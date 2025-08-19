import {GameRoutine} from "/imports/api/routine/server";
import {gameUpdate} from "/imports/api/games/market/server/services";

class MarketRoutine extends GameRoutine {
    gameId = "market";

    async gameUpdate() {
        await gameUpdate();
    }
}

export default new MarketRoutine();
