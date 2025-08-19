import {marbleMethods} from "../../../utils/methods";
import {Game} from "../collections";

marbleMethods({
    getGames: async function(){
        return await Game.find({}).fetch()
    },
    getGame: async function(game, active) {
        const selector = {}
        if (game) selector['_id'] = game
        if (active) selector['active'] = active
        return await Game.find(selector).fetch()
    }
})
