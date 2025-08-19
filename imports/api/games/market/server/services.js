import {CultivationState, GameName, LandSlot, Seed, SettleType} from "../collections";
import {Random} from "meteor/random";
import {transaction} from "../../../core/database";
import {errorCodes} from "../../../../settings/errorCodes";
import {NonFungibleTokenItem} from "../../../nft/collections";
import {getGame} from "../../utils";
import {addBalance, removeBalance} from "../../../account/server/service";
import {getToken} from "../../../tokens/server/services";
import {TokenChangeType} from "../../../tokens/collections";
import {getResultFromHashMapConfig, startRound} from "../../server/services";
import moment from "moment";
import {GameRound, GameRoundStatus} from "../../collections";
import logging from "../../../logging";
import {Block} from "../../../blockchain/collections";
import jsSHA from "jssha";
import {getLandInfo, getLeaseLandIds} from "../../../nft/server/service";
import {miningByLand, miningByReferral} from "../../../mining/server/service";
import {fundPoolChangeByLand} from "../../../fund/server/service";
import {Article, ArticleBag, ArticleRecordType} from "../../article/collections";
import {addArticle, removeArticle} from "../../article/server/services";
import {getBorder, getStartSettleData} from "../../../binanceMarketStreams/server/services";
import {BinanceMarketStream, BinanceMarketStreamSecond} from "../../../binanceMarketStreams/collections";
import {Decimal} from "meteor/mongo-decimal";
import {
    BountyTask, BountyTaskStatus,
} from "../../../bountyTasks/collections";
import {closeTask, publishTask} from "../../../bountyTasks/server/service";
import {updateTaskProgress} from "../../../tasks/server/services";
import {addRankingNumber} from "../../../ranking/server/services";
import {RankingType} from "../../../ranking/collection";
import {settings} from "../../../../settings";


const logger = logging.getLogger(module.id);

export const buildTaskInfo = function (task) {
    return {
        _id: task._id,
        progress: task.progress,
        publisher: task.publisher,
        deadLine: task.deadLine,
        rewards: task.rewards,
        mode: task.requirements.mode
    }
}

export const checkUserMarketStatus = async function (user) {
    let slots = LandSlot.find({user: user._id}).fetch()
    if (!slots.length) {
        await initUsersMarket(user)
    } else {
        await openNewSlot(user)
    }
    return slots
}

export const getUsersMarket = async function (user) {
    await checkUserMarketStatus(user)
    let slots = LandSlot.find({user: user._id}, {sort: {position: 1}}).fetch()
    if (slots.length > 0) {
        for (let slot of slots) {
            if (slot.land && slot.land.state.lend) {
                let task = BountyTask.findOne({
                    status: BountyTaskStatus.InProgress,
                    receiver: user._id,
                    'requirements.land._id': slot.land._id
                })
                if (task) {
                    slot.taskInfo = buildTaskInfo(task)
                }
            }
        }
    }
    return slots
}
const openNewSlot = async function (user) {
    // todo 开启新插槽
}
const initUsersMarket = async function (user) {
    let slots = [{}, {}, {}, {},]
    slots = slots.map((s, i) => ({
        _id: Random.id(),
        user: user._id,
        position: i,
    }))
    return await LandSlot.insertMany(
        slots
    )
}
export const getLandNftId = function () {
    let game = getGame(GameName)
    return game && game.landNftId
}
export const bindLandAndSlot = async function (user, slotId, landId) {
    await transaction.run(async (session) => {
        let res
        let leaseLandIds = await getLeaseLandIds(user)
        // 土地锁定
        if (landId) {
            res = await NonFungibleTokenItem.findOneAndUpdate({
                "$and":
                    [
                        {_id: landId, disable: {$ne: true}},
                        {"$or": [{user: user._id}, {_id: {$in: leaseLandIds}, 'state.lend': true}]}
                    ]
            }, {$set: {disable: true}}, {session})
            /*res = await NonFungibleTokenItem.findOneAndUpdate(
                {_id: landId, user: user._id, disable: {$ne: true}},
                {$set: {disable: true}}, {session}
            )*/
            if (res.ok !== 1 || res.lastErrorObject.n !== 1) {
                throw new Meteor.Error(500, errorCodes.LandInvalid)
            }
            // 绑定插槽和土地
            res = await LandSlot.findOneAndUpdate(
                {_id: slotId, user: user._id, roundId: {$exists: false}},
                {$set: {land: res.value}}, {session}
            )
        } else {
            // 插槽和土地释放
            res = await LandSlot.findOneAndUpdate(
                {_id: slotId, user: user._id, roundId: {$exists: false}},
                {$unset: {land: ""}}, {session}
            )
        }
        if (res.ok !== 1 || res.lastErrorObject.n !== 1)
            throw new Meteor.Error(500, errorCodes.SlotInvalid)
        if (res.value.land) {
            /*res = await NonFungibleTokenItem.findOneAndUpdate(
                {_id: res.value.land._id, user: user._id},
                {$unset: {disable: ""}}, {session}
            )*/
            res = await NonFungibleTokenItem.findOneAndUpdate({
                "$and":
                    [
                        {_id: res.value.land._id},
                        {"$or": [{user: user._id}, {_id: {$in: leaseLandIds}}]}
                    ]
            }, {$unset: {disable: ""}}, {session})
            if (res.ok !== 1 || res.lastErrorObject.n !== 1)
                throw new Meteor.Error(500, errorCodes.SlotInvalid)
        }
    })
}

