import moment from "moment/moment";
import {marbleMethods} from "../../../utils/methods";
import {errorCodes} from "../../../settings/errorCodes";
import {SmsTemplateType} from "../../externalService/sms/colletctions";
import {
    addSubordinates,
    bindContactMethod,
    checkCode,
    checkTokenAddresses,
    checkTradePassword,
    getAreas,
    setTradePassword,
    withdraw
} from "./service";
import {Token} from "../../tokens/collections";
import {Decimal} from 'meteor/mongo-decimal';
import {check} from "meteor/check";
import {transaction} from "../../core/database";
import {Events, EventType} from "../../events/collections";
import SimpleSchema from "simpl-schema";
import {sendNotify} from "../../externalService/telegram/server/services";
import {getHotUpdateConf} from "../../hotUpdateConf/services";
import {ContactType} from "../collections";

marbleMethods({
    /** @desc注冊 **/
    signUp: async function (username, password, code, referral = "", iddCode = "", bindData = null) {
        check(username, String)
        check(password, String)
        check(code, String)

        let user = Meteor.users.findOne({
            $or: [{username: username}, {mobile: username}, {"emails": {$elemMatch: {"address": username}}}]
        })
        if (user) {
            throw new Meteor.Error(403, errorCodes.AccountExists)
        }

        const checkSmsCode = await checkCode(username, code, SmsTemplateType.Reg)
        if (!checkSmsCode) {
            throw new Meteor.Error(500, errorCodes.VerificationCodeError)
        }

        let userData = {
            username: username,
            password: password,
            profile: {
                nickname: username,
                referral: referral,
                iddCode: iddCode,
                bindData: bindData
            }
        }
        if (username.match(SimpleSchema.RegEx.Email)) {
            userData.email = username
        }
        let userId = Accounts.createUser(userData)
        const stampedLoginToken = Accounts._generateStampedLoginToken()
        Accounts._insertLoginToken(userId, stampedLoginToken)
        await addSubordinates(referral)
        sendNotify({
            username: username
        }, 'signup')
        return stampedLoginToken.token;
    },

    /** @desc找回密碼 **/
    forgetPassword: async function (username, password, code) {
        check(username, String)
        check(password, String)
        check(code, String)

        const checkSmsCode = await checkCode(username, code, SmsTemplateType.Reset)
        if (!checkSmsCode) {
            throw new Meteor.Error(500, errorCodes.VerificationCodeError)
        }

        const user = Meteor.users.findOne({
            $or: [{mobile: username}, {"emails": {$elemMatch: {"address": username}}}]
        })
        Accounts.setPassword(user._id, password, {logout: false})
    },

    /** @desc提現 **/
    withdraw: async function (token, address, amount, memo, serviceType = null) {
        check(token, String);
        check(address, String);
        check(amount, String);

        if (!Meteor.userId()) {
            throw new Meteor.Error(401, errorCodes.LoginRequired);
        }
        let tokenInfo = Token.findOne({_id: token});
        if (!tokenInfo || !tokenInfo.withdraw) {
            console.error(`withdraw invalid token ${token}`);
            throw new Meteor.Error(500, errorCodes.InvalidToken);
        }

        let numAmount = Decimal(amount);
        if (numAmount.lt(tokenInfo.minWithdraw) || numAmount.gt(tokenInfo.maxWithdraw)) {
            throw new Meteor.Error(500, errorCodes.InvalidAmount);
        }

        let res;
        await transaction.run(async (session) => {
            res = await withdraw(Meteor.user(), numAmount, tokenInfo, memo, {address}, serviceType, session);
        });
        sendNotify({
            username: Meteor.user().username,
            token: token,
            amount: amount,
            bill_no: '--',
            time: new Date()
        }, 'withdraw');
        return res;
    },

    /** @desc獲取用戶錢包地址 **/
    addTokenAddress: async function () {
        return await checkTokenAddresses(Meteor.userId(), true)
    },

    /** @desc登錄記錄 **/
    loginRecord: async function (where) {
        if (!Meteor.userId()) {
            throw new Meteor.Error(401, errorCodes.LoginRequired);
        }
        return await Events.$findAndCount({
            user: Meteor.userId(),
            eventType: EventType.UserLogin
        }, {sort: {createdAt: -1}, skip: where.offset, limit: where.limit})
    },

    /** @desc綁定郵箱or手機號 **/
    bindContactMethod: async function (contactMethod, code, password, iddCode = null) {
        check(code, String)

        if (!Meteor.userId()) {
            throw new Meteor.Error(401, errorCodes.LoginRequired);
        }

        let user = Meteor.users.findOne({
            _id: {$ne: Meteor.userId()},
            $or: [{mobile: contactMethod}, {"emails": {$elemMatch: {"address": contactMethod}}}]
        })

        if (user) {
            throw new Meteor.Error(500, errorCodes.AccountExists)
        }

        const checkSmsCode = await checkCode(contactMethod, code, SmsTemplateType.Bind)
        if (!checkSmsCode) {
            throw new Meteor.Error(500, errorCodes.VerificationCodeError)
        }

        let loginUser = Meteor.user()
        if (!loginUser.services.password) {
            check(password, String)
            if (password.length < 6) {
                throw new Meteor.Error(400)
            }
            Accounts.setPassword(loginUser._id, password, {logout: false})
        }
        return await bindContactMethod(Meteor.userId(), contactMethod, iddCode)
    },

    /** @desc交易密碼設置 **/
    setTradePassword: async function ({password, oldPassword, code}) {
        check(password, String)
        if (!Meteor.userId()) {
            throw new Meteor.Error(401, errorCodes.LoginRequired);
        }

        if (Meteor.user().tradePassword) {
            check(oldPassword, String)
            let checkPassword = await checkTradePassword(Meteor.userId(), oldPassword)
            if (!checkPassword) {
                throw new Meteor.Error(500, errorCodes.TradePasswordError)
            }
        } else {
            check(code, String)
            const checkSmsCode = await checkCode(Meteor.user().username, code, SmsTemplateType.SetTradePassword)
            if (!checkSmsCode) {
                throw new Meteor.Error(500, errorCodes.VerificationCodeError)
            }
        }
        return await setTradePassword(Meteor.userId(), password)
    },

    /** @desc獲取登錄用戶的角色 **/
    getUserRoles: async function () {
        if (!Meteor.userId()) {
            throw new Meteor.Error(401, errorCodes.LoginRequired);
        }
        return Meteor.roleAssignment.find({'user._id': Meteor.userId()}).fetch()
    },

    setStorage: async function (store) {
        if (!Meteor.userId()) {
            throw new Meteor.Error(401, errorCodes.LoginRequired);
        }
        return Meteor.users.rawCollection().findOneAndUpdate(
            {_id: Meteor.userId()}, {$set: {"profile.store": store}})
    },

    getPublicNotice: async function () {
        let list = await getHotUpdateConf("notice")
        if (list && list.length > 0) {
            let t = moment(list[list.length - 1].endtime, 'YYYY/MM/dd HH:mm:ss')
            return (t.unix() > moment().unix()) && list[list.length - 1]
        }
        return {}
    },


    /**
     * @api {call}  Meteor.call("setUserCountry",countryInfo) 设置用户国家信息
     * @apiVersion  0.1.0
     * @apiGroup    User
     * @apiName     设置用户国家信息
     *
     * @apiParam    {Object}     countryInfo                    国家信息
     * @apiParam    {String}     countryInfo.country            国家名称
     * @apiParam    {String}     countryInfo.countryCode        国家码
     *
     * @apiError    401-10102        需要登录
     */
    setUserCountry: async function (data) {
        check(data.country, String)
        check(data.countryCode, String)

        if (!Meteor.userId()) {
            throw new Meteor.Error(401, errorCodes.LoginRequired);
        }
        await Meteor.users.update(
            {_id: Meteor.userId()},
            {
                $set: {
                    "status.country": data.country,
                    "status.countryCode": data.countryCode,
                }
            }
        )
    },

    /**
     * @api {call}  Meteor.call("getAreas") 获取国家列表
     * @apiVersion  0.1.0
     * @apiGroup    User
     * @apiName     获取国家列表
     *
     * @apiParam    {Array}     list       国家码列表
     *
     */
    getAreas: async function () {
        return await getAreas()
    },

    /**
     * @api {call}  Meteor.call("setContacts",address,type) 设置联系方式
     * @apiVersion  0.1.0
     * @apiGroup    User
     * @apiName     设置联系方式
     *
     * @apiParam    {String}     type            类型
     * @apiParam    {String}     address         地址
     *
     * @apiError    401-10102        需要登录
     */
    setContacts: async function (address, type) {
        check(type, String)
        check(address, String)

        if (!ContactType[type]) {
            throw new Meteor.Error(404, errorCodes.NotImplement)
        }

        if (!Meteor.userId()) {
            throw new Meteor.Error(401, errorCodes.LoginRequired);
        }

        await Meteor.users.rawCollection().findOneAndUpdate(
            {_id: Meteor.userId()},
            {$set: {['contacts.' + type]: address}}
        )
    },

    setAllContacts: async function (contacts) {

        for (let i = 0;i < Object.keys(contacts).length; ++i) {
            const key = Object.keys(contacts)[i]
            if (!ContactType[key]) {
                throw new Meteor.Error(404, errorCodes.NotImplement)
            }
        }

        if (!Meteor.userId()) {
            throw new Meteor.Error(401, errorCodes.LoginRequired);
        }

        let res = await Meteor.users.rawCollection().findOneAndUpdate(
            {_id: Meteor.userId()},
            {$set: {['contacts']: contacts}}
        )

        if (res.ok === 1 && res.lastErrorObject.n === 1) {
            return {code : 0, msg: 'success' }
        }
    }
});
