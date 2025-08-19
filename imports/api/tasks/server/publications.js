import {Meteor} from "meteor/meteor";
import {TaskFinishRules, TaskProgress, TaskRewards, TaskRules, UserTasks} from "../collections";
import {buildTaskTime} from "./services";


const buildTaskInfo = function(id, task, user) {
    if (task.rewards) {
        let rewardIds = task.rewards.split('&')
        task.rewards = TaskRewards.find({_id: {$in: rewardIds}}).fetch()
    }
    if (task.finish_rules) {
        let finishRuleIds = task.finish_rules.split('&')
        /*let progress = []
        for (let finishRule of finishRules) {
            let userProgress = getTaskProgress(user, finishRule, task.class)
            progress.push({finishRule, userProgress})
        }
        task.progress = progress*/
        task.finishRules = TaskFinishRules.find({_id: {$in: finishRuleIds}}).fetch()
    }

    /*let taskTime = buildTaskTime(task.class)
    task.userTask = UserTasks.findOne({
        user: user._id,
        taskRuleId: id,
        status: TaskStatus.Done,
        startTime: taskTime.startTime
    })*/
}

/**
 * @api {subscribe} Meteor.subscribe('tasks') 任务
 * @apiVersion 0.1.0
 * @apiName 订阅我的任務
 * @apiGroup Task
 *
 * @apiSuccess      {Array}     List 用户任务
 */
Meteor.publish('tasks', async function () {
    let user = Meteor.user()
    check(user, Object)

    let self = this;
    let taskRuleHandle = TaskRules.find({
        active: true,
        show: true
    }, {
        sort: {
            sort:1
        },
        pollingIntervalMs: 1000
    }).observeChanges({
        added(id, fields){
            buildTaskInfo(id, fields, user)
            self.added('taskRule', id, fields);
        },
        changed(id, fields){
            buildTaskInfo(id, fields, user)
            self.changed('taskRule', id, fields);
        },
        removed(id){
            self.removed('taskRule', id);
        },
    })

    let dayStartTime = buildTaskTime('daily_task').startTime
    let weekStartTime = buildTaskTime('weekly_task').startTime
    let onceStartTime = buildTaskTime('rookie_task').startTime

    let taskProgressHandle = TaskProgress.find({
        user: user._id,
        $or: [
            {taskClass: 'daily_task', startTime: dayStartTime},
            {taskClass: 'weekly_task', startTime: weekStartTime},
            {taskClass: 'rookie_task', startTime: onceStartTime},
        ]
    }, {pollingIntervalMs: 1000}).observeChanges({
        added(id, fields){
            self.added('taskProgress', id, fields);
        },
        changed(id, fields){
            self.changed('taskProgress', id, fields);
        },
        removed(id){
            self.removed('taskProgress', id);
        },
    })

    let userTaskHandle = UserTasks.find({
        user: user._id,
        $or: [
            {taskClass: 'daily_task', startTime: dayStartTime},
            {taskClass: 'weekly_task', startTime: weekStartTime},
            {taskClass: 'rookie_task', startTime: onceStartTime},
        ]
    }, {pollingIntervalMs: 1000}).observeChanges({
        added(id, fields){
            self.added('userTask', id, fields);
        },
        changed(id, fields){
            self.changed('userTask', id, fields);
        },
        removed(id){
            self.removed('userTask', id);
        },
    })

    this.ready();
    this.onStop(() => {
        taskRuleHandle.stop();
        taskProgressHandle.stop();
        userTaskHandle.stop();
    });
});