import {clear, get} from "../../cache";
import {check, Match} from "meteor/check";
import {Decimal} from 'meteor/mongo-decimal';
import logging from "../../logging";
import {Token, TokenChange, TokenChangeType} from "../../tokens/collections";
import {MongoInternals} from "meteor/mongo";
import {settings} from "../../../settings";
import {errorCodes} from "../../../settings/errorCodes";
import {getTokens, tokenChange} from "../../tokens/server/services";
import {Random} from "meteor/random";
import {UserBalance} from "../collections";
import * as _ from "lodash";
import moment from "moment";
import {Events, EventType} from "../../events/collections";
import {Transaction, TransactionSchema, TransactionStatus, TransactionType} from "../../transactions/collections";
import {addRecord} from "../../events/server/services";
import api from "../../blockchain/services";
import {transaction} from "../../core/database";
import SimpleSchema from "simpl-schema";
import {sendNotify} from "../../externalService/telegram/server/services";
import {updateTaskProgress} from "../../tasks/server/services";

const logger = logging.getLogger(module.id);
const Decimal128 = MongoInternals.NpmModules.mongodb.module.Decimal128;
const DEFAULTBALANCE = String(settings.defaultBalance || 0)
const MAXWITHDRAWLIMIT = String(settings.maxWithdrawLimit || 50000);
const $ObjectID = MongoInternals.NpmModules.mongodb.module.ObjectID
const crypto = require('crypto');

/** @description 獲取單個用戶指定token信息 */
const _getToken = function (user, token_id) {
    return _.find(user.tokens, function (t) {
        if (t.id === token_id) {
            return t;
        }
    });
};

/** @description 獲取跨鏈token信息 */
const getUsedToken = function (token, serviceType) {
    let usedToken = null
    let info = {"withdrawalFee": token.withdrawalFee, "decimalPlaces": token.decimalPlaces}
    if (token.serviceType && serviceType) {
        usedToken = token.serviceType.find(item => {
            return item.type === serviceType
        })
    }
    if (usedToken) {
        if (usedToken.withdrawalFee) {
            info.withdrawalFee = usedToken.withdrawalFee
        }
        if (usedToken.decimalPlaces) {
            info.decimalPlaces = usedToken.decimalPlaces
        }
    }
    return info
}

/** @description 驗證碼驗證 */
const checkCode = async function (username, code, codeType) {
    const cacheKey = username + "_" + codeType
    let cache = get(cacheKey)
    if (cache && cache === code) {
        clear(cacheKey)
        return true
    }
    return false
}

/** @description 獲取用戶指定token */
const getUserToken = async function (user, token_id, session) {
    let userToken = _getToken(user, token_id);
    if (!userToken) {
        let result = await Meteor.users.rawCollection().findOneAndUpdate({
            _id: user._id,
            "tokens.id": {$ne: token_id}
        }, {
            $push: {
                "tokens": {id: token_id}
            }
        }, {
            session,
            returnOriginal: false
        });
        if (result.ok === 1 && result.value) {
            userToken = _getToken(result.value, token_id);
        } else {
            let u = await Meteor.users.rawCollection().findOne({_id: user._id}, {session});
            userToken = _getToken(u, token_id);
        }
    }
    if (userToken) {
        return userToken;
    }
    logger.error(`get user token error ${JSON.stringify(user)} ${token_id}`);
    throw new Meteor.Error(500, errorCodes.UserTokenError);
};

/** @description 獲取用戶指定token餘額 */
const getBalance = async function (user, tokenId, session) {
    let balance = await UserBalance.rawCollection().findOne({user: user._id, token: tokenId}, {session})
    if (!balance) {
        await UserBalance.rawCollection().insert({
            user: user._id,
            token: tokenId,
            amount: Decimal128.fromString(DEFAULTBALANCE),
            updatedAt: new Date()
        },{session})
        return Decimal(0)
    }
    return Decimal(balance.amount.toString());
};

