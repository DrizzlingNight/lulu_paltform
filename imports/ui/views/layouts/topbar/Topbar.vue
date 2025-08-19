<template>
  <div>
    <v-app-bar
        app
        class="flex-row topbar"
    >
      <!-- 導覽列連結 & 語言選擇 in mobile view -->
      <div class="d-block d-lg-none" style="height: 100%;">
        <TopbarBtnGroupMobile/>
      </div>

      <!-- logo -->
      <div @click="logoOnclick()" class="d-flex justify-center align-center logo" style="height: 100%; cursor: pointer;">
        <v-img :src="logoImg"></v-img>
      </div>
      <!-- 導覽列連結 -->
      <div class="d-none d-lg-block">
        <topbar-btn-group></topbar-btn-group>
      </div>

      <v-spacer></v-spacer>
      <!-- 充值按鈕 -->
      <div class="d-none d-lg-block">
        <recharge-btn v-if="user && this.tokens.length != 0"></recharge-btn>
      </div>
      <already-login v-if="user" class="mx-lg-5 d-flex align-center" style="height: 100%;"></already-login>
      <!-- 登入畫面進入點 -->
      <user-login class="mr-4 mr-md-3 mr-lg-5" v-if="!user"></user-login>
      <!-- 語言選擇器 -->
      <div class="d-none d-lg-block">
        <select-language></select-language>
      </div>
    </v-app-bar>
  </div>

</template>

<script>
import UserLogin from "./login/userLogin";
import SelectLanguage from "./selectLanguage";
import TopbarBtnGroup from "./topbarBtnGroup";
import TopbarBtnGroupMobile from './TopbarBtnGroupMobile';
import RechargeBtn from "./rechargeBtn";
import AlreadyLogin from "./alreadyLogin";
import { mapGetters } from "vuex";
import { settings } from "/imports/settings";

export default {
  name: "Topbar",
  components: {AlreadyLogin, RechargeBtn, TopbarBtnGroup, TopbarBtnGroupMobile, SelectLanguage, UserLogin},
  data: () => ({
    showLogin: false
  }),
  created() {
  },
  computed: {
    ...mapGetters(["balance", "tokens", "user"]),
    logoImg() {
      return '/static/ui/topbar/'+ settings.theme +'.png'
    }
  },
  methods: {
    logoOnclick() {
      // logo被點按回到首頁
      if (this.$route.name === 'home') { // 防止當前路由跳轉
        return
      }
      this.$router.push({name: 'home'})
    }
  }
}
</script>

<style lang="scss" scoped>

@import '/imports/ui/scss/theme';


.topbar {
  min-height: 80px;
  padding: 0px 40px;
  z-index: 1000 !important;
  background: $topBarBackground;

  /deep/ .v-toolbar__content {
    padding: 0px;
    min-height: 100%;
  }

  .logo {
    max-width: 116px;
  }
}

@media screen and (max-width: 1264px) {
  .topbar {
    padding: 0px 0px;
    .logo {
      max-width: 96px;
      position: absolute;
      left: 50%;
      transform: translate(-50%, 0%);
    }
  }
}

@media screen and (max-width: 960px) {
  .topbar {
    min-height: 64px;
    padding: 0px 0px;

    .logo {
      max-width: 96px;
      position: absolute;
      left: 50%;
      transform: translate(-50%, 0%);
    }
  }
}

@media screen and (max-width: 600px) {
  .topbar {
    padding: 0px 0px;
    min-height: 44px;

    .logo {
      max-width: 78px;
    }
  }

}

</style>
