import logging from "../logging";
import Web3 from "web3";
import {settings} from "../../settings";

const logger = logging.getLogger(module.id);
const web3 = new Web3();

export default {
    web3,
    isInstalled: function (){
        return typeof window.BinanceChain !== "undefined";
    },
    isMainNet: function (){},
    isConnected: function (){
        if (this.isInstalled)
            return window.BinanceChain.isConnected()
        else
            return false
    },
    connect: async function (){
        try{
            return await BinanceChain.request({ method: 'eth_requestAccounts' });
        }catch (e){
            logger.error(e)
        }
    },
    getAccounts: async function (){
        try{
            return await BinanceChain.request({ method: 'eth_accounts' });
        }catch (e){
            logger.error(e)
        }
    },
    getBalance: async function(address) {
        try{
            return await BinanceChain.request({ method: 'eth_getBalance' ,params:[address, "latest"]});
        }catch (e){
            logger.error(e)
        }
    },
    eip712: function (message){
        const domain = [
            { name: "name", type: "string" }
        ];
        const connection = [
            { name: "message", type: "string" }
        ];
        const domainData = {
            name: settings.webName
        };
        let mes = {
            message
        };
        return JSON.stringify({
            types: {
                EIP712Domain: domain,
                Connection: connection,
            },
            domain: domainData,
            primaryType: "Connection",
            message: mes
        })
    },
    sign: async function(address, message){
        try{
            return await BinanceChain.request({
                method: 'eth_signTypedData_v3',
                params:[address, this.eip712(message)],
                from: address
            });
        }catch (e){
            logger.error(e)
        }
    },
    personal_sign: async function(address, message){
        try{
            return await BinanceChain.request({
                method: 'personal_sign',
                params:[address, message],
                from: address
            });
        }catch (e){
            logger.error(e)
        }
    },
    eth_sign: async function(address, message){
        try{
            return await BinanceChain.request({
                method: 'eth_sign',
                params:[address, message],
                from: address
            });
        }catch (e){
            logger.error(e)
        }
    },
    verify(message, sign){
        return this.web3.eth.accounts.recover(message,sign)
    },
    login: async function(callback){
        let info
        let referral
        try{
            let accounts = await this.getAccounts()
            if (accounts.length === 0)
                accounts = await this.connect()
            if (accounts.length === 0)
                throw new Meteor.Error(403);
            let sign = await this.personal_sign(accounts[0], Meteor.connection._lastSessionId)
            referral = window.localStorage.getItem('referral');
            info = {
                name:accounts[0],
                signature: sign,
                id:Meteor.connection._lastSessionId
            }
        }catch (e){
            callback(e)
            return
        }
        Accounts.callLoginMethod({
            methodArguments: [{
                loginType: 'metaMask',
                ...info,
                referral
            }],
            userCallback: callback
        });
    }
}
