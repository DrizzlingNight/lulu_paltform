import SimpleSchema from 'simpl-schema';
import {Decimal} from 'meteor/mongo-decimal';
import {BaseSchema} from "../core/schema";
import {Collection} from "../core/database";
import {Enum} from "/imports/utils/enum";

const TokenSchema = new SimpleSchema({
    // 基本信息
    name: String,  // 全名，和ID一样，必须是cobo认可的
    code: String,
    blockchain: String,  // 链名
    symbol: String,  // 币名
    decimalPlaces: Number,  // 越值钱位数越多
    decimalPlacesToShow: Number,
    active: {
        type: Boolean,
        defaultValue: true  // 为true才会加入新用户的userToken
    },
    needAddress: {  // 需要地址，会去cobo创造地址，挂在userToken里
        type: Boolean,
        defaultValue: true
    },
    order: Number,  // 排序
    isShowTab: { // 是否在首頁tab上顯示餘額
        type: Boolean,
        defaultValue: false,
    },
    serviceType: Array,
    "serviceType.$": Object,
    defaultServiceType: String,

    // 充值提現
    deposit: { //是否可以充值
        type: Boolean,
        defaultValue: true,
    },
    withdraw: { //是否可以提現
        type: Boolean,
        defaultValue: false,
    },
    minWithdraw: {
        type: Decimal,
        blackbox: true
    },
    maxWithdraw: {
        type: Decimal,
        blackbox: true
    },
    withdrawalFee: {
        type: Decimal,
        blackbox: true
    },
    depositCheckTime: {  // 用户充值的到账时间
        type: Number,
        defaultValue: 5
    },
    dailyMaxWithdraw: { // 單日每人最大提現額度
        type: String,
    },
    manualCheckWithdraw: { //觸發手動審核提現額度
        type: Number,
        defaultValue: 0
    },

    exchangeFee: {
        type: Number,
        defaultValue: 0.005
    },
    referral: { // 是否是邀請的獎勵幣，所有tokens隻能有一個為true
        type: Boolean,
        defaultValue: false
    },
    referralRate: { // 換算成獎勵幣的利率
        type: Number,
        defaultValue: 10
    },
    referralRateByLevel: Array,
    "referralRateByLevel.$": Object,

    // 挖礦
    mining: { // 是否是挖礦幣，所有tokens隻能有一個為true
        type: Boolean,
        defaultValue: false
    },
    miningRate: { // 挖礦利率，大於0會有挖礦收益
        type: SimpleSchema.oneOf(Number, String),
        defaultValue: 100
    },
    payout: { // 是否是質押幣，所有tokens隻能有一個為true
        type: Boolean,
        defaultValue: false
    },

    reference: { // 是否是平台穩定幣 leader board，所有tokens隻能有一個為true
        type: Boolean,
        defaultValue: false
    },

    stake: { // 是否是抵押幣，所有tokens隻能有一個為true
        type: Boolean,
        defaultValue: false
    },
    convert: Array, //可以兌換的貨幣列表 _id
    "convert.$": String,


    minStake: { //最小質押數量
        type: String,
        defaultValue: "1"
    },
    maxStake: { //最大質押數量
        type: String,
        defaultValue: "10000000000"
    },
    maxTotalStake: { //最大總質押數量占穩定幣的流水數量的比
        type: Number,
        defaultValue: null
    },
    maxTotalStakeRate: { //最大總質押數量占穩定幣的流水數量的比
        type: String,
        defaultValue: "0"
    },
    minRedeem: { //最小贖回數量
        type: String,
        defaultValue: "0"
    },
    maxRedeem: { //最大贖回數量
        type: String,
        defaultValue: "10000000000"
    },
    redeemTime: { //贖回所需時間（小時）
        type: String,
        defaultValue: "24"
    },

    minExchange: { // 最小兌換額
        type: String,
    },
    canBuyIn: { // 是否支持买入
        type: Boolean,
        defaultValue: false,
    },

    fund: { // 是否基金幣，所有tokens隻能有一個為true
        type: Boolean,
        defaultValue: false
    },

    bonusRatio: { //进入质押分红池比例
        type: String,
        defaultValue: 0.01
    },
});

const Token = new Collection("tokens");
Token.attachSchema(TokenSchema);

