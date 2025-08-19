import {Token} from "../../tokens/collections";
import ell from "elliptic";
import {blockchainApi} from '../index';
import {Decimal} from "meteor/mongo-decimal";
import db from "../../core/database";
import {withdrawCallback, deposit, getUsedToken} from "../../account/server/service";
import logging from "../../logging";
import {InkpayLog, InkpayWork, InkpayWorkStatus} from "./collections";
import {Transaction} from "../../transactions/collections";
import {fetch, Headers} from "meteor/fetch";

const crypto = require('crypto');
const sha256 = require('sha256');
const bip66 = require('bip66');
const ZERO = Buffer.alloc(1, 0);
const ec = new ell.ec('secp256k1');
const logger = logging.getLogger(module.id);

export class InkpayApi extends blockchainApi {
    url = "";
    key = "";
    secret = "";
    withdrawKey = "";
    withdrawSecret = "";
    sig_type = "ecdsa";

    constructor(url, key, secret, withdrawKey, withdrawSecret, sig_type = "hmac") {
        super();
        this.url = url;
        this.key = key;
        this.withdrawKey = withdrawKey;
        this.withdrawSecret = withdrawSecret;
        this.secret = secret;
        this.sig_type = sig_type;
    }

    toDER(x) {
        let i = 0;
        while (x[i] === 0) ++i;
        if (i === x.length) return ZERO;
        x = x.slice(i);
        if (x[0] & 0x80) return Buffer.concat([ZERO, x], 1 + x.length);
        return x
    }

    sign_ecc(message, api_secret) {
        let privateKey = Buffer.from(api_secret, 'hex');
        let result = ec.sign(Buffer.from(sha256.x2(message), 'hex'), privateKey);
        var r = new Buffer(result.r.toString(16, 64), 'hex');
        var s = new Buffer(result.s.toString(16, 64), 'hex');
        r = this.toDER(r);
        s = this.toDER(s);
        return bip66.encode(r, s).toString('hex');
    };

    sign_hmac(message, api_secret) {
        let x = crypto.createHmac('sha256', api_secret)
            .update(message)
            .digest('hex');
        return x
    };

    async apiCall(method, path, params, key, secret, timeout = 8000) {
        if (!this.url) {
            throw new Meteor.Error("Inkpay api url is empty");
        }
        let nonce = String(new Date().getTime());
        Object.keys(params).forEach(key => params[key] === undefined ? delete params[key] : '');
        let sort_params = Object.keys(params).sort().map((k) => {
            return k + '=' + encodeURIComponent(params[k]).replace(/%20/g, '+');
        }).join('&');
        let content = [method, path, nonce, sort_params].join('|');
        let signature = '';
        if (this.sig_type === 'ecdsa') {
            signature = this.sign_ecc(content, secret)
        } else if (this.sig_type === 'hmac') {
            signature = this.sign_hmac(content, secret)
        } else {
            throw "unexpected sig_type " + this.sig_type;
        }
        let headers = {
            'Content-Type': 'application/json',
            'Biz-Api-Key': key,
            'Biz-Api-Nonce': nonce,
            'Biz-Api-Signature': signature
        };
        let requestInit = {
            method: method,
            headers: new Headers(headers),
        }
        let url = this.url + path
        if (method === 'GET') {
            url = url + "?" + sort_params
        }
        if (method === 'POST') {
            requestInit.body = JSON.stringify(params)
        }
        logger.info(`Inkpay api call ${method} ${url} ${this.sig_type} ${JSON.stringify(headers)} ${JSON.stringify(params)}`);
        let resp = await fetch(url, requestInit)
        const response = await resp.json()
        await InkpayLog.insertOne({response, method, path, params})
        logger.info(`Inkpay api call ${method} ${url} ${this.sig_type} ${JSON.stringify(headers)} ${JSON.stringify(params)} response: ${JSON.stringify(response)}`);

        if (!response.success) {
            throw new Error(JSON.stringify(response));
        }
        return response.result;
    };

    async orgInfo() {
        return await this.apiCall("GET", "/v1/custody/org_info/", {}, this.key, this.secret);
    }

    async newAddress(coin) {
        return await this.apiCall("POST", "/v1/custody/new_address/", {coin}, this.key, this.secret);
    }

    async transaction(id) {
        return await this.apiCall("GET", "/v1/custody/transaction/", {id}, this.key, this.secret);
    }

    async pendingTransactions(coin, side, max_id, limit, min_id) {
        return await this.apiCall("GET", "/v1/custody/pending_transactions/", {
            coin,
            side,
            max_id,
            min_id,
            limit,
        }, this.key, this.secret)
    }

    async transactionHistory(coin, side, address, max_id, limit, begin_time, min_id) {
        return await this.apiCall("GET", "/v1/custody/transaction_history/", {
            coin,
            side,
            address,
            max_id,
            min_id,
            limit,
            begin_time
        }, this.key, this.secret)
    }

    async newWithdrawRequest(coin, request_id, address, amount, memo, fee, gaslimit, gasprice) {
        return await this.apiCall("POST", "/v1/custody/new_withdraw_request/", {
            coin,
            request_id,
            address,
            amount,
            memo,
            fee,
            gaslimit,
            gasprice
        }, this.withdrawKey, this.withdrawSecret, 10000);
    }

