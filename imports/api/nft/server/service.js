import {Random} from "meteor/random";
import {
    NonFungibleToken,
    NonFungibleTokenChange,
    NonFungibleTokenChangeType,
    NonFungibleTokenItem,
    NonFungibleTokenPool,
    NonFungibleTokenPoolName, NonFungibleTokenPoolType,
    NonFungibleTokenTransaction,
    NonFungibleTokenTransactionStatus,
    NonFungibleTokenTransactionType
} from "../collections";
import {errorCodes} from "../../../settings/errorCodes";
import logging from "../../logging";
import {BlindBox, BlindBoxTokenPool} from "../../blindBox/collections";
import {formatString, prefixInteger} from "../../../utils/funcs";
import {getHotUpdateConf} from "../../hotUpdateConf/services";
import {transaction} from "../../core/database";
import api from "../../blockchain/services";
import {Token, TokenChangeType} from "../../tokens/collections";
import {removeBalance} from "../../account/server/service";
import {Decimal} from "meteor/mongo-decimal";
import {fetch} from "meteor/fetch";
import {sendNotify} from "../../externalService/telegram/server/services";
import {BountyTask, BountyTaskStatus, BountyTaskType} from "../../bountyTasks/collections";
import {buildTaskInfo} from "../../games/market/server/services";

const logger = logging.getLogger(module.id);

const randomNft = async function (user, nftId, bboxId, number, session) {
    let nft = await NonFungibleToken.findOne({_id: nftId}, {session})
    if (!nft)
        throw new Meteor.Error(404, errorCodes.ObjNotFound);
    let nftList = []
    let blindTokenPools = await BlindBoxTokenPool.find({bboxId: bboxId, nDefined: {$gt: 0}}, {session}).fetch();

    for (let i = 0; i < number; i++) {
        let list = []
        let total = 0
        blindTokenPools.forEach(p => {
            total = total + p.nDefined
            list.push(total)
        })
        let selectedNumber = Math.floor((Math.random() * total))
        let blindTokenPool = null
        list.forEach((n, i) => {
            if (n > selectedNumber && !blindTokenPool) {
                blindTokenPool = blindTokenPools[i]
            }
        })
        let newNft = await createNft(user._id, nftId, blindTokenPool, session)
        if (!newNft)
            i = i - 1
        else
            nftList.push(newNft)
    }
    return nftList
}

const createNft = async function (user, nftId, blindTokenPool, session) {
    try {
        if (!blindTokenPool) {
            throw new Meteor.Error(500, errorCodes.OptErr);
        }
        let bbox = BlindBox.findOne({_id: blindTokenPool.bboxId}, {session})
        const idOnChain = await generateTokenId(blindTokenPool.nftPoolId, session)
        const nftPool = await NonFungibleTokenPool.$findOne({_id: blindTokenPool.nftPoolId}, session)
        // 插入新的nft
        let res = await NonFungibleTokenItem.insertOne({
            _id: Random.id(),
            nftId: nftId,
            info: {
                nftPool: blindTokenPool,
                totalNftPool: nftPool
            },
            user: user,
            state: {
                internal: true,
                mint: false,
                idOnChain: idOnChain,
            },
            createdAt: new Date()
        }, {session})
        if (!res || !res.insertedCount || res.insertedCount !== 1)
            throw new Meteor.Error(500, errorCodes.OptErr);
        // 插入nft操作记录
        await addNftChangeRecord(user, NonFungibleTokenChangeType.Init, res.ops[0]._id, {
            token: bbox.token,
            price: bbox.openFee,
            bboxId: blindTokenPool.bboxId,
            idOnChain: idOnChain
        }, session)
        // 更新blindTokenPool
        let tmp = await BlindBoxTokenPool.findOneAndUpdate({_id: blindTokenPool._id, nDefined: {$gt: 0}}, {
            $inc: {
                nDefined: -1
            }
        }, {session, returnOriginal: false})
        // 更新nftPoll
        await NonFungibleTokenPool.rawCollection().findOneAndUpdate({
            _id: blindTokenPool.nftPoolId,
            nDefined: {$gt: 0}
        }, {
            $inc: {
                nDefined: -1,
                currentId: 1
            },
        }, {session, returnOriginal: false})
        blindTokenPool.nDefined = tmp.value.nDefined
        return res.ops[0]
    } catch (e) {
        logger.error(e)
    }
}

