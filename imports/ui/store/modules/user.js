import {settings} from "../../../settings"

const state = {
    config: {},
    tokens:{},
    balance:{},
    user:null
}

const mutations = {
    SET_CONFIG: (state, config) => {
        state.config = config
    },
    SET_TOKEN: (state, tokens) => {
        state.tokens = tokens
    },
    SET_BALANCE: (state, balance) => {
        state.balance = balance
    },
    SET_USER: (state, user) => {
        state.user = user
    },
}

const actions = {
    getConfig: function ({commit}) {
        commit('SET_CONFIG', settings)
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}