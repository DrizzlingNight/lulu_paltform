import SimpleSchema from "simpl-schema";
import { Decimal } from "meteor/mongo-decimal";
import { Collection } from "../core/database";
import { BaseSchema } from "../core/schema";
import {Enum} from "../../utils/enum";

// 总分红池
const StakePoolSchema = new SimpleSchema({
    _id: String,
    token: String, // 币种类型
    totalBonus: Decimal, // 总分红
    bonusDivPercent: Decimal, // 分红占比
    totalStake: Decimal, // 用户质押的token总数
    dailyDivPercent: Decimal, // 每日分红占比
    hashrate: Decimal, // 总算力
    shareOutBonusTime: Date, // 下次分红的时间
    historyDivAmount: Decimal,  //历史分红额度
});
StakePoolSchema.extend(BaseSchema);

const StakePool = new Collection("stakePool");
StakePool.attachSchema(StakePoolSchema);

const StakePoolChangeType = new Enum({
    StakeLand: "stakeLand", // 质押土地
    StakeToken: 'stakeToken', // 质押token
    RedeemLand: 'redeemLand', // 赎回土地
    RedeemToken: 'redeemToken', // 赎回token
    CancelRedeemToken: 'cancelRedeemToken', // 取消赎回token
});

// 总分红池改变记录
const StakePoolRecordSchema = new SimpleSchema({
    _id: String,
    token: String,
    changed: Decimal,
    current: Decimal,
    currentHashrate: Decimal,
    changedHashrate: Decimal,
    currentPower: Decimal,
    changedPower: Decimal,
    type: StakePoolChangeType,
    user: String,
    userData: Object,
    createdAt: Date
});

const StakePoolRecord = new Collection("stakePoolRecord");
StakePoolRecord.attachSchema(StakePoolRecordSchema);

// 用户分红池
const StakeUserBonusPoolSchema = new SimpleSchema({
    _id: String,
    token: String,
    total: Decimal,
    user: String,
    historyDivAmount: Decimal,  //历史分红额度
    createdAt: Date
});

const StakeUserBonusPool = new Collection("stakeUserBonusPool");
StakeUserBonusPool.attachSchema(StakeUserBonusPoolSchema);



const StakeBonusChangeType = new Enum({
    Harvest: "harvest", // 领取
    Grant: 'grant', // 发放
});

// 用户分红池改变记录
const StakeUserBonusPoolRecordSchema = new SimpleSchema({
    _id: String,
    token: String,
    current: Decimal,
    changed: Decimal,
    type: StakeBonusChangeType,
    user: String,
    createdAt: Date
});

const StakeUserBonusPoolRecord = new Collection("stakeUserBonusPoolRecord");
StakeUserBonusPoolRecord.attachSchema(StakeUserBonusPoolRecordSchema);


// 用户质押表

const StakeUserPoolSchema = new SimpleSchema({
    _id: String,

    token: String,
    total: Decimal,
    power: Decimal,
    hashrate: Decimal,

    user: String,
    createdAt: Date
});

const StakeUserPool = new Collection("stakeUserPool");
StakeUserPool.attachSchema(StakeUserPoolSchema);


// 用户质押改变记录表

const StakeUserPoolStateType = new Enum({
    Finished: "finished", // 完成
    Redeeming: 'redeeming', // 正在赎回中
    Canceled: 'canceled', // 取消
});

const StakeUserPoolRecordSchema = new SimpleSchema({
    _id: String,

    token: String,

    current: Decimal,
    changed: Decimal,

    currentPower: Decimal,
    changedPower: Decimal,

    currentHashrate: Decimal,
    changedHashrate: Decimal,

    type: StakePoolChangeType,

    state: StakeUserPoolStateType,

    user: String,

    toAccountTime: Date, // 赎回到账时间

    userData: Object,
    createdAt: Date
});

const StakeUserPoolRecord = new Collection("stakeUserPoolRecord");
StakeUserPoolRecord.attachSchema(StakeUserPoolRecordSchema);



export {
    StakePool,
    StakePoolRecord,
    StakeUserPool,
    StakeUserPoolRecord,
    StakeUserBonusPool,
    StakeUserBonusPoolRecord,
    StakePoolChangeType,
    StakeBonusChangeType,
    StakeUserPoolStateType
}
