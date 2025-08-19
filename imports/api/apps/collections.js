import SimpleSchema from 'simpl-schema';
import {Enum} from "../../utils/enum";
import {Collection} from "../core/database";

const AppsSchema = new SimpleSchema({
    _id: String,
    name: String,
    apis: {
        type: Object,
        optional: true,
        blackbox: true
    },
    callBack: Boolean,
    signVerify: Boolean,
    active: Boolean,
});
const Apps = new Mongo.Collection("apps");
Apps.attachSchema(AppsSchema);

const AppSecretType = new Enum({
    MD5: 'MD5',
    ECC: 'ECC',
    HMC: 'HMC',
})

const AppSecretSchema = new SimpleSchema({
    _id: String,
    app: String,
    type: AppSecretType,
    pubKey: String,
    secret: String,
    active: Boolean,
    createdAt: Date,
});
const AppSecret = new Collection("appSecret");
AppSecret.attachSchema(AppSecretSchema);

const AppTaskRecordSchema = new SimpleSchema({
    _id: String,
    app: String,
    clickId: String,
    identifier: String,
    recordId: Number,
    finishedTime: Date,
});
const AppTaskRecord = new Collection("appTaskRecord");
AppTaskRecord.attachSchema(AppTaskRecordSchema);

export {Apps, AppSecret, AppTaskRecord}
