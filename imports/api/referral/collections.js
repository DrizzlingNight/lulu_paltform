import SimpleSchema from "simpl-schema";
import {Decimal} from "meteor/mongo-decimal";
import {Collection} from "../core/database";
import {BaseSchema} from "../core/schema";
import {Enum} from "../../utils/enum";

const ReferralSchema = new SimpleSchema({
    user: String,
    token: String,
    amount: Decimal,
    fromUser: String,
    fromToken: String,
    referralAmount: Decimal,
    rate: Decimal,
});
ReferralSchema.extend(BaseSchema);

const Referral = new Collection("referrals");
Referral.attachSchema(ReferralSchema);

const ReferralThresholdSchema = new SimpleSchema({
    token: String,
    total: Decimal,
    rate: Number,
});

const ReferralThreshold = new Collection("referralThresholds");
ReferralThreshold.attachSchema(ReferralThresholdSchema);

const ReferralPoolSchema = new SimpleSchema({
    token: String,
    amount: Decimal
});

const ReferralPool = new Collection("referralPools");
ReferralPool.attachSchema(ReferralPoolSchema);

const ProxyBuybackOrderStatus = new Enum({
    Init: 0,        //待审核
    Done: 1,        //通过
    Failed: 2,      //审核失败
});
/**代理回购申请**/
const ProxyBuybackOrderSchema = new SimpleSchema({
    _id: String,
    user: String,
    token: String,          //回购币种
    swapToken: String,      //兑换币种
    amount: Decimal,        //申请额度
    swapAmount: Decimal,   //兑换额度
    mineAmount: Decimal,    //挖矿数
    buybackPrice: Decimal,  //回购价格
    buybackRate: Decimal,   //回购比例
    total: Decimal,         //总回购额度
    reason: String,
    time: Date,             //回购周期-开始时间
    status: {
        type: SimpleSchema.Integer,
        allowedValues: Object.values(ProxyBuybackOrderStatus)
    },
    checkUser: String,      //审核人
    createdAt: Date,        //提交时间
    updatedAt: Date         //审核时间
})
const ProxyBuybackOrder = new Collection('proxyBuybackOrder')
ProxyBuybackOrder.attachSchema(ProxyBuybackOrderSchema)

export {Referral, ReferralThreshold, ReferralPool, ProxyBuybackOrder, ProxyBuybackOrderStatus}