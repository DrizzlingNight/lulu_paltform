import {
    TaskFinishRules, TaskProgress,
    TaskRewards,
    TaskRules,
    Tasks,
    TasksAwardRecord,
    TaskStatus,
    TasksType,
    UserTasks
} from "../collections";
import {errorCodes} from "../../../settings/errorCodes";
import {isProxy} from "../../account/services";
import {transaction} from "../../core/database";
import {Decimal} from "meteor/mongo-decimal";
import {addBalance} from "../../account/server/service";
import {Token, TokenChangeType} from "../../tokens/collections";
import moment from "moment";
import {Random} from "meteor/random";
import {appTaskNotify} from "../../apps/server/service";
import {Article, ArticleRecordType} from "../../games/article/collections";
import {addArticle} from "../../games/article/server/services";

/********************邀请铸造start************************/
/** @desc 任務列表 **/
const getTaskList = async function () {
    return Tasks.find().fetch()
}

/** @desc 领取任务奖励 **/
const receiveTaskReward = async function (user, taskId, rewardId) {
    const task = Tasks.findOne({_id: taskId})

    if (!task) {
        throw new Meteor.Error(404, errorCodes.ObjNotFound)
    }

    if (task.type === TasksType.ReferralMint) {
        return await referralTaskReward(user, task, rewardId)
    }
    throw new Meteor.Error(404, errorCodes.ObjNotFound)
}

/** @desc領取邀請mint獎勵 **/
const referralTaskReward = async function (user, task, rewardId) {
    if (isProxy(user._id)) {
        throw new Meteor.Error(500, errorCodes.PermissionError)
    }
    let isReceived = await isReceiveReward(user, task, rewardId)
    if (isReceived) {
        throw new Meteor.Error(500, errorCodes.RewardReceived)
    }

    const reward = task.rewards.find(item => {
        return item.id === rewardId
    })

    if (!reward) {
        throw new Meteor.Error(500, errorCodes.RewardNotFound)
    }

    if (!user.referralStatistical || !user.referralStatistical.mintCount || user.referralStatistical.mintCount < reward.mintCount) {
        throw new Meteor.Error(500, errorCodes.RewardConditionMatchError)
    }

    await transaction.run(async (session) => {
        let amount = Decimal(reward.amount)
        const token = Token.findOne({_id: reward.token})
        await addBalance({
            user,
            amount,
            token,
            type: TokenChangeType.ReferralReward, userData: reward
        }, session);

        await TasksAwardRecord.insertOne(
            {user: user._id, task: task._id.toString(), reward: reward, createdAt: new Date()}, {session})
    });
    return true
}

/** @desc判断奖励是否领取过 **/
const isReceiveReward = async function (user, task, rewardId) {
    return !!TasksAwardRecord.findOne({user: user._id, task: task._id.toString(), 'reward.id': rewardId})
}
/********************邀请铸造end************************/

/**判断是否限时任务**/
const _isTimeLimitTask = function (taskClass) {
    return ['daily_task', 'weekly_task'].includes(taskClass)
}

/**生成任务的起止时间**/
const buildTaskTime = function (taskClass) {
    let timeInfo = {}
    switch (taskClass) {
        case 'daily_task':
            timeInfo.startTime = moment.utc().startOf('day').toDate()
            timeInfo.endTime = moment.utc().endOf('day').toDate()
            break
        case 'weekly_task':
            timeInfo.startTime = moment.utc().startOf('week').toDate()
            timeInfo.endTime = moment.utc().endOf('week').toDate()
            break
        default:
            timeInfo.startTime = null
            timeInfo.endTime = null
            break
    }
    return timeInfo
}

/**获取用户任务**/
const getUserTasks = async function (user, taskClass) {
    let taskTime = buildTaskTime(taskClass)
    let selector = {
        user: user._id,
        taskClass: taskClass
    }
    if (_isTimeLimitTask(taskClass)) {
        selector.startTime = taskTime.startTime
    }
    return UserTasks.find(
        selector,
        {sort: {isReceivedRewards: 1, status: -1, sort: -1}}
    ).fetch()
}

/**初始化任务**/
const initUserTasks = async function (user, taskClass) {
    let taskRules = TaskRules.find({class: taskClass, active: true}).fetch()
    let initTasks = []
    let taskTime = buildTaskTime(taskClass)
    for (let rule of taskRules) {
        let selector = {
            user: user._id,
            taskRuleId: rule._id
        }
        if (_isTimeLimitTask(taskClass)) {
            selector.startTime = taskTime.startTime
        }
        let userTask = UserTasks.findOne(selector)
        if (!userTask) {
            initTasks.push({
                _id: Random.id(),
                user: user._id,
                taskRuleId: rule._id,
                taskClass: rule.class,
                status: TaskStatus.InProgress,
                startTime: taskTime.startTime,
                endTime: taskTime.endTime
            })
        }
    }
    if (initTasks.length > 0) {
        await UserTasks.insertMany(initTasks)
    }
}