const addNftChangeRecord = async function (user, type, itemId, userData, session) {
    return await NonFungibleTokenChange.insertOne(
        {user, type, nonFungibleTokenItem: itemId, userData, createdAt: new Date()}, {session})
}

const moveNft = async function (nftId, user) {
    await transaction.run(async session => {
        let res = await NonFungibleTokenItem.findOneAndUpdate({
            _id: nftId,
            disable: {$ne: true},
            "state.stake": {$ne: true},
            "state.lend": {$ne: true}
        }, {$set: {user: user._id}}, {session})
        if (!res || res.ok !== 1 || res.lastErrorObject.n === 0) {
            res = await NonFungibleTokenItem.findOneAndUpdate({
                _id: nftId,
                disable: {$ne: true},
                "state.stake": {$ne: true},
                "state.lend": {$ne: true}
            }, {$set: {user: user._id}}, {session})
            if (!res || res.ok !== 1 || res.lastErrorObject.n === 0)
                throw new Meteor.Error(500, errorCodes.ObjNotFound)
        }

        if (res.value.user) {
            await addNftChangeRecord(res.value.user, NonFungibleTokenChangeType.TransferOut, res.value._id, {
                nftId,
                user
            }, session)
        }
        await addNftChangeRecord(user._id, NonFungibleTokenChangeType.TransferIn, res.value._id, {
            nftId,
            user: res.value.user
        }, session)
    })
}

const createNftByPool = async function (nftPool, user, userData, session) {
    const idOnChain = await generateTokenId(nftPool._id, session)
    userData.idOnChain = idOnChain
    // 插入新的nft
    let res = await NonFungibleTokenItem.insertOne({
        _id: Random.id(),
        nftId: nftPool.nftId,
        info: {
            nftPool: nftPool,
            totalNftPool: nftPool
        },
        user: user._id,
        state: {
            internal: true,
            mint: false,
            idOnChain: idOnChain,
        },
        createdAt: new Date()
    }, {session})
    if (!res || !res.insertedCount || res.insertedCount !== 1)
        throw new Meteor.Error(500, errorCodes.OptErr);

    // 插入nft操作记录
    await addNftChangeRecord(user._id, userData.changeType, res.ops[0]._id, userData, session)

    // 更新nftPoll
    await NonFungibleTokenPool.rawCollection().findOneAndUpdate({
        _id: nftPool._id,
        nDefined: {$gt: 0}
    }, {
        $inc: {
            nDefined: -1,
            currentId: 1
        },
    }, {session, returnOriginal: false})
    return res.ops[0]
}

/** @desc 创建外部导入nft **/
const createDepositNft = async function (contract, tokenId, user, session) {
    const tokenUri = contract.tokenUri + tokenId.toString()
    let onchainInfo
    try {
        const resp = await fetch(tokenUri, {method: 'GET'});
        onchainInfo = await resp.json()
    } catch (err) {
        logger.error(`get tokenUri error: ${tokenUri}, error: ${err}`)
        return
    }

    const nftPool = await NonFungibleTokenPool.$findOne({"info.BN_NFT_name": onchainInfo.name}, {session})
    if (!nftPool) {
        return
    }
    let userData = {
        tokenUri: tokenUri,
        changeType: NonFungibleTokenChangeType.Init
    }
    return await createNftByPool(nftPool, user, userData, session)
}

/** @desc 生成tokenId **/
const generateTokenId = async function (nftPoolId, session) {
    const pool = await NonFungibleTokenPool.rawCollection().findOne({_id: nftPoolId}, {session})
    if (pool.maxId === pool.currentId) {
        throw new Error(`nft_pool_id:${pool._id}, No tokenId can be allocated`)
    }
    const id = prefixInteger(pool.currentId, pool.maxId.toString().length)
    return pool.info.idPrefix + id
}

/** @desc idOnChain to int **/
const idOnChain2Int = async function (token) {
    if (token.idOnChain2Int) {
        return token.idOnChain2Int
    }
    const nftPool = await NonFungibleTokenPool.rawCollection().findOne({_id: token.info.nftPool.nftPoolId})
    const nftTypeInt = NonFungibleTokenPoolName[nftPool.name]
    const levelInt = parseInt(token.info.nftPool.info.level) - 1
    const typeInt = parseInt(token.info.nftPool.info.type) - 1
    const id = prefixInteger(token.state.idOnChain.match(/\d+/), 5)
    return '' + nftTypeInt + levelInt + typeInt + id
}

