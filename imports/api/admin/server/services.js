import {
    ProxyChildrenWeeklyStatistics,
    TokenChange,
    TokenChangeStatistics,
    TokenChangeType
} from "../../tokens/collections";
import {Transaction} from "../../transactions/collections";
import {NonFungibleTokenChange, NonFungibleTokenItem} from "../../nft/collections";
import {ArticleBag, ArticleRecord, ArticleRecordType} from "../../games/article/collections";
import {addArticle, removeArticle} from '../../games/article/server/services'
import {errorCodes} from "../../../settings/errorCodes";
import {isSuperAdmin, Permissions} from "../../account/services";
import {MongoInternals} from "meteor/mongo";
import {transaction} from "../../core/database";
import {Decimal} from "meteor/mongo-decimal";
import {getBalance} from "../../account/server/service";
import {buildUserSelector} from "./buildSelector";
import {tokenChangeStatistics} from "./statistics";
import { GameRound } from "../../games/collections";
import { BountyTask } from "../../bountyTasks/collections";
import moment from "moment/moment";

const $ObjectID = MongoInternals.NpmModules.mongodb.module.ObjectID

const getUsers = async function ({search, offset = 0, limit = 10, isFromAgent, role}) {

    const reg = RegExp(search, 'gi')
    let selector = {}
    if (!role || role !== Permissions.Service) {
        selector = search.length > 0 ? {$or: [{username: {$regex: reg}}, {_id: {$regex: reg}}]} : {}
    } else {
        selector = {$or: [{username: search}, {_id: search}]}
    }

    if (isFromAgent) {

        if (search.length > 0) {
            const searchSelector = {$or: [{username: search}, {_id: search}]}
            const searchUser = await Meteor.users.findOne(searchSelector)

            if (searchUser) {
                let allUsers = []
                let proxySelector = {}
                proxySelector['$or'] = [{'referral': searchUser._id}, {'_id': searchUser._id}]
                allUsers = await Meteor.users.find(proxySelector).fetch()

                let userFilter = []
                for (let i = 0; i < allUsers.length; ++i) {
                    let u = allUsers[i]
                    let filter = {'_id': u._id}
                    userFilter.push(filter)
                }
                selector['$or'] = userFilter
            } else {
                return {'list': [], count: 0}
            }
        } else {
            return {'list': [], count: 0}
        }

    }

    // query users
    const data = await Meteor.users.rawCollection().aggregate([
        {$match: selector},
        {$sort: {createdAt: -1}},
        {$skip: offset},
        {$limit: limit},

        { // query balance
            $lookup: {
                from: 'userBalance',
                localField: '_id',
                foreignField: 'user',
                as: 'balance'
            }
        }
    ]).toArray();


    // query role-assignment
    const userRoles = {}
    const roles = await Meteor.roleAssignment.find({}).fetch()
    roles.forEach(r => {
        userRoles[r.user._id] = r.role._id
    })

    data.forEach(usr => {
        usr.role = userRoles[usr._id] || ''
    });

    const count = Meteor.users.find(selector).count()
    return {'list': data, count: count}
}

