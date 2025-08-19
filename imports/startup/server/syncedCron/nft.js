import logging from "/imports/api/logging";
import {
    NonFungibleTokenTransaction,
    NonFungibleTokenTransactionStatus,
    NonFungibleTokenItem, NonFungibleTokenTransactionType
} from "../../../api/nft/collections";
import {
    createDepositTrans,
    createMintTrans, sendNftTransRequest, updateNftTransByRequestId
} from "../../../api/nft/server/service";
import {getHotUpdateConf} from "../../../api/hotUpdateConf/services";
import {transaction} from "../../../api/core/database";
import api from "../../../api/blockchain/services";
import {addIntervalSyncedCron} from "../../../api/syncedCron/server/service";

const logger = logging.getLogger(module.id);

/** @description mint nft **/
async function scanNeedMintTokens() {
    const config = await getHotUpdateConf('autoOnchain')
    if (!config || !config.scanMint) {
        return
    }
    let tokens = NonFungibleTokenItem.find({$or: [{state: {$exists: 0}}, {'state.mint': false}]}, {
        sort: {_id: 1},
        limit: 10
    }).fetch()

    for (let token of tokens) {
        logger.info(`create nft mint transaction:${token._id}`)
        await transaction.run(async session => {
            await createMintTrans(token, '', session)
        })
    }
}

/** @description send nft transaction **/
async function scanNftTransactions() {
    const config = await getHotUpdateConf('autoOnchain')
    if (!config || !config.sendTransaction) {
        return
    }
    let trans = NonFungibleTokenTransaction.find({
        status: NonFungibleTokenTransactionStatus.Init,
        type: {$in: [NonFungibleTokenTransactionType.Mint, NonFungibleTokenTransactionType.Transfer]}
    }, {
        sort: {_id: 1},
        limit: 10
    }).fetch()

    for (let tran of trans) {
        logger.info(`send nft transaction request:${tran._id}-${tran.requestId}`)
        await transaction.run(async session => {
            await sendNftTransRequest(tran, session)
        })
    }
}

/** @description 更新交易信息 **/
async function updateTransactions() {
    const trans = NonFungibleTokenTransaction.find({
        status: NonFungibleTokenTransactionStatus.Pending
    }, {
        sort: {_id: 1},
        limit: 10
    }).fetch()

    for (let tran of trans) {
        try {
            await transaction.run(async session => {
                await updateNftTransByRequestId(tran, session)
            })
        } catch (e) {
            logger.error(`nft trans:${tran._id} update failed, reason: ${e}`)
        }
    }
}

/** @description import nft **/
async function scanDepositTokens() {
    let lastTran = NonFungibleTokenTransaction.findOne({
        "responseData.id": {$exists: true},
        type: NonFungibleTokenTransactionType.Deposit,
    }, {sort: {"responseData.id": -1}});

    let minId = undefined
    if (lastTran) {
        minId = lastTran.responseData.id
    }
    logger.info(`get trans min id ${minId}`)

    let trans = await api.nftTransactionHistory('deposit', minId)
    for (let tran of trans) {
        try {
            await transaction.run(async session => {
                await createDepositTrans(tran, session)
            })
        } catch (e) {
            logger.error(e)
        }
    }
}

addIntervalSyncedCron("NftRoutine", 10, async function() {
    try {
        await scanNeedMintTokens()
    } catch (e) {
        logger.error(`scan need mint nft tokens error: ${e}`)
    }

    try {
        await scanNftTransactions()
    } catch (e) {
        logger.error(`scan need send request nft transactions error: ${e}`)
    }

    try {
        await updateTransactions()
    } catch (e) {
        logger.error(`update nft transaction error: ${e}`)
    }

    try {
        await scanDepositTokens()
    } catch (e) {
        logger.error(`nft deposit error: ${e}`)
    }
})
