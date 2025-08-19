import WalletConnect from "@walletconnect/client"
import QRCodeModal from "@walletconnect/qrcode-modal"

import store from './../../ui/store'

// import Web3 from "web3";

// const web3 = new Web3();

// // Create a connector
// const connector = new WalletConnect({
//     bridge: "https://bridge.walletconnect.org", // Required
//     qrcodeModal: QRCodeModal,
// });

// window.connector = connector

// let connectType = ''
// let connectResolve = null
// let connectReject = null

// connector.on("connect", (error, payload) => {

//     if (connectType === 'getAccountAddress') {
        
//         const { accounts } = payload.params[0];
//         if (accounts.length > 0) {
//             if (connectResolve) connectResolve(accounts[0])
//         } else {
//             if (connectReject) connectReject()
//         }
//     } else if (connectType === 'switchToBSC') {
//         if (connectResolve) {
//             connectResolve()
//         }
//     }

// });



// export default {
//     async checkConnection() {
//         return new Promise((resolve, reject) => {
//             if (!connector.connected) {
//                 connector.createSession({ chainId: '0x38'})
//                 connectResolve = resolve
//                 connectReject = reject
//             } else {
//                 resolve()
//             }
//         })
//     },
//     async getAccountAddress()  {

//         connectType = "getAccountAddress"

        
//             return  new Promise((resolve, reject) => {
//                 this.checkConnection().then ((account) => {

//                     if (account) {
//                         resolve(account)
//                     } else {
//                         const accounts = connector.accounts
//                         if (accounts.length > 0) {
//                             resolve(accounts[0])
//                         } else {
//                             reject()
//                         }
//                     }
//                 }).catch( () => {
//                     console.log('check connection reject')
//                     connectResolve = resolve
//                     connectReject = reject
//                 })
//         })

//     },
//     getChainId() {
//         return connector.connected ? connector.chainId : ''
//     },
//     async switchToBSC() {
//         connectType = "switchToBSC"

//         return new Promise((resolve, reject) => {

//             this.checkConnection().then( ()=> {
//                     if (connector.chainId === 56) {
//                         resolve()
//                         return
//                     }
        
//                     // switch to 0x38 network
//                     const switchNetworkReq = {
//                         id: 1,
//                         jsonrpc: '2.0',
//                         method: 'wallet_switchEthereumChain',
//                         params: [{ chainId: '0x38' }],
//                     }
        
//                     connector.sendCustomRequest(switchNetworkReq).then (res => {
//                         resolve(res)
//                     }).catch( err => {
//                         if (String(err).indexOf('wallet_addEthereumChain') != -1) { // have no 0x38 chain
//                             const params = [
//                                 {
//                                     chainId: '0x38',
//                                     chainName: 'Binance Smart Chain',
//                                     rpcUrls: ['https://bsc-dataseed.binance.org/'], /* ... */
//                                     nativeCurrency: {
//                                         name: 'BNB',
//                                         symbol: 'BNB',
//                                         decimals: 18
//                                     },
//                                     blockExplorerUrls: ['https://bscscan.com']
//                                 },
//                             ]
//                             const addNetworkReq = {
//                                 id: 1,
//                                 jsonrpc: '2.0',
//                                 method: 'wallet_addEthereumChain',
//                                 params: params
//                             }
        
//                             // add 0x38 network
//                             connector.sendCustomRequest(addNetworkReq).then( res => {
//                                 resolve(res)
//                             }).catch( err => {
//                                 reject(err)
//                             })
//                         }
//                     })
//             })
//         })
//     },
//     encodeSafeTransferData: function(params){
//         const abi = {"name": "safeTransferFrom", "type": "function", "inputs": [{"name": "from", "type": "address", "internalType": "address"}, {"name": "to", "type": "address", "internalType": "address"}, {"name": "tokenId", "type": "uint256", "internalType": "uint256"}], "outputs": [], "stateMutability": "nonpayable"}
//         return web3.eth.abi.encodeFunctionCall(abi, params)
//     },
//     // 发送交易
//     sendTransaction: async function({
//         to='0x0000000000000000000000000000000000000000', // Required except during contract publications.
//         value, // Only required to send ether to the recipient from the initiating external account.
//         data, // Optional, but used for defining smart contract creation and interaction.
//     }){

