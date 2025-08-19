import logging from "/imports/api/logging";
import api from "../../../api/blockchain/services";
import {Transaction, TransactionStatus, TransactionType} from "../../../api/transactions/collections";
import {inkpayTransaction} from "../../../api/blockchain/inkpay";
import {InkpayWork, InkpayWorkStatus} from "../../../api/blockchain/inkpay/collections";
import {withdrawCallback} from "../../../api/account/server/service";
import {sendNotify} from "../../../api/externalService/telegram/server/services";
import moment from "moment/moment";
import {addIntervalSyncedCron} from "../../../api/syncedCron/server/service";

const logger = logging.getLogger(module.id)


/** @description 充值訂單 **/
async function scanDepositTransactions() {
    let minTran = Transaction.findOne({
        "responseData.id": {$exists: true},
        type: TransactionType.Deposit,
    }, {sort: {"responseData.id": -1}});
    let minId = undefined
    if (minTran) {
        minId = minTran.responseData.id
    }
    logger.info(`get trans min id ${minId}`)

    let trans = await api.getTransactions(undefined, 'deposit', undefined, undefined, undefined, undefined, minId)
    for (let tran of trans) {
        try {
            await inkpayTransaction(tran)
        } catch (e) {
            logger.error(e)
        }
    }
}

/** @description 檢查本地充值訂單 **/
async function checkDepositTransactions() {
    let trans = await Transaction.find({
        type: TransactionType.Deposit,
        user: {$ne: null},
        "responseData.status": "pending"
    }, {sort: {"responseData.id": 1}, limit: 10}).fetch();

    for (let tran of trans) {
        try {
            let transaction = await api.getTransaction(tran.responseData.id);
            await inkpayTransaction(transaction);
        } catch (e) {
            logger.error(e);
        }
    }
}

/** @description 檢查本地提現訂單 **/
async function checkWithdrawTransactions() {
    let trans = await Transaction.find({
        createdAt:{$gt: moment().subtract(3, "hour").toDate()},
        status: {$in: [TransactionStatus.Init, TransactionStatus.Pending]},
        type: TransactionType.Withdraw
    }, {limit: 10, sort: {createdAt: 1}}).fetch();
    for (let tran of trans) {
        try {
            let transaction = await api.withdrawInfoByRequestId(tran.requestId);
            await inkpayTransaction(transaction, tran);
        } catch (e) {
            if (e.message === "12004" && (tran.createdAt.getTime() + 24 * 3600000 < (new Date()).getTime())) {
                logger.warn(`Transaction request id ${tran.requestId} not exist, set status to failed`);
                await withdrawCallback(tran.requestId, tran.txid, "failed", {}, tran);
            } else {
                logger.error(e);
            }
        }
    }
}

/** @description 發送提現請求 **/
async function withdrawRequest() {
    let works = await InkpayWork.$find({status: InkpayWorkStatus.Initial});
    let result, response;
    for (let work of works) {
        result = await InkpayWork.findOneAndUpdate(
            {_id: work._id, status: InkpayWorkStatus.Initial},
            {$set: {status: InkpayWorkStatus.Starting}}
        );
        if (!result.value) return
        try {
            response = await api.apiCall(work.method, work.path, work.params, work.key, work.secret, work.timeout);
            await InkpayWork.findOneAndUpdate(
                {_id: work._id, status: InkpayWorkStatus.Starting},
                {$set: {status: InkpayWorkStatus.Finished, response: response}}
            );
        } catch (e) {
            sendNotify({
                bill_no: work.params.request_id,
                address: work.params.address,
                amount: work.params.amount,
                token: work.params.coin,
                reason: JSON.stringify(e)
            }, 'withdrawError')
            await InkpayWork.findOneAndUpdate(
                {_id: work._id, status: InkpayWorkStatus.Starting},
                {$set: {status: InkpayWorkStatus.Failed, error: e.toString()}}
            );
        }
    }
}

addIntervalSyncedCron("InkpayRoutine", 10, async function() {
    logger.info("inkpayRoutine update")
    try {
        await scanDepositTransactions()
    } catch (e) {
        logger.error(`scan deposit trans error: ${e}`)
    }

    try {
        await checkDepositTransactions()
    } catch (e) {
        logger.error(`check deposit tran error: ${e}`)
    }

    try {
        await checkWithdrawTransactions()
    } catch (e) {
        logger.error(`check withdraw tran error: ${e}`)
    }

    try {
        await withdrawRequest()
    } catch (e) {
        logger.error(`send withdraw request error: ${e}`)
    }
})
