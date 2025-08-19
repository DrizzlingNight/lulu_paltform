import SimpleSchema from 'simpl-schema';
import {Collection} from "../../core/database";
import {Enum} from "../../../utils/enum";

const InkpayLogSchema = new SimpleSchema({
    info: {
        type: Object,
        blackbox: true
    },
    method:String,
    path:String,
    params: {
        type: Object,
        blackbox: true
    }
});
export const InkpayLog =  new Collection("inkpayLog");

InkpayLog.attachSchema(InkpayLogSchema);

export const InkpayWorkStatus = new Enum({
    Initial: 0,         // 新建
    Starting: 1,        // 开始执行(不应该出现的状态)
    Finished: 2,
    Failed: 3
})
/* 网络任务 */
const InkpayWorkSchema = new SimpleSchema({
    method: String,
    path: String,
    params: Object,
    key: String,
    secret: String,
    timeout: Number,
    status: InkpayWorkStatus,
    response: Object,
    error: String
});

export const InkpayWork =  new Collection("inkpayWorks");
InkpayWork.attachSchema(InkpayWorkSchema);
