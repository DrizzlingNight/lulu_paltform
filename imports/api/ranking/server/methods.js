import {Ranking} from "../collection";
import {marbleMethods} from "../../../utils/methods";
import {getMetaDataByRankingType, getRankingConfig} from "./services";


marbleMethods({
    /**
     * @api {call}  Meteor.call("getRankingList",rankingType,{limit=10,sort=-1,start=undefined},callback) 排行榜
     * @apiVersion  0.1.0
     * @apiGroup    ranking
     * @apiName     排行榜
     *
     * @apiParam    {String}     rankingType    排行榜类型 week-mining 周挖矿排行榜
     * @apiParam    {Number}     start          排行榜标记时间 默认undefined
     * @apiParam    {Number}     limit          排行榜长度 默认10
     * @apiParam    {Number}     sort           排行榜排序 默认-1 -1从高到低 1从低到高
     *
     * @apiSuccess  {Object}     rankList                                   排行榜列表
     * @apiSuccess  {Number}     rankList.start                             本周起始时间
     * @apiSuccess  {Object}     rankList.user                              用户信息
     * @apiSuccess  {String}     rankList.user._id                          用户信息
     * @apiSuccess  {String}     rankList.user.username                     用户名称
     * @apiSuccess  {Decimal}    rankList.number                            排行榜数据
     * @apiSuccess  {Number}     rankList.update                            更新时间
     * @apiSuccess  {Number}     rankList.rank                              排名
     * @apiSuccess  {Number}     rankList.update                            更新时间
     * @apiSuccess  {String}     rankList.buyback_token                     回购币种
     * @apiSuccess  {Number}     rankList.buyback_quota                     回购额度
     * @apiSuccessExample {json} Success-Response:
     [
         {
            "_id": {
                "_str": "62447f403e1820620110b3c9"
            },
            "start": 1648339200,
            "type": "week-mining",
            "user": {
                "_id": "vgtDSaZjWaixemjA1",
                "username": "0x75c553512539cbff6611866e2bb5e8a7a68da604"
            },
            "number": "50",
            "update": 1648655753,
            "rank": 1,
            "buyback_token": "LUCK",
            "buyback_quota": 10000
        }
     ]
     */
    getRankingList: async function(rankingType, options=undefined) {
        let start = options && options.start || undefined
        let limit = options && options.limit || 10
        let sort = options && options.sort || -1

        let config = await getRankingConfig(rankingType);
        let ranking = Ranking.find(getMetaDataByRankingType(rankingType, start), {sort:{number: sort, update:1}, limit}).fetch()
        for (let i = 0; i < ranking.length; i++) {
            ranking[i] = {...ranking[i], ...config[i]}
        }
        return ranking
    },
});