//         const txData = {
//             from: connector.accounts[0],
//             to,
//             value,
//             data
//         }
//         return await connector.sendTransaction(txData)
//     },
// }


// ******** 我的code ********


export default {
    // 連結器
    connector: null,
    // 連結狀態
    connectType: '', // 'login' || 'transaction'
    // 是否正抓資料
    fetching: false,
    // 是否已連接
    connected: false,
    // 鏈id
    chainId: 1,
    // 是否顯示彈窗
    showModal: false,
    pendingRequest: false,
    // uri
    uri: '',
    // 錢包資訊
    accounts: [],
    // 帳號詳細地址
    address: '',
    result: null,
    // 錢包詳細資料
    assets: [],

    // 同步到 vuex
    syncDataToVuex() {
        store.commit("walletConnect/SET_CONNECTOR", this.connector)
        store.commit("walletConnect/SET_FETCHING", this.fetching)
        store.commit("walletConnect/SET_CONNECTED", this.connected)
        store.commit("walletConnect/SET_CHAIN_ID", this.chainId)
        store.commit("walletConnect/SET_SHOW_MODAL", this.showModal)
        store.commit("walletConnect/SET_PENDING_REQUEST", this.pendingRequest)
        store.commit("walletConnect/SET_URI", this.uri)
        store.commit("walletConnect/SET_ACCOUNTS", this.accounts)
        store.commit("walletConnect/SET_ADDRESS", this.address)
        store.commit("walletConnect/SET_RESULT", this.result)
        store.commit("walletConnect/SET_ASSETS", this.assets)
    },
    
    // 觸發連線
    async connect() {
        // bridge url
        const bridge = "https://bridge.walletconnect.org"

        // create new connector
        const connector = new WalletConnect({ bridge, qrcodeModal: QRCodeModal })
        
        this.connector = connector

        // check if already connected
        if (!connector.connected) {
            // create new session
            await connector.createSession()
        }

        // subscribe to events
        await this.subscribeToEvents()
    },

    // 登入型連結
    async loginConnect() {
        this.connectType = 'login'
        this.connect()
    },

    // 交易型連結
    async transactionConnect() {
        this.connectType = 'transaction'
        this.connect()
    },

    // 訂閱各事件
    subscribeToEvents () {

        const connector = this.connector
        console.log('connector: ', connector)

        // 沒有connector就不給訂閱
        if (!connector) {
            return
        }

        // 訂閱session更新事件
        connector.on("session_update", async (error, payload) => {
            console.log(`connector.on("session_update")`)

            if (error) {
                throw error
            }

            const { chainId, accounts } = payload.params[0]
            this.onSessionUpdate(accounts, chainId)
        });

        // 訂閱連線事件
        connector.on("connect", (error, payload) => {
            console.log(`connector.on("connect")`)

            if (error) {
                throw error
            }

            this.onConnect(payload)
        });

        // 訂閱斷連事件
        connector.on("disconnect", (error, payload) => {
            console.log(`connector.on("disconnect")`)

            if (error) {
                throw error
            }

            this.onDisconnect()
        });

        // 更新connector資料
        if (connector.connected) {

            this.connected = true
            this.chainId = connector.chainId
            this.accounts = connector.accounts
            this.address = accounts[0]

            this.onSessionUpdate(accounts, chainId)
        }

        this.connector = connector
    },

    // 移除session 重置資料
    async killSession() {
        const connector = this.connector

        if (connector) {
            connector.killSession()
        }

        this.resetApp()
    },

    // 重置資料
    resetApp() {
        console.log('reset app')
        this.connector = null
        this.fetching = false
        this.connected = false
        this.chainId = 1
        this.showModal = false
        this.pendingRequest = false
        this.uri = ''
        this.accounts = []
        this.address = ''
        this.result = null
        this.assets = []

        this.syncDataToVuex()
    },

    // 連線成功時
    async onConnect(payload) {
        window.connector = this.connector
        const { chainId, accounts } = payload.params[0]

        this.connected = true
        this.chainId = chainId
        this.accounts = accounts
        this.address = accounts[0]

        // 針對metamask: 如果不在BSC就切到BSC
        if (this.chainId !== 56) {
            this.switchToBSC()
        }

        // 顯示地址
        console.log('walletConnect address: ', this.address)
        this.syncDataToVuex()

        // 若為登入就觸發系統登入
        if (this.connectType === 'login') {
            console.log('start login')
            console.log('address: ', this.address)
            const address = this.address.toLowerCase()
            const sign = await this.personalSign(address, Meteor.connection._lastSessionId)
            console.log('sign: ', sign)
            const referral = window.localStorage.getItem('referral')
            console.log('referral: ', referral)
            const info = {
                name: address,
                signature: sign,
                id: Meteor.connection._lastSessionId
            }
            console.log('info: ', info)

            Accounts.callLoginMethod({
                methodArguments: [{
                    loginType: 'metaMask', // 前後端統一暫時使用 'metaMask' 作為外部錢包的 loginType-flag
                    ...info,
                    referral
                }],
                // userCallback: callback
            })
        }
    },

    // 斷連時
    async onDisconnect() {
        this.resetApp()
    },

    // 連線更新時
    async onSessionUpdate(accounts, chainId) {
        const address = accounts[0]

        this.chainId = chainId
        this.accounts = accounts
        this.address = address

        // await this.getAccountAssets()
        this.syncDataToVuex()
    },

    // 切換到BSC鏈 (walletConnect到 metamask時可作用)
    async switchToBSC() {
        console.log('switch to BSC')

        const connector = this.connector
        
        // switch to 0x38 network
        const switchNetworkReq = {
            id: 1,
            jsonrpc: '2.0',
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x38' }],
        }

        connector.sendCustomRequest(switchNetworkReq).then(res => {
            console.log(res)
        }).catch( err => {
            const errStr = String(err)
            if (errStr.indexOf('wallet_addEthereumChain') != -1) { // have no 0x38 chain
                const params = [
                    {
                        chainId: '0x38',
                        chainName: 'Binance Smart Chain',
                        rpcUrls: ['https://bsc-dataseed.binance.org/'], /* ... */
                        nativeCurrency: {
                            name: 'BNB',
                            symbol: 'BNB',
                            decimals: 18
                        },
                        blockExplorerUrls: ['https://bscscan.com']
                    },
                ]
                const addNetworkReq = {
                    id: 1,
                    jsonrpc: '2.0',
                    method: 'wallet_addEthereumChain',
                    params: params
                }

                // add 0x38 network
                connector.sendCustomRequest(addNetworkReq).then(res => {
                    console.log(res)
                }).catch( err => {
                    console.log(err)
                })
            } else if (errStr.indexOf('JSON RPC response format is invalid') != -1) {
                return
            }
        })
    },

    // 發起個人簽名
    async personalSign(address, message) {
        try {
            console.log('start personalSign')
            console.log('address: ', address)
            console.log('message: ', message)
            const msgParams = [message, address]
            const signature = await this.connector.signPersonalMessage(msgParams)
    
            return signature
        } catch(err) {
            console.log(err)
            // 如果錢包端沒有接受簽名就砍掉 connector
            this.killSession()
        }
    },

    // encode 交易資料
    encodeSafeTransferData: function(params){
        const abi = {
            "name": "safeTransferFrom",
            "type": "function",
            "inputs": [
                {"name": "from", "type": "address", "internalType": "address"},
                {"name": "to", "type": "address", "internalType": "address"},
                {"name": "tokenId", "type": "uint256", "internalType": "uint256"}
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
        }
        return web3.eth.abi.encodeFunctionCall(abi, params)
    },

    // 發起交易
    async sendTransaction({
        to='0x0000000000000000000000000000000000000000', // Required except during contract publications.
        value, // Only required to send ether to the recipient from the initiating external account.
        data, // Optional, but used for defining smart contract creation and interaction.
    }) {
        console.log(this.connector)

        const tx = { from: this.address, to, value, data }

        return this.connector.sendTransaction(tx)
    },

    // toggle彈窗
    toggleModal() {
        this.showModal = !this.showModal
        this.syncDataToVuex()
    },
}