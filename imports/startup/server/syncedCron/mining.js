import {addIntervalSyncedCron} from "../../../api/syncedCron/server/service";
import {asyncAddToMiningPoolFromCache} from "../../../api/mining/server/service";
import {asyncAddToFundPoolFromCache} from "../../../api/fund/server/service";


addIntervalSyncedCron("MiningRoutine", 60, async function() {
    await asyncAddToMiningPoolFromCache();
    await asyncAddToFundPoolFromCache();
})
