import logging from "../../logging";
import {ProxyBuybackOrder, ProxyBuybackOrderStatus, Referral, ReferralPool} from "../collections";
import {addBalance, removeBalance} from "../../account/server/service";
import {ProxyChildrenWeeklyStatistics, Token, TokenChange, TokenChangeType} from "../../tokens/collections";
import {Decimal} from "meteor/mongo-decimal";
import {getHotUpdateConf} from "../../hotUpdateConf/services";
import {NonFungibleTokenItem} from "../../nft/collections";
import {isProxy, isSuperUserAdmin} from "../../account/services";
import moment from "moment";
import {MongoInternals} from "meteor/mongo";
import {Random} from "meteor/random";
import {errorCodes} from "../../../settings/errorCodes";
import {transaction} from "../../core/database";
import {getToken} from "../../tokens/server/services";

const logger = logging.getLogger(module.id)
const Decimal128 = MongoInternals.NpmModules.mongodb.module.Decimal128;

/** @desc下綫鑄造數 **/
const getSubordinateMintCount = async function (user) {
    const subordinates = await Meteor.users.rawCollection().aggregate([{$match: {referral: user}}, {
        $project: {
            _id: 1,
            username: 1
        }
    }]).toArray()
    return await NonFungibleTokenItem.find(
        {user: {$in: subordinates.map(item => item._id)}}
    ).count()
}

/** @desc邀請統計數據 **/
const getReferralCount = async function (user) {
    const subCount = Meteor.users.find({referral: user}).count()
    let subProfitAmount = await Referral.rawCollection().aggregate([
        {$match: {user: user}},
        {$group: {_id: null, amount: {$sum: '$amount'}}}
    ]).toArray()

    subProfitAmount = subProfitAmount.length ? subProfitAmount[0]['amount'].toString() : 0
    // const subMintCount = await getSubordinateMintCount(user)
    let proxy = Meteor.users.findOne({_id: user})
    const subMintCount = proxy.referralStatistical && proxy.referralStatistical.mintCount ? proxy.referralStatistical.mintCount : 0
    let proxyContacts = await getProxyContacts(proxy)
    return {
        'subCount': subCount,
        'subProfitAmount': subProfitAmount,
        'subMintCount': subMintCount,
        'proxyContacts': proxyContacts
    }
}

/** @desc邀請列表 **/
const getReferralList = async function ({search, offset = 0, limit = 10}) {
    let selector = {}
    if (search) {
        const user = Meteor.users.findOne({
            $or: [{username: search}, {mobile: search}, {_id: search}, {"emails": {$elemMatch: {"address": search}}}]
        })
        if (!user) {
            return {'list': [], count: 0}
        }
        if (user._id === Meteor.userId()) {
            selector.referral = user._id
        } else if (isProxy(Meteor.userId()) && user.parents.indexOf(Meteor.userId()) !== -1) {
            selector.referral = user._id
        } else if (isSuperUserAdmin(Meteor.userId())) {
            selector.referral = user._id
        } else {
            return {'list': [], count: 0}
        }

    } else {
        if (isProxy(Meteor.userId())) {
            selector._id = Meteor.userId()
        }
    }

    let data = await Meteor.users.rawCollection().aggregate([
        {$match: selector},
        {$sort: {createdAt: -1}},
        {$skip: offset},
        {$limit: limit},
        {
            $project:
                {
                    _id: 1,
                    username: 1,
                    referralStatistical: 1,
                    userStatistical: 1,
                    createdAt: 1,
                    referral: 1,
                }
        }
    ]).toArray();
    let count = Meteor.users.find(selector).count()
    return {'list': data, count: count}
}