// 检查并购买种子
const purchaseSeeds = async function (user, slot, seed, number, session) {
    let res = {"purchaseQuantity": number, 'removeRes': null, "task": null}
    if (slot.land.user !== user._id && slot.land.state.lend) {
        let task = BountyTask.findOne({
            "requirements.land._id": slot.land._id,
            status: BountyTaskStatus.InProgress
        }, {session})
        let taskInfo = await checkLeaseTaskProgress(task, user, {type: 'cultivate', number: number}, session)
        res.taskInfo = buildTaskInfo(taskInfo)
        if (task.requirements.mode === 1) {
            return res
        }
    }

    res.purchaseQuantity = number
    let article = Article.findOne({linkedId: seed._id}, {session})
    let seeds = ArticleBag.findOne({articleId: article._id, user: user._id}, {session})
    if (seeds && seeds.number > 0) {
        res.purchaseQuantity = number - seeds.number
        await removeArticle({
            user: user._id, articleId: article._id,
            number: (res.purchaseQuantity <= 0) ? number : seeds.number,
            type: ArticleRecordType.Cultivate
        }, session)
    }

    if (res.purchaseQuantity > 0) {
        let totalPrice = seed.price.times(res.purchaseQuantity)
        let token = getToken({id: seed.token, active: true})
        res.removeRes = await removeBalance({
            user, amount: totalPrice, token, type: TokenChangeType.Cultivate,
            userData: {slot, seed, number}
        }, session)
    }
    return res
}

