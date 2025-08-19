<template>
  <v-container class="pt-0 container" style="margin-top: 26px;margin-bottom: 17px;">
    <v-row no-gutters style="font-size: 12px">
      <v-col cols="12" class="d-flex justify-space-between align-center mx-auto"
             style="max-width: 380px">
        <v-divider class="borderColor" style="max-width: 143px"></v-divider>
        <div class="white--text">
          {{ $t("topbar.loginType") }}
        </div>
        <v-divider class="borderColor" style="max-width: 143px"></v-divider>
      </v-col>
    </v-row>
    <v-row no-gutters style="margin-top: 33px; gap: 10px;" class="d-flex justify-center mx-auto rowType">
      <!-- Binance -->
      <v-btn x-small class="text-capitalize pa-0 btn" elevation="0" style="border-radius: 8px;" height="42"
             @click="commingSoon">
        <div class="d-flex justify-center align-center div" style="margin-left: 11px;margin-right: 11px">
          <v-img class="img" style="margin-right: 8px" max-width="26px" src="/static/ui/topbar/binance.png"></v-img>
          <span
              class="text"
              style="font-size: 12px;font-weight: 600;letter-spacing: -0.312074px">Binance</span>
        </div>
      </v-btn>
      <!-- Metamask -->
      <v-btn x-small class="text-capitalize  pa-0 btn" elevation="0"
             @click="loginWithMetaMask"
             style="border-radius: 8px" height="42">
        <div class="d-flex justify-center align-center div" style="margin-left: 11px;margin-right: 11px">
          <v-img class="img" style="margin-right: 8px" max-width="26px" src="/static/ui/topbar/metamask.png"></v-img>
          <span
              class="text"
              style="font-size: 12px;font-weight: 600;letter-spacing: -0.312074px">Metamask</span>
        </div>
      </v-btn>
      <!-- Walletconnect -->
      <v-btn x-small class="text-capitalize  pa-0 btn" elevation="0"
             @click="loginWithWalletconnect"
             style="border-radius: 8px" height="42">
        <div class="d-flex justify-center align-center div" style="margin-left: 11px;margin-right: 11px">
          <v-img class="img" style="margin-right: 8px" max-width="26px" src="/static/ui/topbar/walletconnect.png"></v-img>
          <span
              class="text"
              style="font-size: 12px;font-weight: 600;letter-spacing: -0.312074px">Walletconnect</span>
        </div>
      </v-btn>
    </v-row>
  </v-container>

</template>

<script>
// import binanceChain from "/imports/api/walletConnect/binanceChain"
import metaMask from '/imports/api/walletConnect/metaMask'
import walletConnect from '/imports/api/walletConnect/walletConnect'

export default {
  name: "loginType",
  data: () => ({}),
  methods: {
    commingSoon() {
      this.toasterComingSoon()
    },

    // 幣安登入
    // loginWithBinanceChain() {
    //   binanceChain.login((res) => {
    //     if (res)
    //       this.$toast.error(this.$t("walletConnect.connectFailed"))
    //     else
    //       this.toasterSuccess(this.$t("walletConnect.connectSuccess"))
    //   })
    //   this.$emit('close')
    // },

    // Metamask登入
    loginWithMetaMask() {
      metaMask.login((res) => {
        if (res)
          this.$toast.error(this.$t("walletConnect.connectFailed"))
        else
          this.toasterSuccess(this.$t("walletConnect.connectSuccess"))
      })
      this.$emit('close')
    },

    // Walletconnect登入
    loginWithWalletconnect() {
      walletConnect.loginConnect((res) => {
        if (res)
          this.$toast.error(this.$t("walletConnect.connectFailed"))
        else
          this.toasterSuccess(this.$t("walletConnect.connectSuccess"))
      })
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.text {
  height: 26px;
  line-height: 26px;
}

@media screen and (max-width: 600px) {
  .btn {
    background: transparent !important;
    margin-bottom: 6px;
    height: 26px !important;
  }

  .div {
    /*height: 42px;*/
    /*line-height: 42px;*/
    margin-right: 0px !important;
    margin-left: 0px !important;
  }

  .rowType {
    margin-top: 17px !important;
  }

  .text {
    display: none !important;
  }

  .img {
    margin-right: 0px !important;
  }

  .container {
    margin-top: 21px !important;
    margin-bottom: 0px !important;
  }
}
</style>
