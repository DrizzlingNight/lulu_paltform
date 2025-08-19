import {marbleMethods} from "../../../utils/methods";
import {errorCodes} from "../../../settings/errorCodes";
import {BountyTask, BountyTaskRule, BountyTaskType} from "../collections";
import {
    buildBountyTaskSelector,
    cancelTask,
    delTask,
    publishTask,
    receiveBountyTaskRewards,
    receiveFakeBountyTask,
    receiveTask
} from "./service";
import {check} from "meteor/check";

marbleMethods({
    /**
     * @api {call}  Meteor.call('bountyTaskRule',type,callback}) 悬赏任务规则
     * @apiVersion  0.1.0
     * @apiGroup    BountyTask
     * @apiName     悬赏任务规则
     *
     * @apiParam    {Number}    type     类型(不传默认返回土地租赁任务)
     *
     * @apiSuccess  {Object}    rule     规则详情
     * @apiSuccessExample {json} Success-Response:
     {
        "_id": "leaseLand",
        "type": 0,
        "rules": {
            "timeLimit": [12,24,48,72],
            "mode": [
                {
                    "type": "lease",
                    "level": [
                        {
                            "seedsCount": 100,
                            "rewards": [
                                {
                                    "type": "token",
                                    "token": "LUSD",
                                    "amount": 10
                                }
                            ]
                        },
                        {
                            "seedsCount": 200,
                            "rewards": [
                                {
                                    "type": "token",
                                    "token": "LUSD",
                                    "amount": 20
                                }
                            ]
                        }
                    ]
                },
                {
                    "type": "work",
                    "level": [
                        {
                            "seedsCount": 100,
                            "rewards": [
                                {
                                    "type": "token",
                                    "token": "LUCK",
                                    "amount": 10
                                }
                            ]
                        },
                        {
                            "seedsCount": 200,
                            "rewards": [
                                {
                                    "type": "token",
                                    "token": "LUCK",
                                    "amount": 20
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        "active": true,
        "createdAt": "2022-04-14T10:42:35.292Z"
    }
     */
    bountyTaskRule: async function (type) {
        const rule = BountyTaskRule.findOne({
            type: type ? type : BountyTaskType.LeaseLand,
            active: true
        })
        return {rule: rule}
    },

    /**
     * @api {call}  Meteor.call("getBountyTask",taskId,callback) 任务详情
     * @apiVersion  0.1.0
     * @apiGroup    BountyTask
     * @apiName     任务详情
     *
     * @apiParam    {String}    taskId          任务id
     *
     * @apiSuccess  {String}     _id               任务id
     * @apiSuccess  {Number}     type              任务类型
     * @apiSuccess  {String}     publisher         任务发布人
     * @apiSuccess  {String}     receiver          任务接取人
     * @apiSuccess  {Object}     requirements      任务要求
     * @apiSuccess  {Object}     progress          任务进度
     * @apiSuccess  {Object}     rewards           任务奖励
     * @apiSuccess  {Object}     extraData         任务额外信息(如数据统计)
     * @apiSuccess  {Number}     status            任务状态
     * @apiSuccess  {Number}     isDeleted         任务删除状态
     * @apiSuccess  {Number}     isReceivedRewards 任务奖励领取状态
     * @apiSuccess  {Date}       createdAt         任务发布时间
     * @apiSuccess  {Date}       startTime         任务开始时间
     * @apiSuccess  {Date}       deadLine          任务截止时间
     * @apiSuccess  {Date}       finishedAt        任务完成时间
     * @apiSuccessExample {json} Success-Response:
     {
        "_id": "yXTHjxBQxGLinGAoJ",
        "type": 0,
        "requirements": {
            "land": {},
            "seed": "primary_grape",
            "mode": 1,
            "timeLimit": 24
        },
        "progress": {
            "seedsCount": 200,
            "cultivatedCount": 0
        },
        "rewards": [
            {
                "type": "token",
                "token": "LUSD",
                "amount": 100
            },
            {
                "type": "token",
                "token": "LUCK",
                "amount": 200
            }
        ],
        "publisher": "FFzWRJBkmEfXBuamu",
        "status": 4,
        "isDeleted": false,
        "isReceivedRewards": false,
        "createdAt": "2022-04-15T08:39:55.701Z"
    }
     */
    getBountyTask: async function (taskId) {
        if (!Meteor.userId()) {
            throw new Meteor.Error(401, errorCodes.LoginRequired);
        }

        return BountyTask.findOne({
            "$and":
                [
                    {"$or": [{publisher: Meteor.userId()}, {receiver: Meteor.userId()}]},
                    {_id: taskId}
                ]
        })
    },


    /**
     * @api {call}  Meteor.call("bountyTaskList",where,callback) 悬赏任务列表
     * @apiVersion  0.1.0
     * @apiGroup    BountyTask
     * @apiName     悬赏任务列表
     *
     * @apiParam    {Object}    where={}        请求参数
     * @apiParam    {Number}    where.type      任务类型(不传默认为0,返回租赁任务)
     * @apiParam    {Array}    where.mode      租赁任务模式(不传-全部 0-借地 1-打工)
     * @apiParam    {Array}    where.timeLimit 租赁任务时长(可选)
     * @apiParam    {String}    where.publisher 发布人(可选)
     * @apiParam    {Boolean}   where.receiver  是否已接受(可选)
     * @apiParam    {Boolean}   where.isDeleted 是否已删除(可选)
     * @apiParam    {Array}   where.status      任务状态(可选,默认返回待领取)
     * @apiParam    {Number}    where.offset    偏移
     * @apiParam    {Number}    where.limit     每页数量
     *
     * @apiSuccess  {Number}     count                  任务数
     * @apiSuccess  {Array}      List                   任务列表
     * @apiSuccess  {String}     List._id               任务id
     * @apiSuccess  {Number}     List.type              任务类型
     * @apiSuccess  {String}     List.publisher         任务发布人
     * @apiSuccess  {String}     List.receiver          任务接取人
     * @apiSuccess  {Object}    List.requirements       任务要求
     * @apiSuccess  {Object}     List.progress          任务进度
     * @apiSuccess  {Object}     List.rewards           任务奖励
     * @apiSuccess  {Object}     List.extraData         任务额外信息(如数据统计)
     * @apiSuccess  {Number}     List.status            任务状态
     * @apiSuccess  {Number}     List.isDeleted         任务删除状态
     * @apiSuccess  {Number}     List.isReceivedRewards 任务奖励领取状态
     * @apiSuccess  {Date}     List.createdAt           任务发布时间
     * @apiSuccess  {Date}     List.startTime           任务开始时间
     * @apiSuccess  {Date}     List.deadLine            任务截止时间
     * @apiSuccess  {Date}     List.finishedAt          任务完成时间
     * @apiSuccessExample {json} Success-Response:
     {
            "list": [
                {
                    "_id": "yXTHjxBQxGLinGAoJ",
                    "type": 0,
                    "requirements": {
                        "land": {},
                        "seed": "primary_grape",
                        "mode": 1,
                        "timeLimit": 24
                    },
                    "progress": {
                        "seedsCount": 200,
                        "cultivatedCount": 0
                    },
                    "rewards": [
                        {
                            "type": "token",
                            "token": "LUSD",
                            "amount": 100
                        },
                        {
                            "type": "token",
                            "token": "LUCK",
                            "amount": 200
                        }
                    ],
                    "publisher": "FFzWRJBkmEfXBuamu",
                    "status": 4,
                    "isDeleted": false,
                    "isReceivedRewards": false,
                    "createdAt": "2022-04-15T08:39:55.701Z"
                }
            ],
            "count": 1
         }
     */
    bountyTaskList: async function (where) {
        if (!Meteor.userId()) {
            throw new Meteor.Error(401, errorCodes.LoginRequired);
        }
        let sort = where.sort ? where.sort : {'createdAt': -1}
        let selector = await buildBountyTaskSelector(where)
        const list = BountyTask.find(selector, {
            sort: sort,
            skip: where.offset,
            limit: where.limit
        }).fetch()
        const count = BountyTask.find(selector).count()
        return {list: list, count: count}
    },

    /**
     * @api {call}  Meteor.call("publishTask",taskRuleId,rules) 发布任务
     * @apiVersion  0.1.0
     * @apiGroup    BountyTask
     * @apiName     发布任务
     *
     * @apiParam    {String}     taskRuleId         任务规则id
     * @apiParam    {Object}     rules              任务规则(以下为土地租赁任务)
     * @apiParam    {Number}     rules.timeLimit    任务时限
     * @apiParam    {Number}     rules.mode         租赁任务模式(0-借地,1-打工)
     * @apiParam    {String}     rules.landId       借出的土地id
     * @apiParam    {Number}     rules.level        任务的等级(种植数/奖励)
     * @apiParam    {String}     rules.seed         任务的种子
     *
     * @apiError    401-10102        需要登录
     * @apiError    500-40002        土地不可用
     * @apiError    500-40003        种子不可用
     */
    publishTask: async function (taskRuleId, rules) {
        check(taskRuleId, String)
        if (!Meteor.userId()) {
            throw new Meteor.Error(401, errorCodes.LoginRequired);
        }
        return await publishTask(taskRuleId, rules, Meteor.user())
    },

    /**
     * @api {call}  Meteor.call("receiveTask",taskId) 接取任务
     * @apiVersion  0.1.0
     * @apiGroup    BountyTask
     * @apiName     接取任务
     *
     * @apiParam    {String}     taskId     任务id
     *
     * @apiError    401-10102        需要登录
     * @apiError    500-31001        任务无效
     * @apiError    500-31003        领取失败
     */
    receiveTask: async function (taskId) {
        check(taskId, String)
        if (!Meteor.userId()) {
            throw new Meteor.Error(401, errorCodes.LoginRequired);
        }
        return await receiveTask(taskId, Meteor.user())
    },

    /**
     * @api {call}  Meteor.call("cancelTask",taskId) 取消任务
     * @apiVersion  0.1.0
     * @apiGroup    BountyTask
     * @apiName     取消任务
     *
     * @apiParam    {String}     taskId     任务id
     *
     * @apiError    401-10102        需要登录
     * @apiError    500-40002        土地不可用
     * @apiError    500-31001        任务无效
     * @apiError    500-31004        取消失败
     */
    cancelTask: async function (taskId) {
        check(taskId, String)
        if (!Meteor.userId()) {
            throw new Meteor.Error(401, errorCodes.LoginRequired);
        }
        return await cancelTask(taskId, Meteor.user())
    },

    /**
     * @api {call}  Meteor.call("delTask",taskId) 删除任务
     * @apiVersion  0.1.0
     * @apiGroup    BountyTask
     * @apiName     删除任务
     *
     * @apiParam    {String}     taskId     任务id
     *
     * @apiError    401-10102        需要登录
     * @apiError    500-31001        任务无效
     * @apiError    500-31005        删除失败
     */
    delTask: async function (taskId) {
        check(taskId, String)
        if (!Meteor.userId()) {
            throw new Meteor.Error(401, errorCodes.LoginRequired);
        }
        return await delTask(taskId, Meteor.user())
    },

    /**
     * @api {call}  Meteor.call("receiveBountyTaskRewards",taskId) 领取任务奖励
     * @apiVersion  0.1.0
     * @apiGroup    BountyTask
     * @apiName     领取任务奖励
     *
     * @apiParam    {String}     taskId     任务id
     *
     * @apiError    401-10102        需要登录
     * @apiError    500-31001        任务无效
     * @apiError    500-31006        奖励领取失败
     */
    receiveBountyTaskRewards: async function (taskId) {
        check(taskId, String)
        if (!Meteor.userId()) {
            throw new Meteor.Error(401, errorCodes.LoginRequired);
        }
        return await receiveBountyTaskRewards(taskId, Meteor.user())
    },

    /**
     * @api {call}  Meteor.call("receiveGuideTask") 接取引导委托
     * @apiVersion  0.1.0
     * @apiGroup    BountyTask
     * @apiName     接取引导委托
     *
     * @apiError    401-10102        需要登录
     * @apiError    500-32001        引导无效(重复领取)
     * @apiError    500-40002        无可用土地
     */
    receiveGuideTask: async function () {
        if (!Meteor.userId()) {
            throw new Meteor.Error(401, errorCodes.LoginRequired);
        }
        return await receiveFakeBountyTask(Meteor.user())
    },
});