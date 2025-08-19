import {Match} from "meteor/check";
import {Random} from "meteor/random";
import {GameRound, GameRoundSchema, GameRoundStatus} from "../collections";
import {getGame} from "../utils";
import {getSequenceValue} from "../../core/server";
import jsSHA from "jssha";
import logging from "/imports/api/logging";
import {errorCodes} from "../../../settings/errorCodes";
const logger = logging.getLogger(module.id);

const createdGameId = async function (session) {
    return await getSequenceValue("gameId", session)
}
export const startRound = async function({ game, userData, }, session) {
    if (Match.test(game, String)) {
        game = getGame(game);
    }

    let round = {
        _id: Random.id(),
        game: game,
        status: GameRoundStatus.Started,
        userData,
        gameId: await createdGameId(session)//lastRound.roundId ? lastRound.roundId + 1 : 1,
    };

    let seed = Random.hexString(32);
    let sha = new jsSHA("SHA-256", "HEX");
    sha.update(seed);
    let seedHash = sha.getHash("HEX");

    round.seed = seed
    round.seedHash = seedHash

    round = GameRoundSchema.clean(round, { mutate: true, extendAutoValueContext: { isInsert: true } });
    GameRoundSchema.validate(round);
    let {result, ops} = await GameRound.insertOne(round, { session });
    logger.debug(`insert round result: ${result.ok}\n${JSON.stringify(ops)}`);
    if (result.ok) {
        return ops[0];
    }
    throw new Meteor.Error(500, errorCodes.StartRoundError);
};

export const getResultFromHashMapConfig = function ({resultHash, config, byteNumber, maxAvaliable}){
    if (!byteNumber){
        if (config){
            byteNumber = 1;
            let oneByteNumber = 16;
            let threshold = oneByteNumber;
            for (; config.total > threshold; threshold = threshold *  oneByteNumber )
                byteNumber++;
            maxAvaliable = threshold - threshold % config.total
        }else{
            byteNumber = 3;
            maxAvaliable = 4000
            config = {
                total: 1000
            }
        }
    }

    let currentNumber = (resultHash.length > byteNumber) ? (Number(`0x${resultHash.substr(resultHash.length - byteNumber)}`).toString(10)) : Math.random() * maxAvaliable
    if (maxAvaliable <= currentNumber) {
        return getResultFromHashMapConfig({resultHash: resultHash.substr(0, resultHash.length - byteNumber), config, byteNumber, maxAvaliable})
    }
    let res = currentNumber * config.total / maxAvaliable
    if (config.cumulativeDistribution){
        for (let i = 0; i < config.cumulativeDistribution.length; i++) {
            if (config.cumulativeDistribution[i].max > res)
                return {resultHash, resNumber: res, res: config.cumulativeDistribution[i].res,
                    leftHash:resultHash.substr(0, resultHash.length - byteNumber) }
        }
        throw new Meteor.Error(500, errorCodes.GameRoundInvalid)
    }else{
        return {resultHash, resNumber: res, res: res / config.total,
            leftHash:resultHash.substr(0, resultHash.length - byteNumber) }
    }
}
