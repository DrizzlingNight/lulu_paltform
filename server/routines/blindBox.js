import logging from "/imports/api/logging";
import {Routine} from "../../imports/api/routine/server";
import {updateBlindBox} from "../../imports/api/blindBox/server/service";

const logger = logging.getLogger(module.id);

class BlindBoxRoutine extends Routine {
    interval = 1000;

    async update() {
        try {
            await updateBlindBox()
        } catch (e) {
            logger.error(`scan need mint nft tokens error: ${e}`)
        }
    }
}

export default new BlindBoxRoutine();
