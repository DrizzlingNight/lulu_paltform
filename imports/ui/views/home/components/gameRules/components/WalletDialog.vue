<template>
  <v-dialog v-model="show" max-width="466" @click:outside="$emit('close')">


    <!-- 鏈結錢包彈窗卡片 -->
    <v-card class="service-terms-card d-flex flex-column">
      <!-- 關閉按鈕 -->
      <v-img @click="$emit('close')" class="close-btn" src="static/ui/topbar/close.png" width="18" height="18" contain></v-img>

      <h2 style="margin-left:40px; margin-top: 20px">{{ $t("home.gameRules.selectYourWallet") }}</h2>

      <v-divider class="divider" style="border: 1px solid #2D4742;margin-top: 24px;margin-bottom: 10px"></v-divider>

      <!-- metaMask登入 -->
      <v-btn class="walletBtn text-left" @click="loginWithMetaMask">
        <span style="width: 100%">MetaMask</span>
        <v-img src="static/ui/topbar/metamask.png" max-width="24"></v-img>
      </v-btn>
      <!-- 幣安登入 -->
      <v-btn class="walletBtn text-left" @click="loginWithBinanceChain">
        <span style="width: 100%">BinanceWallet</span>
        <v-img src="static/ui/topbar/binance.png" max-width="24"></v-img>
      </v-btn>
      <!-- walletConnect -->
      <v-btn class="walletBtn text-left" @click="loginWithWalletConnect">
        <span style="width: 100%">Walletconnect</span>
        <v-img src="static/ui/topbar/walletconnect.png" max-width="24"></v-img>
      </v-btn>
    </v-card>

  </v-dialog>
</template>

<script>
import binanceChain from "/imports/api/walletConnect/binanceChain";
import metaMask from "/imports/api/walletConnect/metaMask";
import walletConnect from '/imports/api/walletConnect/walletConnect'

export default {
  name: 'WalletDialog',
  props:[
      "show"
  ],
  data() {
    return {
      isOpen: false,
      serviceTermsText: ''
    }
  },
  methods: {
    // 幣安登入
    loginWithBinanceChain(){
      this.toasterComingSoon()
      // binanceChain.login((res)=>{
      //   if (res)
      //     this.$toast.error(this.$t("walletConnect.connectFailed"))
      //   else
      //     this.toasterSuccess(this.$t("walletConnect.connectSuccess"))
      // })
      this.$emit('close')
    },
    // metaMask登入
    loginWithMetaMask(){
      metaMask.login((res)=>{
        if (res)
          this.$toast.error(this.$t("walletConnect.connectFailed"))
        else
          this.toasterSuccess(this.$t("walletConnect.connectSuccess"))
      })
      this.$emit('close')
    },

    // walletConnect登入
    loginWithWalletConnect(){
      walletConnect.loginConnect((res)=>{
        if (res)
          this.$toast.error(this.$t("walletConnect.connectFailed"))
        else
          this.toasterSuccess(this.$t("walletConnect.connectSuccess"))
      })
      this.$emit('close')
    },
  },
  mounted() {
  }

}
</script>

<style lang="scss" scoped>

// 激活按鈕
.active-btn {
  max-height: 16px;

  /deep/ .v-btn__content {
    font-size: 12px;
    color: #59CF9E;
  }
}

// 卡片
.service-terms-card {
  position: relative;
  background: linear-gradient(136.3deg, #06261F 2.34%, #08322D 98.54%);
  border: 1px solid #00FFCA !important;
  border-radius: 8px;
  overflow: auto;
  padding-bottom: 18px;

  .close-btn {
    position: absolute;
    top: 20px;
    right: 20px;
    cursor: pointer;
  }

  .divider {
    width: 100%;
    border: 1px solid #2D4742;
  }

  .service-terms-content {
    width: 100%;
    height: 100%;
    color: #ffffff;
    white-space: pre-line;
  }
}

// scroll bar style

// chrome
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 2.5px;
}

::-webkit-scrollbar-corner {
  background: transparent;
}

// firefox
* {
  scrollbar-color: rgba(0, 0, 0, 0.3); /* thumb and track color */
  scrollbar-width: thin;
}

.walletBtn{
  margin: 10px 40px;
  background: rgba(0, 0, 0, 0.3) !important;
}
</style>