/**更新任务进度**/
const updateTaskProgress = async function (user, type, contentType, amount, session) {
    let finishRules = TaskFinishRules.find({type: type, content_type: contentType}, {session}).fetch()
    if (finishRules.length === 0) {
        return true
    }
    for (let taskClass of ['daily_task', 'weekly_task', 'rookie_task']) {
        let taskTime = buildTaskTime(taskClass)
        await TaskProgress.findOneAndUpdate(
            {
                user: user._id,
                taskClass: taskClass,
                type: type,
                content_type: contentType,
                startTime: taskTime.startTime,
                endTime: taskTime.endTime
            },
            {
                $inc: {amount: Decimal(amount)},
            }, {
                session,
                upsert: true,
                returnOriginal: false
            }
        )
    }
}

/**获取任务进度**/
const getTaskProgress = function (user, finishRule, taskClass, session) {
    let taskTime = buildTaskTime(taskClass)
    let selector = {
        user: user._id,
        taskClass: taskClass,
        type: finishRule.type,
        content_type: finishRule.content_type
    }
    if (_isTimeLimitTask(taskClass)) {
        selector.startTime = taskTime.startTime
    }

    return TaskProgress.findOne(selector, {
        fields: {_id: 0}, session
    })
}

/**检查任务进度**/
const _checkTaskProgress = async function (user, taskRule, session) {
    let finishRuleIds = taskRule.finish_rules ? taskRule.finish_rules.split('&') : []
    let finishRules = TaskFinishRules.find({_id: {$in: finishRuleIds}}, {session}).fetch()
    for (let finishRule of finishRules) {
        let progress = getTaskProgress(user, finishRule, taskRule.class, session)
        if (!progress || Decimal(progress.amount).lt(Decimal(finishRule.amount))) {
            throw new Meteor.Error(500, errorCodes.RewardConditionMatchError)
        }
    }
    return true
}

/**奖励**/
const _award = async function (user, rewardIds, userTask, session) {
    let ids = rewardIds.split('&')
    let rewards = TaskRewards.find({_id: {$in: ids}}).fetch()
    if (rewards) {
        for (let reward of rewards) {
            if (reward.type === 'token') {
                const token = await Token.findOne({_id: reward.content_type}, {session});
                if (!token) {
                    throw new Meteor.Error(500, errorCodes.RewardNotFound)
                }
                await addBalance({
                    user: user,
                    amount: Decimal(reward.amount),
                    token: token,
                    type: TokenChangeType.TaskBonus,
                    userData: {userTask: userTask}
                }, session);
            }

            if (reward.type === 'article') {
                let article = await Article.findOne({_id: parseInt(reward.content_type)}, {session})
                if (!article) {
                    throw new Meteor.Error(500, errorCodes.RewardNotFound)
                }
                await addArticle({
                    user: user._id,
                    articleId: reward.content_type,
                    number: reward.amount,
                    type: ArticleRecordType.TaskBonus
                }, session)
            }
        }
        await TasksAwardRecord.insertOne({
            user: user._id,
            task: userTask._id,
            reward: rewards,
            createdAt: new Date()
        }, {session})
    }
}

/**用户领取任务奖励**/
const receiveUserTaskRewards = async function (user, taskRuleId) {
    await transaction.run(async session => {
        /*let userTask = UserTasks.findOne(
            {_id: taskId, user: user._id, status: TaskStatus.Done, isReceivedRewards: {$ne: true}},
            {session}
        )
        if (!userTask) {
            throw new Meteor.Error(500, errorCodes.TaskInvalid)
        }

        let taskRule = TaskRules.findOne({_id: userTask.taskRuleId}, {session})
        if (!taskRule) {
            throw new Meteor.Error(500, errorCodes.TaskInvalid)
        }*/
        let taskRule = TaskRules.findOne({_id: taskRuleId, active: true}, {session})
        if (!taskRule) {
            throw new Meteor.Error(500, errorCodes.TaskInvalid)
        }
        let taskTime = buildTaskTime(taskRule.class)
        let userTask = UserTasks.findOne({
            user: user._id,
            taskRuleId: taskRuleId,
            status: TaskStatus.Done,
            startTime: taskTime.startTime
        }, {session})
        if (userTask) {
            throw new Meteor.Error(500, errorCodes.RewardReceived)
        }

        await _checkTaskProgress(user, taskRule, session)

        userTask = {
            _id: Random.id(),
            user: user._id,
            taskRuleId: taskRule._id,
            taskClass: taskRule.class,
            status: TaskStatus.Done,
            startTime: taskTime.startTime,
            endTime: taskTime.endTime,
            isReceiveReward: true,
            finishedTime: new Date()
        }
        await UserTasks.insertOne(userTask, {session})
        if (taskRule.rewards) {
            await _award(user, taskRule.rewards, userTask, session)
        }

        if (taskRule.notify_apps) {
            await appTaskNotify(user, taskRule, session)
        }
        /*let res = await UserTasks.findOneAndUpdate(
            {_id: taskId},
            {
                $set: {isReceivedRewards: true}
            }, {session}
        )
        if (res.ok !== 1 || res.lastErrorObject.n !== 1) {
            throw new Meteor.Error(500, errorCodes.ReceiveTaskRewardsError)
        }*/
    })
}
export {
    getTaskList,
    receiveTaskReward,
    initUserTasks,
    updateTaskProgress,
    getUserTasks,
    receiveUserTaskRewards,
    buildTaskTime,
    getTaskProgress
}