/**@desc 邀请分成**/
const profit = async function (userId, tokenId, amount, profitType, memo, level = 1, session) {
    const user = Meteor.users.findOne({_id: userId})
    const token = Token.findOne({_id: tokenId})
    const referralToken = Token.findOne({referral: true})
    const referralAmount = token.referralRate * amount
    const referralProfitRateConfig = await getHotUpdateConf('referralProfitRate')

    let profitTotal = 0
    if (user && user.parents.length) {
        const parents = user.parents.slice(0, level)
        for (let i in parents) {
            const agent = Meteor.users.findOne({_id: parents[i]})
            const profitAmount = referralAmount * referralProfitRateConfig[i] / 100
            await addBalance({
                user: agent,
                amount: Decimal(profitAmount),
                token: referralToken,
                type: profitType,
                userData: memo
            }, session);

            // 插入分成記錄
            Referral.rawCollection().insert({
                user: parents[i],
                fromUser: userId,
                token: referralToken._id,
                amount: Decimal128.fromString(profitAmount.toString()),
                fromToken: token._id,
                referralAmount: Decimal128.fromString(referralAmount.toString()),
                rate: Decimal128.fromString(referralProfitRateConfig[i].toString()),
                createdAt: new Date()
            }, {session})
            profitTotal += profitAmount
        }

        await ReferralPool.findOneAndUpdate({token: referralToken._id}, {
            $inc: {amount: Decimal128.fromString(profitTotal.toString())},
            $setOnInsert: {
                token: referralToken._id
            }
        }, {session, upsert: true, returnOriginal: false});
    }
}

/** @desc 获取下线列表 **/
const getSubordinateList = async function (referral) {
    let subs = await Meteor.users.find({parents: {$elemMatch: {$eq: referral}}}, {username: 1}).fetch()
    let list = []
    subs.forEach(sub => {
        list.push(sub._id)
    })
    return list
}

/** @desc 种植数据统计 **/
const plantStatistics = async function (userId) {
    let userIds = await getSubordinateList(userId)
    userIds.push(userId)

    const cultivate = await TokenChange.rawCollection().aggregate([
        {
            $match: {
                user: {$in: userIds},
                type: TokenChangeType.Cultivate
            }
        },
        {
            $group: {
                _id: '$type',
                token: {$first: "$token"},
                amount: {$sum: "$changed"}
            }
        }
    ]).toArray()

    const payout = await TokenChange.rawCollection().aggregate([
        {
            $match: {
                user: {$in: userIds},
                type: TokenChangeType.Payout
            }
        },
        {
            $group: {
                _id: '$type',
                token: {$first: "$token"},
                amount: {$sum: "$changed"}
            }
        }
    ]).toArray()

    const mining = await TokenChange.rawCollection().aggregate([
        {
            $match: {
                user: {$in: userIds},
                type: TokenChangeType.Mining
            }
        },
        {
            $group: {
                _id: '$type',
                token: {$first: "$token"},
                amount: {$sum: "$changed"}
            }
        }
    ]).toArray()

    cultivate[0].amount = cultivate[0].amount.toString()
    payout[0].amount = payout[0].amount.toString()
    mining[0].amount = mining[0].amount.toString()

    return {
        "cultivate": cultivate[0],
        "payout": payout[0],
        "mining": mining[0]
    }
}

/**获取当前登录用户超级代理的联系方式**/
const getProxyContacts = async function (user) {
    let contacts = {}
    if (user.parents) {
        let top = Meteor.users.findOne({_id: user.parents[user.parents.length - 1]})
        if (top && isProxy(top._id)) {
            contacts = top.contacts
        }
    }
    return contacts
}

/**获取代理回购申请**/
const getProxyBuybackOrders = async function (params, user) {
    let selector = {}
    if (params.user) {
        selector.user = params.user
    }
    if (isProxy(user._id)) {
        selector.user = user._id
    }
    if (params.status) {
        selector.status = {$in: params.status}
    }

    if (params.startTime || params.endTime) {
        if (!params.startTime) {
            selector.createdAt = {$lte: new Date(params.endTime)}
        } else if (!params.endTime) {
            selector.createdAt = {$gte: new Date(params.startTime)}
        } else {
            selector['$and'] = [{createdAt: {$gte: new Date(params.startTime)}}, {createdAt: {$lte: new Date(params.endTime)}}]
        }
    }
    const list = ProxyBuybackOrder.find(selector, {
        sort: {'createdAt': -1},
        skip: params.offset,
        limit: params.limit
    }).fetch()
    const count = ProxyBuybackOrder.find(selector).count()
    return {list: list, count: count}
}

/**获取代理周期已申请额度**/
const getProxyBuybackAmount = async function (user, time) {
    let amount = Decimal('0')
    const data = await ProxyBuybackOrder.rawCollection().aggregate([
        {
            $match: {
                user: user._id,
                time: time,
                status: {$in: [ProxyBuybackOrderStatus.Init, ProxyBuybackOrderStatus.Done]}
            }
        },
        {
            $group: {
                _id: '$token',
                total: {$sum: {$add: ['$amount']}}
            }
        }
    ]).toArray()

    if (data.length === 0) {
        return amount
    }
    return Decimal(data[0].total.toString())
}

