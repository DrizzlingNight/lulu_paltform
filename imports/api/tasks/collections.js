import SimpleSchema from "simpl-schema";
import {Enum} from "../../utils/enum";
import {Collection} from "../core/database";

const TasksType = new Enum({
    ReferralMint: 'referralMint', // 邀請鑄造
})

/** @desc任務表 **/
const TasksSchema = new SimpleSchema({
    type: {
        type: TasksType,
        optional: true,
        allowedValues: Object.values(TasksType)
    },
    rewards: {
        type: Array,
        optional: true
    },
    'rewards.$': {
        type: Object
    },
    duration: Number,
    active: {
        type: Boolean,
        defaultValue: true
    },
    createdAt: Date
})
const Tasks = new Collection('tasks')
Tasks.attachSchema(TasksSchema)

/** @desc領獎紀錄 **/
const TasksAwardRecordSchema = new SimpleSchema({
    user: String,
    task: String,
    reward: Object,
    createdAt: Date
})
const TasksAwardRecord = new Collection('tasksAward')
TasksAwardRecord.attachSchema(TasksAwardRecordSchema)

/**任务规则**/
const TaskRulesSchema = new SimpleSchema({
    _id: String,
    class: String,      //分类
    pre_task: String,   //前置任务
    finish_rule: String,//完成条件
    rewards: String,    //奖励内容
    active: {           //开启
        type: Boolean,
        defaultValue: true
    },
    show: {             //展示
        type: Boolean,
        defaultValue: true
    },
})
const TaskRules = new Collection('taskRules')
TaskRules.attachSchema(TaskRulesSchema)

/**任务奖励**/
const TaskRewardsSchema = new SimpleSchema({
    _id: String,
    type: String,           //类型
    content_type: String,   //内容
    amount: String,         //数量
    show: {
        type: Boolean,
        defaultValue: true
    }
})
const TaskRewards = new Collection('taskRewards')
TaskRewards.attachSchema(TaskRewardsSchema)

/**任务领取条件**/
const TaskFinishRulesSchema = new SimpleSchema({
    _id: String,
    type: String,           //类型
    content_type: String,   //内容
    amount: String,         //数量
    show: {
        type: Boolean,
        defaultValue: true
    }
})
const TaskFinishRules = new Collection('taskFinishRules')
TaskFinishRules.attachSchema(TaskFinishRulesSchema)

const TaskStatus = new Enum({
    Init: 0,        //待领取
    InProgress: 1,  //进行中
    Done: 2,        //完成
});

/**用户任务表**/
const UserTasksSchema = new SimpleSchema({
    _id: String,
    user: String,
    taskRuleId: String,
    taskClass: String,
    progress: {     //任务进度
        type: Object,
        blackbox: true,
        optional: true
    },
    status: {
        type: SimpleSchema.Integer,
        allowedValues: Object.values(TaskStatus)
    },
    isDeleted: Boolean,
    isReceivedRewards: Boolean,
    startTime: Date,
    endTime: Date
})
const UserTasks = new Collection('userTasks')
UserTasks.attachSchema(UserTasksSchema)

/**用户任务进度**/
const TaskProgressSchema = new SimpleSchema({
    _id: String,
    taskClass: String,
    type: String,           //类型
    content_type: String,   //内容
    amount: String,         //数量
    startTime: Date,
    endTime: Date
})
const TaskProgress = new Collection('taskProgress')
TaskProgress.attachSchema(TaskProgressSchema)

export {
    Tasks,
    TasksAwardRecord,
    TasksType,
    TaskRules,
    TaskFinishRules,
    TaskRewards,
    TaskStatus,
    UserTasks,
    TaskProgress
}