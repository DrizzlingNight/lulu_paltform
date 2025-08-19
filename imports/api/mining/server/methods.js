import {marbleMethods} from "/imports/utils/methods";
import {getAllMiningInfo} from "./service";
import {getHotUpdateConf} from "../../hotUpdateConf/services";
import {MiningPool} from "../collections";
import {TokenChange, TokenChangeType} from "../../tokens/collections";
import {Decimal} from "meteor/mongo-decimal";

marbleMethods({
    /**
     * @api {call} Meteor.call("getMiningInfo",callback) 获取挖矿信息
     * @apiVersion 0.1.0
     * @apiGroup mining@stake
     * @apiName 获取挖矿信息
     *
     * @apiSuccessExample {json} Success-Response:
     *
     {
        "mine": {
            "total": "15437.5",
            "thresholds": [
                {
                    "_id": {
                        "_str": "61eec3e0211ffe000749df7d"
                    },
                    "total": "0",
                    "token": "LUSD",
                    "rate": "1"
                },
                {
                    "_id": {
                        "_str": "61eec3e0211ffe000749df7e"
                    },
                    "total": "100000",
                    "token": "LUSD",
                    "rate": "0.95"
                },
                {
                    "_id": {
                        "_str": "61eec3e0211ffe000749df7f"
                    },
                    "total": "200000",
                    "token": "LUSD",
                    "rate": "0.9025"
                }
            ]
        },
        "referral": {
            "total": "2932.7",
            "thresholds": [
                {
                    "_id": {
                        "_str": "61eec3e0211ffe000749df7d"
                    },
                    "total": "0",
                    "token": "LUSD",
                    "rate": "1"
                },
                {
                    "_id": {
                        "_str": "61eec3e0211ffe000749df7e"
                    },
                    "total": "100000",
                    "token": "LUSD",
                    "rate": "0.95"
                },
                {
                    "_id": {
                        "_str": "61eec3e0211ffe000749df7f"
                    },
                    "total": "200000",
                    "token": "LUSD",
                    "rate": "0.9025"
                },
            ]
        }
    }
     */
    getMiningInfo: async function () {
        return getAllMiningInfo()
    },

    /**
     * @api {call} Meteor.call("getMiningProgress",callback) 挖矿页进度数据
     * @apiVersion 0.1.0
     * @apiGroup mining@stake
     * @apiName 挖矿页进度数据
     *
     * @apiSuccess  {Object}            progress
     * @apiSuccess  {String}            progress.mine                       挖矿进度
     * @apiSuccess  {String}            progress.referral                   邀请挖矿进度
     * @apiSuccess  {String}            progress.operation_amount           市场运营进度
     * @apiSuccess  {String}            progress.operation_unlock_amount    市场运营解锁量
     * @apiSuccess  {String}            progress.burn_amount                销毁进度
     * @apiSuccess  {String}            progress.fluidity_amount            流动性进度
     * @apiSuccess  {Object}            conf
     * @apiSuccess  {Number}            conf.total                          总发行量
     * @apiSuccess  {Number}            conf.mine_rate                      挖矿占比
     * @apiSuccess  {Number}            conf.referral_rate                  邀请挖矿占比
     * @apiSuccess  {Number}            conf.operation_rate                 市场运营占比
     * @apiSuccess  {Number}            conf.burn_rate                      销毁占比
     * @apiSuccess  {Number}            conf.fluidity_rate                  流动性占比
     * @apiSuccess  {Number}            conf.mine_operation_times           挖矿解锁运营倍率
     * @apiSuccess  {Number}            conf.referral_operation_times       邀请挖矿解锁运营倍率
     * @apiSuccessExample {json} Success-Response:
     {
        "progress": {
            "mine": "2531077.1725",
            "referral": "10000",
            "operation_amount": "400",
            "operation_unlock_amount": "425179.52875",
            burn_amount: "0",
            fluidity_amount: "0"
        },
        "conf": {
            "token": "LUCK",
            "total": 10000000000,
            "mine_rate": 0.6,
            "referral_rate": 0.15,
            "operation_rate": 0.1,
            "burn_rate": 0.1,
            "fluidity_rate": 0.05,
            "operation_amount": 0,
            "burn_amount": 0,
            "fluidity_amount": 0,
            "mine_operation_times": 6,
            "referral_operation_times": 3
        }
    }
     */
    getMiningProgress: async function (token = 'LUCK') {
        let hotUpdate = await getHotUpdateConf('luck_settings')
        let res = {}, progress = {}
        let conf = hotUpdate && hotUpdate[0] || {}
        let pools = MiningPool.find({token: token}).fetch()
        pools.forEach(pool => {
            progress[pool.type] = pool.total.toString()
        })
        let airdrops = await TokenChange.rawCollection().aggregate([
            {$match: {token: token, type: {$in: [TokenChangeType.Airdrop, TokenChangeType.TaskBonus]}}},
            {
                $group: {
                    _id: '$token',
                    total: {$sum: {$add: ['$changed']}}
                }
            }
        ]).toArray()
        airdrops.forEach(airdrop => {
            let operation_amount = conf.operation_amount ? Decimal(conf.operation_amount) : Decimal('0')
            progress.operation_amount = Decimal(airdrop.total.toString()).add(operation_amount).toString()
        })

        let mine_operation_amount = progress.mine && conf.mine_operation_times ? Decimal(progress.mine).div(Decimal(conf.mine_operation_times)) : Decimal('0')
        let referral_operation_amount = progress.referral && conf.referral_operation_times ? Decimal(progress.referral).div(Decimal(conf.referral_operation_times)) : Decimal('0')
        progress.operation_unlock_amount = mine_operation_amount.add(referral_operation_amount).toString()
        progress.burn_amount = conf.burn_amount && conf.burn_amount.toString() || '0'
        progress.fluidity_amount = conf.fluidity_amount && conf.fluidity_amount.toString() || '0'
        res.progress = progress
        res.conf = conf
        return res
    }
});
