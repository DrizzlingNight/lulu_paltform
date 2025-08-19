import { Decimal } from 'meteor/mongo-decimal';
import SimpleSchema from 'simpl-schema';
import {Collection} from "../core/database";
import {AllowAny} from "../../startup/both/permissions";
import {UserSettings} from "../games/market/collections";
import {Enum} from "../../utils/enum";

const UserProfileSchema = new SimpleSchema({
    nickname: {
        type: String,
    },
    metadata: {
        type: Object,
        optional: true,
        blackbox: true
    },
    store: {
        type: Object,
        optional: true,
        blackbox: true
    }
});

const UserTokenSchema = new SimpleSchema({
    id: {
        type: String
    },
    address: {
        type: AllowAny,
        optional: true
    }
});

const ReferralStatisticalSchema = new SimpleSchema({
    subordinatesCount: {    //下綫數量
        type: Number,
        optional: true,
        defaultValue: 0
    },
    mintCount: {    //mint總數
        type: Number,
        optional: true,
        defaultValue: 0
    },
    mintConsumeAmount: {
        type: Decimal,   //mint消費
        optional: true,
        defaultValue: 0.0
    },
    depositAmount: {
        type: Array,   //充值
        optional: true,
        defaultValue: 0.0
    },
    "depositAmount.$": {
        type: Object
    },
    "depositAmount.$.token": {
        type: String
    },
    "depositAmount.$.amount": {
        type: Decimal
    },
    gameConsumeAmount: {
        type: Array,   //游戲消費
        optional: true,
        defaultValue: 0.0
    },
    "gameConsumeAmount.$": {
        type: Object
    },
    "gameConsumeAmount.$.token": {
        type: String
    },
    "gameConsumeAmount.$.amount": {
        type: Decimal
    },
});

const UserStatisticalSchema = new SimpleSchema({
    mintCount: {    //mint總數
        type: Number,
        optional: true,
        defaultValue: 0
    },
    mintConsumeAmount: {
        type: Decimal,   //mint消費
        optional: true,
        defaultValue: 0.0
    },
    depositAmount: {
        type: Array,   //充值
        optional: true,
        defaultValue: 0.0
    },
    "depositAmount.$": {
        type: Object
    },
    "depositAmount.$.token": {
        type: String
    },
    "depositAmount.$.amount": {
        type: Decimal
    },
    gameConsumeAmount: {
        type: Array,   //游戲消費
        optional: true,
        defaultValue: 0.0
    },
    "gameConsumeAmount.$": {
        type: Object
    },
    "gameConsumeAmount.$.token": {
        type: String
    },
    "gameConsumeAmount.$.amount": {
        type: Decimal
    },
});

const ContactType = new Enum({
    'Mobile': 'Mobile',
    'Email': 'Email',
    'Telegram': 'Telegram',
    'Line': 'Line',
})

const UserSchema = new SimpleSchema({
    username: {
        type: String,
        optional: true
    },
    emails: {
        type: Array,
        // For accounts-password, either emails or username is required, but not both. It is OK to make this
        // optional here because the accounts-password package does its own validation.
        // Third-party login packages may not require either. Adjust this schema as necessary for your usage.
        optional: true
    },
    "emails.$": {
        type: Object
    },
    "emails.$.address": {
        type: String,
        regEx: SimpleSchema.RegEx.Email
    },
    "emails.$.verified": {
        type: Boolean
    },
    mobile: {
        type: String,
        regEx: SimpleSchema.RegEx.Phone,
        optional: true
    },
    iddCode: {
        type: String,
        optional: true
    },
    createdAt: {
        type: Date
    },
    profile: {
        type: UserProfileSchema,
        optional: true
    },
    services: {
        type: Object,
        optional: true,
        blackbox: true
    },
    heartbeat: {
        type: Date,
        optional: true
    },
    tokens: {
        type: Array,
        defaultValue: []
    },
    "tokens.$": {
        type: UserTokenSchema
    },
    parents:{
        type: Array,
        defaultValue: []
    },
    "parents.$": {
        type: String
    },
    roles: {
        type: Array,
        optional: true,
        blackbox: true
    },
    "roles.$": {
        type: String
    },
    status: {
        type: Object,
        optional: true,
        blackbox: true
    },
    referral: {
        type: String,
        optional: true
    },
    referralStatistical: {
        type: ReferralStatisticalSchema,
        optional: true
    },
    userStatistical: {
        type: UserStatisticalSchema,
        optional: true
    },
    mintCount: {
        type: Number,
        optional: true,
        defaultValue: 0
    },
    registerType: {
        type: String,
        optional: true,
        defaultValue: 'password'
    },
    isDeleted: {
        type: Boolean,
        optional: true,
        blackbox: true
    },
    isActive: {
        type: Boolean,
        optional: true,
        blackbox: true
    },
    isJoinedGroup: {
        type: Boolean,
        defaultValue: false,
    },
    tradePassword: {
        type: String,
        optional: true
    },
    userSettings: {
        type: UserSettings,
        optional: true
    },
    apps: {
        type: Object,
        optional: true,
        blackbox: true
    },
    contracts: {
        type: Object,
        optional: true,
        blackbox: true
    }
});

Meteor.users.attachSchema(UserSchema);

/**@desc 记录上一次IP变化的登陆 */
const LastLoginSchema = new SimpleSchema({
    user: String,               // 用户ID
    ip: String,                 // 不一定真实的ip
    realIp: String,             // CDN提供的真实ip
    country: String,            // CDN提供的真实国家
    ua: String,                 // UserAgent
    offset: String,             // 时区
    lang: String,               // 语言
    createdAt: Date             // 上次更新时间
});
const LastLogin = new Collection("lastLogins");
LastLogin.attachSchema(LastLoginSchema);

const UserBalanceSchema = new SimpleSchema({
    user: String,
    token: String,
    amount: {
        type: Decimal,
        defaultValue: 0.0
    },
    lowAmount: {
        type: Decimal,
        optional: true
    },
    updatedAt: Date
});
const UserBalance = new Collection("userBalance");
UserBalance.attachSchema(UserBalanceSchema);


export { UserSchema, LastLogin, UserBalance, ContactType }
