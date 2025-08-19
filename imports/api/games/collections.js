import SimpleSchema from 'simpl-schema';
import {Enum} from "../../utils/enum";
import {Collection} from "../core/database";
import {BaseSchema} from "../core/schema";
import {BlockSchema} from "../blockchain/collections";


const GameType = new Enum({
    HTML: 0,
    Unity: 1,
    Cocos: 2,
});

const GameSchema = new SimpleSchema({
    _id: String,
    name: String,
    active: Boolean,
    type: {
        type: SimpleSchema.Integer,
        allowedValues: Object.values(GameType)
    },
    landNftId: String,

});

const Game = new Mongo.Collection("games");
Game.attachSchema(GameSchema);

const GameRoundStatus = {
    Started: 0,
    Ended: 1,
};

const GameRoundSchema = new SimpleSchema({
    _id: String,
    game: {
        type: GameSchema,
    },
    gameId: Number,
    userData: {
        type: Object,
        blackbox: true,
        optional: true
    },
    status: {
        type: SimpleSchema.Integer,
        allowedValues: Object.values(GameRoundStatus)
    },
    seed: { // 每局遊戲的隨機種子
        type: String,
        optional: true
    },
    seedHash: { // 每局遊戲的隨機種子hash
        type: String,
        optional: true
    },
    resultHash: { // 每局結果hash，用來生成遊戲結果
        type: String,
        optional: true
    },
    block: {
        type: BlockSchema,
        optional: true
    },
});
GameRoundSchema.extend(BaseSchema);

const GameRound = new Collection("gameRounds");
GameRound.attachSchema(GameRoundSchema);



export {
    Game,
    GameSchema,
    GameRound,
    GameRoundSchema,
    GameRoundStatus,
}
