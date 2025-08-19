import SimpleSchema from 'simpl-schema';
import {Enum} from "../../utils/enum";
import {Collection} from "../core/database";


const BountyTaskType = new Enum({
    LeaseLand: 0,    //土地租赁
});

const BountyTaskRuleSchema = new SimpleSchema({
    _id: String,
    type: {
        type: SimpleSchema.Integer,
        allowedValues: Object.values(BountyTaskType)
    },
    rules: {
        type: Object,
        blackbox: true,
        optional: true
    },
    active: {
        type: Boolean,
        defaultValue: true
    },
    createdAt: Date
})
const BountyTaskRule = new Collection("bountyTaskRule");
BountyTaskRule.attachSchema(BountyTaskRuleSchema);


const BountyTaskStatus = new Enum({
    Init: 0,        //待领取
    InProgress: 1,  //进行中
    Done: 2,        //完成
    Failed: 3,      //失败
    Canceled: 4,    //取消
});

const BountyTaskSchema = new SimpleSchema({
    _id: String,
    publisher: String,  //发布人
    receiver: String,   //领取人
    type: {    //任务类型
        type: SimpleSchema.Integer,
        allowedValues: Object.values(BountyTaskType)
    },
    rewards: {  //奖励
        type: Array,
        optional: true
    },
    'rewards.$': {
        type: Object
    },
    params: {     //任务创建参数
        type: Object,
        blackbox: true,
        optional: true
    },
    requirements: {     //任务要求
        type: Object,
        blackbox: true,
        optional: true
    },
    progress: {     //任务进度
        type: Object,
        blackbox: true,
        optional: true
    },
    extraData: {
        type: Object,
        blackbox: true,
        optional: true
    },
    description: String,
    status: {
        type: SimpleSchema.Integer,
        allowedValues: Object.values(BountyTaskStatus)
    },
    isDeleted: {    //是否删除
        type: Boolean,
        defaultValue: false
    },
    isReceivedRewards: {    //是否领奖
        type: Boolean,
        defaultValue: false
    },
    createdAt: Date,    //创建时间
    startTime: Date,    //任务开始时间
    deadLine: Date,     //任务截止时间
    finishedAt: Date,   //完成时间
    fake: {             //是否虚拟任务
        type: Boolean,
        defaultValue: false
    }
});
const BountyTask = new Collection("bountyTask");
BountyTask.attachSchema(BountyTaskSchema);


const BountyTaskOptType = new Enum({
    Publish: 0,         //发布任务
    Receive: 1,         //接受任务
    Cancel: 2,          //取消任务
    Finish: 3,          //完成任务
    Close: 4,           //失败关闭任务
    Delete: 5,          //删除任务
    ReceiveRewards: 6,  //领取任务奖励
    ReceiveGuideTask: 7 //领取引导委托
});

const BountyTaskOptHistorySchema = new SimpleSchema({
    task: String,
    user: String,
    type: {
        type: SimpleSchema.Integer,
        allowedValues: Object.values(BountyTaskOptType)
    },
    extraData: {
        type: Object,
        blackbox: true,
        optional: true
    },
    createdAt: Date
})
const BountyTaskOptHistory = new Collection("bountyTaskOptHistory");
BountyTaskOptHistory.attachSchema(BountyTaskOptHistorySchema);

export {
    BountyTaskRule,
    BountyTask,
    BountyTaskType,
    BountyTaskStatus,
    BountyTaskOptType,
    BountyTaskOptHistory
}
