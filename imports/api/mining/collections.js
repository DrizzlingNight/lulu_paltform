import SimpleSchema from "simpl-schema";
import {Decimal} from "meteor/mongo-decimal";
import {Collection} from "../core/database";
import {Enum} from "../../utils/enum";

const LandMiningRecordSchema = new SimpleSchema({
    token: String,
    landId: String,
    amount: Decimal,
    userData: Object,
    dayNote: Number,
});

const LandMiningRecord = new Collection("landMiningRecord");
LandMiningRecord.attachSchema(LandMiningRecordSchema);

const MiningPoolType = new Enum({
    Mine: "mine",
    Referral: "referral"
});

const MiningPoolSchema = new SimpleSchema({
    _id: String,
    token: String,
    total: Decimal,
    type: MiningPoolType,
});

const MiningPool = new Collection("miningPool");
MiningPool.attachSchema(MiningPoolSchema);

const MiningPoolRecordsSchema = new SimpleSchema({
    user: String,
    token: String,
    amount: Decimal,
    current: Decimal,
    type: MiningPoolType,
    createdAt: Date
})

const MiningPoolRecords = new Collection("miningPoolRecords");
MiningPoolRecords.attachSchema(MiningPoolRecordsSchema);

const MiningThresholdSchema = new SimpleSchema({
    token: String,
    total: Decimal,
    rate: Number,
});

const MiningThreshold = new Collection("miningThreshold");
MiningThreshold.attachSchema(MiningThresholdSchema);

const CacheMiningRecordSchema = new SimpleSchema({
    token: Object, // 挖矿币种
    amount: Decimal,
    user: String,
    done: Boolean,
    type: MiningPoolType,
    createdAt: Date,
    updatedAt: Date
})
const CacheMiningRecord = new Collection("cacheMiningRecord");
CacheMiningRecord.attachSchema(CacheMiningRecordSchema);

export { MiningThreshold, MiningPool, MiningPoolType, LandMiningRecord, MiningPoolRecords, CacheMiningRecord }
