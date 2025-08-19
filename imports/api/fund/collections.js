import SimpleSchema from "simpl-schema";
import { Decimal } from "meteor/mongo-decimal";
import { Collection } from "../core/database";
import { BaseSchema } from "../core/schema";
import {Enum} from "../../utils/enum";
import {CacheMiningRecord} from "../mining/collections";

const FundPoolSchema = new SimpleSchema({
    _id: String,
    token: String,
    total: Decimal,
    shareBonusTime: Date, // 下次分红的时间
});
FundPoolSchema.extend(BaseSchema);

const FundPool = new Collection("fundPool");
FundPool.attachSchema(FundPoolSchema);

const FundPoolChangeType = new Enum({
    Cultivate: "cultivate",
    ShareBonus: "shareBonus", // 发放分红
});

const FundPoolRecordSchema = new SimpleSchema({
    token: String,
    changed: Decimal,
    current: Decimal,
    type: FundPoolChangeType,
    userData: Object,
    createdAt: Date
});

const FundPoolRecord = new Collection("fundPoolRecord");
FundPoolRecord.attachSchema(FundPoolRecordSchema);


const FundPoolAddCache = new Collection("fundPoolAddCache");

export { FundPool, FundPoolRecord, FundPoolChangeType, FundPoolAddCache }