const getBlanceHistory = async function ({
                                             user,
                                             token,
                                             types,
                                             startTime,
                                             endTime,
                                             search,
                                             offset,
                                             limit,
                                             role,
                                             isSystemChange
                                         }) {

    let tokenSelector = {}

    let searchUser = null

    if (search && search.length > 0) {
        const selector = {$or: [{username: search}, {_id: search}]}
        searchUser = await Meteor.users.findOne(selector)

        if (!searchUser) return {'list': [], count: 0}

        if (searchUser && role !== Permissions.Proxy) tokenSelector['user'] = searchUser._id

        // 如果是代理先查找所有下级
        if (role === Permissions.Proxy && searchUser) {
            let allUsers = []
            let proxySelector = {}
            proxySelector['$or'] = [{'referral': searchUser._id}, {'_id': searchUser._id}]
            allUsers = await Meteor.users.find(proxySelector).fetch()

            let userFilter = []
            for (let i = 0; i < allUsers.length; ++i) {
                let u = allUsers[i]
                let filter = {'user': u._id}
                userFilter.push(filter)
            }
            tokenSelector['$or'] = userFilter
        }
    }


    if (token) tokenSelector['token'] = token
    if (types && types.length > 0) {
        let orArr = tokenSelector['$or'] || []
        for (let i = 0; i < types.length; ++i) {
            let t = types[i]
            orArr.push({type: t})
        }
        tokenSelector['$or'] = orArr
    }
    if (startTime && endTime) {
        let andArr = tokenSelector['$and'] || []
        andArr.push({createdAt: {$gte: startTime}})
        andArr.push({createdAt: {$lte: endTime}})
        tokenSelector['$and'] = andArr
    }

    if (isSystemChange) {
        tokenSelector['userData.operator'] = {$exists: true}
    }

    const data = await TokenChange.rawCollection().aggregate([
        {$match: tokenSelector},
        { // query user
            $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'userInfo',
            }
        },
        {$sort: {createdAt: -1}},
        {$skip: offset},
        {$limit: limit},
    ]).toArray();

    let totalData = null

    // 统计所有用户的盈亏

    totalData = await TokenChange.rawCollection().aggregate([
        {$match: tokenSelector},
        {
            $group:
                {
                    _id: {token: '$token'},
                    totalChanged: {$sum: "$changed"},
                    count: {$sum: 1}
                }
        },
    ]).toArray()

    if (totalData && totalData.length > 0) {
        for (let i = 0; i < totalData.length; ++i) {
            if (searchUser) {
                const token = totalData[i]._id.token
                const balance = await getBalance(searchUser, token, null)
                totalData[i].totalCurrent = balance
            } else {
                totalData[i].totalCurrent = 0
            }
        }
    }

    const count = TokenChange.find(tokenSelector).count()

    const returnData = {'list': data, count: count}
    if (totalData && totalData.length > 0) {
        returnData['total'] = totalData
    }
    return returnData
}

const fetchTransactions = async function ({user, token, startTime, endTime, search, offset, limit, role}) {
    let txSelector = {}

    const isFromProxy = role === Permissions.Proxy

    if (search && search.length > 0) {
        const selector = {$or: [{username: search}, {_id: search}]}
        const searchUser = await Meteor.users.findOne(selector)
        if (searchUser && !isFromProxy) txSelector['user'] = searchUser._id

        if (role === Permissions.Service && !searchUser) {
            return {list: [], count: 0}
        }

        // 如果是代理先查找所有下级
        if (isFromProxy && searchUser) {
            let allUsers = []
            let proxySelector = {}
            proxySelector['$or'] = [{'referral': searchUser._id}, {'_id': searchUser._id}]
            allUsers = await Meteor.users.find(proxySelector).fetch()

            let userFilter = []
            for (let i = 0; i < allUsers.length; ++i) {
                let u = allUsers[i]
                let filter = {'user': u._id}
                userFilter.push(filter)
            }
            txSelector['$or'] = userFilter
        }
    }

    if (token) txSelector['token'] = token
    if (startTime && endTime) {
        txSelector['$and'] = [{createdAt: {$gte: startTime}}, {createdAt: {$lte: endTime}}]
    }


    const data = await Transaction.rawCollection().aggregate([
        {$match: txSelector},
        {$sort: {createdAt: -1}},
        {$skip: offset},
        {$limit: limit},
        { // query user
            $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'userInfo',
            }
        }
    ]).toArray();


    const count = Transaction.find(txSelector).count()
    return {'list': data, count: count}
}
export const getTokenChangeHistorySum = async function (userId, token) {
    let res = await TokenChange.rawCollection().aggregate([
        {$match: {user: userId, token}},
        {$group: {_id: "$type", changed: {$sum: "$changed"}}}
    ]).toArray()
    return res.map(r => ({
        ...r,
        type: TokenChangeType.getName(r._id)
    }))
}