export const startCultivate = async function (user, slotId, seedId, number, settleDirection) {
    let game = getGame(GameName)
    if (!game || !game.active) return
    await transaction.run(async (session) => {
        // 插槽检查
        let slot = await LandSlot.findOne({_id: slotId}, {session})
        if (!slot || slot.user !== user._id || slot.roundId)
            throw new Meteor.Error(500, errorCodes.SlotInvalid)
        // 土地检查
        let land = await NonFungibleTokenItem.findOne({_id: slot.land._id}, {session})
        if (!land)
            throw new Meteor.Error(500, errorCodes.LandInvalid)
        // let landInfo = await getLandBBoxInfo(land, session)
        let landInfo = await getLandInfo(land, session)
        if (!landInfo)
            throw new Meteor.Error(500, errorCodes.LandInvalid)
        slot.land.info.nftPool = landInfo
        // 种子检查
        let seed = await Seed.findOne({_id: seedId, active: true}, {session})
        if (!seed)
            throw new Meteor.Error(500, errorCodes.SeedInvalid)
        if (number > landInfo.info.single_plant_cap_max || number < landInfo.info.single_plant_cap_min)
            throw new Meteor.Error(500, errorCodes.SeedNumberInvalid)

        // 余额检查并扣除
        // 种子数量
        let purchaseSeedsRes = await purchaseSeeds(user, slot, seed, number, session)
        let removeRes = purchaseSeedsRes.removeRes
        let purchaseQuantity = purchaseSeedsRes.purchaseQuantity

        // 创建game round
        let settleType = user.userSettings && user.userSettings.settleType || SettleType.random
        let pendingTime = user.userSettings && user.userSettings.pendingTime || 1
        let startPrice = await getStartSettleData(settleType, settleDirection)
        if (settleType && settleType !== SettleType.random && !startPrice)
            throw new Meteor.Error(500, errorCodes.MarketError)

        let border = getBorder(settleDirection, startPrice, land, pendingTime)
        let round = await startRound({
            game: GameName, userData: {
                userInfo: {
                    id: user._id,
                    name: user.username
                },
                slot, seed, number, tokenChange: removeRes && removeRes.ops[0]._id, state: CultivationState.Start,
                refreshTime: moment().add(pendingTime * 60, "seconds").valueOf(),
                growingTime: moment().add(pendingTime * 60 / 2, "seconds").valueOf(),
                purchaseQuantity,
                settleType,
                pendingTime,
                settleDirection,
                startPrice,
                border,
                taskInfo: purchaseSeedsRes.taskInfo
            },
        }, session)
        let slotUpdateRes = await LandSlot.findOneAndUpdate({_id: slotId, roundId: {$exists: false}},
            {$set: {roundId: round._id}}, {session})
        if (!slotUpdateRes || slotUpdateRes.ok !== 1 || slotUpdateRes.lastErrorObject.n !== 1)
            throw new Meteor.Error(500, errorCodes.SlotInvalid)

        // 任务事件
        if (!purchaseSeedsRes.task || purchaseSeedsRes.task.mode === 0) {
            let contentType = SettleType.getName(settleType)
            await updateTaskProgress(user, 'cultivate', '', number, session)
            await updateTaskProgress(user, 'cultivate', contentType, number, session)
        }
    })
}
export const gameUpdate = async function () {
    let gr = await GameRound.find({
        "game._id": GameName,
        status: GameRoundStatus.Started,
        "userData.state": {$ne: CultivationState.Waiting},
        "userData.refreshTime": {$lte: moment().valueOf()}
    }).fetch();
    for (let i in gr) {
        let gameRound = gr[i]
        await transaction.run(async (session) => {
            await mature(gameRound, session)
        })
    }
    gr = await GameRound.find({
        "game._id": GameName,
        "userData.state": CultivationState.Start,
        "userData.growingTime": {$lte: moment().valueOf()}
    }).fetch();
    for (let i in gr) {
        let gameRound = gr[i]
        await transaction.run(async (session) => {
            await GameRound.findOneAndUpdate({_id: gameRound._id, "userData.state": gameRound.userData.state},
                {$set: {"userData.state": CultivationState.Growing}}, {session})
        })
    }
}
export const mature = async function (gameRound, session) {
    if (!gameRound.userData.settleType || gameRound.userData.settleType === SettleType.random) {
        let resultHash = await generateResultHash(gameRound.seed, moment(gameRound.userData.refreshTime))
        await GameRound.findOneAndUpdate({_id: gameRound._id, "userData.state": gameRound.userData.state},
            {
                $set: {
                    "userData.state": CultivationState.Waiting,
                    resultHash: resultHash.resultHash, block: resultHash.block
                }
            }, {session})
        logger.info(`gameRound ${gameRound._id} from ${CultivationState.Start} to ${CultivationState.Waiting}`)
    } else {
        let startPrice = gameRound.userData.startPrice
        if (!startPrice) return
        let seed = gameRound.userData.seed
        let pSort = gameRound.userData.settleDirection
        let pendingTime = gameRound.userData.pendingTime * 60 || seed.pendingTime
        let endPrice = await BinanceMarketStream.rawCollection().aggregate([
            {$match: {symbol: startPrice.symbol, T: {$gt: startPrice.T + pendingTime * 1000 - 1000}}},
            {$sort: {T: 1}},
            {$limit: 50},
            {$sort: {p: pSort}},
            {$limit: 1},
        ], {session}).toArray()
        if (endPrice.length > 0)
            endPrice = endPrice[0]
        else return
        endPrice.T = startPrice.T + pendingTime * 1000
        let startT = Number(String(startPrice.T / 1000).substring(0, 10))
        let delta = gameRound.userData.pendingTime || 1
        let priceList = await BinanceMarketStreamSecond.rawCollection().find(
            {
                symbol: startPrice.symbol,
                delta,
                T: {$gte: startT, $lte: startT + 60 * delta}
            },
            {sort: {T: 1}}, {session}).toArray();
        priceList[0] = startPrice
        priceList[priceList.length - 1] = endPrice
        await GameRound.findOneAndUpdate({_id: gameRound._id, "userData.state": gameRound.userData.state},
            {
                $set: {
                    "userData.state": CultivationState.Waiting, "userData.endPrice": endPrice,
                    "userData.priceList": priceList
                }
            }, {session})
        logger.info(`gameRound ${gameRound._id} from ${CultivationState.Start} to ${CultivationState.Waiting}`)
    }
}
const generateResultHash = async function (seed, time) {
    let block = await Block.findOne({createdAt: {$lte: time.toDate()}}, {sort: {createdAt: -1}})
    let blockHash = block ? block.hash.substring(2) : ""
    seed = seed ? seed : "";
    let sha = new jsSHA("SHA-256", "HEX");
    sha.update(blockHash);
    sha.update(seed);
    return {resultHash: sha.getHash("HEX"), block}
}
const createResult = async function (round) {
    if (!round.userData.settleType || round.userData.settleType === SettleType.random) {
        let landInfo = round.userData.slot.land.info.nftPool.info
        let res = getResultFromHashMapConfig(
            {resultHash: round.resultHash, config: landInfo.effect})
        let solt = getResultFromHashMapConfig({resultHash: res.leftHash})
        let payout = res.res.max.minus(res.res.min).times(solt.res).add(res.res.min)
        return {
            res, solt,
            payout,
            totalPayout: payout.times(round.userData.number)
        }
    } else {
        let endPrice = round.userData.endPrice
        let border = round.userData.border
        let res = getResultFromPrice(endPrice, border)
        let landInfo = round.userData.slot.land.info.totalNftPool.info
        let min = Decimal(1).add(landInfo[`binary_${res}_bonus`])
            .add(Decimal(landInfo["harvest_ran"]).neg())
        let max = Decimal(1).add(landInfo[`binary_${res}_bonus`])
            .add(landInfo["harvest_ran"])
        let solt = Math.random()
        let payout = max.minus(min).times(solt).add(min)
        return {
            res: {res: {name: res, max, min}},
            solt: {res: solt},
            payout,
            totalPayout: payout.times(round.userData.number)
        }
    }
}
const getResultFromPrice = function (endPrice, border) {
    let price = Number(endPrice.p)
    for (let k in border) {
        let b = border[k]
        if ((b[0] < price) && (b[1] >= price)) {
            return k
        }
    }
}
export const settle = async function (round, session) {
    let gameUser = await Meteor.users.findOne({_id: round.userData.slot.user}, {session})
    let miningUser = gameUser
    let referralMiningUser = gameUser
    let task
    let tokenChangeType = TokenChangeType.Payout

    // 更新连胜排行榜
    let number = ['harvest', 'bumper_harvest'].includes(round.userData.result.res.res.name) ? 1 : 0
    await addRankingNumber({user: {_id: gameUser._id, username: gameUser.username}, number: number, type: RankingType.weekPlantHarvest}, session)

    if (round.userData.taskInfo) {
        task = BountyTask.findOne({_id: round.userData.taskInfo._id}, {session})
        if (!task) {
            throw new Meteor.Error(500, errorCodes.BountyTaskInvalid)
        }
        miningUser = await Meteor.users.findOne({_id: task.publisher}, {session})
        if (task.requirements.mode === 1) {
            gameUser = miningUser
            referralMiningUser = miningUser
            tokenChangeType = TokenChangeType.BountyTaskPayout
        }
    }

    let token = {_id: round.userData.seed.token}
    // 自动出售
    if (round.userData.seed.autoSale) {
        await addBalance({
            user: gameUser,
            amount: round.userData.result.totalPayout,
            token,
            type: tokenChangeType,
            userData: round
        }, session)
    } else {
        await addArticle({
            user: gameUser._id,
            articleId: round.userData.seed.harvestArticle,
            number: Decimal(round.userData.seed.harvest).mul(round.userData.result.payout).mul(Decimal(round.userData.number)),
            type: ArticleRecordType.Harvest,
            userData: round
        }, session)
    }

    await miningByReferral({
        user: referralMiningUser,
        token,
        land: round.userData.slot.land,
        amount: round.userData.seed.price.times(round.userData.number),
        userData: round
    }, session)

    // 基金池
    await fundPoolChangeByLand({
        land: round.userData.slot.land,
        amount: round.userData.seed.price.times(round.userData.number),
        userData: round
    }, session)

    let mineInfo = await miningByLand({
        user: miningUser,
        token,
        land: round.userData.slot.land,
        amount: round.userData.seed.price.times(round.userData.number),
        userData: round
    }, session)
    if (task) {
        let userData = {
            type: 'harvest',
            number: round.userData.number,
            harvestAmount: round.userData.result.totalPayout,
            harvestToken: token._id,
            mineToken: mineInfo && mineInfo.token ? mineInfo.token : '',
            mineAmount: mineInfo && mineInfo.amount ? mineInfo.amount : Decimal('0')
        }
        await checkLeaseTaskProgress(task, gameUser, userData, session)
    }
    return mineInfo ? mineInfo.amount : null
}
export const harvest = async function (roundId) {
    let roundResult = null;
    await transaction.run(async (session) => {
        // 获取游戏数据
        let round = await GameRound.findOne(
            {_id: roundId, "userData.state": CultivationState.Waiting}, {session})
        if (!round)
            throw new Meteor.Error(500, errorCodes.GameRoundInvalid)
        // 生成结果
        let result = await createResult(round)
        // 数据存储
        let res = await GameRound.findOneAndUpdate(
            {_id: roundId, "userData.state": CultivationState.Waiting},
            {
                $set: {
                    "userData.state": CultivationState.Done,
                    "userData.result": result,
                    status: GameRoundStatus.Ended
                }
            },
            {session, returnOriginal: false})
        if (res.ok !== 1 || res.lastErrorObject.n !== 1) {
            throw new Meteor.Error(500, errorCodes.GameRoundInvalid)
        }
        // 结算
        let miningAmount = await settle(res.value, session)
        // 插槽释放
        let r = await LandSlot.findOneAndUpdate(
            {_id: res.value.userData.slot._id, user: res.value.userData.slot.user},
            {$unset: {roundId: ""}}, {session}
        )
        if (r.ok !== 1 || r.lastErrorObject.n !== 1) {
            throw new Meteor.Error(500, errorCodes.ReleaseSlotError)
        }
        roundResult = res.value
        roundResult.miningAmount = miningAmount
    })
    return roundResult
}

