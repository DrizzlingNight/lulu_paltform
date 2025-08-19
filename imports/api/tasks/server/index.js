import './methods'
import './publications'
import {
    TaskFinishRules,
    TaskProgress,
    TaskRewards,
    TaskRules,
    Tasks,
    TasksAwardRecord,
    UserTasks
} from "../collections";

Tasks.rawCollection().createIndex('_id')
TasksAwardRecord.rawCollection().createIndex('user')
// TasksAwardRecord.rawCollection().createIndex({'reward.id': 1, user: 1}, {sparse: true, unique: true})

TaskRules.rawCollection().createIndex('class', {background: true})
TaskRules.rawCollection().createIndex('active', {background: true})
TaskRules.rawCollection().createIndex('show', {background: true})

TaskRewards.rawCollection().createIndex('type', {background: true})
TaskRewards.rawCollection().createIndex('content_type', {background: true})
TaskRewards.rawCollection().createIndex('show', {background: true})

TaskFinishRules.rawCollection().createIndex('type', {background: true})
TaskFinishRules.rawCollection().createIndex('content_type', {background: true})
TaskFinishRules.rawCollection().createIndex('show', {background: true})

UserTasks.rawCollection().createIndex('user', {background: true})
UserTasks.rawCollection().createIndex('taskRuleId', {background: true})
UserTasks.rawCollection().createIndex('status', {background: true})
UserTasks.rawCollection().createIndex({'user': 1, 'taskRuleId': 1, 'taskClass': 1, 'startTime': 1}, {
    backgroud: true,
    unique: true
})

TaskProgress.rawCollection().createIndex('taskClass', {background: true})
TaskProgress.rawCollection().createIndex('type', {background: true})
TaskProgress.rawCollection().createIndex('content_type', {background: true})
TaskProgress.rawCollection().createIndex({'taskClass': 1, 'type': 1, 'user': 1, 'content_type': 1, 'startTime': 1}, {
    backgroud: true,
    unique: true
})