const fetchNFTItems = async function ({box, type, startTime, endTime, search, offset, limit}) {

    let nftSelector = {}

    if (search && search.length > 0) {
        const selector = {$or: [{username: search}, {_id: search}]}
        const user = await Meteor.users.findOne(selector)
        if (user) nftSelector['user'] = user._id
        else nftSelector["state.idOnChain"] = search
    }

    if (box) nftSelector['info.nftPool.bboxId'] = box
    if (type != undefined) nftSelector['type'] = type
    if (startTime && endTime) {
        nftSelector['$and'] = [{createdAt: {$gte: startTime}}, {createdAt: {$lte: endTime}}]
    }

    const data = await NonFungibleTokenItem.rawCollection().aggregate([
        {$match: nftSelector},
        {$skip: offset},
        {$limit: limit},
        {$sort: {createdAt: -1}},
        { // query user
            $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'userInfo',
            }
        },
        {$unwind: '$userInfo'},
    ]).toArray();

    const count = NonFungibleTokenItem.find(nftSelector).count();
    return {'list': data, count: count}
}

/**
 *
 * @returns
 * @param userId
 * @param startTime
 * @param endTime
 * @param token
 * @param type
 */
const getUserProfitLoss = async function (userId, startTime, endTime, token, type = 1) {
    let selector = {'user': userId}

    if (type === 2) {
        selector['type'] = TokenChangeType.Mining
    } else if (type === 3) {
        selector['type'] = TokenChangeType.ReferralMining
    } else {
        selector.$or = [{'type': TokenChangeType.Cultivate}, {'type': TokenChangeType.Payout}]
    }

    if (startTime && endTime) {
        selector['$and'] = [{createdAt: {$gte: startTime}}, {createdAt: {$lte: endTime}}]
    }

    if (token) selector['token'] = token

    const data = await TokenChange.rawCollection().aggregate([
        {$match: selector},
        {
            $group: {
                _id: '$type',
                total: {$sum: {$add: ['$changed']}}
            }
        }
    ]).toArray()

    let total = 0

    data.forEach(d => {
        total += parseFloat(d.total)
    })

    return total
}

/**
 *
 * @returns
 * @param userId
 * @param startTime
 * @param endTime
 * @param token
 * @param type
 */
const getUserMiningDetail = async function (userId, startTime, endTime, token, type = 1) {
    let selector = {'user': userId}

    if (startTime && endTime) {
        selector['$and'] = [{createdAt: {$gte: startTime}}, {createdAt: {$lte: endTime}}]
    }

    if (type === 2) {
        selector['type'] = TokenChangeType.ReferralMining
    } else {
        selector['type'] = TokenChangeType.Mining
    }

    if (token) selector['token'] = token


    const list = await TokenChange.rawCollection().aggregate([
        {$match: selector},
        {
            $group: {
                _id: '$userData.userData.slot.land.info.nftPool.info.grade',
                total: {
                    $sum: {$add: '$changed'}
                }
            }
        }

    ]).toArray()

    let data = {}

    list.forEach(t => {
        data[t._id] = t.total
    })

    return data
}

const updateProfitMiningDetail = async function (userInfo, startTime, endTime, needReferral = false) {
    let user = userInfo

    const userId = user._id

    user.totalProfitLoss = await getUserProfitLoss(userId, startTime, endTime, "LUSD")

    user.totalMining = await getUserProfitLoss(userId, startTime, endTime, "LUCK", 2)

    user.miningDetail = await getUserMiningDetail(userId, startTime, endTime, "LUCK")

    if (needReferral) {

        user.totalReferralMining = await getUserProfitLoss(userId, startTime, endTime, "LUCK", 3)

        user.totalReferralMiningDetail = await getUserMiningDetail(userId, startTime, endTime, "LUCK", 2)
    }

    return user
}