/** @description 增加餘額 */
const addBalance = async function ({user, amount, token, type, userData = {}}, session) {
    logger.info(`add balance ${user.username} ${amount.toString()} ${token._id} ${type} ${JSON.stringify(userData)}`);

    check(type, Match.Where((t) => {
        check(t, Match.Integer);
        return Object.values(TokenChangeType).indexOf(t) >= 0;
    }));

    let tokenid = token._id
    if (amount.gt(0)) {
        await getUserToken(user, tokenid, session);
        let balance = await getBalance(user, tokenid, session);
        let changed = Decimal128.fromString(amount.toString());
        let result = await UserBalance.rawCollection().findOneAndUpdate({
            user: user._id,
            token: tokenid,
        }, {
            $inc: {amount: changed},
        }, {
            session
        });
        if (result.ok === 1) {
            let current = balance.add(amount)
            return await tokenChange({user: user, type, amount, current, token, userData}, session);
        }
    } else {
        throw new Meteor.Error(500, errorCodes.InvalidAmount);
    }
};

/** @description 扣除餘額 */
const removeBalance = async function ({user, amount, token, type, userData}, session) {
    logger.info(`remove balance ${user.username} ${amount.toString()} ${token._id} ${type}`);

    check(amount, Decimal);
    check(type, Match.Where((t) => {
        check(t, Match.Integer);
        return Object.values(TokenChangeType).indexOf(t) >= 0;
    }));

    let tokenid = token._id
    if (amount.gt(0)) {
        await getUserToken(user, tokenid, session);
        let balance = await getBalance(user, tokenid, session)
        let result = await UserBalance.rawCollection().findOneAndUpdate({
            user: user._id,
            token: tokenid,
            amount: {$gte: Decimal128.fromString(amount.toString())}
        }, {
            $inc: {amount: Decimal128.fromString(amount.neg().toString())},
        }, {
            session,
            returnOriginal: false
        });
        if (result.ok === 1 && result.value) {
            let current = balance.sub(amount)
            return await tokenChange({user: user, type, amount: amount.neg(), current, token, userData}, session);
        } else {
            throw new Meteor.Error(500, errorCodes.NotEnoughToken);
        }
    } else if (amount.lt(0)) {
        throw new Meteor.Error(500, errorCodes.InvalidAmount);
    }
};

/** @description 檢測每日提現限額 **/
const checkDailyMaxWithdraw = async function ({user, token, dailyMaxWithdrawAmount, amount}) {
    const time = moment().startOf('day').unix()
    const aggr = [{
        $match: {
            user: user,
        }
    }, {
        $match: {
            eventType: EventType.UserWithdraw,
            "info.time": time,
            "info.token": token,
        }
    }, {
        $group: {_id: "$info.token", total: {$sum: "$info.amount"}}
    }];
    const result = await Events.rawCollection().aggregate(aggr).toArray();
    const withdrawAmount = result[0] ? result[0].total.toString() : 0;
    return (Number(withdrawAmount) + Number(amount.toString())) > Number(dailyMaxWithdrawAmount)

}

/** @description 最大提現額度 **/
export const getMaxWithdrawLimit = async function (tokenId) {
    const token = await Token.findOne({_id: tokenId});
    return token ? token.manualcheckwithdraw : MAXWITHDRAWLIMIT
}

/** @description 檢查充提記錄 **/
const checkDepositAndWithdrawHistory = async function (user, token, trans, withdrawAmount, session) {
    const historyData = await Transaction.rawCollection().aggregate([
        {
            $match: {
                user,
                token: token._id,
                status: {$in: [0, 1, 2, 4]},
                createdAt: {$gte: moment().subtract(token.withdrawCheckTime || 7, "days").toDate()}
            }
        },
        {$group: {_id: "$type", amount: {$sum: "$amount"}}}
    ], {session}).toArray();
    let amount = Decimal(token.withdrawExceedDepositLimit || 0);
    historyData.forEach(d => {
        if (d._id === 1)
            amount = amount.add(d.amount.toString());
        else
            amount = amount.minus(d.amount.toString());
    })

    if (amount.lt(withdrawAmount))
        trans.status = TransactionStatus.AwaitReview;

    return trans;
}

/** @description 清除當日提現額度 **/
const clearWithdrawEvents = async function (requestId, session) {
    await Events.rawCollection().updateOne({
        eventType: EventType.UserWithdraw,
        "info.requestId": requestId
    }, {$set: {"info.amount": 0}}, {session})
}

