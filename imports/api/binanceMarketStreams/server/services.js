import WebSocket from 'ws';
import {
    BinanceMarketStream,
    BinanceMarketStreamCheck,
    BinanceMarketStreamSecond,
    MarketDistribution
} from "../collections";
import {GameName, SettleDirection, SettleType} from "../../games/market/collections";
import gaussian from "./normalDistribution"
import logging from "../../logging";
import moment from "moment";
import {settings} from "../../../settings";
import {getGame} from "../../games/utils";
import {errorCodes} from "../../../settings/errorCodes";
const logger = logging.getLogger(module.id);

let current = {}
let marketDistributionTmp = {}
let ws = undefined
let lastPrice = {}
let game = getGame(GameName)
export let deltaList = [1,3,5,10,30]
if (game && game.pendingTimeList){
    deltaList = game.pendingTimeList
}

export const coinList = ["BTCUSDT", "ETHUSDT"]

export function init() {
    let symbols = coinList.map(c=>(`${c.toLowerCase()}@aggTrade`))
        // ['btcusdt@aggTrade','ethusdt@aggTrade']
    let str = ''
    symbols.forEach(s=>{str = str+'/'+s})
    if (ws)
        ws.close()
    ws = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${str.substring(1)}`);

    logger.info(`init websocket received message: ${symbols}`, );

    ws.on('message', async function message(data) {
        const now = (new Date()).getTime()
        const dataJson = JSON.parse(data)
        if (!dataJson.data)
            return
        if (!current[dataJson.data.s])
            current[dataJson.data.s] = dataJson.data.t
        if (current[dataJson.data.s] > dataJson.data.t)
            return
        if (lastPrice[dataJson.data.s] === dataJson.data.p)
            return
        else
            lastPrice[dataJson.data.s] = dataJson.data.p
        dataJson.data.localT = now
        if (!marketDistributionTmp[dataJson.data.s])
            marketDistributionTmp[dataJson.data.s] = await MarketDistribution.rawCollection().findOne({_id:dataJson.data.s})
        BinanceMarketStream.rawCollection().insert({
            _id: dataJson.data.a,
            ...dataJson.data,
            symbol:dataJson.data.s,
            distributionModel: marketDistributionTmp[dataJson.data.s]
        })
        // await BinanceMarketStream.rawCollection().findOneAndUpdate({
        //     _id: dataJson.data.a,
        // }, {$set: {...dataJson.data, symbol:dataJson.data.s,
        //         distributionModel: marketDistributionTmp[dataJson.data.s]
        // }}, {upsert:true})
        insertSimple(dataJson, deltaList).then()
        let tmp = BinanceMarketStream.findOne({ symbol: dataJson.data.s}, {sort: { T: -1}, limit:1})
        logger.info(`received message: ${data} ${JSON.stringify(tmp)}`)
    });

    ws.on('close', function () {
        logger.error(`WebSocket connection close`, );
    });
    ws.on('error', function error(error) {
        logger.error(`WebSocket connect error: ${error}`, );
    });
}
export const insertSimple = async function(dataJson, deltaList){
    for (let i in deltaList){
        await insertSimpleMarketStream(dataJson, deltaList[i])
    }
}
export const sendPong = async function(){
    logger.info(`WebSocket send pong`)
    ws.send('pong')
}

export const insertSimpleMarketStream = async function(data, delta = 1){
    let T = Math.trunc(Number(data.data.T.toString().substring(0,10)) / delta) * delta
    BinanceMarketStreamSecond.rawCollection().findOneAndUpdate({
        symbol:data.data.s,
        T,
        _id: `${T}_${data.data.s}_${delta}`
    }, {$set:{...data.data, T, delta,
            distributionModel: marketDistributionTmp[data.data.s]
        }}, {upsert:true})
}

export const getNormalDistributionParams = async function(symbol, deltaTime=1, pointsNumber=5000000){
    deltaTime = deltaTime * 60000
    let params = await BinanceMarketStreamCheck.rawCollection().aggregate([
        {$match: {symbol, deltaTime}},
        {$sort: {"start.T":-1}},
        {$limit: pointsNumber},
        {$project: {_id:0, rate:1, rateSquared: {$multiply:["$rate","$rate"]}}},
        {$group: {_id:"sum", rateSum:{$sum:"$rate"}, rateSquaredSum: {$sum:"$rateSquared"}, count:{$sum:1}}},
        {$project: {_id:0,
                rateMean:{$divide: ["$rateSum", "$count"]},
                rateSquaredMean: {$divide: ["$rateSquaredSum", "$count"]},
                rateSquaredSum:1, count:1}},
        {$project: {_id:0, mean: "$rateMean",
                variance: {$subtract: ["$rateSquaredMean", {$multiply:["$rateMean","$rateMean"]}]},
                tmp:{ rateMean: "$rateMean", rateSquaredMean: "$rateSquaredMean", rateSquaredSum: "$rateSquaredSum", count: "$count" },
            }},
    ], {readPreference: "secondary"}).toArray()
    if (params.length > 0)
        return {...params[0], standardDeviation: Math.sqrt(params[0].variance)}
}

export const removeMarketPrice = async function (){
    let res = await BinanceMarketStream.rawCollection().deleteMany({T:{$lt:moment().subtract(7, "day").unix() * 1000}})
    res = await BinanceMarketStreamCheck.rawCollection().deleteMany({'start.T':{$lt:moment().subtract(7, "day").unix() * 1000}})
}

export const checkMarketStatus = async function (){
    if (settings.runBinanceMarketStreams){
        let res = await BinanceMarketStream.rawCollection().findOne({}, {sort: {T: -1}})
        if (!res)
            return
        let now = (new Date()).getTime()
        if (res.localT - res.T > 1000){
            init()
        }else if (res.T < (now - 1500)){
            init()
        }
    }
}

export const generateMarketDistribution = async function (){
    let keys = coinList  //  ["BTCUSDT", "ETHUSDT"]
    for (let i in keys){
        let key = keys[i]
        let tmp = {_id: key}
        for (let i in deltaList){
            let res = await getNormalDistributionParams(key, deltaList[i])
            if (res)
                res.mean = 0
            tmp[deltaList[i]] = res
        }
        marketDistributionTmp[key] = tmp
        await MarketDistribution.rawCollection().findOneAndUpdate({
            _id: key,
        }, {$set: {...tmp}}, {upsert:true})
    }
}

export const getStartSettleData = async function (settleType, settleDirection){
    if (!settleType || settleType === SettleType.random) return
    let symbol = SettleType.getName(settleType)
    if (!symbol) return
    let sort = -settleDirection
    return await BinanceMarketStream.rawCollection().findOne({ symbol, T: {$gte:(new Date()).getTime() - 1500}},
        {sort: { p: sort}})
}

export const getBorder = function (settleDirection, startPrice, land, pendingTime){
    if (!startPrice) return
    let gaussianModel = pendingTime?
        gaussian(startPrice.distributionModel[String(pendingTime)].mean, startPrice.distributionModel[String(pendingTime)].variance):
        gaussian(startPrice.distributionModel.mean, startPrice.distributionModel.variance)
    let res
    if (settleDirection === SettleDirection.up){
        let binary_very_poor_harvest_p = land.info.nftPool.info.binary_very_poor_harvest_p || 0
        let poor_harvest = Number(startPrice.p) * (1 + gaussianModel.ppf(binary_very_poor_harvest_p + land.info.nftPool.info.binary_poor_harvest_p)/10000)
        let harvest = Number(startPrice.p) * (1 + gaussianModel.ppf(binary_very_poor_harvest_p + land.info.nftPool.info.binary_poor_harvest_p + land.info.nftPool.info.binary_harvest_p)/10000)
        res = {
            poor_harvest: [0, poor_harvest],
            harvest: [poor_harvest, harvest],
            bumper_harvest: [harvest, 10000000],
        }
        if (binary_very_poor_harvest_p){
            let very_poor_harvest = Number(startPrice.p) * (1 + gaussianModel.ppf(binary_very_poor_harvest_p)/10000)
            res = {
                ...res,
                very_poor_harvest: [0, very_poor_harvest],
                poor_harvest: [very_poor_harvest, poor_harvest],
            }
        }
    }
    else if (settleDirection === SettleDirection.down){
        let binary_very_poor_harvest_p = land.info.nftPool.info.binary_very_poor_harvest_p || 0
        let bumper_harvest = Number(startPrice.p) * (1 + gaussianModel.ppf(land.info.nftPool.info.binary_bumper_harvest_p)/10000)
        let harvest = Number(startPrice.p) * (1 + gaussianModel.ppf(land.info.nftPool.info.binary_bumper_harvest_p + land.info.nftPool.info.binary_harvest_p)/10000)
        res = {
            bumper_harvest: [0, bumper_harvest],
            harvest: [bumper_harvest, harvest],
            poor_harvest: [harvest, 10000000],
        }
        if (binary_very_poor_harvest_p){
            let poor_harvest = Number(startPrice.p) * (1 + gaussianModel.ppf(land.info.nftPool.info.binary_bumper_harvest_p + land.info.nftPool.info.binary_harvest_p + land.info.nftPool.info.binary_poor_harvest_p)/10000)
            res = {
                ...res,
                poor_harvest: [harvest, poor_harvest],
                very_poor_harvest: [poor_harvest, 10000000],
            }
        }
    }
    return res
}

let priceMap = {} // {"BTCUSDT":[],"ETHUSDT":[]}
let mark = {} // {"BTCUSDT":1,"ETHUSDT":1}

for (let i in coinList){
    priceMap[coinList[i]] = []
    mark[coinList[i]] = 1
}
const endDelta = 60000
export const computeDistribution = async function(){
    for (let key in priceMap){
        let priceList =priceMap[key]
        if (priceList.length === 0){
            let last = await BinanceMarketStreamCheck.findOne({symbol: key}, {sort: {"start.T": -1}})
            if (!last)
                priceList.push(...await BinanceMarketStream.find({s: key}, {sort: {T: 1}, limit: 1000}).fetch())
            else
                priceList.push(...await BinanceMarketStream.find({s: key, T: {$gte: last.start.T}}, {sort: {T: 1}, limit: 1000}).fetch())
        }else{
            priceList.push(...await BinanceMarketStream.find({s: key, T: {$gte: priceList[priceList.length-1].T}}, {sort: {T: 1}, limit: 1000}).fetch())
        }
        logger.info(`computeDistribution ${key} start ${priceList[0]._id}`)
        let insertData = []
        for (;;){
            let startPrice = priceList[0];
            if (!startPrice) break
            let insert = false;
            for(let i = mark[key] || 1; i < priceList.length;i++){
                mark[key] = i
                let endPrice = priceList[i]
                if (!endPrice) break
                if (startPrice.T < endPrice.T - endDelta){
                    // logger.info(`computeDistribution ${key} ${startPrice.t}`)
                    insertData.push({
                        _id:startPrice.t,
                        startPrice: startPrice.p,
                        endPrice: endPrice.p,
                        deltaTime: endDelta,
                        start: startPrice,
                        end: endPrice,
                        symbol: startPrice.symbol.toUpperCase(),
                        rate: (Number(endPrice.p) - Number(startPrice.p))/Number(startPrice.p)*10000,//万分之一
                    })
                    insert = true
                    break
                }
            }
            if (insert){
                priceMap[key] = priceList.slice(1)
                priceList = priceMap[key]
                mark[key] = mark[key] - 1
            }
            else
                break
        }
        logger.info(`computeDistribution ${key} end ${priceList[0]._id}, length ${insertData.length}`)
        if (insertData.length > 0)
            await BinanceMarketStreamCheck.rawCollection().insertMany(insertData, {ordered:false})
    }
}

export const computeDistributionV2 = async function(delta, key){
    let endDelta = delta * 60000
    const limit = 1000
    let selector = {symbol: key, deltaTime: endDelta}
    let last = await BinanceMarketStreamCheck.findOne(selector, {sort: {"start.T": -1}})
    logger.info(`computeDistributionV2 last ${key} ${delta}: ${last && last._id}`)
    let startList, endList
    if (!last){
        startList = await BinanceMarketStream.find({s: key, T: {$gte:(new Date()).getTime() - 24 * 60 * 60 * 1000}}, {sort: {T: 1}, limit}).fetch()
        if (startList.length === 0)
            return
    }else{
        startList = await BinanceMarketStream.find({s: key, a: {$gt:last.start.a}}, {sort: {T: 1}, limit}).fetch()
    }
    logger.info(`computeDistributionV2 start ${key} ${delta}: ${startList[0].T}`)
    endList = await BinanceMarketStream.find({s: key, T: {$gte:startList[0].T + delta * 60000}}, {sort: {T: 1}, limit}).fetch()
    if (endList.length === 0)
        return
    logger.info(`computeDistributionV2 end ${key} ${delta}: ${endList[0].T}`)
    let sign = 0
    let insertData = []
    let stop = false
    for (let start in startList){
        if (stop) break
        let startPrice = startList[start]
        for(let i = sign; i < endList.length;i++){
            sign = i
            let endPrice = endList[i]
            if (!endPrice) break
            if (startPrice.T < (endPrice.T - endDelta)){
                insertData.push({
                    _id:`${startPrice._id}_${endDelta}`,
                    startPrice: startPrice.p,
                    endPrice: endPrice.p,
                    deltaTime: endDelta,
                    start: startPrice,
                    end: endPrice,
                    symbol: startPrice.symbol.toUpperCase(),
                    rate: (Number(endPrice.p) - Number(startPrice.p))/Number(startPrice.p)*10000,//万分之一
                })
                break
            }
            if (i === (endList.length - 1))
                stop = true
        }
    }
    if (insertData.length > 0){
        logger.info(`computeDistributionV2 ${key} ${delta}: ${insertData[0].start.T} ${insertData[insertData.length - 1].start.T}`)
        try{
            await BinanceMarketStreamCheck.rawCollection().insertMany(insertData, {ordered:false})
        }catch (e) {
            logger.error(e)
        }
    }
}
