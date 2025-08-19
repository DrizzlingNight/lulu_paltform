import moment from "moment"
import {
    StakeBonusChangeType,
    StakePool,
    StakePoolChangeType,
    StakePoolRecord,
    StakeUserBonusPool,
    StakeUserBonusPoolRecord,
    StakeUserPool,
    StakeUserPoolRecord,
    StakeUserPoolStateType
} from '../collections'
import {NonFungibleTokenChange, NonFungibleTokenChangeType, NonFungibleTokenItem} from '../../nft/collections';
import {FundPool, FundPoolChangeType, FundPoolRecord} from '../../fund/collections'
import {addFundPool} from '../../fund/server/service'

import {MongoInternals} from "meteor/mongo";
import {addBalance, getBalance, removeBalance} from '../../account/server/service';
import {TokenChangeType} from '../../tokens/collections';
import {Decimal} from 'meteor/mongo-decimal';
import {errorCodes} from "../../../settings/errorCodes";
import {Random} from 'meteor/random';
import {transaction} from '../../core/database';
import {getHotUpdateConf} from '../../hotUpdateConf/services';
import {getToken} from '../../tokens/server/services';
import user from "../../../ui/store/modules/user";
import {updateTaskProgress} from "../../tasks/server/services";


const Decimal128 = MongoInternals.NpmModules.mongodb.module.Decimal128;


// 检查赎回还未到账的
const checkRedeemRecord = async function () {

    const list = await StakeUserPoolRecord.find({state: StakeUserPoolStateType.Redeeming}).fetch()

    const token = getToken({stake: true}) || {}

    for (let i = 0; i < list.length; ++i) {
        const data = list[i]
        if (data.toAccountTime <= new Date()) {

            await transaction.run(async session => {
                const user = Meteor.users.findOne({_id: data.user});

                // 给用户加余额
                await addBalance({
                    user,
                    amount: Decimal(Math.abs(data.changed).toString()),
                    token: token,
                    type: TokenChangeType.Redeem,
                    userData: {}
                }, session)

                await StakeUserPoolRecord.findOneAndUpdate({_id: data._id, state: StakeUserPoolStateType.Redeeming},
                    {$set: {state: StakeUserPoolStateType.Finished}}, {session})
            })
        }
    }

}

// 质押nft
const stakeOrRedeemNFT = async function ({type, landId, user}) {

    let res = null

    await transaction.run(async session => {

        const token = getToken({stake: true})

        // 更新nft状态
        res = await NonFungibleTokenItem.findOneAndUpdate({
            _id: landId,
            user: user._id,
            'state.stake': {
                $ne: StakePoolChangeType.StakeLand === type ? true : false
            }
        }, {
            $set: {
                "state.stake": StakePoolChangeType.StakeLand === type ? true : false
            }
        }, {
            session,
            returnOriginal: false
        })
        if (res.ok !== 1 || res.lastErrorObject.n !== 1) {
            throw new Meteor.Error(500, errorCodes.LandInvalid)
        }

        const oldStakeInfo = StakeUserPool.findOne({
            user: user._id
        }, {
            session
        }) || {}

        // 改变质押池

        let oldPower = Decimal((oldStakeInfo.power || 0).toString())
        let total = Decimal((oldStakeInfo.totalStake || 0).toString())

        let changedPower = Decimal(res.value.info.nftPool.info.power.toString())

        // 改变质押用户池
        if (res.ok == 1) {
            changedPower = StakePoolChangeType.StakeLand == type ? changedPower : changedPower * -1
            res = await changeStakeUserPool(type, 0, token._id, changedPower, user, res.value, session)
        }

        // 计算当前用户算力的增幅
        const stakeConf = await getHotUpdateConf('stake_config', session) || {}
        const powerTohashrateUpTimes = Decimal(stakeConf.POWER_TO_HASHRATE_UP_TIMES || 0.000125)
        const totalPower = oldPower.add(changedPower)
        let userHashrate = (Decimal(1).add(totalPower.mul(powerTohashrateUpTimes))) * total
        let hashrateChange = Decimal(userHashrate).sub(Decimal(oldStakeInfo.hashrate || 0))


        // (type, amount, token, changedHashrate, power, user, landId, session)
        res = await changeStakePool(type, 0, token._id, hashrateChange, changedPower, user, landId, session)

        // 添加nft改变记录
        if (res.code === 0) {
            res = await NonFungibleTokenChange.insertOne({
                user: user._id,
                type: type == StakePoolChangeType.StakeLand ? NonFungibleTokenChangeType.Stake : NonFungibleTokenChangeType.Redeem,
                nonFungibleTokenItem: landId,
                userData: {
                    nftId: landId,
                    user: user._id
                },
                createdAt: new Date()
            }, {
                session
            })
        }

    })

    if (res.result.ok === 1) {
        return {
            code: 0,
            message: 'success'
        }
    }
}

