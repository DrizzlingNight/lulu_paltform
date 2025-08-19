

const state = {
    isShowMoneyDialog:false,
    isShowRechargeDialog: false,
    codeType:''
}

const mutations = {
    SET_IS_SHOW_MONEY_DIALOG:(state,isAtMoneyState) => {
        state.isShowMoneyDialog = isAtMoneyState
    },
    SET_IS_SHOW_RECHARGE_DIALOG:(state,isAtRechargeState) => {
        state.isShowRechargeDialog = isAtRechargeState
    },
    SET_CODE_TYPE:(state,codeType) => {
        state.codeType = codeType
    }
}

const actions = {}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}