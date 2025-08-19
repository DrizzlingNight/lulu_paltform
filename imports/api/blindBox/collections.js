import SimpleSchema from 'simpl-schema';
import { Decimal } from 'meteor/mongo-decimal';
import { BaseSchema } from "../core/schema";
import { Collection } from "../core/database";

const BlindBoxSchema = new SimpleSchema({
    // 基本信息
    id: String,
    name: String,
    nft: String,
    active: {
        type: Boolean,
        defaultValue: true
    },
    token: String, // 盲盒的消费币种
    order: Number,  // 排序
    startTime: Date, // 开始时间
    endTime: Date, // 结束时间
    openFee: { // 开盲盒的费用
        type: Decimal,
        blackbox: true
    },
    rules: {
        type: Object,
        optional: true
    }
});
const BlindBox = new Collection("blindBox");
BlindBox.attachSchema(BlindBoxSchema);

const BlindBoxRecordSchema = new SimpleSchema({
    user: String,
    BlindBox: String,
    userData: { // 本次盲盒开启记录的具体信息
        type: Object,
        blackbox: true,
        optional: true
    },
    createdAt: Date
});
BlindBoxRecordSchema.extend(BaseSchema);
const BlindBoxRecord = new Collection("blindBoxRecord");
BlindBoxRecord.attachSchema(BlindBoxRecordSchema);

const BlindBoxTokenPoolSchema = new SimpleSchema({
    // 基本信息
    bboxId: String,
    active: Boolean,
    nftPoolId: String,
    info: {
        type: Object,
        blackbox: true,
        optional: true
    },
    total: Number,
    nDefined: Number
});
const BlindBoxTokenPool = new Collection("blindBoxTokenPool");
BlindBoxTokenPool.attachSchema(BlindBoxTokenPoolSchema);

export { BlindBox, BlindBoxRecord, BlindBoxTokenPool};
