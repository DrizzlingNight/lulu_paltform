import * as _ from "lodash"

const getters = {
  // UI
  isShowRechargeDialog: (state) => state.ui.isShowRechargeDialog,
  isShowMoneyDialog: (state) => state.ui.isShowMoneyDialog,
  // 設定值
  codeType: (state) => state.ui.codeType,
  config: (state) => state.user.config,
  tokens: (state) => state.user.tokens,
  stakeToken: (state) => _.find(state.user.tokens,t=>t.stake),
  balance: (state) => state.user.balance,
  // 用戶資料
  user: (state) => state.user.user,
  // walletConnect
  walletConnectAddress: (state) => state.walletConnect.address,
  walletConnectChainId: (state) => state.walletConnect.chainId,
  walletConnectFetching: (state) => state.walletConnect.fetching,
  walletConnectShowModal: (state) => state.walletConnect.showModal,
  walletConnectUri: (state) => state.walletConnect.uri,
  walletConnectAssets: (state) => state.walletConnect.assets,
  // 盲盒
  boxInfo: (state) => state.box.info,
  boxRecord: (state) => state.box.record,
  boxNftPool: (state) => state.box.nftPool,
};
export default getters;
