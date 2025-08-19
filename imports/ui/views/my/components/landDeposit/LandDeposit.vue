<template>
  <div class="land-deposit-wrapper">
    <div class="land-deposit-content">
      <!-- 返回我的土地 -->
      <div class="back mb-2 mb-sm-4 mb-md-6" @click="$router.push({name: 'land'})">
          <img :src="`/static/ui/assets/img/back-yellow.png`" />
          <p class="text">{{ $t('my.buyHistory.back') }}</p>
      </div>
      <!-- 土地轉入標題 -->
      <p class="land-deposit-title mb-2 mb-sm-6 mb-md-10">{{ $t('my.landDeposit.title') }}</p>
      <!-- 各步驟內容 -->
      <div class="steps-wrapper">
        <!-- 選擇鏈 -->
        <SelectChain v-if="step === 0" :chains="chains" @chainOnSelected="chainSelected" />
        <!-- 選擇錢包 -->
        <SelectWallet v-if="step === 1" :selected-chain="selectedChain" :wallets="wallets" @walletOnSelected="walletSelected" />
        <!-- 選地址 -->
        <SelectAddress v-if="step >= 2" :selected-chain="selectedChain" :selected-wallet="selectedWallet" :selected-contract="selectedContract" :contracts="contracts" :wallet-address="walletAddress" @contractSelected="updateSelectedContract" class="mb-10" />
        <!-- 選土地 -->
        <SelectLand v-if="step === 3"
            :should-get-lands="shouldGetLands"
            :contract-address="contractAddress"
            :contract-name="contractName"
            :wallet-address="walletAddress"
            :dialog-should-close="confirmDialogShouldClose"
            @transferNft="transferNft"
        />
      </div>
    </div>
  </div>
</template>

<script>
import SelectChain from './components/selectChain/SelectChain.vue'
import SelectWallet from './components/selectWallet/SelectWallet.vue'
import SelectAddress from './components/selectAddress/SelectAddress.vue'
import SelectLand from './components/selectLand/SelectLand.vue'

import { mapGetters } from 'vuex'

import metaMask from '/imports/api/walletConnect/metaMask'
import walletConnect from '/imports/api/walletConnect/walletConnect'

