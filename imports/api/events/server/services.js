import { Events, EventType } from "../collections"
import logging from "../../logging";

import moment from "moment"
const logger = logging.getLogger(module.id);

export const addRecord = async function(type, userId, info, sessiion) {
    try {
        const events = {
            eventType: type,
            info: info,
            user: userId,
            createdAt: new Date()
        };
        await Events.insertOne(events, { sessiion })
    } catch (error) {
        logger.error(error);
    }
}

const getAggregateQuery = function(startTs, endTs) {
    const baseMatch = {
        // 取出小於endTs的所有login and logout 狀態
        $match: {
            eventType: { $in: [EventType.UserLogin, EventType.UserLogout] },
            createdAt: {
                $lte: moment(endTs).toDate()
            }
        },
    }
    const aggr = [
        baseMatch,
        { $sort: { createdAt: 1 } },
        // 根據時間排序
        { $group: { _id: "$user", eventType: { $last: "$eventType" }, createdAt: { $last: "$createdAt" } } },
        // 分組並取出最後的時間與狀態
        { // 除去 createdAt 小於開始時間並且 eventype等於 logout的 
            // 解析：（在時間區間內沒有logout 或者在結束時間以前沒有login狀態 說明不在時間段內在線）
            $match: {
                $or: [{
                        $and: [{
                            createdAt: { $gte: moment(startTs).toDate() }
                        }]
                    },
                    {
                        createdAt: { $lte: moment(startTs).toDate() },
                        eventType: EventType.UserLogin
                    }
                ]
            }
        },

        { $count: "count" }
    ]
    return aggr
}

/**
 * 獲取某個小時內的在線活躍人數
 * @param {Number} endTs
 */
export const getUserActiveHourRecord = async function({ endTs, startTs }) {
    const result = await Events.aggregate(getAggregateQuery(startTs, endTs));
    return result[0] ? result[0] : { count: 0 };
}


/**
 * type = 'hour|day'
 * startTs 毫秒級別開始時間
 * endTs 毫秒級別結束時間
 */
export const getUserOnlineCount = async function({
    type = 'hour',
    startTs,
    endTs
}) {
    const $facet = {}
    while (startTs < endTs) {
        const _startTs = moment(startTs).valueOf()
        $facet[_startTs] = getAggregateQuery(_startTs, moment(_startTs).add(1,type).valueOf())
        startTs = moment(startTs).add(1,type).valueOf()
    }

    const aggr = [{ $facet: $facet }]
    const result = await Events.aggregate(aggr);
    const resp = []
    for (let key in result[0]) {
        if (Number(key) > moment().valueOf()) {
            resp.push({
                time: key,
                count: 0
            });
        } else {
            resp.push({
                time: key,
                count: result[0][key] && result[0][key].length > 0 ? result[0][key][0].count : 0
            });
        }

    }
    return { data: resp, type };
}

export const getRegisterEventByUser = function(user) {
    const where = {
        user: user,
        eventType: EventType.UserRegister
    }
    return Events.find(where).count()
}