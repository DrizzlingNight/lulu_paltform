import SimpleSchema from "simpl-schema";
import {Enum} from "../../utils/enum";
import {Collection} from "../core/database";


const RankingConfigMap = new Enum({
    "week-mining": "mine_buyback_rank",
    "week-plant-harvest": "plant_harvest_rank"
})


const RankingType = new Enum({
    weekMining: "week-mining",
    weekPlantHarvest: "week-plant-harvest"
})


const RankingSchema = new SimpleSchema({
    user: String,
    username: String,
    type: RankingType,
    number: Number,
    start: Number,
    update: Number,
    currentNumber: Number
})


const Ranking = new Collection("ranking");
Ranking.attachSchema(RankingSchema);

export { Ranking, RankingType, RankingConfigMap}