const userHistoryDivAmount = async function(user){
    let amount = Decimal('0')
    let userDivHistory = await StakeUserBonusPoolRecord.aggregate([
        {$match: {user: user, type: StakeBonusChangeType.Grant}},
        {$group: {_id: null, count: {$sum: "$changed"}}}
    ])
    if (userDivHistory.length > 0) {
        amount = Decimal(userDivHistory[0].count)
    }
    return amount
}

// 获取用户历史质押分红
const getUserHistoryDivAmount = async function (user) {
    const divInfo = StakeUserBonusPool.findOne({user: user})
    let amount = Decimal('0')
    if (divInfo && divInfo.historyDivAmount === undefined) {
        amount = await userHistoryDivAmount(user)
        await StakeUserBonusPool.findOneAndUpdate(
            {user: user},
            {$set: {historyDivAmount: amount}}
        )
    }
    return amount
}

const getFundPool = async function (fundToken) {
    let fundPool = FundPool.findOne({token: fundToken._id})
    if (fundPool && fundPool.historyDivAmount === undefined) {
        let fundPoolDivHistory = await FundPoolRecord.aggregate([
            {$match: {token: fundToken, type: FundPoolChangeType.ShareBonus}},
            {$group: {_id: null, count: {$sum: "$changed"}}}
        ])
        let historyDivAmount = Decimal(0)
        if (fundPoolDivHistory.length > 0) {
            historyDivAmount = Decimal(fundPoolDivHistory[0].count).times(Decimal(-1))
        }

        let res = await FundPool.findOneAndUpdate(
            {token: fundToken},
            {$set: {historyDivAmount: historyDivAmount}},
            {returnOriginal: false}
        )
        fundPool = res.value
    }
    return fundPool
}

const getMyStakeInfo = async function (user) {

    let data = {}


    let stake = 0
    let hashrate = 0
    let hashrateGrowth = 0

    const token = getToken({stake: true})

    let balance = await getBalance(user, token._id)

    const stakeUserInfo = await StakeUserPool.findOne({
        user: user._id,
        token: token._id
    })

    if (stakeUserInfo) {
        stake = stakeUserInfo.total || 0
        hashrate = stakeUserInfo.hashrate || 0
        const stakeConf = await getHotUpdateConf('stake_config') || {}
        const powerTohashrateUpTimes = Decimal(stakeConf.POWER_TO_HASHRATE_UP_TIMES || 0.000125)
        hashrateGrowth = stakeUserInfo.power * powerTohashrateUpTimes
    }


    data.balance = balance
    data.stake = stake
    data.hashrate = hashrate
    data.token = token._id
    data.hashrateGrowth = hashrateGrowth
    data.bonus = 0

    const bonusInfo = await StakeUserBonusPool.findOne({user: user._id}) || {}

    data.availableBonus = bonusInfo.total || 0
    data.userHistoryDivAmount = bonusInfo.historyDivAmount || await getUserHistoryDivAmount(user._id)


    const stakePool = await StakePool.findOne({token: token._id})

    const fundToken = getToken({fund: true})
    const fundPool = await getFundPool(fundToken._id)

    if (fundPool && fundPool.total > 0 && stakePool && stakePool.hashrate > 0) {
        data.bonus = hashrate / stakePool.hashrate * fundPool.total
    }

    const stakeConf = await getHotUpdateConf('stake_config') || {}

    data.divPoolPercent = stakeConf.divpool_distribute_percentage || 0.05

    data.stakePool = stakePool || {}
    data.fundPool = fundPool || {}

    return {
        code: 0,
        message: 'success',
        data: data
    }
}

