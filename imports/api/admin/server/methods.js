import logging from "/imports/api/logging";
import {Decimal} from 'meteor/mongo-decimal';
import {marbleMethods} from "../../../utils/methods";
import assert from "assert";
import {
    canUserViewAdmin,
    isCurrentDeveloper,
    isCurrentUserAdmin,
    isSuperUserAdmin,
    isCurrentProxy,
    isCurrentService
} from "../../account/services";
import {
    checkProxyBuyback,
    getProxyBuybackOrders,
    getReferralList,
    plantStatistics,
    proxyBuyback
} from "../../referral/server/services";
import {Token, TokenChangeType} from "../../tokens/collections";
import {addBalance, getBalance, removeBalance, setUserJoinedGroup} from "../../account/server/service";
import {errorCodes} from "../../../settings/errorCodes";
import {createDefinedNft, moveNft} from "../../nft/server/service";
import {hotUploadStart, uploadFileData} from "../../hotUpdateConf/services";

import {
    fetchNFTItems,
    fetchTransactions,
    getBlanceHistory,
    getUsers,
    getMiningData,
    fetchArticleList,
    transferArticle,
    getTokenChangeHistorySum,
    banUser,
    getMoveNftHistory,
    getArticleHistory,
    getUserData,
    getGameHistory,
    getOrderHistory, 
    getUsersWeekly,
    getUsersCanBuyAmount
} from "./services";
import {NonFungibleTokenPool} from "../../nft/collections";
import {BlindBox} from '../../blindBox/collections'
import {migration} from "./migration";
import {Game} from "../../games/collections";
import {ArticleRecordType} from "../../games/article/collections";
import {transaction} from "../../core/database";
import {addArticle, getArticleRecordSum, removeArticle} from "../../games/article/server/services";
import {Article} from "../../games/article/collections";
import {getTaskProgress, updateTaskProgress} from "../../tasks/server/services";


const logger = logging.getLogger(module.id);