const TokenChangeType = new Enum({
    Deposit: 0, //充值
    Withdraw: 1, //提现
    WithdrawFee: 2, //提现手续费
    Exchange: 3,//兑换
    Redeem: 4, //贖回
    Bonus: 5, //質押分紅
    WithdrawCancel: 6, //提款失敗返還
    WithdrawCancelFee: 7, //提款失敗返還手續費
    Airdrop: 8, //空投,
    OpenBlindBox: 9, // blindBox,
    ReferralReward: 10, //邀請獎勵
    LeadboardBuyback: 11, // 排行榜回購
    SystemChange: 12, //系統,
    ProxyReward: 13, //代理返利
    ProxyBuyBack: 14,//系统回购
    Cultivate: 15, //耕种,
    Payout: 16, //收获,
    Mining: 17, //挖矿
    ReferralMining: 18, //挖矿
    Stake: 19, //质押
    NftWithdrawFee: 20, //nft提现手续费
    TaskBonus: 21, // 任務獎勵
    BountyTaskBonus: 22, //租赁任务奖励(悬赏)
    BountyTaskBonusFreeze: 23,   //租赁任务奖励发布冻结
    BountyTaskBonusReturn: 24,   //租赁任务奖励取消退还
    BountyTaskFreeze: 25,   //租赁任务冻结
    BountyTaskReturn: 26,   //租赁任务退还
    BountyTaskPayout: 27,   //打工任务收获
    ProfitWithdrawal: 28,   //利润支取
    ProxyBuyBackReturn: 29, //代理回购退回
});

const TokenChangeSchema = new SimpleSchema({
    _id: String,
    user: String,
    type: {
        type: SimpleSchema.Integer,
        allowedValues: Object.values(TokenChangeType)
    },
    changed: {
        type: Object,
        blackbox: true,
    },
    current: {
        type: Object,
        blackbox: true,
    },
    token: String,
    userData: {
        type: Object,
        blackbox: true,
        optional: true
    },

});
TokenChangeSchema.extend(BaseSchema);

const TokenChange = new Collection("tokenChanges");
TokenChange.attachSchema(TokenChangeSchema);

export const WelfarePoolType = new Enum({
    TotalNum: 0//總共發放數量
})
const WelfarePoolSchema = new SimpleSchema({
    type: {
        type: SimpleSchema.Integer,
        allowedValues: Object.values(WelfarePoolType)
    },
    token: String,
    amount: Decimal
});
WelfarePoolSchema.extend(BaseSchema);

const WelfarePool = new Collection("welfarePool");
WelfarePool.attachSchema(WelfarePoolSchema);

const StatisticsType = new Enum({
    Daily: 'daily',
})

/**账变统计数据**/
const TokenChangeStatisticsSchema = new SimpleSchema({
    _id: String,
    user: String,
    referral: String,
    parents: {
        type: Array,
        defaultValue: []
    },
    "parents.$": {
        type: String
    },
    token: String,
    statistics: {   //统计
        type: Object,
        optional: true,
        blackbox: true
    },
    type: StatisticsType,
    createdAt: Date,
    time: Date,
})
const TokenChangeStatistics = new Collection("tokenChangeStatistics")
TokenChangeStatistics.attachSchema(TokenChangeStatisticsSchema)

/**当前统计账变记录id**/
const StatisticsTokenChangeIdSchema = new SimpleSchema({
    _id: String,
    type: StatisticsType,
    changeId: String,
    changeTime: Date,
    createdAt: Date
})
const StatisticsTokenChangeId = new Collection("statisticsTokenChangeId")
StatisticsTokenChangeId.attachSchema(StatisticsTokenChangeIdSchema)

/**周报统计数据**/
const ProxyChildrenWeeklyStatisticsSchema = new SimpleSchema({
    user: String,
    parents: {
        type: Array,
        defaultValue: []
    },
    "parents.$": {
        type: String
    },
    type: StatisticsType,
    createdAt: Date,
    time: Date,
})
const ProxyChildrenWeeklyStatistics = new Collection("proxyChildrenWeeklyStatistics")
ProxyChildrenWeeklyStatistics.attachSchema(ProxyChildrenWeeklyStatisticsSchema)

export {
    Token,
    TokenSchema,
    TokenChange,
    TokenChangeType,
    TokenChangeSchema,
    WelfarePool,
    WelfarePoolSchema,
    TokenChangeStatistics,
    StatisticsTokenChangeId,
    StatisticsType,
    ProxyChildrenWeeklyStatistics
};
