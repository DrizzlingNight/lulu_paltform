import {blockchainApi} from "../index";
import './methods'

const Web3 = require('web3');
const Tx = require('ethereumjs-tx').Transaction
const Common = require('ethereumjs-common').default

export class Bscapi extends blockchainApi {
    host = ""
    account = ""
    priKey = ""
    web3 = {}
    contractAddress = ''
    contract = undefined
    common = undefined
    gasInfo = undefined

    constructor(host, account, priKey, contractInfo=undefined) {
        super()
        this.host = host
        this.account = account
        this.priKey = priKey
        this.web3 = new Web3(this.host)
        if (contractInfo) {
            this.contractAddress = contractInfo.contractAddress
            this.contract = new this.web3.eth.Contract(contractInfo.abi, this.web3.utils.toChecksumAddress(this.contractAddress))
            this.common = Common.forCustomChain(
                contractInfo.commonInfo.baseChain,
                {
                    name: contractInfo.commonInfo.name,
                    networkId: contractInfo.commonInfo.networkId,
                    chainId: contractInfo.commonInfo.chainId,
                    url: this.host
                },
                contractInfo.commonInfo.hardfork,
            )
            this.gasInfo = {
                gasLimit: contractInfo.gasLimit,
                gasPrice: contractInfo.gasPrice
            }
        }
    }

    /** @desc獲取nonce **/
    async getNonce(address) {
        return await this.web3.eth.getTransactionCount(this.web3.utils.toChecksumAddress(address))
    }

    /** @desc獲取最新區塊信息 **/
    async getLatestBlock() {
        return this.web3.eth.getBlock('latest')
    }

    /** @desc獲取區塊信息**/
    async getBlock(blockNum) {
        return this.web3.eth.getBlock(blockNum)
    }

    /** @desc獲取餘額**/
    async getBalance(address) {
        const balance = await this.web3.eth.getBalance(this.web3.utils.toChecksumAddress(address))
        return this.web3.utils.fromWei(balance, 'ether')
    }

    /** @desc通過私鑰獲取地址 **/
    async getAddressFromPriKey(priKey) {
        return this.web3.eth.accounts.privateKeyToAccount(priKey)
    }

    /** @desc获取交易凭据信息 **/
    async getTransactionReceipt(txHash) {
        return this.web3.eth.getTransactionReceipt(txHash)
    }

    /** @desc获取交易信息 **/
    async getTransaction(txHash) {
        return this.web3.eth.getTransaction(txHash)
    }

    /*************************************外部调用接口**********************************************/
    /** @desc鑄造nft **/
    async abiMint(to, nftId) {
        const data = this.contract.methods.mint(to, nftId).encodeABI()
        return this.abiSendSignedTransaction(data)
    }

    /** @desc轉移nft **/
    async abiSafeTransferFrom(from, to, nftId, memo) {
        const data = this.contract.methods.safeTransferFrom(from, to, nftId, this.web3.utils.hexToBytes(memo)).encodeABI()
        return this.abiSendSignedTransaction(data)
    }

    /** @desc銷毀nft **/
    async abiBurn(nftId) {
        const data = this.contract.methods.burn(nftId).encodeABI()
        return this.abiSendSignedTransaction(data)
    }

    /** @desc設置tokenURI **/
    async abiSetTokenURI(uri) {
        const data = this.contract.methods.setBaseURI(uri).encodeABI()
        return this.abiSendSignedTransaction(data)
    }

    /** @desc獲取tokenURI **/
    async abiGetTokenURI(nftId) {
        return this.contract.methods.tokenURI(nftId).call()
    }

    /** @desc發送簽名交易 **/
    async abiSendSignedTransaction(data) {
        const txObj = {
            nonce: this.web3.utils.toHex(await this.getNonce(this.account)),
            gasLimit: this.web3.utils.toHex(this.gasInfo.gasLimit),
            gasPrice: this.web3.utils.toHex(this.web3.utils.toWei(this.gasInfo.gasPrice, 'gwei')),
            to: this.contractAddress,
            data: data
        }
        const pkBuffer = Buffer.from(this.priKey, 'hex')
        const tx = new Tx(txObj, {common: this.common})
        tx.sign(pkBuffer)
        const rawData = '0x' + tx.serialize().toString('hex')
        return this.web3.eth.sendSignedTransaction(rawData)
    }

    /** @desc獲取transfer交易參數 **/
    async getTransferParams(txHash) {
        const transaction = await this.getTransaction(txHash)
        if (transaction && transaction.input) {
            let inputData = '0x' + transaction.input.slice(10)
            return this.web3.eth.abi.decodeParameters(['address', 'address', 'uint256', 'bytes'], inputData)
        }
        return ""
    }
 }
