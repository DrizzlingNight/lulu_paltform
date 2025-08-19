import {
    BountyTask,
    BountyTaskOptHistory,
    BountyTaskOptType,
    BountyTaskRule,
    BountyTaskStatus,
    BountyTaskType
} from "../collections";
import {errorCodes} from "../../../settings/errorCodes";
import {transaction} from "../../core/database";
import moment from "moment/moment";
import {addBalance, removeBalance} from "../../account/server/service";
import {Token, TokenChangeType} from "../../tokens/collections";
import {Decimal} from "meteor/mongo-decimal";
import {Random} from "meteor/random";
import {closeLeaseTask, publishLeaseTask} from "../../games/market/server/services";
import {updateTaskProgress} from "../../tasks/server/services";
import {settings} from "../../../settings";
import {getFakeLand} from "../../nft/server/service";
import {NonFungibleTokenItem} from "../../nft/collections";

const buildBountyTaskSelector = async function (params) {
    let selector = {
        'type': params.type ? params.type : BountyTaskType.LeaseLand,
        'status': params.status ? {$in: params.status} : BountyTaskStatus.Init
    }

    if (params.mode !== undefined) {
        selector['requirements.mode'] = {$in: params.mode}
    }
    if (params.timeLimit !== undefined) {
        selector['requirements.timeLimit'] = {$in: params.timeLimit}
    }
    if (params.isDeleted !== undefined) {
        if (params.isDeleted === false) {
            selector['isDeleted'] = {$ne: true}
        } else {
            selector['isDeleted'] = params.isDeleted
        }
    }
    if (params.publisher) {
        selector['publisher'] = params.publisher
    } else {
        selector['publisher'] = {$ne: Meteor.userId()}
    }
    if (params.receiver) {
        selector['receiver'] = Meteor.userId()
    }
    return selector
}

// 获取用户进行中的任务数
const getUserTaskCount = async function (user, taskType, session) {
    return BountyTask.find({
        receiver: user._id,
        type: taskType,
        status: {$in: [BountyTaskStatus.InProgress, BountyTaskStatus.Done, BountyTaskStatus.Failed]},
        isDeleted: false
    }, {session}).count()
}

// 检查任务条件
const checkTaskRequirement = async function (task, user, session) {
    const rule = BountyTaskRule.findOne({_id: task.ruleId, active: true}, {session})
    if (!rule) {
        throw new Meteor.Error(500, errorCodes.BountyTaskInvalid)
    }

    if (rule.rules.inProgressCount) {
        const inProgressCount = await getUserTaskCount(user, task.type, session)
        if (inProgressCount >= rule.rules.inProgressCount) {
            throw new Meteor.Error(500, errorCodes.TaskNumberInvalid)
        }
    }
    return true
}

// 发布任务
const publishTask = async function (taskRuleId, rules, user) {

    await transaction.run(async (session) => {
        const rule = BountyTaskRule.findOne({_id: taskRuleId, active: true})
        if (!rule) {
            throw new Meteor.Error(500, errorCodes.ObjNotFound)
        }

        let taskId = Random.id()
        let taskInfo
        if (rule.type === BountyTaskType.LeaseLand) {
            taskInfo = await publishLeaseTask(rule, rules, taskId, user, session)
        }

        Object.assign(taskInfo, {
            _id: taskId,
            type: rule.type,
            ruleId: taskRuleId,
            publisher: user._id,
            status: BountyTaskStatus.Init,
            params: rules,
            isDeleted: false,
            isReceivedRewards: false,
            createdAt: new Date()
        })

        await BountyTask.insertOne(taskInfo, {session})
        await BountyTaskOptHistory.insertOne({
            task: taskId,
            user: user._id,
            type: BountyTaskOptType.Publish,
            createdAt: new Date()
        }, {session})

        if (taskInfo.rewards) {
            for (let reward of taskInfo.rewards) {
                if (reward.type === 'token') {
                    const token = await Token.findOne({_id: reward.token}, {session});
                    await removeBalance({
                        user: user,
                        amount: Decimal(reward.amount),
                        token: token,
                        type: TokenChangeType.BountyTaskBonusFreeze,
                        userData: {task: taskId}
                    }, session);
                }
            }
        }
    })
}

