import {generateMarketDistribution} from "../../../api/binanceMarketStreams/server/services";
import {addIntervalSyncedCron} from "../../../api/syncedCron/server/service";

addIntervalSyncedCron("GenerateMarketDistribution", 300, async function() {
    await generateMarketDistribution()
})