async function addStakePoolRecord({
                                      type,
                                      amount,
                                      token,
                                      hashrate,
                                      power,
                                      user,
                                      landId,
                                      currentHashrate,
                                      currentPower,
                                      current,
                                      currentBonus
                                  }, session) {


    let userData = {
        landId
    }

    let _id = Random.id()
    let result = await StakePoolRecord.insertOne({
            _id,
            token,
            changed: amount,
            current,
            currentHashrate,
            changedHashrate: hashrate,
            currentPower,
            changedPower: power,
            type,
            user: user ? user._id : '',
            currentBonus,
            createdAt: new Date()
        },
        userData, {
            session
        })

    result = result.result

    if (result.ok === 1) {
        result = {
            code: 0,
            message: 'success'
        }
    }

    return result
}

async function changeStakeUserPool(type, amount, token, power, user, userData, session) {


    const userStakeInfo = await StakeUserPool.findOne({
        user: user._id
    }, {
        session
    })

    let hashrate = Decimal(0)
    let value = null

    let res = null

    const stakeConf = await getHotUpdateConf('stake_config', session) || {}
    const powerTohashrateUpTimes = Decimal(stakeConf.POWER_TO_HASHRATE_UP_TIMES || 0.000125)

    if (userStakeInfo) {
        if (Decimal(amount).lt(0) && userStakeInfo.total.lt(Decimal(amount).abs())) throw new Meteor.Error(500, errorCodes.NotEnoughToken)
        const total = Decimal(userStakeInfo.total).add(Decimal(amount))
        const totalPower = Decimal(userStakeInfo.power).add(Decimal(power))
        hashrate = total * (Decimal(1).add(totalPower.mul(powerTohashrateUpTimes)))


        res = await StakeUserPool.rawCollection().findOneAndUpdate({
            user: user._id
        }, {
            $inc: {
                'total': Decimal128.fromString(amount.toString()),
                'power': Decimal128.fromString(power.toString())
            },
            $set: {
                'hashrate': hashrate
            }
        }, {
            session,
            returnOriginal: false
        })
        value = res.value
    } else {
        amount = Decimal(amount)
        hashrate = amount.mul((Decimal(1).add(Decimal(power).mul(powerTohashrateUpTimes))))
        hashrate = Decimal128.fromString(hashrate.toString())
        power = Decimal128.fromString(power.toString())

        const _id = Random.id()
        value = {
            _id,
            token,
            total: Decimal128.fromString(amount.toString()),
            power,
            hashrate,
            user: user._id,
            availableBonus: 0,
            createdAt: new Date()
        }
        res = await StakeUserPool.insertOne(value, {
            session
        })

        res = res.result
    }

    if (res.ok === 1) {
        // 判断用户总质押是否超过最大值
        let total = Decimal(value.total.toString())
        let stakeToken = getToken({id: token})
        if (stakeToken.maxTotalStake && total.gt(stakeToken.maxTotalStake))
            throw new Meteor.Error(500, errorCodes.StakeAmountError)
        return await addUserStakePoolRecord(type, amount, token, power, user, value, userData, session)
    }
}

async function addUserStakePoolRecord(type, amount, token, power, user, stakeInfo, userData, session) {

    const current = stakeInfo.total
    const currentPower = stakeInfo.power
    const currentHashrate = stakeInfo.hashrate

    const stakeConf = await getHotUpdateConf('stake_config', session) || {}

    let createdAt = new Date();
    let toAccountTime = new Date();

    let state = type === StakePoolChangeType.RedeemToken ? StakeUserPoolStateType.Redeeming : StakeUserPoolStateType.Finished

    if (state === StakeUserPoolStateType.Redeeming) {
        toAccountTime.setTime(toAccountTime.getTime() + 60 * 60 * (stakeConf.UNSTAKE_TIME || 24) * 1000);
    }


    const _id = Random.id()
    let res = await StakeUserPoolRecord.insertOne({
        _id,
        token,
        changed: amount,
        current,
        changedPower: power,
        currentPower,
        currentHashrate,
        user: user._id,
        type,
        state,
        userData,
        toAccountTime,
        createdAt,
    }, {
        session
    })

    res = res.result

    if (res.ok === 1) {
        return {
            code: 0,
            message: 'succcess'
        }
    } else {
        throw new Meteor.Error(500, errorCodes.LandInvalid)
    }
}