// 领取任务
const receiveTask = async function (taskId, user) {
    await transaction.run(async (session) => {
        const task = BountyTask.findOne({_id: taskId, status: BountyTaskStatus.Init}, {session})

        if (!task || task.publisher === user._id) {
            throw new Meteor.Error(500, errorCodes.BountyTaskInvalid)
        }

        await checkTaskRequirement(task, user, session)

        let now = moment()
        let res = await BountyTask.findOneAndUpdate(
            {_id: taskId, status: BountyTaskStatus.Init},
            {
                $set: {
                    receiver: user._id,
                    status: BountyTaskStatus.InProgress,
                    startTime: now.toDate(),
                    deadLine: task.requirements && task.requirements.timeLimit ? now.add(task.requirements.timeLimit, 'hours').toDate() : null
                }
            }, {session}
        )
        if (res.ok !== 1 || res.lastErrorObject.n !== 1) {
            throw new Meteor.Error(500, errorCodes.ReceiveTaskError)
        }

        await BountyTaskOptHistory.insertOne({
            task: task._id,
            user: user._id,
            type: BountyTaskOptType.Receive,
            createdAt: new Date()
        }, {session})

        // 任务事件
        let receiveType, publishType
        if (task.requirements.mode === 0) {
            receiveType = 'receive_rent'
            publishType = 'publish_rent'
        } else {
            receiveType = 'receive_job'
            publishType = 'publish_job'
        }
        let publisher = Meteor.users.findOne({_id: task.publisher})
        await updateTaskProgress(user, 'bountyTask', 'receive', 1, session)
        await updateTaskProgress(user, 'bountyTask', receiveType, 1, session)
        await updateTaskProgress(publisher, 'bountyTask', 'publish', 1, session)
        await updateTaskProgress(publisher, 'bountyTask', publishType, 1, session)
    })
}

// 取消任务
const cancelTask = async function (taskId, user) {
    await transaction.run(async (session) => {
        const task = BountyTask.findOne({_id: taskId, status: BountyTaskStatus.Init, publisher: user._id}, {session})

        if (!task) {
            throw new Meteor.Error(500, errorCodes.BountyTaskInvalid)
        }

        let res = await BountyTask.findOneAndUpdate(
            {_id: taskId, status: BountyTaskStatus.Init, publisher: user._id},
            {
                $set: {status: BountyTaskStatus.Canceled,}
            }, {session}
        )
        if (res.ok !== 1 || res.lastErrorObject.n !== 1) {
            throw new Meteor.Error(500, errorCodes.CancelTaskError)
        }

        if (task.type === BountyTaskType.LeaseLand) {
            await closeLeaseTask(task, user, session)
        }

        if (task.rewards) {
            for (let reward of task.rewards) {
                if (reward.type === 'token') {
                    const token = await Token.findOne({_id: reward.token}, {session});
                    await addBalance({
                        user: user,
                        amount: Decimal(reward.amount),
                        token: token,
                        type: TokenChangeType.BountyTaskBonusReturn,
                        userData: {task: task._id}
                    }, session);
                }
            }
        }

        await BountyTaskOptHistory.insertOne({
            task: task._id,
            user: user._id,
            type: BountyTaskOptType.Cancel,
            createdAt: new Date()
        }, {session})
    })
}

// 删除任务
const delTask = async function (taskId, user) {
    await transaction.run(async (session) => {
        const task = BountyTask.findOne({
            _id: taskId,
            isDeleted: false,
            receiver: user._id,
            status: {$in: [BountyTaskStatus.Done, BountyTaskStatus.Failed]}
        }, {session})

        if (!task || (task.status === BountyTaskStatus.Done && !task.isReceivedRewards)) {
            throw new Meteor.Error(500, errorCodes.BountyTaskInvalid)
        }

        let res = await BountyTask.findOneAndUpdate(
            {
                _id: taskId,
                isDeleted: false,
                receiver: user._id,
                status: {$in: [BountyTaskStatus.Done, BountyTaskStatus.Failed]}
            },
            {
                $set: {isDeleted: true,}
            }, {session}
        )
        if (res.ok !== 1 || res.lastErrorObject.n !== 1) {
            throw new Meteor.Error(500, errorCodes.DelTaskError)
        }

        await BountyTaskOptHistory.insertOne({
            task: task._id,
            user: user._id,
            type: BountyTaskOptType.Delete,
            createdAt: new Date()
        }, {session})
    })
}

// 关闭任务
const closeTask = async function (task, session) {
    let user = Meteor.users.findOne({_id: task.publisher})
    let res = await BountyTask.findOneAndUpdate(
        {_id: task._id, status: BountyTaskStatus.InProgress},
        {
            $set: {status: BountyTaskStatus.Failed}
        }, {session}
    )
    if (res.ok !== 1 || res.lastErrorObject.n !== 1) {
        throw new Meteor.Error(500, errorCodes.CloseTaskError)
    }

    if (task.type === BountyTaskType.LeaseLand) {
        await closeLeaseTask(task, user, session)
    }

    if (task.rewards) {
        for (let reward of task.rewards) {
            if (reward.type === 'token') {
                const token = await Token.findOne({_id: reward.token}, {session});
                await addBalance({
                    user: user,
                    amount: Decimal(reward.amount),
                    token: token,
                    type: TokenChangeType.BountyTaskBonusReturn,
                    userData: {task: task._id}
                }, session);
            }
        }
    }

    await BountyTaskOptHistory.insertOne({
        task: task._id,
        user: user._id,
        type: BountyTaskOptType.Close,
        createdAt: new Date()
    }, {session})
}