const failedWithdraw = async function (transId, session) {
    const trans = await Transaction.findOne({_id: transId});
    if (!trans) {
        throw new Meteor.Error(500, errorCodes.InvalidTransOrder)
    }

    const token = await Token.findOne({_id: trans.token});
    const user = Meteor.users.findOne({_id: trans.user});

    await addBalance({
        user,
        amount: Decimal(trans.amount.toString()),
        token,
        type: TokenChangeType.WithdrawCancel,
        userData: {transaction: trans._id}
    }, session);

    if (Decimal(token.withdrawalFee).gt(0)) {
        let usedToken = getUsedToken(token, trans.serviceType)
        await addBalance({
            user,
            amount: Decimal(usedToken.withdrawalFee),
            token,
            type: TokenChangeType.WithdrawCancelFee,
            userData: {transaction: trans._id}
        }, session);
    }
    await clearWithdrawEvents(trans.requestId, session)
}

/** @description 發起提現 */
const withdraw = async function (user, amount, token, memo, requestData, serviceType, session) {
    check(amount, Decimal);
    check(memo, String);
    check(requestData, Match.Maybe(Object));
    let address = requestData.address;
    check(address, String);

    // 檢查是否超過本日提現最大額度，如果沒有設置最大額度則不檢查
    if (token.dailyMaxWithdraw) {
        const isDailyMaxLimitWithdraw = await checkDailyMaxWithdraw({
            user: user._id,
            token: token._id,
            dailyMaxWithdrawAmount: token.dailyMaxWithdraw,
            amount
        })
        if (isDailyMaxLimitWithdraw) {
            return {
                code: errorCodes.DailyMaxLimitWithdraw,
                DailyMaxLimitWithdraw: token.dailyMaxWithdraw
            }
        }
    } else {
        logger.warn(`Please set the maximum daily withdrawal amount`);
    }
    // 單筆最大提現審批額度
    const maxWithdrawLimit = await getMaxWithdrawLimit(token._id)
    let requestId = Random.id();
    let trans = {
        _id: Random.id(),
        user: user._id,
        amount: Decimal128.fromString(amount.toString()),
        status: amount.gte(maxWithdrawLimit) ? TransactionStatus.AwaitReview : TransactionStatus.Init,
        token: token._id,
        type: TransactionType.Withdraw,
        requestData: requestData,
        requestId: requestId,
        serviceType: serviceType,
        memo
    };

    // 风控
    trans = await checkDepositAndWithdrawHistory(user._id, token, trans, amount, session);
    trans.status = TransactionStatus.Init // test

    trans = TransactionSchema.clean(trans, {mutate: true, extendAutoValueContext: {isInsert: true}});
    TransactionSchema.validate(trans);

    let res = await Transaction.rawCollection().insert(trans, {session});
    await removeBalance({user, amount, token, type: TokenChangeType.Withdraw, userData: {requestId}}, session);

    let usedToken = getUsedToken(token, serviceType)
    let fee = Decimal(usedToken.withdrawalFee);
    if (fee.gt(0))
        await removeBalance({
            user,
            amount: fee,
            token,
            type: TokenChangeType.WithdrawFee,
            userData: {requestId}
        }, session); //手續費

    // 記錄今日提現額度
    await addRecord(EventType.UserWithdraw, user._id, {
        time: moment().startOf('day').unix(),
        token: token._id,
        amount: amount,
        requestId
    }, session)
    if (trans.status !== TransactionStatus.AwaitReview) {
        try {
            let work = await api.withdrawRequesting(session, token, amount, address, requestId, memo, serviceType);
            trans = await Transaction.rawCollection().findOneAndUpdate({_id: trans._id}, {
                $set: {
                    status: TransactionStatus.Pending,
                    requestWork: work._id
                }
            }, {returnOriginal: false, session});
        } catch (e) {
            logger.error(e);
            trans = await Transaction.rawCollection().findOneAndUpdate({_id: trans._id}, {$set: {response: e.toString()}}, {
                returnOriginal: false,
                session
            });
        }
    }
    return trans.value
};

