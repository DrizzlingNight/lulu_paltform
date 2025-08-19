import {marbleMethods} from "../../../utils/methods";
import {getTaskList, getUserTasks, receiveTaskReward, receiveUserTaskRewards} from "./services";
import {errorCodes} from "../../../settings/errorCodes";
import {TaskRewards, TaskRules, TasksAwardRecord} from "../collections";

marbleMethods({
    /** @desc任務列表 **/
    taskList: async function () {
        return await getTaskList()
    },

    /** @desc领奖记录 **/
    taskAwardRecord: async function (taskId) {
        if (!Meteor.userId()) {
            throw new Meteor.Error(401, errorCodes.LoginRequired);
        }
        return TasksAwardRecord.find({user: Meteor.userId(), task: taskId.toString()}).fetch()
    },

    /** @desc领取奖励 **/
    receiveTaskReward: async function (taskId, rewardId) {
        if (!Meteor.userId()) {
            throw new Meteor.Error(401, errorCodes.LoginRequired);
        }
        return receiveTaskReward(Meteor.user(), taskId, rewardId)
    },

    /**
     * @api {call}  Meteor.call("taskRules",where,callback) 任务规则
     * @apiVersion  0.1.0
     * @apiGroup    Task
     * @apiName     任务规则列表
     *
     * @apiSuccess  {Array}             List                            任务规则列表
     * @apiSuccess  {String}            List._id                        任务规则id
     * @apiSuccess  {Number}            List.sort                       排序
     * @apiSuccess  {Boolean}           List.active                     启用状态
     * @apiSuccess  {Boolean}           List.show                       是否展示
     * @apiSuccess  {String}            List.class                      任务分类
     * @apiSuccess  {String}            List.task_name_langCode         名称-多语言
     * @apiSuccess  {String}            List.task_discription_langCode  描述-多语言
     * @apiSuccess  {String}            List.pre_task_id                前置任务id
     * @apiSuccess  {String}            List.finish_rules               完成条件
     * @apiSuccess  {String}            List.rewards                    任务奖励
     * @apiSuccessExample {json} Success-Response:
     [
        {
            "_id": "1001",
            "sort": 1,
            "active": true,
            "show": true,
            "class": "daily_task",
            "task_name_cn": "日常哈希",
            "task_discription_cn": "每天在哈希模式下，种植超过50个葡萄种子",
            "pre_task_id": "0",
            "finish_rules": "1001&1002",
            "rewards": "1001&1002"
        }
     ]
     */
    taskRules: async function(taskClass){
        let selector = {
            active: true,
            show: true
        }
        if (taskClass) {
            selector.class = taskClass
        }
        return TaskRules.find(selector, {sort: {sort: 1}}).fetch()
    },

    /**
     * @api {call}  Meteor.call("taskRewards",callback) 任务奖励规则
     * @apiVersion  0.1.0
     * @apiGroup    Task
     * @apiName     任务奖励列表
     *
     * @apiSuccess  {Array}             List                        任务奖励列表
     * @apiSuccess  {String}            List._id                    奖励规则id
     * @apiSuccess  {String}            List.type                   奖励类型
     * @apiSuccess  {String}            List.content_type           奖励内容
     * @apiSuccess  {String}            List.amount                 奖励内容
     * @apiSuccess  {Boolean}           List.show                   是否展示
     * @apiSuccessExample {json} Success-Response:
     [
         {
            "_id": "1001",
            "type": "token",
            "content_type": "LUCK",
            "amount": "10",
            "show": true
        }
     ]
     */
    taskRewards: async function() {
        return TaskRewards.find({show: true}).fetch()
    },

    /**
     * @api {call}  Meteor.call("getUserTasks",where,callback) 用户已领取任务
     * @apiVersion  0.1.0
     * @apiGroup    Task
     * @apiName     用户任务列表
     *
     * @apiParam    {String}    taskClass       任务类型(不传默认为daily_task,可选daily_task|weekly_task|rookie_task)
     *
     * @apiSuccess  {Array}             List                        用户任务列表
     * @apiSuccess  {String}            List._id                    任务id
     * @apiSuccess  {String}            List.user                   用户id
     * @apiSuccess  {String}            List.taskRuleId             任务规则id
     * @apiSuccess  {String}            List.taskClass              任务类型
     * @apiSuccess  {Number}            List.status                 任务状态()
     * @apiSuccess  {Boolean}           List.isReceivedRewards      是否已领取奖励(字段可能不存在)
     * @apiSuccess  {Object}            List.Progress               任务进度(字段可能不存在)
     * @apiSuccess  {Date}              List.startTime              开始时间
     * @apiSuccess  {Date}              List.endTime                截止时间
     * @apiSuccessExample {json} Success-Response:
     [
         {
            "_id": "S6zyBvASBnJdNDptn",
            "user": "N8tLighGGRWGfoJWC",
            "taskRuleId": "1101",
            "taskClass": "rookie_task",
            "status": 1,
            "startTime": "2022-05-23T05:42:07.330Z",
            "endTime": null
        }
     ]
     */
    getUserTasks: async function (taskClass='daily_task') {
        if (!Meteor.userId()) {
            throw new Meteor.Error(401, errorCodes.LoginRequired);
        }
        return await getUserTasks(Meteor.user(), taskClass)
    },

    /**
     * @api {call}  Meteor.call("receiveUserTaskRewards",taskId) 领取任务奖励
     * @apiVersion  0.1.0
     * @apiGroup    Task
     * @apiName     领取任务奖励
     *
     * @apiParam    {String}     taskId     任务id
     *
     * @apiError    401-10102        需要登录
     * @apiError    500-30001        獎勵已領取過
     * @apiError    500-30010        任务无效
     * @apiError    500-31006        奖励领取失败
     */
    receiveUserTaskRewards: async function(taskRuleId) {
        if (!Meteor.userId()) {
            throw new Meteor.Error(401, errorCodes.LoginRequired);
        }
        return await receiveUserTaskRewards(Meteor.user(), taskRuleId)
    },

    /** 测试 **/
    testTask: async function () {

    }
})