// 任务种子
const purchaseTaskSeeds = async function (seedId, number, user, taskId, session) {
    let seed = await Seed.findOne({_id: seedId, active: true}, {session})
    if (!seed) {
        throw new Meteor.Error(500, errorCodes.SeedInvalid)
    }

    if (number > 0) {
        let totalPrice = seed.price.times(number)
        let token = getToken({id: seed.token, active: true})
        await removeBalance({
            user, amount: totalPrice, token, type: TokenChangeType.BountyTaskFreeze,
            userData: {taskId, seedId, number}
        }, session)
    }
}

// 发布土地租赁任务
export const publishLeaseTask = async function (taskRule, rules, taskId, user, session) {
    check(rules.mode, Number)   //0-借地， 1-打工
    check(rules.landId, String)
    check(rules.timeLimit, Number)
    check(rules.level, Number)
    check(rules.seed, String)

    let res = await NonFungibleTokenItem.findOneAndUpdate(
        {_id: rules.landId, user: user._id, disable: {$ne: true}, "state.lend": {$ne: true}},
        {$set: {"state.lend": true}}, {session}
    )
    if (res.ok !== 1 || res.lastErrorObject.n !== 1) {
        throw new Meteor.Error(500, errorCodes.LandInvalid)
    }

    const land = NonFungibleTokenItem.findOne({_id: rules.landId}, {session})
    let mode = taskRule.rules.mode[rules.mode]
    let rewards = mode.level[rules.level].rewards

    if (mode.type === 'work') {
        await purchaseTaskSeeds(rules.seed, mode.level[rules.level].seedsCount, user, taskId, session)
    }

    let requirements = {
        land: land,
        seed: rules.seed,
        mode: rules.mode,
        timeLimit: rules.timeLimit
    }

    let progress = {
        "seedsCount": mode.level[rules.level].seedsCount,
        "cultivatedCount": 0
    }

    return {
        requirements: requirements,
        progress: progress,
        rewards: rewards,
    }
}

