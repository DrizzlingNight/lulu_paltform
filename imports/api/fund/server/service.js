import {FundPool, FundPoolAddCache, FundPoolChangeType, FundPoolRecord} from "../collections";
import {Decimal} from 'meteor/mongo-decimal';
import {getToken} from "../../tokens/server/services";
import {errorCodes} from "../../../settings/errorCodes";
import logging from "../../logging";
import {CacheMiningRecord} from "../../mining/collections";
import {transaction} from "../../core/database";

const logger = logging.getLogger(module.id);

/** @desc 添加基金池變動記錄 **/
async function addFundPoolRecord(token, changed, current, type, userData, session) {
    await FundPoolRecord.insertOne({
        token: token._id,
        changed: changed,
        current: current,
        type: type,
        userData,
        createdAt: new Date()
    }, {session})
}

/** @desc add基金池 **/
const addFundPool = async function(token, changed, type, userData, session) {
    let updateData = {total: changed}
    if (type === FundPoolChangeType.ShareBonus) {
        updateData.historyDivAmount = changed.times(Decimal(-1))
    }
    let res = await FundPool.findOneAndUpdate({token: token._id},
        {$inc: updateData},
        {session, upsert: true, returnOriginal: false})
    if (res.ok !== 1 || res.lastErrorObject.n !== 1)
        throw new Meteor.Error(500, errorCodes.FundPoolChangeError);
    await addFundPoolRecord(token, changed, res.value.total, type, userData, session)
}
async function asyncAddToFundPoolCache(token, changed, type, userData, session){
    await FundPoolAddCache.insertOne({
        token, changed, type, userData,
        done: false,
        createdAt: new Date()
    }, {session})
}

async function asyncAddToFundPoolFromCache(){
    let records = await FundPoolAddCache.find({done:false}, {}).fetch()
    for (let i in records){
        let record = records[i]
        try{
            await transaction.run(async (session) =>{
                await addFundPool(
                    record.token,
                    record.changed,
                    record.type,
                    record.userData,
                    session)
                let res = await FundPoolAddCache.findOneAndUpdate({_id: record._id, done:false},
                    {$set: {done:true, }},
                    {session, returnOriginal: false})
                if (res.ok !== 1 || res.lastErrorObject.n !== 1)
                    throw new Meteor.Error(500, errorCodes.AddFundPoolErr);
            })
        }catch (e){
            logger.error(e)
        }
    }
}
/** @desc 基金池變動 **/
const fundPoolChangeByLand = async function ({land, amount, userData}, session) {
    const fundToken = getToken({fund: true})
    let rate = land && land.info.nftPool.info.fund_rate ? land.info.nftPool.info.fund_rate : false
    logger.info(`fund pool change, amount: ${amount}, rate: ${rate}, token: ${fundToken._id}`)
    if (!rate || !fundToken) return
    // 计算分红池变动数量
    let changed = Decimal(rate).times(amount)
    // await addFundPool(fundToken, changed, FundPoolChangeType.Cultivate, userData, session)
    await asyncAddToFundPoolCache(fundToken, changed, FundPoolChangeType.Cultivate, userData, session)
}

export {fundPoolChangeByLand, addFundPool, asyncAddToFundPoolFromCache}
