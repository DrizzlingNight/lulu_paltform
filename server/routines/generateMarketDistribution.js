import logging from "/imports/api/logging";
import {Routine} from "../../imports/api/routine/server";
import {generateMarketDistribution} from "../../imports/api/binanceMarketStreams/server/services";

const logger = logging.getLogger(module.id);

class GenerateMarketDistribution extends Routine {
    interval = 300000;

    async update() {
        try {
            await generateMarketDistribution()
        } catch (e) {
            logger.error(`generateMarketDistribution error: ${e}`)
        }
    }
}

export default new GenerateMarketDistribution();
