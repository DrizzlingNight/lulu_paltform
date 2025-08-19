const state = {
  info: [],
  record: [],
  nftPool: [],
};

const mutations = {
  SET_INFO: (state, info) => {
    state.info = [...info];
  },
  SET_RECORD: (state, record) => {
    state.record = [...record];
  },
  SET_NFT_POOL: (state, nftPool) => {
    // console.log("nftPool:", nftPool);
    state.nftPool = [...nftPool];
  },
};

const actions = {
  setNftPool: ({ commit }, nftPool) => {
    commit("SET_NFT_POOL", nftPool);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