const getMiningData = async function ({user, search, limit, offset, startTime, endTime, role}) {
    let selector = {}

    let data = {}

    let searchUser = {}

    let isFromProxy = role === Permissions.Proxy

    if (search && search.length > 0) {
        const userSelector = {$or: [{username: search}, {_id: search}]}
        searchUser = await Meteor.users.findOne(userSelector)
        if (searchUser) {
            const userId = searchUser._id
            selector['referral'] = userId

            let userInfo = await updateProfitMiningDetail(searchUser, startTime, endTime, true)

            // query role-assignment
            const userRoles = {}
            const roles = await Meteor.roleAssignment.find({}).fetch()
            roles.forEach(r => {
                userRoles[r.user._id] = r.role._id
            })
            userInfo.role = userRoles[userInfo._id] || ''

            data = userInfo
        } else {
            return {'data': {}, 'list': {}, 'count': 0}
        }
    }


    let proxySelector = {}
    if ((isFromProxy && searchUser._id) || role === Permissions.SuperAdmin) {
        proxySelector['$or'] = [{'_id': searchUser._id}, {'referral': searchUser._id}]
    }


    if (!data._id && !search) {
        // 返回列表
        let list = []
        let count = Meteor.users.find(proxySelector).count()

        list = await Meteor.users.rawCollection().aggregate([
            {$sort: {createdAt: -1}},
            {$skip: offset},
            {$limit: limit},
            {$match: proxySelector}
        ]).toArray()
        for (let idx in list) {

            list[idx] = await updateProfitMiningDetail(list[idx], startTime, endTime)
        }

        return {'data': {}, 'list': list, 'count': count}
    }

    // 获取下级用户列表

    const subList = await Meteor.users.rawCollection().aggregate([
        {$match: selector},
        {$sort: {createdAt: -1}},
        {$skip: offset},
        {$limit: limit},
        {$match: proxySelector}
    ]).toArray();


    let subTotalProfitLoss = 0.0
    let subTotalMining = 0.0

    let subMiningDetail = {}
    let sss = 0.0
    let ss = 0.0
    let s = 0.0
    let a = 0.0
    let b = 0.0

    for (let idx in subList) {

        const subUser = await updateProfitMiningDetail(subList[idx], startTime, endTime)
        subTotalProfitLoss += parseFloat(subUser.totalProfitLoss || 0.0)
        subTotalMining += parseFloat(subUser.totalMining || 0.0)

        const miningDetail = subUser.miningDetail

        sss += parseFloat(miningDetail['SSS'] || 0.0)
        ss += parseFloat(miningDetail['SS'] || 0.0)
        s += parseFloat(miningDetail['S'] || 0.0)
        a += parseFloat(miningDetail['A'] || 0.0)
        b += parseFloat(miningDetail['B'] || 0.0)

        subList[idx] = subUser
    }

    subMiningDetail['SSS'] = sss
    subMiningDetail['SS'] = ss
    subMiningDetail['S'] = s
    subMiningDetail['A'] = a
    subMiningDetail['B'] = b

    const subCount = Meteor.users.find({...selector, ...proxySelector}).count()

    data.subUser = {list: subList, count: subCount}
    data.subTotalProfitLoss = subTotalProfitLoss
    data.subTotalMining = subTotalMining
    data.subMiningDetail = subMiningDetail


    return {'data': data, 'list': [], count: 0}

}

