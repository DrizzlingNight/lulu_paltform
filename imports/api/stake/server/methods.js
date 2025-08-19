import {
    stakeOrRedeemNFT,
    stakeOrRedeemToken,
    getMyStakeInfo,
    getMyCanStakeLand,
    getMyStakedLand,
    harvestBonus, getLastRedeem, cancelRedeem
} from './service'
import {
    StakePoolChangeType
} from '../collections';
import {
    marbleMethods
} from "/imports/utils/methods";
import { errorCodes } from "../../../settings/errorCodes";


marbleMethods({

    /**
     * @api {call}  Meteor.call("stakeMyNFT",landId,callback) 质押NFT
     * @apiVersion  0.1.0
     * @apiGroup    stake
     * @apiName     质押NFT
     *
     * @apiParam    {String}     landId    土地Id
     *
     * @apiSuccessExample {json} Success-Response:
     {
         code: 0,
         message: 'successs'
     }
     */
    stakeMyNFT: async function (params) {
        if (!Meteor.userId()) {
            throw new Meteor.Error(401, errorCodes.LoginRequired);
        }
        let user = Meteor.user()
        return await stakeOrRedeemNFT({
            landId: params.landId,
            user,
            type: StakePoolChangeType.StakeLand
        })
    },

    /**
     * @api {call}  Meteor.call("redeemMyNFT",landId,callback) 赎回NFT
     * @apiVersion  0.1.0
     * @apiGroup    stake
     * @apiName     赎回NFT
     *
     * @apiParam    {String}     landId    土地Id
     *
     * @apiSuccessExample {json} Success-Response:
     {
         code: 0,
         message: 'successs'
     }
     */
    redeemMyNFT: async function (landId) {
        if (!Meteor.userId()) {
            throw new Meteor.Error(401, errorCodes.LoginRequired);
        }
        let user = Meteor.user()
        return await stakeOrRedeemNFT({
            landId,
            user,
            type: StakePoolChangeType.RedeemLand
        })
    },
    /**
     * @api {call}  Meteor.call("stakeToken",amount,callback) 质押Token
     * @apiVersion  0.1.0
     * @apiGroup    stake
     * @apiName     质押LUCK
     *
     * @apiParam    {String}     amount    数量
     *
     * @apiSuccessExample {json} Success-Response:
     {
         code: 0,
         message: 'successs'
     }
     */
    stakeToken: async function (amount) {
        if (!Meteor.userId()) {
            throw new Meteor.Error(401, errorCodes.LoginRequired);
        }
        let user = Meteor.user()
        return await stakeOrRedeemToken({
            type: StakePoolChangeType.StakeToken,
            amount,
            user
        })
    },
    /**
     * @api {call}  Meteor.call("redeemToken",amount,callback) 赎回Token
     * @apiVersion  0.1.0
     * @apiGroup    stake
     * @apiName     赎回质押的token
     *
     * @apiParam    {Object}     amount    数量
     *
     * @apiSuccessExample {json} Success-Response:
     {
         code: 0,
         message: 'successs'
     }
     */
    redeemToken: async function (amount) {
        if (!Meteor.userId()) {
            throw new Meteor.Error(401, errorCodes.LoginRequired);
        }
        let user = Meteor.user()
        return await stakeOrRedeemToken({
            type: StakePoolChangeType.RedeemToken,
            amount,
            user
        })
    },
    cancelRedeem: async function () {
        if (!Meteor.userId()) {
            throw new Meteor.Error(401, errorCodes.LoginRequired);
        }
        return await cancelRedeem(Meteor.userId())
    },
    getLastRedeem: async function () {
        if (!Meteor.userId()) {
            throw new Meteor.Error(401, errorCodes.LoginRequired);
        }
        return await getLastRedeem(Meteor.userId())
    },
    /**
     * @api {call}  Meteor.call("getMyStakeInfo",null,callback) 获取我的质押token/余额
     * @apiVersion  0.1.0
     * @apiGroup    stake
     * @apiName     获取我的余额和质押的token
     *
     * @apiSuccess {Number} data.stake 已经质押
     * @apiSuccess {Number} data.balance 余额
     * @apiSuccess {Number} data.hashrate 我的算力
     * @apiSuccess {String} data.token 质押的token币种
     * @apiSuccess {Number} data.hashrateGrowth 算力提升
     * @apiSuccess {Number} data.bonus 我的分红
     * @apiSuccess {Number} data.availableBonus 可领取的分红
     * @apiSuccess {Number} data.historyDivAmount 我的历史分红
     * @apiSuccessExample {json} Success-Response:
     * {
        code: 0,
        message: 'success',
        data: {
            stake: 0,
            balance: 0,
            hashrate: 0,
            token: 'LUCK',
            hashrateGrowth: 0.1,
            bonus: 0,
            availableBonus: 0,
            historyDivAmount: 0
        }
    }
     */
    getMyStakeInfo: async function () {
        if (!Meteor.userId()) {
            throw new Meteor.Error(401, errorCodes.LoginRequired);
        }
        let user = Meteor.user()
        return await getMyStakeInfo(user)
    },
    /**
     * @api {call}  Meteor.call("getMyStakedLand",where,callback) 获取我的已质押土地
     * @apiVersion  0.1.0
     * @apiGroup    stake
     * @apiName     获取我已经质押的土地
     *
     * @apiParam    {Object}     where    分页参数 {limit, offset}
     *
     */
    getMyStakedLand: async function (where) {
        if (!Meteor.userId()) {
            throw new Meteor.Error(401, errorCodes.LoginRequired);
        }
        let user = Meteor.user()
        return await getMyStakedLand({
            user,
            where
        })
    },
    /**
     * @api {call}  Meteor.call("getMyCanStakeLand",where,callback) 获取我的可质押土地
     * @apiVersion  0.1.0
     * @apiGroup    stake
     * @apiName     获取我可以质押的土地
     *
     * @apiParam    {Object}     where    分页 {limit, offset}
     *
     */
    getMyCanStakeLand: async function (where) {
        if (!Meteor.userId()) {
            throw new Meteor.Error(401, errorCodes.LoginRequired);
        }
        let user = Meteor.user()
        return await getMyCanStakeLand({
            user,
            where
        })
    },

    /**
     * @api {call}  Meteor.call("harvestBonus",null,callback) 领取分红
     * @apiVersion  0.1.0
     * @apiGroup    stake
     * @apiName     领取分红
     *
     *
     */
    harvestBonus: async function () {
        if (!Meteor.userId()) {
            throw new Meteor.Error(401, errorCodes.LoginRequired);
        }
        let user = Meteor.user()
        return await harvestBonus({
            user
        })
    }
});