/** @description 提現回調 */
const withdrawCallback = async function (request_id, txid, tx_status, responseData, db_tran) {
    check(request_id, String);
    check(txid, Match.Maybe(String));
    check(tx_status, String);
    check(responseData, Match.Maybe(Object));

    let query = {requestId: request_id, status: db_tran.status};
    let status = TransactionStatus.Init;
    if (tx_status === "failed") {
        status = TransactionStatus.Failed;
    } else if (tx_status === "pending") {
        status = TransactionStatus.Pending;
    } else if (tx_status === "success") {
        status = TransactionStatus.Done;
    } else {
        throw new Error(`withdraw callback request ${request_id} txid ${txid} invalid tx status ${tx_status}`);
    }
    await transaction.run(async (session) => {
        let updated = await Transaction.rawCollection().updateOne(query, {
            $set: {
                status,
                txId: txid,
                responseData: responseData
            },
        }, {session});

        if (updated.modifiedCount > 0) {
            if (status === TransactionStatus.Failed) {
                await failedWithdraw(db_tran._id, session)
            }
            logger.info(`withdraw callback ${request_id} change status to ${status} `);
        } else {
            logger.error(`withdraw transaction ${JSON.stringify(query)} not found or not modified`);
        }
    });


};

/** @description 充值完成 */
const deposit = async function (user, amount, token, txId, responseData, session) {
    check(amount, Decimal);
    let transStatus = TransactionStatus.Pending
    if (responseData.status === 'success') {
        transStatus = TransactionStatus.Done
    }
    let trans = {
        _id: Random.id(),
        user: user ? user._id : null,
        amount: Decimal128.fromString(amount.toString()),
        status: transStatus,
        token: token ? token._id : responseData.coin,
        type: TransactionType.Deposit,
        responseData: responseData,
        txId
    };
    trans = TransactionSchema.clean(trans, {mutate: true, extendAutoValueContext: {isInsert: true}});
    TransactionSchema.validate(trans);

    let result = await Transaction.rawCollection().findOneAndUpdate({
        token: token ? token._id : responseData.coin,
        txId,
        type: TransactionType.Deposit,
    }, {
        $setOnInsert: trans,
    }, {
        session,
        upsert: true
    });
    if (responseData.status === 'success') {
        if (user && token && result.ok === 1 && result.lastErrorObject.upserted) {
            await addBalance({user, amount, token, type: TokenChangeType.Deposit}, session);
            await addDepositAmount(user, token, amount, session)

            // 任务事件
            await updateTaskProgress(user, 'deposit', token._id, amount, session)
            sendNotify({
                username: user.username,
                amount: amount.toFixed(),
                token: token._id,
                bill_no: trans._id,
                time: new Date()
            }, 'deposit');
        } else {
            await Transaction.rawCollection().findOneAndUpdate({
                token: token ? token._id : responseData.coin,
                txId,
                type: TransactionType.Deposit,
            }, {
                $set: {responseData, status: TransactionStatus.Done},
            }, {
                session,
                upsert: true
            });
        }
    }
    return trans;
};

/** @description 用戶是否有某個token的錢包 **/
const tokenAddressExists = async function (user, token, serviceType) {
    return !!Meteor.users.find({
        _id: user._id,
        "tokens": {$elemMatch: {"id": token._id, "address.type": serviceType}}
    }).count();
};

/** @description 用给定地址更新单个token的地址 */
const updateTokenAddress = async function (user, token_id, address) {
    if (Match.test(user, String)) {
        user = Meteor.users.findOne({_id: user});
    }
    check(token_id, String);

    let userToken = await getUserToken(user, token_id);

    logger.info(`update user ${user.username} token ${token_id} address from ${userToken.address} to ${JSON.stringify(address)}`);
    let result = await Meteor.users.rawCollection().update({
        _id: user._id,
        "tokens": {$elemMatch: {id: token_id}}
    }, {
        $set: {
            "tokens.$.address": address,
        }
    });
    if (result.result.ok === 1) {
        logger.info(`success update user ${user.username} token ${token_id} address ${JSON.stringify(address)}`);
    } else {
        logger.info(`failed update user ${user.username} token ${token_id} address ${JSON.stringify(address)}`);
    }
};

