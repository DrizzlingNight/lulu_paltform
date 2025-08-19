import {removeMarketPrice} from "../../../api/binanceMarketStreams/server/services";
import {addIntervalSyncedCron} from "../../../api/syncedCron/server/service";

addIntervalSyncedCron("RemoveOldMarketPrice", 60, async function() {
    await removeMarketPrice()
})
