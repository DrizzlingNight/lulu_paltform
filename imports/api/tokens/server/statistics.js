import {
    ProxyChildrenWeeklyStatistics,
    StatisticsTokenChangeId,
    StatisticsType,
    TokenChange,
    TokenChangeStatistics,
    TokenChangeType
} from "../collections";
import {Decimal} from "meteor/mongo-decimal";
import moment from "moment";
import {transaction} from "../../core/database";
import logging from "../../logging";
import {Permissions} from "../../account/services";
const logger = logging.getLogger(module.id);

const _getTypeTime = function (type) {
    switch (type) {
        default:
            return moment.utc().startOf('day').toDate()
    }
}

const _buildGroupParams = function (id) {
    let group = {_id: id}
    for (let type in TokenChangeType) {
        if (TokenChangeType.hasOwnProperty(type)) {
            group[type] = {$sum: {$add: ['$statistics.'+ type]}}
        }
    }
    return group
}

/**获取当前统计到的账变ID**/
const _getCurrentChangeId = async function (type, session) {
    return StatisticsTokenChangeId.findOne({type: type}, {session})
}

/**更新当前统计到的账变ID**/
const _updateCurrentChangeId = async function (item, type, session) {
    await StatisticsTokenChangeId.findOneAndUpdate(
        {
            type: type
        },
        {
            $set: {
                changeId: item._id,
                changeTime: item.createdAt,
                createdAt: new Date()
            },
        }, {
            session,
            upsert: true,
            returnOriginal: false
        }
    )
}

const tokenChangeDailyStatistics = async function (statisticalTime=null) {
    if (statisticalTime === null){
        let lastStatistics = TokenChangeStatistics.findOne({}, {sort: {time:-1}})
        if (!lastStatistics){
            let firstChange = TokenChange.findOne({}, {sort: {createdAt:1}})
            statisticalTime = moment(firstChange.createdAt).utc().startOf('day')
        }
        else {
            statisticalTime = moment(lastStatistics.time).utc().startOf('day').add(1, 'days')
        }
    }
    if (moment(statisticalTime).add(1, 'days').toDate().unix() > moment().unix()){
        logger.info(`tokenChangeDailyStatistics is latest`)
        return
    }
    logger.info(`TokenChangeStatistics start ${statisticalTime.toDate()}`)
    let statisticalRes = await TokenChange.rawCollection().aggregate([
        {$match:{
                createdAt:{
                    $gte:statisticalTime.toDate(),
                    $lt:moment(statisticalTime).add(1, 'days').toDate(),
                }
            }},
        {$group:{
                _id: {user:'$user', token:"$token", type: "$type"},
                totalChanged:{$sum:"$changed"}
            }},
        {$lookup:{
                from: "users",
                localField: "_id.user",
                foreignField: "_id",
                as: "userInfo"
            }},
        {$unwind: "$userInfo"}
    ]).toArray()
    if (statisticalRes.length === 0) {
        statisticalTime.add(1, 'days')
        return await tokenChangeDailyStatistics(statisticalTime)
    }
    let insertData = statisticalRes.map(item=>({
        user: item._id.user,
        userInfo: item.userInfo,
        referral: item.userInfo.referral,
        parents: item.userInfo.parents,
        token: item._id.token,
        tokenChangeType: item._id.type,
        tokenChangeTypeCode: TokenChangeType.getName(item._id.type),
        type: StatisticsType.Daily,
        totalChanged: item.totalChanged,
        createdAt: new Date(),
        time: statisticalTime.toDate(),
    }))
    return await transaction.run(async session => {
        let res = await TokenChangeStatistics.insertMany(insertData, {session})
        logger.info(`TokenChangeStatistics insert ${statisticalTime.toDate()}`)
        return res
    })
}