/** @description 更新单个token的地址 */
const newTokenAddress = async function (user, token_id) {
    if (Match.test(user, String)) {
        user = Meteor.users.findOne({_id: user});
    }
    check(token_id, String);

    let token = Token.findOne({_id: token_id});
    let userToken = await getUserToken(user, token._id);

    let newAddress = userToken.address ? userToken.address : []
    let flag = false
    if (token.serviceType) {
        if (userToken.address && typeof userToken.address === 'string') {
            let exists = await tokenAddressExists(user, token, token.defaultServiceType)
            if (!exists) {
                let serviceType = token.serviceType.find(item => {
                    return item.type === token.defaultServiceType
                })
                newAddress.push({
                    "type": token.defaultServiceType,
                    "token_id": serviceType._id,
                    "address": userToken.address
                })
                flag = true
            }
        }
        for (let serviceType of token.serviceType) {
            let exists = newAddress.find(item => {
                return item.type === serviceType.type
            })
            if (!exists) {
                try {
                    let address = await api.createAddress(serviceType);
                    newAddress.push({"type": serviceType.type, "token_id": serviceType._id, "address": address})
                    flag = true
                } catch (e) {
                    logger.error(e);
                }
            }
        }
    } else {
        logger.warn(`token need set serviceType`)
    }

    if (flag) {
        await updateTokenAddress(user, token_id, newAddress);
    }
};

/** @description 更新用戶錢包地址 */
const checkTokenAddresses = async function (user, addAddress = false) {
    if (Match.test(user, String)) {
        user = Meteor.users.findOne({_id: user});
    }

    let tokens = getTokens();
    for (let token of tokens) {
        await getUserToken(user, token._id);
        logger.info(`need update token:${token.name} address for ${Meteor.user().username}`)
        /* 当前行为要求添加地址，该币种需要地址，用户没地址，且不是本地测试环境 */
        if (addAddress && token.needAddress && !settings.localTest) {
            logger.info(`update token:${token.name} address for ${Meteor.user().username}`)
            try {
                await newTokenAddress(user, token._id);
            } catch (e) {
                logger.error(e);
            }
        }
    }
};

/** @desc綁定手機號或郵箱 **/
const bindContactMethod = async function (userId, contactMethod, iddCode) {
    let updateData = {}
    if (contactMethod.match(SimpleSchema.RegEx.Email)) {
        updateData = {emails: [{address: contactMethod, verified: true}]}
    }
    if (contactMethod.match(SimpleSchema.RegEx.Phone)) {
        updateData = {mobile: contactMethod, iddCode:iddCode}
    }
    return await Meteor.users.update(
        {_id: userId},
        {$set: updateData}
    )
}

/** @desc驗證交易密碼 **/
const checkTradePassword = async function (userId, tradePassword) {
    const user = Meteor.users.findOne({_id: userId})
    let password = crypto.createHash('md5').update(userId + tradePassword).digest('base64')
    return password === user.tradePassword
}

/** @desc設置交易密碼 **/
const setTradePassword = async function (userId, tradePassword) {
    let password = crypto.createHash('md5').update(userId + tradePassword).digest('base64')
    return await Meteor.users.update(
        {_id: userId},
        {$set: {tradePassword: password}}
    )
}

/** 更新下綫數量 **/
const addSubordinates = async function (userId, session) {
    await Meteor.users.rawCollection().findOneAndUpdate({
        _id: userId,
    }, {
        $inc: {'referralStatistical.subordinatesCount': 1},
    }, {
        session
    });
}

/** 更新mint數 **/
const addMintCount = async function (user, count, amount, session) {
    await Meteor.users.rawCollection().findOneAndUpdate({
        _id: user.referral,
    }, {
        $inc: {'referralStatistical.mintCount': parseInt(count), 'referralStatistical.mintConsumeAmount': Decimal128.fromString(amount.toString())},
    }, {
        session
    });

    await Meteor.users.rawCollection().findOneAndUpdate({
        _id: user._id,
    }, {
        $inc: {'userStatistical.mintCount': parseInt(count), 'userStatistical.mintConsumeAmount': Decimal128.fromString(amount.toString())},
    }, {
        session
    });
}