/** @desc nft mint **/
const createMintTrans = async function (token, mintAddress, session) {
    const idOnChain = await idOnChain2Int(token)
    const contract = NonFungibleToken.findOne({_id: token.nftId})
    mintAddress = mintAddress ? mintAddress : contract.defaultAddress
    let requestId = Random.id()

    // 修改nft信息
    await NonFungibleTokenItem.findOneAndUpdate({
        _id: token._id
    }, {
        $set: {
            "state.mint": true,
            "state.idOnChain": token.state.idOnChain,
            "state.idOnChain2Int": idOnChain,
            "state.internal": true,
            "state.owner": mintAddress,
        }
    }, {session})

    // 增加transaction记录
    await NonFungibleTokenTransaction.insertOne(
        {
            user: token.user,
            nftItem: token._id,
            nftId: token.nftId,
            requestId: requestId,
            type: NonFungibleTokenTransactionType.Mint,
            sourceAddress: mintAddress,
            status: NonFungibleTokenTransactionStatus.Init,
            createdAt: new Date()
        }, {session}
    )
}

/** @desc get source user **/
const getSourceUser = async function (to) {
    return Meteor.users.findOne({
        $or: [{username: to}, {"tokens": {$elemMatch: {"address.address": to}}}]
    })
}

const getWithdrawContract = async function (token) {
    let contract
    if (token.state.depositContract) {
        contract = NonFungibleToken.findOne({contractAddress: token.state.depositContract})
    } else {
        contract = NonFungibleToken.findOne({_id: token.nftId})
    }
    return contract
}

/** $desc nft transfer external**/
const transferExternal = async function (token, toAddress, session) {
    /*const mintTrans = NonFungibleTokenTransaction.findOne({
        nftItem: token._id,
        type: NonFungibleTokenTransactionType.Mint
    })*/
    // const contract = NonFungibleToken.findOne({_id: token.nftId}, {session})
    const contract = await getWithdrawContract(token)
    const user = Meteor.users.findOne({_id: token.user}, {session})
    const feeToken = Token.findOne({_id: contract.feeToken}, {session})
    const requestId = Random.id()

    let requestParams = {
        requestId: requestId,
        contract: contract.contractAddress
    }
    const idOnChain = await idOnChain2Int(token)
    if (!token.state.mint && !token.state.depositContract) {
        requestParams['func'] = 'mint'
        requestParams['params'] = [toAddress, idOnChain]
    } else {
        requestParams['func'] = 'safeTransferFrom'
        let tokenId = token.state.depositTokenId ? token.state.depositTokenId : idOnChain
        requestParams['params'] = [token.state.owner, toAddress, tokenId]
    }
    // 扣除手续费
    let fee = Decimal(contract.withdrawalFee);
    if (fee.gt(0)) {
        await removeBalance({
            user: user,
            amount: fee,
            token: feeToken,
            type: TokenChangeType.NftWithdrawFee,
            userData: {requestId}
        }, session); //手續費
    }

    // 增加transaction记录
    await NonFungibleTokenTransaction.insertOne(
        {
            user: token.user,
            nftItem: token._id,
            nftId: token.nftId,
            requestId: requestId,
            type: NonFungibleTokenTransactionType.Transfer,
            sourceAddress: toAddress,
            params: requestParams,
            status: NonFungibleTokenTransactionStatus.Init,
            internal: false,
            createdAt: new Date()
        }, {session}
    )

    // 修改nft信息
    await NonFungibleTokenItem.findOneAndUpdate({
        _id: token._id
    }, {
        $set: {
            user: null,
            "state.mint": true,
            "state.idOnChain": token.state.idOnChain,
            "state.idOnChain2Int": idOnChain,
            "state.internal": false,
            "state.owner": toAddress,
        }
    }, {session})

    //提现通知
    sendNotify({
        username: user.username,
        token: token._id.toString(),
        tokenId: token.state.idOnChain,
        requestId: requestId,
        time: new Date()
    }, 'nftWithdraw')
}

/** @desc nft transfer **/
const createTransferTrans = async function (token, toAddress, session) {
    // const sourceUser = await getSourceUser(toAddress)
    await transferExternal(token, toAddress, session)
    /*if (!sourceUser) {
        await transferExternal(token, toAddress, session)
    } else {
        await moveNft(token._id, sourceUser, session)
    }*/
}

