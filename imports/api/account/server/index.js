import {UserStatus} from 'meteor/mizzao:user-status';
import {LastLogin, UserBalance} from "../collections";
import "./methods";
import "./publications"
import logging from "../../logging";
import {errorCodes} from "../../../settings/errorCodes";
import {addRecord, getRegisterEventByUser} from "../../events/server/services";
import {EventType} from "../../events/collections";
import {getBlackByIpOrUser, isDeletedUser} from "../../blackSetting/services"
import {settings} from "/imports/settings";
import SimpleSchema from "simpl-schema";
import metaMask from "/imports/api/walletConnect/metaMask"
import {addSubordinates, updateUserStatisticalActiveStatus} from "./service";
import {appTaskNotify, requestVerify} from "../../apps/server/service";
import {Apps} from "../../apps/collections";
import {TaskRules} from "../../tasks/collections";
import moment from "moment/moment";


Meteor.users.rawCollection().createIndex({"createdAt": -1}, {background: true});
Meteor.users.rawCollection().createIndex({"status.online": 1, createdAt: -1}, {background: true});

LastLogin.rawCollection().createIndex({realIp: 1}, {background: true});
LastLogin.rawCollection().createIndex({_id: 1, realIp: 1}, {background: true});

UserBalance.rawCollection().createIndex({user: 1}, {background: true});
UserBalance.rawCollection().createIndex({user: 1, token: 1}, {unique: true, background: true});
UserBalance.rawCollection().createIndex({_id: 1, token: 1}, {background: true});
UserBalance.rawCollection().createIndex({_id: 1, user: 1}, {background: true});

const logger = logging.getLogger(module.id);

Accounts.onCreateUser((options, user) => {
    const username = user.username
    user.profile = options.profile
    if (username.match(SimpleSchema.RegEx.Email)) {
        user.registerType = 'email'
    }
    if (username.match(SimpleSchema.RegEx.Phone)) {
        user.registerType = 'mobile'
        user.mobile = username
        user.iddCode = options.profile.iddCode
    }
    if (options.registerType)
        user.registerType = options.registerType
    user.isActive = true
    user.isDeleted = false

    const referral = options.profile.referral
    if (referral) {
        let parents = []
        const parentUser = Meteor.users.findOne({_id: referral})
        if (parentUser) {
            parents = parentUser.parents ? parentUser.parents : []
            parents.unshift(referral)
        }
        user.parents = parents
        user.referral = referral
    }

    // sharp账户绑定
    let bindData = options.profile.bindData
    if (bindData) {
        appBind(options.profile.bindData)
        user.apps = {[bindData.app]: bindData.clickId}

        // 任务事件
        let taskRule = TaskRules.findOne({_id: '8001', active: true})
        appTaskNotify(user, taskRule)
    }
    return user;
});

Accounts.onLogin(async (data) => {
    // logger.info(`on user login ${JSON.stringify(data)}`);
    const ua = data.connection.httpHeaders["user-agent"];
    const ip = data.connection.clientAddress;
    let realIp = undefined;
    let country = undefined;
    logger.debug(`request headers: ${JSON.stringify(data.connection.httpHeaders)}`);

    if (settings.realInfoHeaders) {
        for (let cdnHeader of settings.realInfoHeaders) {
            if (data.connection.httpHeaders[cdnHeader.ipHeader] !== undefined) {
                realIp = data.connection.httpHeaders[cdnHeader.ipHeader]
                country = cdnHeader.countryHeader && data.connection.httpHeaders[cdnHeader.countryHeader]
                let p = recordLastLogin(data.user._id, ip, realIp, country, ua)
                break
            }
        }
    }

    let user = Meteor.users.findOne({_id: data.user._id});

    if (user.status.signUa === undefined) {
        // 首次登录时，更新注册IP
        Meteor.users.update({_id: user._id}, {
            $set: {
                'status.signIp': ip,
                'status.signUa': ua,
                'status.signRealIp': realIp,
                'status.signRealCountry': country
            }
        });
    } else {
        Meteor.users.update({_id: user._id}, {
            $set: {
                'status.lastLogin.realIp': realIp || '',
                'status.lastLogin.realCountry': country || ''
            }
        });
    }
    await updateUserStatisticalActiveStatus()
    //初始化用户任务
    /*let lastLogin = data.user.status.lastLogin && data.user.status.lastLogin.date ? moment(data.user.status.lastLogin.date) : moment('0')
    if (!lastLogin.isSame(moment(), 'day')) {
        await initUserTasks(user, 'daily_task')
        await initUserTasks(user, 'weekly_task')
        await initUserTasks(user, 'rookie_task')
    }*/
});


// 多個tab頁麵的時候每個頁麵刷新時會觸發（多個連接的時候，監聽每個實例的動作）
UserStatus.events.on("connectionLogin", async function (info) {
    await addRecord(EventType.UserLogin, info.userId, info)
})
UserStatus.events.on("connectionLogout", async function (info) {
    await addRecord(EventType.UserLogout, info.userId, info)
})
UserStatus.events.on("connectionIdle", async function (info) {
    await addRecord(EventType.UserIdle, info.userId, info)
})
UserStatus.events.on("connectionActive", async function (info) {
    await addRecord(EventType.UserActive, info.userId, info)
})