async function changeStakePool(type, amount, token, changedHashrate, power, user, landId, session) {
    let result = null

    const stakeToken = getToken({stake: true})

    const stakePoolInfo = StakePool.findOne({
        token: token
    }, {
        session
    })

    let value = null

    // 用聚合计算总分红池

    let total = Decimal(0)
    let hashrate = Decimal(0)


    let data = []

    if (stakeToken._id === token) {
        data = await StakeUserPool.rawCollection().aggregate([{
            $group: {
                _id: 'token',
                total: {
                    $sum: '$total'
                },
                hashrate: {
                    $sum: '$hashrate'
                }
            }
        }], {
            session
        }).toArray()
    }

    if (data.length === 1) {
        total = Decimal128.fromString(data[0].total.toString())
        hashrate = Decimal128.fromString(data[0].hashrate.toString())
    }

    if (stakePoolInfo) {

        result = await StakePool.findOneAndUpdate({
            token: token
        }, {
            $set: {
                'totalStake': total,
                'hashrate': hashrate,
            }
        }, {
            session,
            returnOriginal: false
        })
        value = result.value
    } else {
        let _id = Random.id()

        const stakeConf = await getHotUpdateConf('stake_config', session) || {}

        const divPoolPercent = stakeConf.divpool_distribute_percentage || 0.05

        value = {
            _id,
            token,
            totalStake: total,
            userDivPool: divPoolPercent,
            hashrate
        }
        result = await StakePool.insertOne(value, {
            session,
            returnOriginal: false
        })

        result = result.result
    }

    if (result.ok === 1) {
        // {type, amount, token, hashrate, power, user, landId, currentHashrate, currentPower, current}
        const currentPower = value.power
        const current = value.totalStake
        result = await addStakePoolRecord({
            type,
            amount,
            token,
            hashrate: changedHashrate,
            power,
            user,
            landId,
            currentHashrate: hashrate,
            currentPower,
            current,
        }, session)
    }


    return result
}

export const getLastRedeem = async function (user, session) {
    return StakeUserPoolRecord.findOne({
            user, type: StakePoolChangeType.RedeemToken,
            state: StakeUserPoolStateType.Redeeming, toAccountTime: {$gt: moment().toDate()}
        },
        {sort: {toAccountTime: -1}, session})
}
export const cancelRedeem = async function (user) {
    await transaction.run(async session => {
        let res = await StakeUserPoolRecord.findOneAndUpdate({
            user,
            state: StakeUserPoolStateType.Redeeming
        }, {$set: {state: StakeUserPoolStateType.Canceled}}, {session})
        if (res.ok !== 1 || res.lastErrorObject.n !== 1) return
        await updateStakePoolByUserOperate({
            type: StakePoolChangeType.CancelRedeemToken, amount: Decimal(res.value.changed).neg(),
            tokenId: res.value.token, user: {_id: user}
        }, session)
    })
}

// 质押或者赎回token
const stakeOrRedeemToken = async function ({type, amount, user}) {

    amount = (type === StakePoolChangeType.StakeToken) ? amount * 1 : amount * -1

    let res = null

    const token = getToken({stake: true}) || {}
    const tokenId = token._id || 'LUCK'

    const absAmount = Math.abs(amount)
    if (absAmount < token.minStake || absAmount > token.maxStake) {
        throw new Meteor.Error(500, errorCodes.StakeAmountError)
    }

    await transaction.run(async session => {
        res = await updateStakePoolByUserOperate({type, amount, tokenId, user}, session)
    })

    if (res && res.result.ok === 1) {
        return {
            code: 0,
            message: 'success'
        }
    }
    return {}
}

