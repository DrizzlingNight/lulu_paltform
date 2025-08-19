import moment from "moment";
import {Ranking, RankingConfigMap, RankingType} from "../collection";
import {getHotUpdateConf} from "../../hotUpdateConf/services";


const getThisWeek = function (){
    return moment().utc().startOf('week').unix()
}


const getStartByType = function (type){
    switch(type){
        case RankingType.weekMining:
            return getThisWeek()
        case RankingType.weekPlantHarvest:
            return getThisWeek()
    }
    return 0
}


export const getMetaDataByRankingType = function (rankingType, start){
    return {
        type: rankingType,
        start: start || getStartByType(rankingType)
    }
}


export const addRankingNumber = async function ({user, number, type, username}, session){
    let updateData = {
        '$set': {update: moment().unix()}
    }
    if (RankingType.weekPlantHarvest === type) {
        let ranking = Ranking.findOne({
            user: user,
            type: type,
            start:getStartByType(type)
        }, {session})

        if (!ranking) {
            updateData['$inc'] = {number: 1, currentNumber: 1}
        } else {
            if (number === 1) {
                if (ranking.number === ranking.currentNumber) {
                    updateData['$inc'] = {number: 1, currentNumber: 1}
                } else {
                    updateData['$inc'] = {currentNumber: 1}
                }
            } else {
                updateData['$set'].currentNumber = 0
            }
        }
    } else {
        updateData['$inc'] = {number}
    }
    return await Ranking.findOneAndUpdate(
        {user, type, start:getStartByType(type)},
        updateData,
        {session, upsert: true})
}

export const getRankingConfig = async function (type){
    return await getHotUpdateConf(RankingConfigMap[type])
}