marbleMethods({
    /** @desc大代理數據 **/
    admin_getReferralList: async function (params) {
        assert.ok(canUserViewAdmin());
        return getReferralList(params)
    },

    /** @desc加餘額 **/
    admin_addBalance: async function ({userId, amount, tokenId, type = TokenChangeType.Airdrop, userData = {}}) {
        assert.ok(isCurrentUserAdmin());
        const user = Meteor.users.findOne({_id: userId})
        const token = await Token.$findOne({_id: tokenId})
        amount = Decimal(amount)
        return addBalance({user, amount, token, type, userData})
    },

    /** @desc減餘額 **/
    admin_removeBalance: async function ({
                                             userId,
                                             amount,
                                             tokenId,
                                             type = TokenChangeType.SystemChange,
                                             userData = {}
                                         }) {
        assert.ok(isCurrentUserAdmin());
        const user = Meteor.users.findOne({_id: userId})
        const token = await Token.$findOne({_id: tokenId})
        amount = Decimal(amount)
        return removeBalance({user, amount, token, type, userData})
    },

    /** nft转移 **/
    admin_moveNft: async function (nftId, newUser) {
        assert.ok(isSuperUserAdmin());
        const user = Meteor.users.findOne({$or: [{username: newUser}, {_id: newUser}]})
        if (!user)
            throw new Meteor.Error(500, errorCodes.InvalidUser)
        return await moveNft(nftId, user)
    },
    /** nft转移记录 */
    admin_getMoveNftHistory: async function (params) {
        assert.ok(isCurrentUserAdmin() || isCurrentService());

        return await getMoveNftHistory(params)
    },

    /** 获取用户列表 */
    admin_getUsers: async function ({search, offset, limit = 10, isFromAgent = false, role}) {
        assert.ok(isCurrentUserAdmin() || isCurrentService() || isCurrentProxy());

        return await getUsers({search, offset, limit, isFromAgent, role})
    },
    /** 改变某个用户的角色 */
    admin_changeUserRole: function ({user, role}) {
        assert.ok(isSuperUserAdmin());

        Roles.setUserRoles(user, [role])
    },

    /** 获取所有角色 */
    admin_getAllRoles: async function () {
        return await Meteor.roles.find({}).fetch()
    },

    /** 获取帐变记录 */
    admin_getBlanceHistory: async function (params) {
        assert.ok(isCurrentUserAdmin() || isCurrentProxy() || isCurrentService());

        const user = Meteor.user()
        return await getBlanceHistory({...params, user})
    },

    /** 获取帐变记录 */
    admin_getTransactionHistory: async function (params) {
        assert.ok(isCurrentUserAdmin() || isCurrentProxy() || isCurrentService());

        const user = Meteor.user()
        return await fetchTransactions({...params, user})
    },

    /** 获取帐变记录总和 */
    admin_getTokenChangeHistorySum: async function (userId, token) {
        assert.ok(isCurrentUserAdmin());

        return await getTokenChangeHistorySum(userId, token)
    },

    /** 获取物品记录 */
    admin_getArticleRecordSum: async function (userId) {
        assert.ok(isCurrentUserAdmin());

        let res = await getArticleRecordSum(userId)
        let articles = {}
        res.articles.forEach(article => {
            articles[article._id] = article
        })
        return res.articleSum.map(r => ({
            article: articles[Number(r._id.articleId)],
            type: ArticleRecordType.getName(r._id.type),
            number: r.number
        }))
    },

    /** 获取余额 */
    admin_getBalance: async function (userId, token) {
        assert.ok(isCurrentUserAdmin());

        return await getBalance({_id: userId}, token)
    },

    /** 获取NFT列表 */
    admin_getNFTItems: async function (params) {
        assert.ok(isCurrentUserAdmin() || isCurrentService());

        return await fetchNFTItems(params)
    },
    admin_getNFTPools: async function () {
        return await NonFungibleTokenPool.find({}).fetch()
    },
    admin_getBlindbox: async function () {
        return await BlindBox.find({}).fetch()
    },

    /** 更新热更文件 **/
    admin_uploadFileData: async function (params) {
        assert.ok(isCurrentDeveloper());
        return await uploadFileData(params)
    },

    admin_setGameActive: async function (games) {
        assert.ok(isSuperUserAdmin());
        for (let i in games) {
            await Game.rawCollection().findOneAndUpdate({_id: games[i]._id}, {$set: {active: games[i].active}})
        }
    },
    /** 热更文件转换为系统需要的数据 **/
    admin_hotUploadStart: async function () {
        assert.ok(isCurrentDeveloper())
        return await hotUploadStart()
    },

    admin_migrations: async function () {
        assert.ok(isCurrentDeveloper())
        return await migration()
    },

    admin_fetchArticleList: async function (params) {
        assert.ok(isCurrentUserAdmin() || isCurrentProxy() || isCurrentService());

        const user = Meteor.user()

        return await fetchArticleList({...params, user})
    },

    admin_transferArticle: async function (params) {
        assert.ok(isCurrentUserAdmin() || isCurrentProxy() || isCurrentService());

        return await transferArticle(params)
    },

    admin_addArticle: async function (params) {
        assert.ok(isSuperUserAdmin());
        await transaction.run(async session => {
            const user = await Meteor.users.findOne({$or: [{_id: params.user}, {username: params.user}]}, {session})
            if (!user) {
                throw new Meteor.Error(500, errorCodes.InvalidUser)
            }
            return await addArticle({
                user: user._id,
                articleId: params.articleId,
                number: params.number,
                type: ArticleRecordType.SystemChange
            }, session)
        })
    },

    admin_removeArticle: async function (params) {
        assert.ok(isSuperUserAdmin());
        await transaction.run(async session => {
            const user = await Meteor.users.findOne({$or: [{_id: params.user}, {username: params.user}]}, {session})
            if (!user) {
                throw new Meteor.Error(500, errorCodes.InvalidUser)
            }
            return await removeArticle({
                user: user._id,
                articleId: params.articleId,
                number: params.number,
                type: ArticleRecordType.SystemChange
            }, session)
        })
    },

    admin_getArticleHistory: async function (params) {
        assert.ok(isCurrentUserAdmin() || isCurrentService())

        return await getArticleHistory(params)
    },

    admin_getAllArticles: async function (params) {
        return await Article.find({}).fetch()
    },

    /** @desc 代理链种植收益统计 **/
    admin_plant_statistics: async function (userId) {
        assert.ok(isSuperUserAdmin());
        return await plantStatistics(userId)
    },

    /** 获取代理的盈亏/挖矿等数据 */
    admin_getMiningData: async function (params) {
        assert.ok(isCurrentUserAdmin() || isCurrentProxy());

        const user = Meteor.user()

        return await getMiningData({...params, user});
    },

    /** mint指定类型的土地 **/
    admin_createLand: async function (userId, landType, landGrade) {
        assert.ok(isCurrentDeveloper());

        return await createDefinedNft(userId, landType, landGrade)
    },

    /**封禁用户**/
    admin_banUser: async function (userId) {
        assert.ok(isCurrentUserAdmin());
        check(userId, String)
        return banUser(userId)
    },

    /**用户数据**/
    admin_getUserData: async function (params) {
        assert.ok(isSuperUserAdmin());
        return await getUserData(params, Meteor.user())
    },

    admin_getGameHistory: async function (params) {
        assert.ok(isSuperUserAdmin());
        return await getGameHistory(params)
    },

    /**设置用户加入群组状态**/
    admin_setJoinedGroup: async function (userId) {
        assert.ok(isCurrentUserAdmin() || isCurrentService())

        let user = Meteor.users.findOne({_id: userId})
        let type = 'manual'
        let contentType = ''
        let isJoined = getTaskProgress(user, {
            type: type,
            content_type: contentType
        }, 'rookie_task')
        if (!isJoined) {
            await updateTaskProgress(user, type, contentType, 1)
            await setUserJoinedGroup(user._id, true)
        }
        return true
    },
    admin_getOrderHistory: async function (params) {
        assert.ok(isCurrentUserAdmin() || isCurrentService() || isCurrentProxy())

        return await getOrderHistory(params)
    },

    /** 流水周报 **/
    admin_getUsersWeekly: async function (params = {}) {
        assert.ok(isSuperUserAdmin() || isCurrentProxy())
        if (isCurrentProxy()) {
            if (!params.user)
                params.user = Meteor.userId()
            else {
                let checkUser = Meteor.users.findOne({_id: params.user})
                if (!checkUser) return
                if (checkUser.parents.indexOf(Meteor.userId()) === -1) return
            }
        }
        return await getUsersWeekly(params)
    },

    admin_getUsersCanBuyAmount: async function (params = {}) {
        assert.ok(isSuperUserAdmin() || isCurrentProxy())
        if (isCurrentProxy()) {
            if (!params.user)
                params.user = Meteor.userId()
            else {
                let checkUser = Meteor.users.findOne({_id: params.user})
                if (!checkUser) return
                if (checkUser.parents.indexOf(Meteor.userId()) === -1) return
            }
        }
        return await getUsersCanBuyAmount(params)
    },

    /**获取代理回购申请列表**/
    admin_getProxyBuybackOrders: async function (params) {
        assert.ok(isSuperUserAdmin() || isCurrentProxy())
        return await getProxyBuybackOrders(params, Meteor.user())
    },

    /**代理申请回购**/
    admin_proxyBuyback: async function (amount) {
        assert.ok(isCurrentProxy())
        return await proxyBuyback(Decimal(amount), Meteor.user())
    },

    /**代理回购审批**/
    admin_checkProxyBuyback: async function (orderId, status, reason = '') {
        assert.ok(isSuperUserAdmin())
        return await checkProxyBuyback(orderId, status, reason, Meteor.user())
    }
})