const updateStakePoolByUserOperate = async function ({type, amount, tokenId, power = 0, user}, session) {
    // 改变用户质押池
    let res = await changeStakeUserPool(type, amount, tokenId, power, user, {}, session)

    if (res.code === 0) {
        // (type, amount, token, changedHashrate, power, user, landId, session)
        res = await changeStakePool(type,
            amount,
            tokenId,
            amount,
            power,
            user,
            null,
            session)
    }

    if (res.code === 0) {
        if (type === StakePoolChangeType.StakeToken) {

            const token = getToken({id: tokenId})
            res = await removeBalance({
                user,
                amount: Decimal(amount.toString()),
                token,
                type: TokenChangeType.Stake,
                userData: {}
            }, session)

            // 任务事件
            await updateTaskProgress(user, 'stake', token._id, amount, session)
        } else {
            res = {
                code: 0,
                message: 'success',
                result: {
                    ok: 1
                }
            }
        }
    }
    return res

}

const getMyStakedLand = async function ({user, where}) {
    where = where || {}
    const list = NonFungibleTokenItem.find({
        user: user._id,
        'state.stake': true
    }, {
        sort: {
            "info.nftPool.info.power": -1
        },
        skip: where.offset || 0,
        limit: where.limit || 8
    }).fetch()
    const count = NonFungibleTokenItem.find({
        user: Meteor.userId(),
        'state.stake': true
    }).count()
    return {
        list: list,
        count: count
    }
}

const getMyCanStakeLand = async function ({user, where}) {
    where = where || {}
    const list = NonFungibleTokenItem.find({
        user: user._id,
        'state.stake': {
            $ne: true
        }
    }, {
        sort: {
            "info.nftPool.info.power": -1
        },
        skip: where.offset || 0,
        limit: where.limit || 8
    }).fetch()
    const count = NonFungibleTokenItem.find({
        user: Meteor.userId(),
        'state.stake': {
            $ne: true
        }
    }).count()
    return {
        list: list,
        count: count
    }
}

const shareBonus = async function () {

    // const fundPools = await FundPool.find({ total: { $gt : 0 }, shareBonusTime: {$gt: new Date()}}).fetch()
    const fundPools = await FundPool.find({total: {$gt: 0}, shareBonusTime: {$lt: new Date()}}).fetch()
    if (fundPools.length === 0) return
    const stakeToken = getToken({stake: true})

    let stakeConf = await getHotUpdateConf('stake_config') || {}
    /*let stakeConf = await getHotUpdateConf('stake_config')
    if (stakeConf)
        stakeConf = stakeConf[0]
    else
        stakeConf = {}*/
    const divPoolPercent = stakeConf.divpool_distribute_percentage || 0.05
    const divPower2HashrateUpTimes = stakeConf.POWER_TO_HASHRATE_UP_TIMES || 0.000125

    // 重新计算 总的算力
    let totalHashrate = Decimal(0)
    const list = await StakeUserPool.rawCollection().aggregate([
        {
            $match: {
                token: stakeToken._id,
                total: {$gt: 0}
            }
        },
        {
            $project: {
                _id: 1, total: 1, power: 1, user: 1,
                tempRate: {$multiply: ["$power", divPower2HashrateUpTimes]}
            }
        },
        {
            $project: {
                _id: 1, total: 1, power: 1, user: 1,
                tempRate: {$add: ["$tempRate", 1]}
            }
        },
        {
            $project: {
                _id: 1, total: 1, power: 1, user: 1,
                hashrate: {$multiply: ["$tempRate", "$total"]}
            }
        }
    ]).toArray()

    list.forEach(s => {
        totalHashrate = totalHashrate.add(s.hashrate.toString())
    })

    for (let i = 0; i < fundPools.length; ++i) {
        let fundPool = fundPools[i]
        let shareBonusTime = fundPool.shareBonusTime


        // 分红数量： 总基金 * 分红比例
        const shareOutAmount = fundPool.total.times(Decimal(divPoolPercent)).times(Decimal('-1'))

        const fundToken = getToken({id: fundPool.token})

        // 下次分红时间： 获取配置
        shareBonusTime.setTime(shareBonusTime.getTime() + 60 * 60 * (stakeConf.share_bonus_time_interval || 24) * 1000);


        // 发放分红
        await transaction.run(async session => {

            // 改变下次分红时间
            await FundPool.findOneAndUpdate({token: fundPool.token}, {$set: {shareBonusTime}}, {session})

            // 从分红池中减去发放的数量
            await addFundPool(fundToken, shareOutAmount, FundPoolChangeType.ShareBonus, {}, session)

            // const list = await StakeUserPool.rawCollection().find({total: { $gt : 0 }}, {
            //     session
            // }).toArray()

            // 发放到用户分红池
            for (let j = 0; j < list.length; ++j) {
                const data = list[j]
                const userDivToken = Decimal(data.hashrate.toString()).div(Decimal(totalHashrate.toString())).mul(Decimal(shareOutAmount.toString())).mul(Decimal(-1))
                await changeStakeBonusPool(StakeBonusChangeType.Grant, fundToken._id, userDivToken, data.user, session)
            }

        })
    }
}

