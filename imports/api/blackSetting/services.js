import {BlackSetting} from "./collections"
/**
 * 獲取黑名單列表
 * @param {Number} offset
 * @param {Number} limit
 * @param ip
 * @return
 * {"count":1,
 * "data":[
 *      {
 *       "_id":"5d00b3f43f6646bff54c4786",
 *       "createorName":"test1",
 *       "ip":"127.0.0.1",
 *       "createdAt":"2019-06-12T08:12:36.521Z",
 *       "user":"DE6uyqDtkaE2yY8FW"
 *       "desc":"desc"
 *      }
 *   ]
 * }
 * */
export const getBlackList = async function(offset = 0, limit = 10, ip) {
    const aggr = []
    if (ip) {
        aggr.push({
            $match: { ip: ip }
        })
    }
    aggr.push(...[{
            "$lookup": {
                "localField": "createor",
                "from": "users",
                "foreignField": "_id",
                "as": "userInfo"
            },
        },
        { $unwind: "$userInfo" },
        { $skip: offset }, { $limit: limit },
        {
            $project: {
                _id: "$_id",
                createorName: "$userInfo.username",
                username: "$username",
                ip: "$ip",
                createdAt: "$createdAt",
                user: "$user",
                createor: "$cerateor",
                desc: "$desc"
            }
        }
    ])
    const result = await Promise.all([
        BlackSetting.rawCollection().aggregate(aggr).toArray(),
        BlackSetting.rawCollection().count()
    ])
    return {
        count: result[1] || 0,
        data: result[0] ? result[0].map(item => {
            return {...item, _id: item._id.toString() }
        }) : []
    }
}


/**
 * 添加黑名單
 * @param {String} param0.createor //操作者
 * @param {String} param0.username 
 * @param {String} param0.ip 
 * @param {String} param0.desc  // 備注
 */
export const addBlack = async function({ createor, username, ip, desc }) {
    let user
    if (username) {
        const userInfo = await Meteor.users.rawCollection().findOneAndUpdate({ username: username }, { $pop: { "services.resume.loginTokens": 1 } });

        user = userInfo.value ? userInfo.value._id : ""
    }

    if (ip) {
        await Meteor.users.rawCollection().updateMany({ "status.lastLogin.ipAddr": ip }, { $pop: { "services.resume.loginTokens": 1 } });
    }
    const entries = {
        createor,
        user,
        ip,
        desc,
        username,
        createdAt: new Date()
    }

    const result = await BlackSetting.insertOne(entries)

    return result.ops[0]
}

/**
 * 移除黑名單
 * @param {Array} param.ip ["",""]
 */
export const removeBlack = async function({ iplist = [], username = [] }) {
    const where = {
        $or: [
            { ip: { $in: iplist } },
            { username: { $in: username } },
        ]
    }
    await BlackSetting.deleteMany(where)
    return true
}

// 根據用戶ip或者id查找黑名單用戶
export const getBlackByIpOrUser = function({ ip, user }) {
    const where = { $or: [{ ip }, { user }] }
    return BlackSetting.findOne(where)
}

// 檢查是否已經刪除的用戶
export const isDeletedUser = function(user) {
    const where = { _id: user }
    const result = Meteor.users.findOne(where)

    return result ? result.isDeleted || !result.isActive : false
}