// 领取任务奖励
const receiveBountyTaskRewards = async function (taskId, user) {
    await transaction.run(async (session) => {
        const task = BountyTask.findOne({
            _id: taskId,
            status: BountyTaskStatus.Done,
            isReceivedRewards: false,
            receiver: user._id
        }, {session})

        if (!task) {
            throw new Meteor.Error(500, errorCodes.BountyTaskInvalid)
        }

        if (task.rewards) {
            for (let reward of task.rewards) {
                if (reward.type === 'token') {
                    const token = await Token.findOne({_id: reward.token}, {session});
                    await addBalance({
                        user: user,
                        amount: Decimal(reward.amount),
                        token: token,
                        type: TokenChangeType.BountyTaskBonus,
                        userData: {task: task._id}
                    }, session);
                }
            }
        }

        let res = await BountyTask.findOneAndUpdate(
            {_id: taskId},
            {
                $set: {isReceivedRewards: true}
            }, {session}
        )
        if (res.ok !== 1 || res.lastErrorObject.n !== 1) {
            throw new Meteor.Error(500, errorCodes.ReceiveTaskRewardsError)
        }

        await BountyTaskOptHistory.insertOne({
            task: task._id,
            user: user._id,
            type: BountyTaskOptType.ReceiveRewards,
            extraData: {
                rewards: task.rewards
            },
            createdAt: new Date()
        }, {session})

        // 任务事件
        let contentType = task.requirements.mode === 0 ? 'finish_rent' : 'finish_job'
        await updateTaskProgress(user, 'bountyTask', 'finish', 1, session)
        await updateTaskProgress(user, 'bountyTask', contentType, 1, session)
    })
}

// 领取fake委托
const receiveFakeBountyTask = async function (user, mode='rent') {
    await transaction.run(async (session) => {
        const isReceived = BountyTask.findOne({receiver: user._id, fake: true}, {session})
        const taskRule = BountyTaskRule.findOne({_id: 'leaseLand', active: true}, {session})
        if (isReceived) {
            throw new Meteor.Error(500, errorCodes.GuideInvalid)
        }

        let publisher = Meteor.users.findOne({username: settings.bountyTask.publisher}, {session})
        let rules = settings.bountyTask.rules[mode]

        let land = await getFakeLand(publisher, session)
        if (!land) {
            throw new Meteor.Error(500, errorCodes.LandInvalid)
        }

        let now = moment()
        let taskId = Random.id()
        let taskInfo = {
            _id: taskId,
            type: taskRule.type,
            ruleId: taskRule._id,
            publisher: publisher._id,
            isDeleted: false,
            isReceivedRewards: false,
            createdAt: now.toDate(),
            receiver: user._id,
            status: BountyTaskStatus.InProgress,
            startTime: now.toDate(),
            deadLine: now.add(rules.timeLimit, 'hours').toDate(),
            fake: true,
            requirements: {
                land: land,
                seed: rules.seed,
                mode: rules.mode,
                timeLimit: rules.timeLimit
            },
            progress: {
                "seedsCount": rules.seedsCount,
                "cultivatedCount": 0
            },
            rewards: rules.rewards,
        }
        await BountyTask.insertOne(taskInfo, {session})
        if (taskInfo.rewards) {
            for (let reward of taskInfo.rewards) {
                if (reward.type === 'token') {
                    const token = await Token.findOne({_id: reward.token}, {session});
                    await removeBalance({
                        user: publisher,
                        amount: Decimal(reward.amount),
                        token: token,
                        type: TokenChangeType.BountyTaskBonusFreeze,
                        userData: {task: taskId}
                    }, session);
                }
            }
        }

        let res = await NonFungibleTokenItem.findOneAndUpdate(
            {_id: land._id, user: publisher._id, disable: {$ne: true}, "state.lend": {$ne: true}},
            {$set: {"state.lend": true}}, {session}
        )
        if (res.ok !== 1 || res.lastErrorObject.n !== 1) {
            throw new Meteor.Error(500, errorCodes.LandInvalid)
        }

        await BountyTaskOptHistory.insertOne({
            task: taskId,
            user: user._id,
            type: BountyTaskOptType.ReceiveGuideTask,
            createdAt: now.toDate()
        }, {session})
    })
}

export {
    buildBountyTaskSelector,
    publishTask,
    receiveTask,
    cancelTask,
    closeTask,
    delTask,
    receiveBountyTaskRewards,
    receiveFakeBountyTask
}