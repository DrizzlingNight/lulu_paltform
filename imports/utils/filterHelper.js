import moment from "moment";

export const filterQuery = function({ token, type, status, startTime, endTime }) {
    const selector = {}
    // payment token
    if (token instanceof Array) {
        if (token.length > 0) {
            selector["token"] = { $in: token };
        }
    } else if (token != null) {
        selector["token"] = token;
    }

    // payment type=TransactionType
    if (type instanceof Array) {
        if (type.length > 0) {
            selector["type"] = { $in: type };
        }
    } else if (type != null) {
        selector["type"] = type;
    }
    // payment status=TransactionStatus
    if (status instanceof Array) {
        if (status.length > 0) {
            selector["status"] = { $in: status };
        }
    } else if (status != null) {
        selector["status"] = status;
    }

    if (startTime || endTime) {
        selector["createdAt"] = {};
        if (startTime) {
            selector["createdAt"]["$gte"] = moment(startTime).toDate();
        }
        if (endTime) {
            selector["createdAt"]["$lte"] = moment(endTime).toDate();
        }
    }

    return selector;
}

export const getUserAggrMatch = function({ offset = 0, limit = 10, name, isOnline = false, user_id=undefined, isExact = false }) {
    const query = {}

    if (name) {
        if (!isExact) {
            const reg = new RegExp(name, 'ig')
            query["username"] = reg
        } else {
            query["username"] = regNameExact(name)
        }

    }
    if (isOnline) {
        query["status.online"] = true
    }
    if (user_id) {
        query["_id"] = user_id
    }
    const aggr = [
        { $match: query },
        { $sort: { createdAt: -1 } },
        { $skip: offset }, { $limit: limit },
        { $lookup: { from: "events", localField: "_id", foreignField: "user", as: "registerIpInfo" } },
        { $lookup: { from: "blackSetting", localField: "_id", foreignField: "user", as: "blackIpInfo" } },
        { $lookup: { from: "stakes", localField: "_id", foreignField: "user", as: "stakesInfo" } },
        { $lookup: { from: "users", localField: "_id", foreignField: "referral", as: "referralInfos" } },
        {
            $project: {
                "tokens": "$tokens",
                "username": "$username",
                "createdAt": "$createdAt",
                "level": "$level",
                "profile": "$profile",
                isActive: 1,
                "emails": { $arrayElemAt: ["$emails", 0] },
                "user": "$_id",
                "stakesInfo": { $arrayElemAt: ["$stakesInfo", 0] },
                "isBlack": { $size: "$blackIpInfo" },
                "lastLoginDate": "$status.lastLogin.date",
                "lastLoginIp": "$status.lastLogin.ipAddr",
                "lastLoginUa": "$status.lastLogin.userAgent",
                "lastLoginRealIp": "$status.lastLogin.realIp",
                "signIp": "$status.signIp",
                "signUa": "$status.signUa",
                "signRealIp": "$status.signRealIp",
                "referralCount": { $size: "$referralInfos" },
                "registerIpInfo": {
                    $filter: { input: "$registerIpInfo", as: "registerIpInfo", cond: { $eq: ["$$registerIpInfo.eventType", "UserRegister"] } }
                },
                "roles": "$roles"
            }
        },
        {
            $project: {
                "tokens": "$tokens",
                "username": "$username",
                "profile": "$profile",
                "createdAt": "$createdAt",
                "level": "$level",
                isActive: 1,
                "emails": "$emails.address",
                "verified": "$emails.verified",
                "user": "$user",
                "stakesAmount": "$stakesInfo.amount",
                "stakesfreezeAmount": "$stakesInfo.freezeAmount",
                "referralCount": "$referralCount",
                "isBlack": "$isBlack",
                "lastLoginDate": "$lastLoginDate",
                "lastLoginIp": "$lastLoginIp",
                "lastLoginUa": "$lastLoginUa",
                "lastLoginRealIp": "$lastLoginRealIp",
                "signIp": "$signIp",
                "signUa": "$signUa",
                "signRealIp": "$signRealIp",
                "registerIpInfo": { $arrayElemAt: ["$registerIpInfo", 0] },
                "roles": "$roles"
            }
        },
        {
            $project: {
                "tokens": "$tokens",
                "username": "$username",
                "profile": "$profile",
                "emails": "$emails",
                isActive: 1,
                "createdAt": "$createdAt",
                "level": "$level",
                "verified": "$verified",
                "user": "$user",
                "stakesAmount": "$stakesAmount",
                "stakesfreezeAmount": "$stakesfreezeAmount",
                "referralCount": "$referralCount",
                "isBlack": "$isBlack",
                "lastLoginDate": "$lastLoginDate",
                "lastLoginIp": "$lastLoginIp",
                "lastLoginUa": "$lastLoginUa",
                "lastLoginRealIp": "$lastLoginRealIp",
                "signIp": "$signIp",
                "signUa": "$signUa",
                "signRealIp": "$signRealIp",
                "registerIp": "$registerIpInfo.info.ipAddr",
                "userAgent": "$registerIpInfo.info.userAgent",
                "roles": "$roles"
            }
        }
    ];

    return { aggr, query }
}


export const regNameExact = function(username) {
    return new RegExp("^" + username + "$", 'ig')
}