export default {
  name: 'LandDeposit',
  components: {
    SelectChain,
    SelectWallet,
    SelectAddress,
    SelectLand
  },
  data: () => ({
    // 當前步驟(0 - 2)
    step: 0,
    // 根據當前選則的鏈得到的內部錢包地址
    currentChainWalletAddress: '',
    // 外部錢包地址
    walletAddress: '',
    // 選擇了的鏈
    selectedChain: {},
    // 選擇了的外部錢包
    selectedWallet: {},
    // 選擇了的合約
    selectedContract: {},
    // 所有可用鏈
    chains: [],
    // 所有可用合約
    contracts: [],
    // 可用錢包(寫死)
    wallets: [
      {
        id: 1,
        name: 'Metamask'
      },
      {
        id: 2,
        name: 'Walletconnect'
      }
    ],
    // 通知該拉土地資料的flag
    shouldGetLands: false,
    confirmDialogShouldClose: false
  }),
  computed: {
    ...mapGetters(['user', 'walletConnectAddress']),

    // 外部合約地址
    contractAddress() {
      return this.selectedContract.contractAddress
    },

    // 選擇的合約名稱
    contractName() {
      return this.selectedContract.name
    }
  },
  watch: {
    walletConnectAddress(newVal) {
      if (newVal) {
        this.walletAddress = newVal
      }
    }
  },
  created() {
    console.log('created')
    // 重置walletConnect WS 連線資料
    walletConnect.killSession()
    // 後端取得可用鏈
    this.getContracts()
  },
  methods: {
    // 鏈被選擇了
    chainSelected(chainId) {
      this.selectedChain = this.chains.find(chain => chain.chainId == chainId)
      this.getCurrentChainWalletAddress(()=>{
        this.step ++
      })
    },

    // 錢包被選擇了
    walletSelected(walletId) {
      this.selectedWallet = this.wallets.find(wallet => wallet.id === walletId)

      // metamask
      if (walletId === 1) {
        // 取得metaMask錢包地址
        this.getMetamaskWalletAddress(this.selectedChain.code)
      } else {
        // 取得Walletconnect 外部錢包地址
        this.getWalletConnectAddress()
      }
      this.step ++
    },

    // 合約被選擇了
    updateSelectedContract(contractId) {
      this.selectedContract = this.contracts.find(contract => contract._id === contractId)

      this.step = 3

      // 告知 selectLand應該向後端請求土地
      this.shouldGetLands = !this.shouldGetLands
    },

    // 取得合約資訊
    getContracts() {
      Meteor.call('nftContracts', (err, res) => {
        if (res) {
          res.forEach(r=>{
            if (!r.internal)
              this.chains.push(r)
          })
          this.contracts = [...res]
        }
      })
    },

    // 根據所選鏈取得本地錢包地址
    getCurrentChainWalletAddress(callback) {
      const tokenId = this.selectedChain.depositToken
      console.log('tokenId: ', tokenId)
      let address = ''

      this.user.tokens.forEach(token => {
        if (token.address)
          token.address.forEach(addressItem => {
            if (addressItem.token_id === tokenId) {
              address = addressItem.address
              console.log('addressItem: ', addressItem)
            }
          })
      })
      if (!address){
        Meteor.call('addTokenAddress', (err, res) => {
          if (res) {
            this.getCurrentChainWalletAddress(callback)
          }
        })
      }

      this.currentChainWalletAddress = address
      callback()
    },

    // 取得 Metamask 錢包地址
    async getMetamaskWalletAddress(chain) {
      await metaMask.getWalletInfo(chain).then(res => {
        console.log('getWalletInfo res', res)
        this.walletAddress = res
        this.toasterSuccess(this.$t("tip.addSuccess"))
      }).catch(err => {
        console.log('getWalletInfo err', err)
        this.$toast.error(this.$t("tip.addFailed"))
      })
    },

    // 取得 Walletconnect 外部錢包地址
    async getWalletConnectAddress() {
      // 發起 walletConnect WS連線
      await walletConnect.transactionConnect()
    },

    // 正式轉入
    async transferNft(nftTokenId) {
      try {
        if (this.selectedWallet.id === 1) { // metamask
          const data = await window.metaMask.encodeSafeTransferData([
              this.walletAddress, //from 當前持有nft的地址
              this.currentChainWalletAddress, //to 要轉移nft的目標地址
              nftTokenId // tokenId
          ])

          console.log(data)

          const res = await window.metaMask.sendTransaction({
            to: this.contractAddress, //to 合约地址
            data
          })

          console.log('metamask data: ', data)
          console.log('metamask res: ', res)

        } else { // walletConnect
          const data = await walletConnect.encodeSafeTransferData([
            this.walletAddress, // from 當前持有nft地址
            this.currentChainWalletAddress, // to 要轉移nft的目標地址
            nftTokenId // tokenId
          ])

          console.log('walletConnect encode data: ', data)

          const res = await walletConnect.sendTransaction({
            to: this.contractAddress,
            data
          })

          console.log('walletconnect data: ', data)
          console.log('walletconnect response: ', res)
        }

        // 跳alert
        this.toasterSuccess(this.$t('my.landDeposit.transferSucceed'))
        // 關閉確認彈窗
        this.confirmDialogShouldClose = !this.confirmDialogShouldClose
        // 重新拉nft列表
        this.shouldGetLands = !this.shouldGetLands
        // this.$router.push({ name: 'landDeposit' })
      } catch(err) {
        console.log(err)
        this.toasterErr(this.$t('my.landDeposit.transferFailed'))
        this.confirmDialogShouldClose = !this.confirmDialogShouldClose
        // this.$router.push({ name: 'landDeposit' })
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.land-deposit-wrapper {
  min-height: 100vh;
  width: 100%;
  color: #ffffff;
  padding: 40px 80px;

  .land-deposit-content {
    width: 100%;
    margin: 0 auto;

    // 返回
    .back {
      cursor: pointer;
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-left: -40px;

      img {
        width: 18px;
        height: 18px;
      }

      .text {
        // font-size: 16px;
        color: #F7CD0A;
        margin-left: 10px;
        margin-bottom: 0px;
      }
    }

    // 標題
    .land-deposit-title {
      font-size: 24px;
      font-weight: 600;
    }
  }
}

@media screen and (max-width: 600px) {
  .land-deposit-wrapper {
    padding: 10px 10px;

    .land-deposit-content {

      // 返回
      .back {
        cursor: pointer;
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-left: 0px;

        .text {
          font-size: 12px;
          margin-left: 4px;
        }
      }

      // 標題
      .land-deposit-title {
        font-size: 18px;
      }
    }
  }
}
</style>