/** $desc nft deposit **/
const createDepositTrans = async function (trans, session) {
    const user = Meteor.users.findOne({"tokens": {$elemMatch: {"address.address": trans.to_address}}})
    const handled = NonFungibleTokenTransaction.findOne(
        {txHash: trans.hash_id}
    )
    if (handled) {
        return
    }

    const contract = NonFungibleToken.findOne({contractAddress: trans.contract})
    let token
    if (contract) {
        token = NonFungibleTokenItem.findOne({
            $or: [
                {'state.idOnChain2Int': trans.params.tokenId.toString()},
                {'state.depositTokenId': trans.params.tokenId.toString(), 'state.depositContract': trans.contract}
            ]
        }, {session})
        if (!token && !contract.internal && user) {
            // 外部合约导入，需创建nft
            token = await createDepositNft(contract, trans.params.tokenId, user, session)
        }
    }

    // 增加transaction记录
    await NonFungibleTokenTransaction.insertOne(
        {
            user: user ? user._id : '',
            nftItem: token ? token._id : trans.params.tokenId,
            nftId: token ? token.nftId : '',
            requestId: trans.requestId,
            type: NonFungibleTokenTransactionType.Deposit,
            sourceAddress: trans.from_address,
            status: NonFungibleTokenTransactionStatus.Done,
            responseData: trans,
            onChainData: trans.server_data,
            txHash: trans.hash_id,
            createdAt: new Date()
        }, {session}
    )

    if (token && user) {
        await addNftChangeRecord(user._id, NonFungibleTokenChangeType.Deposit, token._id, {from: trans.from_address}, session)
        let updateData = {
            disable: false,
            "state.internal": true,
            "state.owner": trans.to_address,
            "state.depositContract": contract.internal ? null : trans.contract,
            "state.depositTokenId": contract.internal ? null : trans.params.tokenId.toString(),
            user: user._id,
        }
        // 修改nft信息
        await NonFungibleTokenItem.findOneAndUpdate({
            _id: token._id
        }, {
            $set: updateData
        }, {session})

        // 导入通知
        sendNotify({
            username: user.username,
            token: token._id.toString(),
            tokenId: token.state.idOnChain,
            time: new Date()
        }, 'nftDeposit')
    }
}

/** @desc send nft transaction request **/
const sendNftTransRequest = async function (trans, session) {
    const token = NonFungibleTokenItem.findOne({_id: trans.nftItem}, {session})
    const contract = NonFungibleToken.findOne({_id: trans.nftId}, {session})
    if (trans.status !== NonFungibleTokenTransactionStatus.Init || !contract.contractAddress) {
        return
    }
    let resp, func
    func = trans.params.func
    try {
        resp = await api.newNftTransactionRequest(
            trans.params.requestId,
            trans.params.contract,
            trans.params.func,
            JSON.stringify(trans.params.params))
        logger.info(`send ${func} trans success, tokenId: ${token._id}, requestId: ${trans.requestId}`)
    } catch (e) {
        logger.error(`send ${func} trans failed, requestId: ${trans.requestId}, reason: ${e}`)
        // 交易上链失败通知
        sendNotify({
            func: func,
            requestId: trans.requestId,
            reason: JSON.stringify(e),
            time: new Date()
        }, 'nftTransError')
        throw new Error(e)
    }

    await NonFungibleTokenTransaction.findOneAndUpdate({
        _id: trans._id
    }, {
        $set: {
            status: NonFungibleTokenTransactionStatus.Pending,
            responseData: resp
        }
    }, {session})
}

/** @desc 更新nft trans狀態 **/
const updateNftTransByRequestId = async function (trans, session) {
    const resp = await api.nftTransactionByRequestId(trans.requestId)
    const token = NonFungibleTokenItem.findOne({_id: trans.nftItem}, {session})
    if (resp.status === NonFungibleTokenTransactionStatus.Done) {
        // 更新交易信息
        await NonFungibleTokenTransaction.findOneAndUpdate({
            _id: trans._id
        }, {
            $set: {
                status: NonFungibleTokenTransactionStatus.Done,
                onChainData: resp.server_data,
                responseData: resp,
                txHash: resp.hash_id,
                updatedAt: new Date()
            }
        }, {session})

        let changeType, extraData
        if (trans.type === NonFungibleTokenTransactionType.Mint) {
            changeType = NonFungibleTokenChangeType.Mint
            extraData = {
                requestId: trans.requestId,
                sourceAddress: trans.sourceAddress
            }
        } else if (trans.type === NonFungibleTokenTransactionType.Transfer) {
            changeType = NonFungibleTokenChangeType.Withdraw
            extraData = {
                requestId: trans.requestId,
                internal: false,
                sourceAddress: trans.sourceAddress
            }
        } else {
            return
        }
        await addNftChangeRecord(token.user, changeType, token._id, extraData, session)
    }
}

