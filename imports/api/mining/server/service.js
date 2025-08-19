import {getToken} from "../../tokens/server/services";
import {addBalance} from "../../account/server/service";
import {Token, TokenChangeType} from "../../tokens/collections";
import {
    CacheMiningRecord,
    LandMiningRecord,
    MiningPool,
    MiningPoolRecords,
    MiningPoolType,
    MiningThreshold
} from "../collections";
import {Decimal} from "meteor/mongo-decimal";
import moment from "moment";
import {getLandInfo} from "../../nft/server/service";
import {errorCodes} from "../../../settings/errorCodes";
import {ReferralThreshold} from "../../referral/collections";
import {RankingType} from "../../ranking/collection";
import {addRankingNumber} from "../../ranking/server/services";
import {transaction} from "../../core/database";
import {updateTaskProgress} from "../../tasks/server/services";


const getAllMiningInfo = function () {
    let res = {}
    let miningPools = MiningPool.find({}).fetch()
    miningPools.forEach(m=>{
        res[m.type] = {total: m.total}
    })
    res.mine["thresholds"] = MiningThreshold.find({}, {sort: {total: 1}}).fetch()
    res.referral["thresholds"] = ReferralThreshold.find({}, {sort: {total: 1}}).fetch()
    return res
}

let RateMap = {}
RateMap[MiningPoolType.Mine] = MiningThreshold
RateMap[MiningPoolType.Referral] = ReferralThreshold

const getxxMiningRate = function ({token, mineToken, type}, session) {
    let miningPool = MiningPool.findOne({token: mineToken._id, type}, {session});
    if (!miningPool)
        miningPool = {token: token._id, type, total: Decimal(0)};
    let miningThreshold = RateMap[type].findOne({token: token._id, total: {$lte: miningPool.total}},
        {sort: {total: -1}, session})
    let rate = miningThreshold && miningThreshold.rate
    if (rate && type === MiningPoolType.Mine){
        Token.findOneAndUpdate({_id: mineToken._id}, {$set: {miningRate: rate.toNumber()}}).then().catch()
    }
    return rate
}

async function addToMiningPool(user, miningToken, miningType, miningAmount, session) {
    let res = await MiningPool.findOneAndUpdate({token: miningToken._id, type: miningType},
        {$inc: {total: miningAmount}},
        {session, upsert: true, returnOriginal: false})
    if (res.ok !== 1 || res.lastErrorObject.n !== 1)
        throw new Meteor.Error(500, errorCodes.MiningError);
    await MiningPoolRecords.insertOne({
        user: user,
        token: miningToken._id,
        type: miningType,
        amount: miningAmount,
        current: res.value.total,
        createdAt: new Date()
    }, {session})
}

async function asyncAddToMiningPoolCache(user, miningToken, miningType, miningAmount, session){
    await CacheMiningRecord.insertOne({
        user,
        token: miningToken,
        type:miningType,
        amount: miningAmount,
        done: false,
        createdAt: new Date()
    }, {session})
}

async function asyncAddToMiningPoolFromCache(){
    let records = await CacheMiningRecord.find({done:false}, {}).fetch()

    for (let i in records){
        let record = records[i]
        try{
            await transaction.run(async (session) =>{
                await addToMiningPool(
                    record.user,
                    record.token, //miningToken,
                    record.type,  //miningType,
                    record.amount, //miningAmount,
                    session)
                let res = await CacheMiningRecord.findOneAndUpdate({_id: record._id, done:false},
                    {$set: {done:true, }},
                    {session, returnOriginal: false})
                if (res.ok !== 1 || res.lastErrorObject.n !== 1)
                    throw new Meteor.Error(500, errorCodes.MiningError);
            })
        }catch (e){
            logger.error(e)
        }

    }

}

async function getLandReserves(land, dayNote, session) {
    let record
    let total = await LandMiningRecord.aggregate([
        {$match: {
                landId: land._id,
                dayNote: dayNote || moment().utc().startOf('day').unix(),
            }},
        {$group: {
                _id: "$landId",
                total: { $sum: "$amount"}
            }}
    ], {session})
    if (total.length)
        record = total[0]
    else
        record = { _id: land._id, total: Decimal(0) }
    let landInfo = getLandInfo(land, session)
    record.reserves = Decimal(landInfo.info.mine_cap || 0)
    return record
}

async function maxMiningByLand(land, dayNote, session) {
    let res = await getLandReserves(land, dayNote, session)
    return Decimal(res.reserves).add(res.total.neg())
}

async function addLandMineRecord(land, dayNote, miningToken, miningAmount, userData, session) {
    await LandMiningRecord.insertOne({
        token: miningToken._id,
        landId: land._id,
        amount: miningAmount,
        userData,
        dayNote
    }, {session})
}

/**
 * 土地挖矿
 * */
const miningByLand = async function ({user, land, token, amount, userData}, session){
    // 获取挖矿效率
    let miningToken = getToken({mining: true})
    if (!miningToken) return
    // let rate = getMiningRate(token, miningToken, session);
    let rate = getxxMiningRate({token, mineToken:miningToken, type: MiningPoolType.Mine}, session);
    if (!rate) return
    // 计算挖矿数量
    let miningAmount = rate.times(amount)
    // 获取土地允许最大挖矿数量
    const dayNote = moment().utc().startOf('day').unix()
    let maxMining = await maxMiningByLand(land, dayNote, session)
    if (maxMining.eq(0)) return

    if (miningAmount.gt(maxMining))
        miningAmount = maxMining
    // 增加矿池挖出数量
    // await addToMiningPool(user._id, miningToken, MiningPoolType.Mine, miningAmount, session)
    await asyncAddToMiningPoolCache(user._id, miningToken, MiningPoolType.Mine, miningAmount, session)
    await addLandMineRecord(land, dayNote, miningToken, miningAmount, userData, session)
    await addBalance({user, amount: miningAmount, token: miningToken,
        type: TokenChangeType.Mining, userData}, session)
    await addRankingNumber({user: {_id: user._id, username: user.username}, number: miningAmount, type: RankingType.weekMining}, session)

    // 任务事件
    await updateTaskProgress(user, 'mine', miningToken._id, miningAmount, session)
    return {amount: miningAmount, token: miningToken._id}
}

/**
 * 推荐挖矿
 * */
const miningByReferral = async function ({user, token, amount, userData}, session){
    // 获取挖矿效率
    let miningToken = getToken({referral: true})
    if (!miningToken) return
    let rate = getxxMiningRate({token, mineToken:miningToken, type: MiningPoolType.Referral}, session);
    if (!rate) return
    // 计算挖矿数量
    let miningAmount = rate.times(amount)

    // 增加矿池挖出数量
    for (let i in user.parents){
        if (!miningToken.referralRateByLevel[i])
            return
        let u = {_id:user.parents[i],username:user.parents[i]}
        let amount = miningAmount.times(miningToken.referralRateByLevel[i])
        // await addToMiningPool(u._id, miningToken, MiningPoolType.Referral, amount, session)
        await asyncAddToMiningPoolCache(u._id, miningToken, MiningPoolType.Referral, amount, session)
        await addBalance({user:u, amount, token: miningToken,
            type: TokenChangeType.ReferralMining, userData}, session)

        // 任务事件
        await updateTaskProgress(u, 'referralMine', miningToken._id, amount, session)
    }
}

export { miningByLand, getLandReserves, miningByReferral, getAllMiningInfo, asyncAddToMiningPoolFromCache}