/**获取代理可回购额度**/
const getProxyMineAmount = async function (user, time) {
    let mineAmount = Decimal('0')
    let weekData = ProxyChildrenWeeklyStatistics.findOne({user: user._id, is_proxy: true, time: time})

    if (!weekData || !weekData.proxyTotalChanged.LUCK.Mining) {
        return mineAmount
    }
    return weekData.proxyTotalChanged.LUCK.Mining.totalChanged
}

/**代理申请回购**/
const proxyBuyback = async function (amount, user) {
    await transaction.run(async session => {
        let week = moment().utc().startOf('week').subtract(1, 'week').toDate()
        let hotUpdate = await getHotUpdateConf('proxy_buyback')
        let conf = hotUpdate ? hotUpdate[0] : null
        let buybackRate = conf ? Decimal(conf.buybackRate) : Decimal('0.4')
        let buybackPrice = conf ? Decimal(conf.buybackPrice) : Decimal('0.05')
        let minBuyback = conf ? Decimal(conf.min) : null
        let maxBuyback = conf ? Decimal(conf.max) : null

        //获取用户可回购额度
        let mineAmount = await getProxyMineAmount(user, week)
        let total = mineAmount.mul(buybackRate)
        let alreadyBuybackAmount = await getProxyBuybackAmount(user, week)
        let canBuybackAmount = total.sub(alreadyBuybackAmount)

        if (amount.gt(total) || (minBuyback && amount.lt(minBuyback)) || (maxBuyback && amount.gt(maxBuyback)) || amount.gt(canBuybackAmount)) {
            throw new Meteor.Error(500, errorCodes.InvalidAmount)
        }

        let tokenId = conf ? conf.token : 'LUCK'
        await ProxyBuybackOrder.insertOne({
            _id: Random.id(),
            user: user._id,
            token: tokenId,
            swapToken: conf ? conf.swapToken : 'LUSD',
            amount: amount,
            buybackPrice: buybackPrice,
            buybackRate: buybackRate,
            swapAmount: amount.mul(buybackPrice),
            mineAmount: mineAmount,
            total: mineAmount.mul(buybackRate),
            time: week,
            status: ProxyBuybackOrderStatus.Init,
            createdAt: new Date()
        }, {session})

        let token = getToken({id: tokenId})
        await removeBalance({
            user: user,
            amount: amount,
            token: token,
            type: TokenChangeType.ProxyBuyBack,
            userData: conf
        }, session); //手續費
    })
}

/**代理回购审批**/
const checkProxyBuyback = async function (orderId, status, reason, admin) {
    if (![ProxyBuybackOrderStatus.Done, ProxyBuybackOrderStatus.Failed].includes(status)) {
        throw new Meteor.Error(500, errorCodes.InvalidParams)
    }
    await transaction.run(async session => {
        let res = await ProxyBuybackOrder.rawCollection().findOneAndUpdate(
            {_id: orderId},
            {
                $set: {
                    status: status,
                    reason: reason,
                    checkUser: admin._id,
                    updatedAt: new Date(),
                }
            },
            {
                returnOriginal: false,
                session
            }
        )

        if (res.ok !== 1 && res.lastErrorObject.n !== 1) {
            throw new Meteor.Error(500, errorCodes.FailedOpt)
        }

        let user = Meteor.users.findOne({_id: res.value.user}, {session})
        if (status === ProxyBuybackOrderStatus.Done) {
            let swapToken = getToken({id: res.value.swapToken})
            await addBalance({
                user: user,
                amount: Decimal(res.value.swapAmount.toString()),
                token: swapToken,
                type: TokenChangeType.ProxyBuyBack,
                userData: {proxyBuybackId: res.value._id}
            })
        } else {
            let token = getToken({id: res.value.token})
            await addBalance({
                user: user,
                amount: Decimal(res.value.amount.toString()),
                token: token,
                type: TokenChangeType.ProxyBuyBackReturn,
                userData: {proxyBuybackId: res.value._id}
            })
        }
    })
}

export {
    getReferralCount,
    getSubordinateMintCount,
    getReferralList,
    profit,
    getSubordinateList,
    plantStatistics,
    getProxyContacts,
    getProxyBuybackOrders,
    proxyBuyback,
    checkProxyBuyback
}