const fetchArticleList = async function (params) {

    let selector = {number: {$gt: 0}}

    const role = params.role

    const search = params.search
    if (search && search.length > 0) {
        const selectSelector = {$or: [{username: search}, {_id: search}]}
        const searchUser = await Meteor.users.findOne(selectSelector)
        if (searchUser && role !== Permissions.Proxy) selector['user'] = searchUser._id

        if (role === Permissions.Service && !searchUser) {
            return {'data': [], count: 0}
        }

        // 如果是代理先查找所有下级
        if ((role === Permissions.Proxy || role === Permissions.Admin) && searchUser) {
            let allUsers = []
            let proxySelector = {}
            proxySelector['$or'] = [{'referral': searchUser._id}, {'_id': searchUser._id}]

            allUsers = await Meteor.users.find(proxySelector).fetch()

            let userFilter = []
            for (let i = 0; i < allUsers.length; ++i) {
                let u = allUsers[i]
                let filter = {'user': u._id}
                userFilter.push(filter)
            }
            selector['$or'] = userFilter
        }
    } else if (role === Permissions.Proxy || role === Permissions.Admin || role === Permissions.Service) {
        selector['user'] = params.user._id
    }

    const list = await ArticleBag.rawCollection().aggregate([
        {$match: selector},
        {$skip: params.offset || 0},
        {$limit: params.offset || 10},
        {
            $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'userInfo',
            }
        },
        {
            $lookup: {
                from: 'article',
                localField: 'articleId',
                foreignField: '_id',
                as: 'articleInfo',
            }
        },
    ]).toArray()

    for (let i = 0; i < list.length; ++i) {
        list[i]._id = list[i]._id.toString()
    }

    const count = await ArticleBag.find(selector).count()

    return {'data': list, count: count}
}

const transferArticle = async function ({articleObjectId, articleId, toUser, number}) {
    await transaction.run(async session => {
        const findUser = await Meteor.users.findOne({$or: [{_id: toUser}, {username: toUser}]}, {session})
        if (!findUser) {
            throw new Meteor.Error(500, errorCodes.InvalidUser)
        }

        let objId = $ObjectID(articleObjectId)
        const article = await ArticleBag.rawCollection().findOne({_id: objId}, {session})

        if (!article) {
            throw new Meteor.Error(500, errorCodes.ObjNotFound)
        }
        const user = Meteor.users.findOne({_id: article.user}, {session})

        if (Decimal(article.number.toString()).lt(Decimal(number.toString())) || article.number === 0) {
            throw new Meteor.Error(500, errorCodes.InvalidAmount)
        }

        await removeArticle({
            user: user._id,
            articleId: articleId,
            number,
            type: ArticleRecordType.Transfer
        }, session)
        await addArticle({user: findUser._id, number, articleId, type: ArticleRecordType.Transfer}, session)
    });
    return {code: 0, message: 'success'}
}

/**封禁用户**/
const banUser = async function (userId) {
    let user = Meteor.users.findOne({$or: [{_id: userId}, {username: userId}, {mobile: userId}, {"emails": {$elemMatch: {"address": userId}}}]})
    if (!user || isSuperAdmin(user._id)) {
        throw new Meteor.Error(500, errorCodes.InvalidUser)
    }
    let updateData = {
        isDeleted: true,
        'services.resume.loginTokens': []
    }
    if (user.isDeleted) {
        updateData = {isDeleted: false}
    }
    await Meteor.users.rawCollection().updateOne({
        _id: user._id
    }, {$set: updateData});
    return true
}

const getMoveNftHistory = async function ({search, startTime, endTime, offset, limit = 10, type}) {

    let selector = {$nor: [{type: 0}, {type: 9}]}

    if (search && search.length > 0) {
        if (search && search.length > 0) {
            const selectSelector = {$or: [{username: search}, {_id: search}]}
            const searchUser = await Meteor.users.findOne(selectSelector)
            if (searchUser) selector['user'] = searchUser._id
            else return {code: 0, list: [], count: 0}
        }
    }
    if (startTime && endTime) {
        selector['$and'] = [{createdAt: {$gte: startTime}}, {createdAt: {$lte: endTime}}]
    }
    if (type) {
        selector['type'] = type
    }

    const list = await NonFungibleTokenChange.rawCollection().aggregate([
        {$sort: {createdAt: -1}},
        {$match: selector},
        {$skip: offset},
        {$limit: limit},
        { // query user
            $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'userInfo',
            }
        },
        { // query nft
            $lookup: {
                from: 'nonFungibleTokenItem',
                localField: 'nonFungibleTokenItem',
                foreignField: '_id',
                as: 'nftInfo',
            }
        },
    ]).toArray()

    const count = await NonFungibleTokenChange.rawCollection().find(selector).count()

    return {code: 0, list: list, count: count}
}

