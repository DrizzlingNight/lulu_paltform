import {checkMarketStatus} from "../../../api/binanceMarketStreams/server/services";
import {addIntervalSyncedCron} from "../../../api/syncedCron/server/service";

addIntervalSyncedCron("CheckMarketStatus", 60, async function() {
    await checkMarketStatus()
})