    // 只创建任务，不发送
    async newWithdrawRequestWork(session, coin, request_id, address, amount, memo, fee, gaslimit, gasprice) {
        let params = {coin, request_id, address, amount, fee, gaslimit, gasprice}
        if (memo) {
            params.memo = memo
        }
        let {ops} = await InkpayWork.insertOne({
            method: 'POST',
            path: "/v1/custody/new_withdraw_request/",
            params: params,
            key: this.withdrawKey,
            secret: this.withdrawSecret,
            timeout: 10000,
            status: InkpayWorkStatus.Initial
        }, {session})
        return ops
    }

    async withdrawInfoByRequestId(request_id) {
        return await this.apiCall("GET", "/v1/custody/withdraw_info_by_request_id/", {request_id}, this.key, this.secret);
    }

    async faucetTestCoin(coin, address, amount) {
        return await this.apiCall("POST", "/v1/custody/faucet_test_coin/", {
            coin,
            address,
            amount
        }, this.key, this.secret);
    }

    //send nft transaction
    async newNftTransactionRequest(request_id, contract, func, params) {
        return await this.apiCall("POST", "/v2/nft/new_transaction_request/", {
            request_id,
            contract,
            "function": func,
            params
        }, this.key, this.secret, 10000);
    }

    //get nft transaction info
    async nftTransactionByRequestId(request_id) {
        return await this.apiCall("GET", "/v2/nft/transaction_info_by_request_id/", {
            request_id
        }, this.key, this.secret);
    }

    //get nft transaction history
    async nftTransactionHistory(side, min_id) {
        return await this.apiCall("GET", "/v2/nft/transaction_history/", {
            side,
            min_id,
        }, this.key, this.secret)
    }

    //get nft balance
    async getNftBalance(contractAddress, address) {
        return await this.apiCall("GET", `/v2/nft/nft_balance/${contractAddress}/${address}/`, {},
            this.key, this.secret)
    }

    async createAddress(token) {
        logger.info(`create new ${token.name} address`)
        let result = await this.newAddress(token.name);
        logger.info(`create address result ${result}`)
        return result.address;
    }

    async getPendingTransactions(token, type, max_id, limit, min_id) {
        return await this.pendingTransactions(
            token ? token.name : undefined, type, max_id, limit, min_id);
    }

    async getTransactions(token, type, address, max_id, limit, begin_time, min_id) {
        return await this.transactionHistory(token ? token.name : undefined, type, address, max_id, limit, begin_time, min_id);
    }

    async getTransaction(id) {
        return await this.transaction(id);
    }

    async withdrawRequest(token, amount, address, request_id, memo, fee, gaslimit, gasprice) {
        amount = Decimal(amount).times(Decimal(10).pow(token.decimalPlaces));
        return await this.newWithdrawRequest(token.name, request_id, address, amount.toFixed(), memo, fee, gaslimit, gasprice)
    }

    async withdrawRequesting(session, token, amount, address, request_id, memo, serviceType, fee, gaslimit, gasprice) {
        let usedToken = getUsedToken(token, serviceType)
        amount = Decimal(amount).times(Decimal(10).pow(usedToken.decimalPlaces));
        if (token.serviceType) {
            token = token.serviceType.find(item => {
                return item.type === serviceType
            })
        }
        return await this.newWithdrawRequestWork(session, token.name, request_id, address, amount.toFixed(), memo, fee, gaslimit, gasprice)
    }

}

export const checkTransaction = async function (tran) {
    if (tran.side !== "withdraw") return false;
    const db_tran = await Transaction.findOne({requestId: tran.request_id});
    if (db_tran) {
        if (tran.coin !== db_tran.token) return false;
        if (tran.address !== db_tran.requestData.address) return false;
        if (tran.memo !== "" && tran.memo !== db_tran.memo) return false;
        if (!Decimal(tran.abs_amount).eq(db_tran.amount)) return false;
        return true;
    } else {
        return false;
    }
}
export const inkpayTransaction = async function (tran, db_tran) {
    if (tran.side === "deposit") {
        let user = Meteor.users.findOne({"tokens": {$elemMatch: {"address.address": tran.address}}});
        if (!user) {
            logger.error(`Inkpay transaction deposit error, users: ${JSON.stringify(user)}`);
        }
        let amount = Decimal(tran.abs_amount);
        let token = Token.findOne({"serviceType": {$elemMatch: {_id: tran.coin}}})
        if (tran && ['success', 'pending'].includes(tran.status)) {
            await db.transaction.run(async (session) => {
                await deposit(user, amount, token, tran.txid, tran, session);
            });
        } else {
            logger.error(`Invalid Inkpay response ${JSON.stringify(tran)}`)
        }
    } else if (tran.side === "withdraw") {
        await withdrawCallback(tran.request_id, tran.txid, tran.status, tran, db_tran);
    } else {
        logger.error(`Invalid Inkpay response ${JSON.stringify(tran)}`);
        throw new Meteor.Error(500, "InvalidParams");
    }
};


InkpayWork.rawCollection().createIndex({"status": 1}, {background: true});
InkpayWork.rawCollection().createIndex({"_id": 1, "status": 1}, {background: true});