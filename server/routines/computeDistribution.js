import logging from "/imports/api/logging";
import {Routine} from "../../imports/api/routine/server";
import {computeDistribution} from "../../imports/api/binanceMarketStreams/server/services";

const logger = logging.getLogger(module.id);

class ComputeDistributionRoutine extends Routine {
    interval = 1000;

    async update() {
        try {
            await computeDistribution()
        } catch (e) {
            logger.error(`ComputeDistributionRoutine error: ${e}`)
        }
    }
}

export default new ComputeDistributionRoutine();
