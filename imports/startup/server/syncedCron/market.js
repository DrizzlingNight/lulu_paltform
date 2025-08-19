import {gameUpdate} from "/imports/api/games/market/server/services";
import {addIntervalSyncedCron} from "../../../api/syncedCron/server/service";


addIntervalSyncedCron("MarketRoutine", 1, async function() {
    await gameUpdate();
})