// 关闭租赁任务
export const closeLeaseTask = async function (task, user, session) {

    await recycleLand(task, session)
    if (task.requirements.mode === 1) {
        let article = Article.findOne({linkedId: task.requirements.seed}, {session})
        await addArticle({
            user: user._id,
            articleId: article._id,
            number: task.progress.seedsCount - task.progress.cultivatedCount,
            type: ArticleRecordType.BountyTaskReturn
        }, session)
    }
}

// 更新任务进度
const updateLeaseTaskProgress = async function (task, user, number, session) {
    let res = await BountyTask.findOneAndUpdate({
        _id: task._id,
        receiver: user._id,
    }, {
        $inc: {"progress.cultivatedCount": number},
    }, {session, returnOriginal: false});
    if (!res || res.ok !== 1 || res.lastErrorObject.n !== 1)
        throw new Meteor.Error(500, errorCodes.SeedNumberInvalid)
    return res.value
}

// 回收土地
const recycleLand = async function (task, session) {
    let itemRes = await NonFungibleTokenItem.findOneAndUpdate({
        _id: task.requirements.land._id,
        user: task.publisher
    }, {$set: {'disable': false, 'state.lend': false}}, {session})
    if (itemRes.ok !== 1 || itemRes.lastErrorObject.n !== 1) {
        throw new Meteor.Error(500, errorCodes.LandInvalid)
    }

    if (task.status === BountyTaskStatus.InProgress) {
        let slotRes = await LandSlot.findOneAndUpdate(
            {'land._id': task.requirements.land._id},
            {$unset: {land: ""}}, {session}
        )
        /*if (slotRes.ok !== 1 || slotRes.lastErrorObject.n !== 1) {
            throw new Meteor.Error(500, errorCodes.SlotInvalid)
        }*/
    }
}

