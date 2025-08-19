import {Game} from "./collections";
import logging from "../logging";
import { get, set} from "../cache";
import * as _ from "lodash";

const logger = logging.getLogger(module.id);

const getGame = function(id, active=null) {
    let games = getGames();
    if(active == null) {
        return _.find(games, (v) => {return v._id === id});
    }
    else {
        return _.find(games, (v) => {return v._id === id && v.active === active});
    }
};

const getGames = function() {
    let games = get("games");
    if (!games) {
        games = Game.find({active:true}).fetch();
        set("games", games, 60);
        logger.debug(`fetch games from db: ${JSON.stringify(games)}`);
        games = get("games");
    }
    return games;
};

export { getGame, getGames }
