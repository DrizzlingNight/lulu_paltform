import logging from "/imports/api/logging";
import { shareBonus, checkRedeemRecord } from "../../../api/stake/server/service";
import {addIntervalSyncedCron} from "../../../api/syncedCron/server/service";

const logger = logging.getLogger(module.id);

addIntervalSyncedCron("StakeRoutine", 60, async function() {
    try {
        await shareBonus()
    } catch (e) {
        logger.error(`shareBonus error: ${e}`)
    }

    try {
        await checkRedeemRecord()
    } catch (e) {
        logger.error(`checkRedeemRecord error: ${e}`)
    }
})