// 检查任务进度
const checkLeaseTaskProgress = async function (task, user, userData, session) {
    if (userData.type === 'cultivate') {
        if (task.status !== BountyTaskStatus.InProgress || task.deadLine <= new Date()) {
            throw new Meteor.Error(500, errorCodes.BountyTaskInvalid)
        }
        if (task.progress.seedsCount - task.progress.cultivatedCount < userData.number) {
            throw new Meteor.Error(500, errorCodes.SeedNumberInvalid)
        }
        return await updateLeaseTaskProgress(task, user, userData.number, session)
    }

    if (userData.type === 'harvest') {
        let updateData = {
            "extraData.harvestToken": userData.harvestToken,
            "extraData.mineToken": userData.mineToken
        }
        if (task.progress.seedsCount === task.progress.cultivatedCount) {
            updateData.status = BountyTaskStatus.Done
            updateData.finishedAt = new Date()
            await recycleLand(task, session)
        }
        // 更新任务收益
        let updateRes = await BountyTask.findOneAndUpdate(
            {_id: task._id},
            {
                $set: updateData,
                $inc:
                    {
                        "extraData.harvestAmount": userData.harvestAmount,
                        "extraData.harvestCount": 1,
                        "extraData.harvestSeedsCount": userData.number,
                        "extraData.mineAmount": userData.mineAmount
                    },
            }, {session})
        if (updateRes.ok !== 1 || updateRes.lastErrorObject.n !== 1) {
            throw new Meteor.Error(500, errorCodes.TaskUpdateError)
        }

        /*if (task.progress.seedsCount > task.progress.cultivatedCount && task.deadLine < new Date()) {
            await closeTask(task, session)
        }*/
    }
}

// 自动结束租赁任务
export const autoFinishLeaseTask = async function (task) {
    let game = GameRound.findOne({status: GameRoundStatus.Started, 'userData.taskInfo._id': task._id})
    if (game) {
        if (game.userData.state === CultivationState.Start) {
            return
        }
        if (game.userData.state === CultivationState.Waiting) {
            logger.info(`auto harvest game:${game._id}, task:${task._id}, time:${new Date()}`)
            await harvest(game._id)
        }
    } else {
        await transaction.run(async (session) => {
            await closeTask(task, session)
        })

        await autoPublishLeaseTask(task)
    }
}

/**自动发布租赁任务**/
export const autoPublishLeaseTask = async function (task) {
    if (task.requirements.mode === 1 || task.fake) {
        return
    }

    if (settings.bountyTask.failedAutoPublish || task.requirements.autoPublish) {
        try {
            let publisher = Meteor.users.findOne({_id: task.publisher})
            await publishTask(task.ruleId, task.params, publisher)
            logger.info(`auto repub task ${task._id}`)
        } catch (e) {
            logger.error(`task ${task._id} repub failed, error:${e}`)
        }
    }
}