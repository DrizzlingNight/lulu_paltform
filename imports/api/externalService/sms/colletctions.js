import SimpleSchema from "simpl-schema";
import {Collection} from "../../core/database";
import {Enum} from "../../../utils/enum";

export const SmsTemplateType = new Enum({
    Reg: 1,     //注冊
    Reset: 2,   //忘記密碼
    Login: 3,   //驗證碼登錄
    Bind: 4,    //綁定
    SetTradePassword: 5 //設置安全密碼
});

export const SmsTemplateWay = new Enum({
    TXT: 1,     //文本短信
    VOICE: 2,   //语音短信
});

export const SmsSendStatus = new Enum({
    Init: 0,
    Success: 1,
    Failed: 2
});

const SmsTemplateSchema = new SimpleSchema({
    type: {
        type: SimpleSchema.Integer,
        allowedValues: Object.values(SmsTemplateType)
    },
    content: String,
    way: {
        type: SimpleSchema.Integer,
        allowedValues: Object.values(SmsTemplateWay)
    },
    lang: String
});

export const SmsTemplate = new Collection("smsTemplate");
SmsTemplate.attachSchema(SmsTemplateSchema);


const SmsRecordSchema = new SimpleSchema({
    username: String,
    message: String,
    code: String,
    codeType: {
        type: SimpleSchema.Integer,
        allowedValues: Object.values(SmsTemplateType)
    },
    errorMessage: String,
    status: {
        type: SimpleSchema.Integer,
        allowedValues: Object.values(SmsSendStatus)
    },
    createdAt: Date
});

export const SmsRecord = new Collection("smsRecord");
SmsRecord.attachSchema(SmsRecordSchema);