const getArticleHistory = async function ({search, startTime, endTime, offset, limit = 10, type}) {
    // ArticleRecord

    let selector = {}

    let searchUser = null

    if (search && search.length > 0) {
        const selectSelector = {$or: [{username: search}, {_id: search}]}
        searchUser = await Meteor.users.findOne(selectSelector)
        if (searchUser) selector['user'] = searchUser._id
        else return { code: 0, list: [], count: 0 }
    }

    if (startTime && endTime) {
        selector['$and'] = [{createdAt: {$gte: startTime}}, {createdAt: {$lte: endTime}}]
    }
    if (type) {
        selector['type'] = type
    }

    const list = await ArticleRecord.rawCollection().aggregate([
        {$sort: {createdAt: -1}},
        {$match: selector},
        {$skip: offset},
        {$limit: limit},
        { // query user
            $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'userInfo',
            }
        },
        { // query user
            $lookup: {
                from: 'article',
                localField: 'articleId',
                foreignField: '_id',
                as: 'articleInfo',
            }
        },
    ]).toArray()

    const count = await ArticleRecord.rawCollection().find(selector).count()

    return {code: 0, list: list, count: count}
}

/**
 * 区域数据
 **/
const getUserData = async function (params, loginUser) {
    let selector = buildUserSelector(params)
    let users = Meteor.users.find(selector, {sort: {createdAt: -1}, skip: params.offset, limit: params.limit}).fetch()
    let count = Meteor.users.find(selector).count()

    for (let user of users) {
        user.statistics = {}
        if (params.statistics) {
            // lulu-market盈亏
            if (params.statistics.profitLossData) {
                user.statistics.profitLossData = await tokenChangeStatistics({
                    userId: user._id,
                    type: [TokenChangeType.Cultivate, TokenChangeType.Payout],
                    tokenId: 'LUSD'
                })
            }

            // 挖矿数
            if (params.statistics.minedData) {
                user.statistics.minedData = await tokenChangeStatistics({
                    userId: user._id,
                    type: [TokenChangeType.Mining],
                    tokenId: 'LUCK'
                })
            }

            // 邀请挖矿
            if (params.statistics.referralMinedData) {
                user.statistics.referralMinedData = await tokenChangeStatistics({
                    userId: user._id,
                    type: [TokenChangeType.ReferralMining],
                    tokenId: 'LUCK'
                })
            }

            // 充值
            if (params.statistics.depositData) {
                user.statistics.depositData = await tokenChangeStatistics({
                    userId: user._id,
                    type: [TokenChangeType.Deposit],
                })
            }

            // 提现
            if (params.statistics.withdrawData) {
                user.statistics.withdrawData = await tokenChangeStatistics({
                    userId: user._id,
                    type: [TokenChangeType.Withdraw],
                })
            }

            // 铸造消费
            if (params.statistics.mintData) {
                user.statistics.mintData = await tokenChangeStatistics({
                    userId: user._id,
                    type: [TokenChangeType.OpenBlindBox],
                })
            }

            // 邀请人数
            if (params.statistics.subordinateCount) {
                user.statistics.subordinateCount = await Meteor.users.find({parents: {$elemMatch: {$eq: user._id}}}).count()
            }
        }
    }
    return {"list": users, "count": count}
}