Accounts.validateNewUser((user) => {
    let referral = user.referral;
    if (referral) {
        let user = Meteor.users.findOne({_id: referral});
        if (user) {
            return true;
        } else {
            throw new Meteor.Error(403, errorCodes.ReferralInvalid);
        }
    } else {
        return true
        // throw new Meteor.Error(403, errorCodes.ReferralInvalid);
    }
});

// 登陸檢查黑名單 是否已經刪除的用戶
Accounts.validateLoginAttempt(userInfo => {
    const clientIp = userInfo.connection.clientAddress
    let result = false
    let isDeleted = false
    try {
        result = getBlackByIpOrUser({ip: clientIp, user: userInfo.user._id});
        isDeleted = isDeletedUser(userInfo.user._id)
        // 當count為0的時候首次注冊登錄進來
        const count = getRegisterEventByUser(userInfo.user._id)
        if (count === 0) {
            addRecord(EventType.UserRegister, userInfo.user._id, {
                userId: userInfo.user._id,
                ipAddr: userInfo.connection.clientAddress,
                userAgent: userInfo.connection.httpHeaders["user-agent"]
            })
        }
    } catch (error) {
        logger.error(`validateLoginAttempt: ${JSON.stringify(error)}`);
    }
    if (result || isDeleted) {
        throw new Meteor.Error(403, errorCodes.InvalidUser);
    } else {
        return true
    }
})

Accounts.registerLoginHandler(function (loginRequest) {
    logger.info(`on user login ${JSON.stringify(loginRequest)}`);
    //there are multiple login handlers in meteor.
    //a login request go through all these handlers to find it's login hander
    if (loginRequest.loginType === 'metaMask') {
        return loginByMetaMask(loginRequest, this.connection);
    } else if (loginRequest.loginType === 'lulu') {
        return loginByLulu(loginRequest)
    }
});

function loginByLulu(request) {
    let user = Meteor.users.findOne(
        {
            $or: [
                {username: request.user},
                {mobile: request.user},
                {"emails": {$elemMatch: {"address": request.user}}}
            ]
        }
    )
    if (!user) {
        throw new Meteor.Error(403)
    }
    const result = Accounts._checkPassword(user, request.pwd);
    if (result.error) {
        throw result.error;
    }
    return {userId: user._id}
}

function loginByMetaMask(request, connection) {
    let res = metaMask.verify(connection.id, request.signature)
    if (!res || (String(res).toLowerCase() !== String(request.name).toLowerCase())) {
        logger.error(`login sig verify failed ${JSON.stringify(request)} ${JSON.stringify(res)}`);
        throw new Meteor.Error(403);
    }
    let username = String(request.name).toLowerCase();
    let user_query = {username};
    let user = Meteor.users.findOne(user_query);
    let userId;
    if (!user) {
        let userData = {
            username: username,
            registerType: "metaMask",
            profile: {
                nickname: username,
                referral: request.referral,
                bindData: request.bindData
            }
        }
        if (username.match(SimpleSchema.RegEx.Email)) {
            userData.email = username
        }
        userId = Accounts.createUser(userData)
        addSubordinates(request.referral)
    } else {
        userId = user._id;
    }
    return {userId};
}

/** @description 记录每日登录(单日相同IP和浏览器只记录一次) */
async function recordLastLogin(userId, ip, realIp, country, ua) {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 86400000);
    const loginRecord = await LastLogin.$findOne({
        user: userId,                       // 同一个人
        ip: ip,                             // 同一个ip
        realIp: realIp,                     // 同一个真实ip
        ua: ua,                             // 同一个ua
        createdAt: {$gt: yesterday}       // 一天之内
    });
    if (!loginRecord) {
        await LastLogin.rawCollection().insert({
            user: userId,
            ip: ip,
            realIp: realIp,
            country: country,
            ua: ua,
            createdAt: now
        });
    }
}

/** @description 记录每日登录额外信息(切换时区和语言会被记录) */
export async function recordLastLoginExtra(userId, offset, browserLang) {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 86400000);

    const loginRecord = await LastLogin.$findOne(
        {user: userId, createdAt: {$gt: yesterday}},
        {sort: {createdAt: -1}}
    );
    if (loginRecord && loginRecord.offset === undefined) {
        await LastLogin.findOneAndUpdate({
            _id: loginRecord._id
        }, {
            $set: {offset: offset, lang: browserLang}
        });
    } else if (loginRecord && (loginRecord.offset !== offset || loginRecord.lang !== browserLang)) {
        await LastLogin.rawCollection().insert({
            user: userId,
            ip: loginRecord.ip,
            realIp: loginRecord.realIp,
            country: loginRecord.country,
            ua: loginRecord.ua,
            createdAt: now,
            offset: offset,
            lang: browserLang
        });
    } else {
        logger.error('recordLastLoginExtra failed, cannot find loginRecord');
    }
}


const appBind = function (bindData) {
    let filter = {['apps.' + bindData.app]: bindData.clickId}
    let user = Meteor.users.findOne(filter)
    if (user) {
        throw new Meteor.Error(500, errorCodes.BindUserExisted)
    }
    let app = bindData.app
    let appConfig = Apps.findOne({_id: app})
    let nonce = bindData.nonce
    let key = bindData.pubKey
    let sign = bindData.sign
    delete bindData.nonce
    delete bindData.sign
    delete bindData.pubKey
    if (appConfig.signVerify) {
        if (!requestVerify(app, bindData, nonce, key, sign, 'bind')) {
            throw new Meteor.Error('500', errorCodes.InvalidParams)
        }
    }

}