const proxyChildrenWeeklyStatistics = async function(weekTime=null){
    if (!weekTime){
        let lastWeek = ProxyChildrenWeeklyStatistics.findOne({}, {sort: {time:-1}})
        if (!lastWeek){
            let lastStatistics = TokenChangeStatistics.findOne({}, {sort: {time:1}})
            weekTime = moment(lastStatistics.time).utc().startOf('week')
        }else{
            weekTime = moment(lastWeek.time).utc().startOf('week').add(1, "week")
        }
    }else{
        weekTime.startOf('week')
    }
    if (weekTime.unix() > moment().unix()){
        logger.info(`tokenChangeDailyStatistics is latest`)
        return
    }
    let lastRegisterTime = moment(weekTime).add(1,'week')
    let users = Meteor.users.find({createdAt: {$lt:lastRegisterTime.toDate()}}).fetch()
    let insertData = []
    for (let i in users){
        let user = users[i]
        let selecter = {parents:user._id, time:{$gte: weekTime.toDate(), $lt:lastRegisterTime.toDate()}}
        let childrenStatistics = TokenChangeStatistics.find(selecter).count()
        if (childrenStatistics === 0){
            insertData.push({
                user: user._id,
                is_proxy: Roles.userIsInRole(user._id, Permissions.Proxy),
                referral: user.referral,
                parents: user.parents,
                createdAt: new Date,
                time: weekTime.toDate(),
            })
        }else{
            childrenStatistics = TokenChangeStatistics.find(selecter).fetch()
            const initChangedAmount = function(changed, store){
                if (!store[changed.token])
                    store[changed.token] = {}
                if (!store[changed.token][changed.tokenChangeTypeCode])
                    store[changed.token][changed.tokenChangeTypeCode] =
                        {code:changed.tokenChangeType, totalChanged: Decimal(0)}
                store[changed.token][changed.tokenChangeTypeCode].totalChanged =
                    store[changed.token][changed.tokenChangeTypeCode].totalChanged.add(changed.totalChanged)
            }
            let proxyTotalChanged = {}
            let totalChanged = {}
            childrenStatistics.forEach(changed=>{
                initChangedAmount(changed, proxyTotalChanged)
                if (changed.parents.indexOf(user._id) < 2){
                    initChangedAmount(changed, totalChanged)
                }

            })
            insertData.push({
                user: user._id,
                is_proxy: Roles.userIsInRole(user._id, Permissions.Proxy),
                referral: user.referral,
                parents: user.parents,
                createdAt: new Date,
                time: weekTime.toDate(),
                proxyTotalChanged,
                totalChanged
            })
        }
    }
    return await transaction.run(async session => {
        let res = await ProxyChildrenWeeklyStatistics.insertMany(insertData, {session})
        logger.info(`proxyChildrenWeeklyStatistics insert ${weekTime.toDate()}`)
        return res
    })
}

/**用户账变增量计算统计**/
const tokenChangeStatistics = async function (type = 'daily') {
    await transaction.run(async session => {
        let currentId = await _getCurrentChangeId(type, session)
        let current
        let startTime = currentId ? currentId.changeTime : new Date('0')
        let changes = TokenChange.find({createdAt: {$gt: startTime}}, {sort: {createdAt: 1}, limit: 100}).fetch()
        if (changes.length > 0) {
            for (let change of changes) {
                await TokenChangeStatistics.findOneAndUpdate(
                    {
                        user: change.user,
                        token: change.token,
                        type: type,
                        createdAt: _getTypeTime(type)
                    },
                    {
                        $inc: {[`statistics.` + TokenChangeType.getName(change.type)]: Decimal(change.changed)},
                    }, {
                        session,
                        upsert: true,
                        returnOriginal: false
                    }
                )
                current = change
            }

            await _updateCurrentChangeId(current, type)
        }
    })
}

/**获取统计结果**/
const getCount = async function() {
    let group = _buildGroupParams('$token')
    let res  = await TokenChangeStatistics.rawCollection().aggregate([
        {$match: {}},
        {
            $group: group
        }
    ]).toArray()

    let total = {}
    res.forEach(d => {
        total[d._id] = {}
        for (let type in d) {
            if (d.hasOwnProperty(type)) {
                total[d._id][type] = d[type].toString()
            }
        }
    })
    return total
}

export {tokenChangeStatistics, getCount, tokenChangeDailyStatistics, proxyChildrenWeeklyStatistics}
