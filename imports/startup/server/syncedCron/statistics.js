import {addIntervalSyncedCron} from "../../../api/syncedCron/server/service";
import {tokenChangeDailyStatistics, proxyChildrenWeeklyStatistics} from "../../../api/tokens/server/statistics";

addIntervalSyncedCron("StatisticsRoutine", 10, async function() {
    await proxyChildrenWeeklyStatistics()
    await tokenChangeDailyStatistics()
}, true)