/** @desc 生成tokenUrl數據 **/
const buildTokenInfo = async function (tokenId) {
    const token = NonFungibleTokenItem.findOne({
        'state.idOnChain2Int': tokenId
    })
    if (!token) return {}

    const conf = await getHotUpdateConf('baseConfig')
    let image = ''
    if (conf && conf.s3ImageUrl) {
        image = formatString(conf.s3ImageUrl, {tokenId: tokenId})
    }
    const terrain = NonFungibleTokenPoolType.getName(token.info.nftPool.info.type)
    return {
        'name': token.state.idOnChain,
        // 'image': image,
        'description': `Land of Lulu Market`,
        'extend_info': {
            'terrain': terrain,
            'level': token.info.nftPool.info.grade
        }
    }
}

const getLandInfo = function (land, session) {
    return NonFungibleTokenPool.findOne({
        _id: land.info.nftPool.nftPoolId || land.info.nftPool.info._id
    }, {session})
}

const getLandBBoxInfo = function (land, session) {
    return BlindBoxTokenPool.findOne({
        _id: land.info.nftPool._id
    }, {session})
}


// 获取任务土地
const getLeaseLands = async function (user) {
    const tasks = BountyTask.find({
        receiver: user._id,
        type: BountyTaskType.LeaseLand,
        status: BountyTaskStatus.InProgress,
        deadLine: {$gt: new Date()}
    }).fetch()

    let leaseLands = []
    if (tasks.length > 0) {
        for (let task of tasks) {
            let land = NonFungibleTokenItem.findOne({_id: task.requirements.land._id, disable: {$ne: true}})
            if (land) {
                land.taskInfo = buildTaskInfo(task)
                leaseLands.push(land)
            }
        }
    }
    return leaseLands
}

// 获取任务土地id
const getLeaseLandIds = async function (user) {
    const tasks = BountyTask.find({
        receiver: user._id,
        type: BountyTaskType.LeaseLand,
        status: BountyTaskStatus.InProgress,
        deadLine: {$gt: new Date()}
    }).fetch()

    let ids = []
    if (tasks.length > 0) {
        for (let task of tasks) {
            ids.push(task.requirements.land._id)
        }
    }
    return ids
}

const createDefinedNft = async function (userId, landType, landGrade) {
    if (landType < 1 || landType > 6) {
        throw new Meteor.Error(404, errorCodes.ObjNotFound);
    }
    if (['SSS', 'SS', 'S', 'A', 'B'].indexOf(landGrade) < 0) {
        throw new Meteor.Error(404, errorCodes.ObjNotFound);
    }
    await transaction.run(async (session) => {
        const user = Meteor.users.findOne({$or: [{_id: userId}, {username: userId}]}, {session})
        if (!user) {
            throw new Meteor.Error(500, errorCodes.InvalidUser)
        }
        const nftPool = NonFungibleTokenPool.findOne({
            'info.grade': landGrade,
            'info.type': landType
        }, {session})

        await createNftByPool(nftPool, user, {changeType: NonFungibleTokenChangeType.SysCreate}, session)
    })
}

/**创建虚拟土地**/
const _createFakeLand = async function(user, session) {
    const nftPool = NonFungibleTokenPool.findOne({"info.FAKE": true}, {session})
    if (!nftPool) {
        throw new Meteor.Error(500, errorCodes.LandInvalid)
    }

    return await createNftByPool(nftPool, user, {changeType: NonFungibleTokenChangeType.SysCreate}, session)
}

/**获取fake land**/
const getFakeLand = async function(user, session) {
    let item = NonFungibleTokenItem.findOne({
        user: user._id,
        "info.nftPool.info.FAKE": true,
        "state.lend": {$ne: true}
    }, {sort: {createdAt: -1}, session})

    if (!item) {
        item = await _createFakeLand(user, session)
    }
    return item
}

export {
    randomNft,
    createMintTrans,
    createTransferTrans,
    createDepositTrans,
    sendNftTransRequest,
    updateNftTransByRequestId,
    buildTokenInfo,
    moveNft,
    getLandInfo,
    getLandBBoxInfo,
    getLeaseLands,
    getLeaseLandIds,
    createDefinedNft,
    getWithdrawContract,
    idOnChain2Int,
    getFakeLand
}