async function changeStakeBonusPool(type, token, amount, userId, session) {
    const userBonusInfo = await StakeUserBonusPool.findOne({
        user: userId
    }, {
        session
    })

    let res = null
    let value = null
    let divAmount = Decimal128.fromString(amount.toString())
    if (userBonusInfo) {
        let historyAmount = amount
        if (userBonusInfo.historyDivAmount === undefined) {
            let old = await userHistoryDivAmount(user)
            historyAmount = historyAmount.add(old)
        }
        res = await StakeUserBonusPool.findOneAndUpdate({
            user: userId,
            token
        }, {
            $inc: {
                'total': divAmount,
                'historyDivAmount': Decimal128.fromString(historyAmount.toString())
            }
        }, {
            session,
            returnOriginal: false
        })
        value = res.value
    } else {
        const _id = Random.id()
        value = {
            _id,
            token,
            total: divAmount,
            historyDivAmount: divAmount,
            user: userId,
            createdAt: new Date()
        }
        res = await StakeUserBonusPool.insertOne(value, {
            session
        })

        res = res.result
    }

    if (res.ok === 1) {
        res = addStakeBonusPoolRecord(type, token, divAmount, userId, value, session)
    }

    return res
}

// 添加质押分红池改变记录
async function addStakeBonusPoolRecord(type, token, amount, userId, bonusInfo, session) {

    const current = bonusInfo.total

    const _id = Random.id()
    let res = await StakeUserBonusPoolRecord.insertOne({
        _id,
        type,
        token,
        current,
        changed: amount,
        user: userId,
        createdAt: new Date()
    }, session)

    if (res.result.ok === 1) {
        return {
            code: 0,
            message: 'success'
        }
    }

}

// 领取分红
const harvestBonus = async function ({user}) {


    let res = null
    const userBonusInfos = await StakeUserBonusPool.find({
        user: user._id
    }).fetch()

    for (let i = 0; i < userBonusInfos.length; ++i) {
        const userBonusInfo = userBonusInfos[i]

        if (userBonusInfo && userBonusInfo.total > 0) {
            await transaction.run(async session => {

                // 领取
                res = await StakeUserBonusPool.findOneAndUpdate({
                    user: user._id,
                    token: userBonusInfo.token
                }, {
                    $set: {
                        'total': 0
                    }
                }, {
                    session,
                    returnOriginal: false
                })

                const addToken = getToken({id: userBonusInfo.token})

                // 给用户加余额
                await addBalance({
                    user,
                    amount: Decimal(Math.abs(userBonusInfo.total).toString()),
                    token: addToken,
                    type: TokenChangeType.Bonus,
                    userData: {}
                }, session)

                let value = res.value

                if (res.ok === 1) {
                    // 添加领取记录
                    let amount = userBonusInfo.total * -1
                    res = await addStakeBonusPoolRecord(StakeBonusChangeType.Harvest, userBonusInfo.token, amount, user._id, value, session)
                }
            });
        }
    }

    return res
}


export {
    stakeOrRedeemNFT,
    stakeOrRedeemToken,
    getMyStakeInfo,
    getMyStakedLand,
    getMyCanStakeLand,
    shareBonus,
    harvestBonus,
    checkRedeemRecord
}
