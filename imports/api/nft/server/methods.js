import {marbleMethods} from "/imports/utils/methods";
import {errorCodes} from "../../../settings/errorCodes";
import {
    NonFungibleToken,
    NonFungibleTokenChange,
    NonFungibleTokenItem,
    NonFungibleTokenPool,
} from "../collections";
import {
    createTransferTrans, getWithdrawContract, idOnChain2Int,
} from "./service";
import {transaction} from "../../core/database";
import api from "../../blockchain/services";

marbleMethods({
    /** @desc nft列表 **/
    nftList() {
        return NonFungibleTokenPool.find({active: true}).fetch()
    },

    /** @desc用戶的nft信息 **/
    nftItems(where) {
        if (!Meteor.userId()) {
            throw new Meteor.Error(401, errorCodes.LoginRequired);
        }
        let selector = {
            user: Meteor.userId(),
            'state.internal': {$ne: false}
        }
        if (where.withdraw) {
            selector['disable'] = {$ne: true}
            selector['state.stake'] = {$ne: true}
            selector['state.lend'] = {$ne: true}
        }
        if (where.lease) {
            selector['disable'] = {$ne: true}
            selector['state.lend'] = {$ne: true}
        }

        const list = NonFungibleTokenItem.find(selector, {
            sort: {'info.nftPool.info.level':1, createdAt: -1},
            skip: where.offset,
            limit: where.limit
        }).fetch()
        const count = NonFungibleTokenItem.find(selector).count()
        return {list: list, count: count}
    },

    /** @descNFT流轉记录 **/
    nftChangeRecord(where) {
        if (!Meteor.userId()) {
            throw new Meteor.Error(401, errorCodes.LoginRequired);
        }
        const list = NonFungibleTokenChange.find({
            user: Meteor.userId()
        }, {sort: {createdAt: -1}, skip: where.offset, limit: where.limit}).fetch()
        const count = NonFungibleTokenChange.find({user: Meteor.userId()}).count()
        return {list: list, count: count}
    },

    /**
     * @api {call} Meteor.call('nftContracts') nft合约列表
     * @apiVersion 0.1.0
     * @apiName nft合约列表
     * @apiGroup NFT
     *
     * @apiSuccess {Array} List 合约列表
     * @apiSuccess {Number} List._id 合约id
     * @apiSuccess {String} List.blockchain 链名
     * @apiSuccess {String} List.contractAddress 合约地址
     * @apiSuccess {Boolean} List.active 是否启用
     */
    nftContracts() {
        if (!Meteor.userId()) {
            throw new Meteor.Error(401, errorCodes.LoginRequired);
        }
        return NonFungibleToken.find({active: true}).fetch()
    },

    /**
     * @api {call} Meteor.call('nftWithdraw','nftitem._id','to_address') nft提现
     * @apiVersion 0.1.0
     * @apiName nft提现
     * @apiGroup NFT
     *
     * @apiSuccess null
     */
    nftWithdraw: async function (tokenId, toAddress) {
        if (!Meteor.userId()) {
            throw new Meteor.Error(401, errorCodes.LoginRequired);
        }
        await transaction.run(async session => {
            const token = NonFungibleTokenItem.findOne(
                {
                    _id: tokenId,
                    user: Meteor.userId(),
                    'state.internal': true,
                    'state.stake': {$ne: true},
                    'state.lend': {$ne: true},
                    disable: {$ne: true}
                },
                {session}
            )

            if (!token || token.disable) {
                throw new Meteor.Error(500, errorCodes.ObjNotFound)
            }
            await createTransferTrans(token, toAddress, session)
        })
    },

    /**
     * @api Meteor.call('getNftBalance','contractAddress','address') 获取指定钱包的nft列表
     * @apiVersion 0.1.0
     * @apiName 获取指定钱包的nft列表
     * @apiGroup NFT
     *
     * @apiSuccess {Array} List nft列表
     * @apiSuccess {Number} List._id nftid
     * @apiSuccess {Object} List.info nft信息
     */
    /** @desc获取指定地址指定合约的所有nft **/
    getNftBalance: async function (contractAddress, address) {
        if (!Meteor.userId()) {
            throw new Meteor.Error(401, errorCodes.LoginRequired);
        }

        const contract = NonFungibleToken.findOne({contractAddress: contractAddress})
        if (!contract) {
            throw new Meteor.Error(500, errorCodes.InvalidContract)
        }
        const tokenIds = await api.getNftBalance(contractAddress, address)
        let tokens = []
        if (contract.internal) {
            let ids = []
            for (let id of tokenIds) {
                ids.push(id.tokenId)
            }
            tokens = NonFungibleTokenItem.find({
                'state.idOnChain2Int': {$in: ids}
            }).fetch()
        } else {
            for (let id of tokenIds) {
                // const tokenInfo = await fetch(contract.tokenUri+id.tokenId, {
                //     method: "GET",
                // })
                const token =
                    {
                        tokenId: id.tokenId,
                        tokenUri: contract.tokenUri + id.tokenId,
                        ...await id.tokenInfo
                    }
                tokens.push(token)
            }
        }
        return {list: tokens, count: tokens.length}
    },

    /**
     * @api Meteor.call('getWithdrawNftItem',itemId,callback) 获取要提现的nft信息
     * @apiVersion 0.1.0
     * @apiName 获取要提现的nft信息
     * @apiGroup NFT
     *
     * @apiSuccess {String}             _id         nft itemId
     * @apiSuccess {name}               name        nft 名称
     * @apiSuccess {tokenId}            tokenId     链上Id
     * @apiSuccess {Object}             contract    合约信息
     */
    getWithdrawNftItem: async function (itemId) {
        if (!Meteor.userId()) {
            throw new Meteor.Error(401, errorCodes.LoginRequired);
        }

        let token = NonFungibleTokenItem.findOne({_id: itemId, user: Meteor.userId()})
        if (!token) {
            throw new Meteor.Error(404, errorCodes.ObjNotFound)
        }

        let tokenId = await idOnChain2Int(token)
        let resp = {}
        resp.contract = await getWithdrawContract(token)
        resp._id = token._id
        resp.name = token.state.idOnChain
        resp.tokenId = token.state.depositTokenId ? token.state.depositTokenId : tokenId
        return resp
    },
});