const getGameHistory = async function({search, startTime, endTime, offset, limit = 10, type}) {

    let selector = {}

    let searchUser = null

    if (search && search.length > 0) {
        const selectSelector = {$or: [{username: search}, {_id: search}]}
        searchUser = await Meteor.users.findOne(selectSelector)
        if (searchUser) selector['userData.userInfo.id'] = searchUser._id
        else return { code: 0, list: [], count: 0 }
    }

    if (startTime && endTime) {
        selector['$and'] = [{createdAt: {$gte: startTime}}, {createdAt: {$lte: endTime}}]
    }
    if (type) {
        selector['userData.settleType'] = type
    }

    const list = await GameRound.rawCollection().aggregate([
        {$sort: {createdAt: -1}},
        {$match: selector},
        {$skip: offset},
        {$limit: limit},
    ]).toArray()

    let totalData = await GameRound.rawCollection().aggregate([
        {$match: selector},
        {$match: {
            "userData.number" : { $gte : 0}
        }},
        {
            $group: {
                _id: null,
                totalCost: {
                  $sum: { $multiply: ["$userData.seed.price", "$userData.number"]}
                },
                totalPayout: {
                  $sum: '$userData.result.totalPayout'
                },
                count: { $sum : 1}
              }
        }
    ]).toArray()

    totalData = totalData.length === 1 ? totalData[0] : null

    const count = await GameRound.rawCollection().find(selector).count()

    return {code: 0, list: list, count: count, total: totalData}
}

const getOrderHistory = async function({search, startTime, endTime, offset, limit = 10, type}) {

    let selector = {}

    let searchUser = null

    if (search && search.length > 0) {
        const selectSelector = {$or: [{username: search}, {_id: search}]}
        searchUser = await Meteor.users.findOne(selectSelector)
        if (searchUser) selector['$or'] = [{publisher : searchUser._id}, { receiver: searchUser._id} ]
        else return { code: 0, list: [], count: 0 }
    }

    if (startTime && endTime) {
        selector['$and'] = [{createdAt: {$gte: startTime}}, {createdAt: {$lte: endTime}}]
    }
    if (type) {
        selector['type'] = type
    }

    console.log('11111111111 selector', selector);

    const list = await BountyTask.rawCollection().aggregate([
        {$sort: {createdAt: -1}},
        {$match: selector},
        {$skip: offset},
        {$limit: limit},
        { // query user
            $lookup: {
                from: 'users',
                localField: 'publisher',
                foreignField: '_id',
                as: 'publisherInfo',
            }
        },
        { // query user
            $lookup: {
                from: 'users',
                localField: 'receiver',
                foreignField: '_id',
                as: 'receiverInfo',
            }
        },

    ]).toArray()

    const count = await BountyTask.rawCollection().find(selector).count()

    return {code: 0, list: list, count: count}

}

const getUsersWeekly = async function({user, startTime, type, offset, limit = 10}) {
    let start = startTime ? moment(startTime).utc().startOf('week')
        : moment().utc().startOf('week')
    let end = moment(start).add(1, 'week')
    let selector = {
        time: { $gte: start.toDate(), $lt: end.toDate()},
    }
    if (user){
        selector.referral = user
    }

    const list = await ProxyChildrenWeeklyStatistics.find(selector, {sort: {createdAt: -1}, limit, offset}).fetch()
    const count = await ProxyChildrenWeeklyStatistics.find(selector, {sort: {createdAt: -1}, limit, offset}).count()

    return {code: 0, list: list, count: count}

}


const getUsersCanBuyAmount = async function({user, startTime}) {
    let start = startTime ? moment(startTime).utc().startOf('week')
        : moment().utc().startOf('week')
    let end = moment(start).add(1, 'week')
    let selector = {
        time: { $gte: start.toDate(), $lt: end.toDate()},
    }
    if (user){
        selector.referral = user
    }

    const list = await ProxyChildrenWeeklyStatistics.rawCollection().aggregate([
        {$match: selector},
        { 
            $group: {
                _id: null,
                canBuyBackAmount: {
                    $sum : "$totalChanged.LUCK.Mining.totalChanged"
                }
            }
        }
    ]).toArray();

    return {code: 0, data: list.length === 1 ? list[0] : null }

}

export {
    getUsers,
    getBlanceHistory,
    fetchTransactions,
    fetchNFTItems,
    getMiningData,
    fetchArticleList,
    transferArticle,
    banUser,
    getMoveNftHistory,
    getArticleHistory,
    getUserData,
    getGameHistory,
    getOrderHistory,
    getUsersWeekly,
    getUsersCanBuyAmount
}
