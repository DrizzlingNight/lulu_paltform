import { add } from "lodash"

const state = {
    // 連結器
    connector: null,
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
}

const mutations = {
    SET_CONNECTOR: (state, connector) => {
        state.connector = connector
    },
    SET_FETCHING: (state, fetching) => {
        state.fetching = fetching
    },
    SET_CONNECTED: (state, connected) => {
        state.connected = connected
    },
    SET_CHAIN_ID: (state, chainId) => {
        state.chainId = chainId
    },
    SET_SHOW_MODAL: (state, showModal) => {
        state.showModal = showModal
    },
    SET_PENDING_REQUEST: (state, pendingRequest) => {
        state.pendingRequest = pendingRequest
    },
    SET_URI: (state, uri) => {
        state.uri = uri
    },
    SET_ACCOUNTS: (state, accounts) => {
        state.accounts = accounts
    },
    SET_ADDRESS: (state, address) => {
        state.address = address
    },
    SET_RESULT: (state, result) => {
        state.result = result
    },
    SET_ASSETS: (state, assets) => {
        state.assets = assets
    },
}

const actions = {}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}