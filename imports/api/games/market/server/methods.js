import {marbleMethods} from "/imports/utils/methods";
import {bindLandAndSlot, buildTaskInfo, getLandNftId, getUsersMarket, harvest, startCultivate} from "./services";
import {errorCodes} from "../../../../settings/errorCodes";
import {NonFungibleTokenItem} from "../../../nft/collections";
import {CultivationState, GameName, Seed, SettleDirection, SettleType} from "../collections";
import {GameRound} from "../../collections";
import {getLandReserves} from "../../../mining/server/service";
import {getLeaseLandIds, getLeaseLands} from "../../../nft/server/service";
import {getGame} from "../../utils";
import {getArticles} from "../../article/server/services";
import {BinanceMarketStream} from "../../../binanceMarketStreams/collections";
import {BountyTask, BountyTaskStatus} from "../../../bountyTasks/collections";

marbleMethods({
    /**
     * @api {call} Meteor.call("getMarket",callback) 获取农场插槽
     * @apiVersion 0.1.0
     * @apiGroup game
     * @apiName 获取农场插槽
     *
     * @apiSuccess {Array} List 开启的农场插槽列表
     * @apiSuccess {String} List._id 插槽id
     * @apiSuccess {String} List.user 插槽所属于的用户id
     * @apiSuccess {Number} List.position 插槽的位置编号
     * @apiSuccess {Object} List.land 插槽绑定的土地
     * @apiSuccessExample {json} Success-Response:
     [
     {
        "_id": "YKmsJYKjitwaDRbqE",
        "user": "hotRuFYZc7YZW9cAP",
        "position": 0,
        "land": {
            "_id": {
                "_str": "61d6ef3953fae60b04f59c87"
            },
            "nftId": "61c04f78cd117d10572c88cf",
            "info": {
                "nftPool": {
                    "_id": {
                        "_str": "61d43244716600006c004c98"
                    },
                    "nftId": "61c04f78cd117d10572c88cf",
                    "info": {
                        "name": "A",
                        "level": 4,
                        "harvest": {
                            "foison": 6,
                            "normal": 5,
                            "poor": 3
                        },
                        "hashrate": 200,
                        "probability": 30,
                        "type": 1,
                        "idPrefix": "AF"
                    },
                    "total": 30,
                    "nDefined": 13,
                    "bboxId": "61c04901a8290e4b3e2a4494",
                    "nftPoolId": "61d4392f716600006c004ca0",
                    "active": true
                }
            },
            "user": "hotRuFYZc7YZW9cAP",
            "state": {
                "internal": true,
                "mint": false,
                "idOnChain": "AF0048"
            },
            "createdAt": "2022-01-06T13:31:37.684Z"
        }
    },{
        "_id": "QYHokAzNCwnXRPfKz",
        "user": "hotRuFYZc7YZW9cAP",
        "position": 1
    }]
     */
    getMarket: async function () {
        if (!Meteor.userId()) {
            throw new Meteor.Error(401);
        }
        let user = Meteor.user()
        return await getUsersMarket(user)
    },
    /**
     * @api {call}  Meteor.call("getLandList",where,callback) 获取可用土地列表
     * @apiVersion  0.1.0
     * @apiGroup    game
     * @apiName     获取可用土地列表
     *
     * @apiParam    {Object}    where={}        分页参数
     * @apiParam    {Number}    where.offset    偏移
     * @apiParam    {Number}    where.limit     每页数量
     *
     * @apiSuccess  {Number}     count 可用土地总数
     * @apiSuccess  {Array}      List 可用土地列表
     * @apiSuccess  {String}     List._id 土地id
     * @apiSuccess  {String}     List.user 土地所属于的用户id
     * @apiSuccess  {Object}     List.state 土地状态
     * @apiSuccess  {Object}     List.nftId 土地对应的nft的id
     * @apiSuccess  {Object}     List.info 土地信息
     * @apiSuccess  {Object}     List.info.nftPool 土地信息
     * @apiSuccess  {Object}     List.info.nftPool.info 土地信息
     * @apiSuccess  {String}     List.info.nftPool.info.name 土地名称
     * @apiSuccess  {Number}     List.info.nftPool.info.level 土地等级
     * @apiSuccess  {Number}     List.info.nftPool.info.type 土地类型
     * @apiSuccess  {Number}     List.info.nftPool.info.hashrate 算力
     * @apiSuccess  {Object}     List.info.nftPool.info.harvest 收成星级 1是半颗星
     * @apiSuccess  {Number}     List.info.nftPool.info.harvest.foison 大丰收
     * @apiSuccess  {Number}     List.info.nftPool.info.harvest.normal 丰收
     * @apiSuccess  {Number}     List.info.nftPool.info.harvest.poor 歉收
     * @apiSuccess  {Date}       List.createdAt 土地创建日期
     * @apiSuccessExample {json} Success-Response:
     {
        "count": 12,
        "list": [{
        "_id": "61e00cbaf1608522b9fa4d5f",
        "nftId": "61c04f78cd117d10572c88cf",
        "info": {
            "nftPool": {
                "_id": "1_3",
                "nftId": "61c04f78cd117d10572c88cf",
                "total": 30,
                "nDefined": 11,
                "bboxId": 1,
                "active": true,
                "nftPoolId": 4,
                "info": {
                    "name": "A",
                    "level": 4,
                    "type": 1,
                    "hashrate": 200,
                    "harvest": {
                        "foison": 6,
                        "normal": 5,
                        "poor": 3
                    },
                    "idPrefix": "AF"
                }
            }
        },
        "user": "hotRuFYZc7YZW9cAP",
        "state": {
            "internal": true,
            "mint": false,
            "idOnChain": "AF0049"
        },
        "createdAt": "2022-01-13T11:27:54.834Z"
     }]}
     */
    getLandList: async function (where = {}) {
        if (!Meteor.userId()) {
            throw new Meteor.Error(401, errorCodes.LoginRequired);
        }
        let selector = {
            user: Meteor.userId(),
            disable: {$ne: true},
            "state.lend": {$ne: true},
            nftId: getLandNftId()
        }
        const list = NonFungibleTokenItem.find(selector, {
            sort: {'info.nftPool.info.level': 1, createdAt: -1},
            skip: where.skip,
            limit: where.limit
        }).fetch()
        const count = NonFungibleTokenItem.find(selector).count()
        for (let i in list) {
            list[i].reserves = await getLandReserves(list[i])
        }

        const leaseLands = await getLeaseLands(Meteor.user())
        return {leaseLands, list, count: count}
    },
    /**
     * @api {call}  Meteor.call("getLandReserves",landId,callback) 获取土地矿藏
     * @apiVersion  0.1.0
     * @apiGroup    game
     * @apiName     获取土地矿藏
     *
     * @apiParam    {String}    landId        土地Id
     *
     * @apiSuccess  {Decimal}     total      今日已挖矿数量
     * @apiSuccess  {Decimal}      reservse   当日最大挖矿数量
     * @apiSuccessExample {json} Success-Response:
     {
        "_id": "61d6ec8aa9de9cf640051e0c",
        "total": "100",
        "reservse": "100"
     }
     */
    getLandReserves: async function (landId) {
        if (!Meteor.userId()) {
            throw new Meteor.Error(401, errorCodes.LoginRequired);
        }
        let land = NonFungibleTokenItem.findOne({_id: landId})
        if (!land || land.user !== Meteor.userId())
            throw new Meteor.Error(401, errorCodes.LandInvalid);
        return getLandReserves(land)
    },
    /**
     * @api {call}  Meteor.call("bindLand",slotId,landId,callback) 绑定土地和插槽
     * @apiVersion  0.1.0
     * @apiGroup    game
     * @apiName     绑定土地和插槽
     *
     * @apiParam    {String}     slotId    分页参数
     * @apiParam    {String}     landId    偏移
     *
     */
    bindLand: async function (slotId, landId) {
        if (!Meteor.userId()) {
            throw new Meteor.Error(401);
        }
        let user = Meteor.user()
        return await bindLandAndSlot(user, slotId, landId)
    },
    /**
     * @api {call}  Meteor.call("getSeedList",where,callback) 获取种子列表
     * @apiVersion  0.1.0
     * @apiGroup    game
     * @apiName     获取种子列表
     *
     * @apiParam    {Object}    where={}        分页参数
     * @apiParam    {Number}    where.offset    偏移
     * @apiParam    {Number}    where.limit     每页数量
     *
     * @apiSuccess  {Number}     count                  可用种子总数
     * @apiSuccess  {Array}      List                   可用种子列表
     * @apiSuccess  {String}     List._id               种子的唯一标识
     * @apiSuccess  {String}     List.token             购买种子需要的币种
     * @apiSuccess  {Decimal}    List.price             种子价格
     * @apiSuccess  {String}     List.name              种子名称
     * @apiSuccess  {Number}     List.pendingTime       种子成熟时间
     * @apiSuccess  {Number}     List.harvest           种子预期产能
     * @apiSuccess  {Number}     List.selling_price     产物售价
     * @apiSuccess  {Number}     List.selling_token     产物出售币种
     * @apiSuccess  {Number}     List.max_num           最大数量
     * @apiSuccess  {Number}     List.min_num           最小数量
     * @apiSuccessExample {json} Success-Response:
     {
            "list": [
                {
                    "_id": "primary_grape",
                    "name": "primary grape",
                "price": "1",
                    "token": "LUSD",
                    "pendingTime": 300,
                    "harvest": 0.5,
                    "selling_price": 2,
                    "selling_token": "LUSD",
                "active": true,
                "max_num": 1000,
                "min_num": 1
                }
            ],
            "count": 1
         }
     */
    getSeedList: async function (where) {
        if (!Meteor.userId()) {
            throw new Meteor.Error(401, errorCodes.LoginRequired);
        }
        let selector = {
            active: true
        }
        const list = Seed.find(selector, {skip: where.offset, limit: where.limit}).fetch()
        const count = Seed.find(selector).count()
        return {list: list, count: count}
    },
    /**
     * @api {call}  Meteor.call("getAllInfo",landId,callback) 种植页面数据获取
     * @apiVersion  0.1.0
     * @apiGroup    game
     * @apiName     种植页面数据获取
     *
     * @apiParam    {String}    landId        土地id
     *
     * @apiSuccess  {Array}      seedList               种子列表
     * @apiSuccess  {Object}     landReserves           土地矿储
     * @apiSuccess  {Array}     articles               持有种子列表
     * @apiSuccessExample {json} Success-Response:
     {
        "seedList": [
            {
                "_id": "primary_grape",
                "name": "primary grape",
                "price": "1",
                "token": "LUSD",
                "pendingTime": 60,
                "harvest": 0.5,
                "selling_price": 2,
                "selling_token": "LUSD",
                "active": true,
                "max_num": 1000,
                "min_num": 1
            }
        ],
        "landReserves": {
            "_id": "61de826e1785d600077d56a9",
            "total": "200",
            "reserves": "200"
        },
        "articles": []
    }
     */
    getAllInfo: async function (landId) {
        if (!Meteor.userId()) {
            throw new Meteor.Error(401, errorCodes.LoginRequired);
        }
        let selector = {
            active: true
        }

        let leaseLandIds = await getLeaseLandIds(Meteor.user())
        let land = NonFungibleTokenItem.findOne({
            "$and":
                [
                    {_id: landId, disable: true},
                    {"$or": [{user: Meteor.userId()}, {_id: {$in: leaseLandIds}, 'state.lend': true}]}
                ]
        })
        if (!land)
            throw new Meteor.Error(401, errorCodes.LandInvalid);

        let taskInfo = {}
        let task = BountyTask.findOne({
            status: BountyTaskStatus.InProgress,
            receiver: Meteor.userId(),
            'requirements.land._id': land._id
        })
        if (task) {
            taskInfo = buildTaskInfo(task)
        }

        return {
            seedList: Seed.find(selector).fetch(),
            landReserves: await getLandReserves(land),
            articles: await getArticles(Meteor.user(), ["seed"]),
            taskInfo: taskInfo
        }
    },
    /**
     * @api {call}  Meteor.call("startCultivate",slotId,seedId,number,settleDirection,callback) 开始耕种
     * @apiVersion  0.1.0
     * @apiGroup    game
     * @apiName     开始耕种
     *
     * @apiParam    {String}     slotId    插槽id
     * @apiParam    {String}     seedId    种子id
     * @apiParam    {String}     number    数量
     * @apiParam    {Number}     settleDirection    方向 1涨 -1跌
     *
     * @apiError    500-40003        种子不可用
     * @apiError    401-10102        需要登录
     * @apiError    500-40001        插槽不可用
     */
    startCultivate: async function (slotId, seedId, number, settleDirection = SettleDirection.up) {
        check(number, Number)
        if (!number >= 1) {
            throw new Meteor.Error(500, errorCodes.SeedInvalid)
        }
        if (!Meteor.userId()) {
            throw new Meteor.Error(401, errorCodes.LoginRequired);
        }
        let user = Meteor.user()
        await new Promise(resolve => setTimeout(resolve, 500))
        return startCultivate(user, slotId, seedId, number, settleDirection)
    },
    /**
     * @api {call}  Meteor.call("harvest",roundId,callback) 收获
     * @apiVersion  0.1.0
     * @apiGroup    game
     * @apiName     收获
     *
     * @apiParam    {String}     roundId    游戏当前局id
     *
     * @apiError    401-10102        需要登录
     * @apiError    500-40005        roundId不可用
     *
     * @apiSuccess  {Object}     gameRound                                  游戏当前局
     * @apiSuccess  {String}     gameRound._id                              当前游戏局唯一标识
     * @apiSuccess  {Object}     gameRound.game                             游戏基本信息
     * @apiSuccess  {Object}     gameRound.userData                         本局游戏信息
     * @apiSuccess  {Object}     gameRound.userData.result                  本局游戏结果
     * @apiSuccess  {Decimal}     gameRound.userData.result.totalPayout      本局游戏收益
     * @apiSuccess  {String}     gameRound.userData.result.res              本局游戏结果
     * @apiSuccess  {String}     gameRound.userData.result.res.res          本局游戏结果
     * @apiSuccess  {String}     gameRound.userData.result.res.res.name     本局游戏结果 harvest丰收 bumper_harvest大丰收 poor_harvest歉收
     * @apiSuccessExample {json} Success-Response:
     {
        "_id": "qKapA23LRPgpRyDRe",
        "game": {
            "_id": "market",
            "name": "lulu market",
            "active": true,
            "type": 2,
            "landNftId": "61c04f78cd117d10572c88cf"
        },
        "status": 1,
        "userData": {
            "result": {
                "res": {
                    "resultHash": "f5ecca60f0401492c84207f5cfbb74188c960a51fd6eaa5859d8d7fe37cecf0c",
                    "resNumber": 963,
                    "res": {
                        "name": "harvest",
                        "min": "1.15",
                        "max": "0.95"
                    },
                    "leftHash": "f5ecca60f0401492c84207f5cfbb74188c960a51fd6eaa5859d8d7fe37cec"
                },
                "solt": {
                    "resultHash": "f5ecca60f0401492c84207f5cfbb74188c960a51fd6eaa5859d8d7fe37cec",
                    "resNumber": 827,
                    "res": 0.20675,
                    "leftHash": "f5ecca60f0401492c84207f5cfbb74188c960a51fd6eaa5859d8d7fe37"
                },
                "payout": "0.60865",
                "totalPayout": "0.60865"
            }
        },
        "gameId": 100043,
        "seed": "e44997401d3c65f713ba99d33ccc18c6",
        "seedHash": "93dc50dc8e15b04fc07b56e45a3dd33fb0d0ddcf6603b864861b69819c1251f6",
        "createdAt": "2022-01-19T12:19:17.009Z",
        "resultHash": "f5ecca60f0401492c84207f5cfbb74188c960a51fd6eaa5859d8d7fe37cecf0c",
        "miningAmount": "1"
    }
     */
    harvest: async function (roundId) {
        if (!Meteor.userId()) {
            throw new Meteor.Error(401, errorCodes.LoginRequired);
        }
        let round = await GameRound.findOne(
            {
                _id: roundId, "userData.state": CultivationState.Waiting,
                "userData.slot.user": Meteor.userId()
            })
        if (!round) {
            throw new Meteor.Error(500, errorCodes.GameRoundInvalid)
        }
        return await harvest(roundId)
    },
    /**
     * @api {call}  Meteor.call("setUserSettleType",type,callback) 设置用户默认结算方式
     * @apiVersion  0.1.0
     * @apiGroup    game
     * @apiName     设置用户默认结算方式
     *
     * @apiParam    {Number}     type    结算方式 0随机 1比特风 2以太雨
     *
     * @apiError    401-10102        需要登录
     * @apiError    404-10404        type不匹配
     */
    setUserSettleType: async function (type) {
        if (!Meteor.userId()) {
            throw new Meteor.Error(401, errorCodes.LoginRequired);
        }
        if (!SettleType.getName(type)) {
            throw new Meteor.Error(404, errorCodes.ObjNotFound);
        }
        Meteor.users.update({_id: Meteor.userId()}, {$set: {"userSettings.settleType": type}})
    },
    /**
     * @api {call}  Meteor.call("setUserPendingTime",time,callback) 设置用户默认成熟时间
     * @apiVersion  0.1.0
     * @apiGroup    game
     * @apiName     设置用户默认成熟时间
     *
     * @apiParam    {Number}     time    结算方式 1 3 5 10 30 分钟
     *
     * @apiError    401-10102        需要登录
     * @apiError    404-10404        time不匹配
     */
    setUserPendingTime: async function (time) {
        if (!Meteor.userId()) {
            throw new Meteor.Error(401, errorCodes.LoginRequired);
        }
        let game = getGame(GameName)
        if (!game || !game.pendingTimeList || game.pendingTimeList.indexOf(time) < 0) {
            throw new Meteor.Error(404, errorCodes.ObjNotFound);
        }
        Meteor.users.update({_id: Meteor.userId()}, {$set: {"userSettings.pendingTime": time}})
    },
    testMarket: function (symbol, sort) {
        let now = new Date().getTime()
        let res = BinanceMarketStream.findOne({symbol, T: {$gte: (now - 1500)}},
            {sort: {p: sort}, limit: 1});
        let tmp = BinanceMarketStream.findOne({symbol}, {sort: {T: -1}, limit: 1})
        return {res, tmp, now}
    }
});
