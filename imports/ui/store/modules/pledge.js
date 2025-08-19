const state = {
  reload: false,
};

const mutations = {
  UPDATE_PLEDGE: (state) => {
    state.reload = true;

    setTimeout(() => {
      state.reload = false;
    }, 1000)
  },
};

const actions = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
