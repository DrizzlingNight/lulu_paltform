import {updateBlindBox} from "../../../api/blindBox/server/service";
import {addIntervalSyncedCron} from "../../../api/syncedCron/server/service";

addIntervalSyncedCron("BlindBoxRoutine", 1, async function() {
    await updateBlindBox()
})
