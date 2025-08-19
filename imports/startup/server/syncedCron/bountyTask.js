import {addIntervalSyncedCron} from "../../../api/syncedCron/server/service";
import {BountyTask, BountyTaskStatus, BountyTaskType} from "../../../api/bountyTasks/collections";
import logging from "/imports/api/logging";
import {autoFinishLeaseTask} from "../../../api/games/market/server/services";

const logger = logging.getLogger(module.id);

/** @desc检查悬赏任务 **/
async function scanBountyTasks() {
    let tasks = BountyTask.find(
        {status: BountyTaskStatus.InProgress, deadLine: {$lte: new Date()}},
        {sort: {"deadLine": -1}}
    ).fetch()
    if (tasks.length <= 0) {
        return
    }

    for (let task of tasks) {
        try {
            // 检测是否有进行中的游戏
            logger.info(`auto close  task:${task._id}, time:${new Date()}`)
            if (task.type === BountyTaskType.LeaseLand) {
                await autoFinishLeaseTask(task)
            }
        } catch (e) {
            logger.error(e)
        }
    }
}

addIntervalSyncedCron("BountyTaskRoutine", 10, async function () {
    try {
        await scanBountyTasks()
    } catch (e) {
        logger.error(`scan bounty task error: ${e}`)
    }
})