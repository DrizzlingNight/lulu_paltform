import logging from "/imports/api/logging";
import {Routine} from "../../imports/api/routine/server";
import { shareBonus, checkRedeemRecord } from "../../imports/api/stake/server/service";

const logger = logging.getLogger(module.id);

class StakeRoutine extends Routine {
    interval = 60 * 1000;

    async update() {
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
    }
}

export default new StakeRoutine();
