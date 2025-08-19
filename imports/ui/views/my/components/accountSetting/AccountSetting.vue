<template>
  <div class="AccountSetting">
    <div class="left">
      <p class="title">{{ $t('my.accountSetting.title') }}</p>
      <p class="description">{{ $t('my.accountSetting.description') }}</p>
      <div class="content">

        <!-- 修改登入密碼 -->
        <div v-if="user.mobile || user.emails" class="login-password">
          <p class="text mb-4 mb-sm-0">{{ $t('my.accountSetting.loginPassword') }}</p>
          <div class="right d-flex justify-space-between pl-3 pl-md-0 mb-6 mb-md-0">
            <div class="description modify">
              <img :src="'/static/ui/assets/img/check-mark-circle.png'" class="mr-5" />
              <!-- 2022.01.05 由於i18n文擋空白內容會一直被改成null，所以直接拿掉文字 -->
              <p class="text">{{ }}</p>
            </div>
            <p class="button" @click="isModifyPasswordShow = true">{{ $t('my.accountSetting.loginPassword_button') }}</p>
          </div>
        </div>

        <!-- 手機綁定 -->
        <div class="bind-phone">
          <p class="text mb-4 mb-sm-0">{{ $t('my.accountSetting.bindPhone') }}</p>
          <div class="right d-flex justify-space-between pl-3 pl-md-0 mb-6 mb-md-0">
            <div :class="{ modify: user.mobile }" class="description">
              <img v-if="user.mobile" :src="'/static/ui/assets/img/check-mark-circle.png'" class="mr-5" />
              <img v-else :src="'/static/ui/assets/img/exclamation-mark-triangle.png'" class="mr-5" />
              <p class="text">{{ $t('my.accountSetting.bindPhone_description') }}</p>
            </div>
            <div class="">
              <p v-if="user.mobile" class="show">{{ `+${user.iddCode} ${user.mobile}` }}</p>
              <p v-else class="button" @click="isBindPhoneShow = true">{{ $t('my.accountSetting.bindPhone_button') }}</p>
            </div>
          </div>
          <div class="description-mobile">
            <p class="text">{{ $t('my.accountSetting.bindPhone_description') }}</p>
          </div>
        </div>

        <!-- 郵箱綁定 -->
        <div class="bind-email">
          <p class="text mb-4 mb-sm-0">{{ $t('my.accountSetting.bindEmail') }}</p>
          <div class="right d-flex justify-space-between pl-3 pl-md-0 mb-6 mb-md-0">
            <div :class="{ modify: user.emails && user.emails[0] }" class="description">
              <img v-if="user.emails && user.emails[0]" :src="'/static/ui/assets/img/check-mark-circle.png'" class="mr-5" />
              <img v-else :src="'/static/ui/assets/img/exclamation-mark-triangle.png'" class="mr-5" />
              <p class="text">{{ $t('my.accountSetting.bindEmail_description') }}</p>
            </div>
            <div class="">
              <p v-if="user.emails && user.emails[0]" class="show">{{ emailHandler(user.emails[0].address) }}</p>
              <p v-else class="button" @click="isBindEmailShow = true">{{ $t('my.accountSetting.bindEmail_button') }}</p>
            </div>
          </div>
          <div class="description-mobile">
            <p class="text">{{ $t('my.accountSetting.bindEmail_description') }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 各彈窗 -->
    <!-- 修改密碼 -->
    <ModifyPasswordDialog :is-modify-password-show="isModifyPasswordShow" @close="closeModifyPasswordDialog" @resetPassword="openResetPasswordDialog" />
    <!-- 綁定手機 -->
    <BindPhoneDialog :is-bind-phone-show="isBindPhoneShow" @close="closeBindPhoneDialog" />
    <!-- 綁定郵箱 -->
    <BindEmailDialog :is-bind-email-show="isBindEmailShow" @close="closeBindEmailDialog" />
    <!-- 忘記密碼彈窗 -->
    <ResetPasswordDialog :is-reset-password-dialog-show="isResetPasswordDialogShow" @close="closeResetPasswordDialog" />
  </div>
</template>

<script>
import ModifyPasswordDialog from './components/modifyPasswordDialog/ModifyPasswordDialog.vue'
import BindPhoneDialog from './components/bindPhoneDialog/BindPhoneDialog.vue'
import BindEmailDialog from './components/bindEmailDialog/BindEmailDialog.vue'
import ResetPasswordDialog from './components/resetPasswordDialog/ResetPasswordDialog.vue'

import { mapGetters } from 'vuex'

export default {
  name: 'AccountSetting',
  components: {
    ModifyPasswordDialog,
    BindPhoneDialog,
    BindEmailDialog,
    ResetPasswordDialog,
  },
  data() {
    return {
      showPassword: false,
      isLoading: false,
      isModifyPasswordShow: false,
      isBindPhoneShow: false,
      isBindEmailShow: false,
      isResetPasswordDialogShow: false,
    }
  },
  computed: {
    ...mapGetters(['user']),
  },
  methods: {

    // 把email截取部分字段顯示
    emailHandler(email) {
      const start = email.substring(0,3)
      const end = email.split('@')[1]
      const result = `${start}...@${end}`
      return result
    },

    // 關閉密碼修改彈窗、重製表單
    closeModifyPasswordDialog() {
      this.isModifyPasswordShow = false
    },

    // 關閉綁定手機彈窗、重製表單
    closeBindPhoneDialog() {
      this.isBindPhoneShow = false
    },

    // 關閉綁定郵箱、重製表單
    closeBindEmailDialog() {
      this.isBindEmailShow = false
    },

    // 開啟忘記密碼彈窗
    openResetPasswordDialog() {
      this.isResetPasswordDialogShow = true
    },

    // 關閉忘記密碼彈窗
    closeResetPasswordDialog() {
      this.isResetPasswordDialogShow = false
    },
  },
  meteor: {
    user() {
      console.log('user', Meteor.user())
      return Meteor.user()
    },
  }
}
</script>

<style lang="scss" scoped>

@import '/imports/ui/scss/theme';

.AccountSetting {
  height: 100vh;
  display: flex;
  flex-direction: row;
  background: $commonBackground;
  padding-top: 56px;
  padding-left: 80px;
  

  .left {
    .title {
      font-size: 24px !important;
      font-weight: 600;
      color: #ffffff;
      margin-bottom: 7px;
    }

    .description {
      // font-size: 16px;
      color: #CF2C46;
      // margin-bottom: 24px;
    }

    .content {
      width: 62.5vw;
      display: flex;
      flex-direction: column;
      background: $lightBackground5030;
      border-radius: 5px;
      padding: 24px 24px 0px 24px;
      box-shadow: 0px 5px 8px 1px rgba(0, 20, 15, 0.5);

      .login-password,
      .bind-phone,
      .bind-email,
      .deal-password {
        display: flex;
        align-items: center;
        flex-direction: row;
        margin-bottom: 24px;
        // justify-content: space-between;
        
        p {
          // margin-right: 120px;
          margin-bottom: 0px;
          // white-space: nowrap;
        }

        .text {
          color: #FFFFFF;
          margin-right: 20px;
          min-width: 120px;
        }

        .right {
          width: 100%;

          .description {
            display: flex;
            align-items: center;
            max-width: 60%;
            // flex-direction: row;
            // justify-content: flex-start;
            // min-width: 450px;

            img {
              max-width: 24px;
              max-height: 24px;
            }

            .text {
              color: $darkFontColor;
              // white-space: nowrap;
              font-size: 14px;
            }
          }

          .button {
            cursor: pointer;
            color: #00FFCA;
            text-align: right;
          }

          .show {
            color: $darkFontColor;
            white-space: nowrap;
            text-align: right;
          }

          // .modify {
          //   // min-width: 451px;
          // }
        }

        .description-mobile {
          display: none;
        }
      }

    }
  }
}

@media screen and (max-width: 960px) {
  .AccountSetting {
    width: 100vw;
    padding-top: 30px;
    padding-left: 10px;
    padding-right: 10px;
    padding-bottom: 100px;
    
    .left {
      width: 100%;
      
      .content {
        width: 100%;

        .login-password,
        .bind-phone,
        .bind-email,
        .deal-password {
          flex-direction: row;
          flex-wrap: wrap;
          justify-content: flex-start;
          border-bottom: 1px solid #2D4742;
          padding-bottom: 10px;
          margin-bottom: 10px;

          p {
            min-width: 80px;
          }

          .text {
            margin-right: 0px;
            min-width: 50px;
          }

          .right {
            width: calc(100% - 50px);

            .description {
              min-width: 20px;

              img {
                max-width: 18px;
                max-height: 18px;
              }

              .text {
                display: none;
                white-space: normal;
                word-break: break-all;
              }
            }

            .show {
              max-width: auto;
              white-space: normal;
              word-break: break-all;
            }

          }

          .description-mobile {
            display: block;

            .text {
              color: #44675F;
              // white-space: nowrap;
            }
          }
        }

        .login-password {
          padding-bottom: 0px;
        }
        
        // 2022.01.18 因為安全密碼暫時拔掉，所以信箱綁定的border也拔掉
        .bind-email {
          border: 0px;
        }

      }
    }
  }
}

</style>