/** 更新累充金額 **/
const addDepositAmount = async function (user, token, amount, session) {
    let referralRes = await Meteor.users.rawCollection().findOneAndUpdate({
        _id: user.referral,
        "referralStatistical.depositAmount.token": token._id
    }, {
        $inc: {'referralStatistical.depositAmount.$.amount': Decimal128.fromString(amount.toString())},
    }, {
        session
    });
    if (referralRes.ok === 1 && !referralRes.lastErrorObject.updatedExisting) {
        await Meteor.users.rawCollection().findOneAndUpdate({
            _id: user.referral,
        }, {
            $push: {'referralStatistical.depositAmount': {token: token._id, amount: Decimal128.fromString(amount.toString())}},
        }, {
            session
        });
    }

    let userRes = await Meteor.users.rawCollection().findOneAndUpdate({
        _id: user._id,
        "userStatistical.depositAmount.token": token._id
    }, {
        $inc: {'userStatistical.depositAmount.$.amount': Decimal128.fromString(amount.toString())},
    }, {
        session
    });
    if (userRes.ok === 1 && !userRes.lastErrorObject.updatedExisting) {
        await Meteor.users.rawCollection().findOneAndUpdate({
            _id: user._id,
        }, {
            $push: {'userStatistical.depositAmount': {token: token._id, amount: Decimal128.fromString(amount.toString())}},
        }, {
            session
        });
    }
}

/**设置用户活跃状态**/
const updateUserStatisticalActiveStatus = async function(){
    let user = Meteor.user()
    let createdAt = moment(user.createdAt).clone().startOf('days')
    let secondDay = createdAt.clone().add(1, 'days')
    let thirdDay = createdAt.clone().add(2, 'days')
    let seventhDay = createdAt.clone().add(6, 'days')
    let timeList = [createdAt.unix(), secondDay.unix(), thirdDay.unix(), seventhDay.unix(),]
    let loginTime = moment().startOf('days').unix()
    let index = timeList.indexOf(loginTime)
    let profile
    if (index === 1)
        profile = { "status.activeStatus.secondDay":true }
    else if (index === 2)
        profile = { "status.activeStatus.thirdDay":true }
    else if (index === 3)
        profile = { "status.activeStatus.seventhDay":true }
    if (profile) {
        Meteor.users.update({_id: user._id}, {
            $set: profile
        });
    }
}

const setUserStatisticalActiveStatus = async function(userId){
    let user
    if (userId){
        user = Meteor.users.findOne({_id:userId})
    }else{
        user = Meteor.user()
    }
    let createdAt = moment(user.createdAt).clone().startOf('days')
    let secondDay = createdAt.clone().add(1, 'days')
    let thirdDay = createdAt.clone().add(2, 'days')
    let seventhDay = createdAt.clone().add(6, 'days')
    let profile = {
        secondDay: false,
        thirdDay: false,
        seventhDay: false,
    }
    let timeList = [createdAt.unix(), secondDay.unix(), thirdDay.unix(), seventhDay.unix(),]
    if (!user.services.resume)
        return
    for(let i in user.services.resume.loginTokens){
        let loginTime = moment(user.services.resume.loginTokens[i].when).startOf('days').unix()
        let index = timeList.indexOf(loginTime)
        if (index === 1)
            profile.secondDay = true
        else if (index === 2)
            profile.thirdDay = true
        else if (index === 3)
            profile.seventhDay = true
    }
    Meteor.users.update({_id: user._id}, {
        $set: {
            "status.activeStatus": profile
        }
    });
}

const setUserJoinedGroup = async function(userId, isJoined) {
    let user = null
    if (userId){
        user = Meteor.users.findOne({_id:userId})
    }
    if (user) {
        Meteor.users.update({_id: user._id}, {
            $set: {
                "isJoinedGroup": isJoined
            }
        });
    }
}

/**获取地区列表**/
const getAreas = async function () {
    const data = await Meteor.users.rawCollection().aggregate([
        {$match: {}},
        {
            $group: {
                _id: '$status.countryCode',
            }
        }
    ]).toArray()
    let areas = []
    data.forEach(d => {
        if (d._id) {
            areas.push(d._id)
        }
    })
    return areas
}

export {
    checkCode,
    getUserToken,
    getUsedToken,
    getBalance,
    addBalance,
    removeBalance,
    withdraw,
    withdrawCallback,
    deposit,
    checkTokenAddresses,
    bindContactMethod,
    checkTradePassword,
    setTradePassword,
    addSubordinates,
    addMintCount,
    getAreas,
    setUserStatisticalActiveStatus,
    updateUserStatisticalActiveStatus,
    setUserJoinedGroup
}
