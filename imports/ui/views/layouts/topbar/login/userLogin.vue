<template>
  <div>
    <v-btn elevation="0" @click="signIn" class="login-btn">
      {{ $t("topbar.signIn") }}
    </v-btn>
    <login-dialog :show="showLogin" @close="showLogin=false"></login-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import LoginDialog from "./loginDialog";

export default {
  name: "userLogin",
  components: {LoginDialog},
  data: () => ({
    showLogin: false
  }),
  computed: {
    ...mapGetters(['user']),
  },
  methods: {
    signIn() {
      this.showLogin = true
    },
    // 如果網址有邀請碼就直接打開彈窗
    openDialogIfReferralExist() {
      const referral = this.$route.query.referral

      // 如果user不是空值表示不是未登入狀態，因此不動作
      if (this.user !== null) {
        return
      }
      
      if (referral) {
        this.showLogin = true
      }
    }
  },
  created() {
    this.openDialogIfReferralExist()
  }
}
</script>

<style lang="scss" scoped>

.login-btn {
  height: 46px;
  width: 92px;
  border-radius: 8px;

  /deep/ .v-btn__content {
    // font-weight: 600;
  }
}

@media screen and (max-width: 960px) {
  .login-btn {
    height: 40px !important;
    width: 80px;

    /deep/ .v-btn__content {
      font-size: 14px;
    }
  }
}

@media screen and (max-width: 600px) {
  .login-btn {
    height: 24px !important;
    border-radius: 4px;
    width: 48px;
    min-width: 48px !important;

    /deep/ .v-btn__content {
      font-size: 12px;
    }
  }
}


</style>
