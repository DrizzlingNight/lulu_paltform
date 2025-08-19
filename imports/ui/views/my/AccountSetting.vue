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
        <!-- 2021.12.30 因應LM-107單 個人中心功能調整 交易密碼暫時隱藏 -->
        <!-- <div class="deal-password">
          <p class="text">{{ $t('my.accountSetting.dealPassword') }}</p>
          <div class="description">
            <img v-if="user.tradePassword" :src="'/static/ui/assets/img/check-mark-circle.png'">
            <img v-else :src="'/static/ui/assets/img/exclamation-mark-triangle.png'">
            <p class="text">{{ $t('my.accountSetting.dealPassword_description') }}</p>
          </div>
          <p class="button" @click="openDealPasswordDialog">{{ user.tradePassword ? $t('base.modify')  : $t('my.accountSetting.dealPassword_button') }}</p>
        </div> -->
      </div>
    </div>
    <!-- 2021.12.21 設計圖看錯，其實它是設計的註解，實際沒有這段文字 -->
    <!-- <div class="right">
      <p class="text">{{ `${$t('my.accountSetting.alreadySet')}${$t('my.accountSetting.modify')}` }}</p>
    </div> -->

    <!-- 修改密碼彈窗 -->
    <CustomDialog
      :show="isModifyPasswordShow"
      :title="$t('my.accountSetting.modifyPassword')"
      :disabled="!isModifyPasswordValid"
      :loading="isLoading"
      @closeDialog="closeModifyPasswordDialog"
      @confirm="modifyPassword"
    >
      <template #content>
        <v-form
          ref="form"
          v-model="isModifyPasswordValid"
          style="margin: 0;background:red;"
        >
          <div class="old-password">
            <!-- <p>{{ $t('my.accountSetting.oldPassword') }}</p> -->
            <v-text-field
              v-model="data.oldPassword"
              :label="$t('my.accountSetting.placeholder_oldPassword')"
              :rules="[passwordRules]"
              color="btnColor"
              @input="validate"
            >
            </v-text-field>
          </div>
          <div class="new-password">
            <!-- <p>{{ $t('my.accountSetting.newPassword') }}</p> -->
            <v-text-field
              v-model="data.newPassword"
              :label="$t('my.accountSetting.placeholder_newPassword')"
              :rules="[passwordRules]"
              color="btnColor"
              @input="validate"
            >
            </v-text-field>
          </div>
          <div class="confirm-password">
            <!-- <p>{{ $t('my.accountSetting.confirmPassword') }}</p> -->
            <v-text-field
              v-model="data.confirmPassword"
              :label="$t('my.accountSetting.placeholder_confirmPassword')"
              :rules="[confirmPasswordRules]"
              color="btnColor"
              @input="validate"
            >
            </v-text-field>
          </div>
        </v-form>
      </template>
    </CustomDialog>

    <!-- 手機綁定彈窗 -->
    <CustomDialog
      :show="isBindPhoneShow"
      :title="$t('my.accountSetting.bindPhone')"
      :disabled="!isBindPhoneValid"
      :loading="isLoading"
      @closeDialog="closeBindPhoneDialog"
      @confirm="bindPhone"
    >
      <template #content>
        <p class="bindPhone-description">{{ $t('my.accountSetting.bindPhoneDialog_description') }}</p>
        <v-form
          ref="form"
          v-model="isBindPhoneValid"
          style="margin: 0"
        >
          <!-- 手機 -->
          <p class="phone">
            {{ $t('base.phone') }}
            <span>*</span>
          </p>
          <PhoneInput :data="data" />
          <!-- 驗證碼 -->
          <p class="phoneVerificationCode">
            {{ $t('base.phoneVerificationCode') }}
          <span>*</span>
          </p>
          <VerificationCodeInput :data="data" :codeType="4" :disabled="!isPhoneValid" />
          <!-- 設置密碼(註冊類型為錢包註冊 && 沒有綁定過手機與郵箱 才顯示) -->
          <template v-if="user.registerType === 'metaMask' && !user.emails && !user.mobile">
            <div class="new-password">
              <!-- <p>{{ $t('my.accountSetting.newPassword') }}</p> -->
              <v-text-field
                v-model="data.newPassword"
                autocomplete="new-password"
                :type="showPassword ? 'text':'password'"
                :label="$t('my.accountSetting.placeholder_newPassword')"
                :rules="[passwordRules]"
                color="btnColor"
                @input="validate"
              >
                <!-- 密碼是否可見 toggle -->
                <template v-slot:append>
                  <v-img @click="showPassword = !showPassword" class="eyeImg my-auto" style="cursor:pointer" width="32px"
                      height="32px"
                      :src="showPassword ? '/static/ui/topbar/openPassword.png':'/static/ui/topbar/closePassword.png'"></v-img>
                </template>
              </v-text-field>
            </div>
            <div class="confirm-password">
              <!-- <p>{{ $t('my.accountSetting.confirmPassword') }}</p> -->
              <v-text-field
                v-model="data.confirmPassword"
                autocomplete="new-password"
                :type="showPassword ? 'text':'password'"
                :label="$t('my.accountSetting.placeholder_confirmPassword')"
                :rules="[confirmPasswordRules]"
                color="btnColor"
                @input="validate"
              >
              </v-text-field>
            </div>
          </template>
        </v-form>
      </template>
    </CustomDialog>

    <!-- 郵箱綁定彈窗 -->
    <CustomDialog
      :show="isBindEmailShow"
      :title="$t('my.accountSetting.bindEmail')"
      :disabled="!isBindEmailValid"
      :loading="isLoading"
      @closeDialog="closeBindEmailDialog"
      @confirm="bindEmail"
    >
      <template #content>
        <p class="bindEmail-description">{{ $t('my.accountSetting.bindEmailDialog_description') }}</p>
        <v-form
          ref="form"
          v-model="isBindEmailValid"
          style="margin: 0"
        >
          <!-- 郵箱 -->
          <p class="email">
            {{ $t('base.email') }}
            <span>*</span>
          </p>
          <v-text-field
            v-model="data.email"
            :label="$t('my.accountSetting.placeholder_bindEmail')"
            :rules="[emailRules]"
            color="btnColor"
          >
          </v-text-field>
          <!-- 驗證碼 -->
          <p class="emailVerificationCode">
            {{ $t('base.emailVerificationCode') }}
            <span>*</span>
          </p>
          <VerificationCodeInput :data="data" inputType="email" :codeType="4" :disabled="!isEmailValid" />
          <!-- 設置密碼(註冊類型為錢包註冊 && 沒有綁定過手機與郵箱 才顯示) -->
          <template v-if="user.registerType === 'metaMask' && !user.emails && !user.mobile">
            <div class="new-password">
              <!-- <p>{{ $t('my.accountSetting.newPassword') }}</p> -->
              <v-text-field
                v-model="data.newPassword"
                autocomplete="new-password"
                :type="showPassword ? 'text':'password'"
                :label="$t('my.accountSetting.placeholder_newPassword')"
                :rules="[passwordRules]"
                color="btnColor"
                @input="validate"
              >
                <!-- 密碼是否可見 toggle -->
                <template v-slot:append>
                  <v-img @click="showPassword = !showPassword" class="eyeImg my-auto" style="cursor:pointer" width="32px"
                      height="32px"
                      :src="showPassword ? '/static/ui/topbar/openPassword.png':'/static/ui/topbar/closePassword.png'"></v-img>
                </template>
              </v-text-field>
            </div>
            <div class="confirm-password">
              <!-- <p>{{ $t('my.accountSetting.confirmPassword') }}</p> -->
              <v-text-field
                v-model="data.confirmPassword"
                autocomplete="new-password"
                :type="showPassword ? 'text':'password'"
                :label="$t('my.accountSetting.placeholder_confirmPassword')"
                :rules="[confirmPasswordRules]"
                color="btnColor"
                @input="validate"
              >
              </v-text-field>
            </div>
          </template>
        </v-form>
      </template>
    </CustomDialog>
    
    <!-- 交易密碼彈窗 -->
    <CustomDialog
      :show="isDealPasswordShow"
      :title="$t('my.accountSetting.dealPasswordDialog_title')"
      :disabled="!isDealPasswordValid"
      :loading="isLoading"
      @closeDialog="closeDealPasswordDialog"
      @confirm="setDealPassword"
    >
      <template #content>
        <v-form
          ref="form"
          v-model="isDealPasswordValid"
          style="margin: 0"
        >
          <div v-if="!user.tradePassword" class="dealPassword-firstBind">
            <div v-if="user.registerType === 'email'">
              <p>
                {{ $t('my.accountSetting.email_bind') }}
                <span>{{ user.username }}</span>
              </p>
              <VerificationCodeInput :data="data" inputType="email" :codeType="5" />
            </div>
            <div v-else>
              <p>
                {{ $t('my.accountSetting.phone_bind') }}
                <span>{{ `+${user.iddCode} ${user.username}` }}</span>
              </p>
              <VerificationCodeInput :data="data" :codeType="5" />
            </div>
          </div>
          <div v-else>
            <v-text-field
              v-model="data.oldDealPassword"
              :label="$t('my.accountSetting.placeholder_oldDealPassword')"
              :rules="[passwordRules]"
              color="btnColor"
              class="oldDealPassword"
              @input="validate"
            >
            </v-text-field>
          </div>
          <p class="dealPassword-description">{{ $t('my.accountSetting.dealPasswordDialog_description') }}</p>
          <v-text-field
            v-model="data.dealPassword"
            :label="$t('my.accountSetting.placeholder_dealPassword')"
            :rules="[passwordRules]"
            color="btnColor"
            class="dealPassword"
            @input="validate"
          >
          </v-text-field>
          <v-text-field
            v-model="data.confirmDealPassword"
            :label="$t('my.accountSetting.placeholder_confirmDealPassword')"
            :rules="[confirmDealPasswordRules]"
            color="btnColor"
            class="confirmDealPassword"
            @input="validate"
          >
          </v-text-field>
        </v-form>
      </template>
    </CustomDialog>
  </div>
</template>

<script>
import CustomDialog from '/imports/ui/components/customDialog/CustomDialog'
import PhoneInput from '/imports/ui/components/phoneInput/PhoneInput'
import VerificationCodeInput from '/imports/ui/components/verificationCodeInput/VerificationCodeInput'
import { Accounts } from 'meteor/accounts-base'

import { mapGetters } from 'vuex'

export default {
  name: 'AccountSetting',
  components: {
    CustomDialog,
    PhoneInput,
    VerificationCodeInput,
  },
  data() {
    return {
      showPassword: false,
      isLoading: false,
      isModifyPasswordShow: false,
      isBindPhoneShow: false,
      isBindEmailShow: false,
      isDealPasswordShow: false,
      isModifyPasswordValid: false,
      isBindPhoneValid: false,
      isBindEmailValid: false,
      isDealPasswordValid: false,
      data: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
        phone: '',
        phoneCode: '+886',
        verificationCode: '',
        email: '',
        oldDealPassword: '',
        dealPassword: '',
        confirmDealPassword: '',
      }
    }
  },
  computed: {
    ...mapGetters(['user']),
    isPhoneValid() {
      const result = this.phoneRules(this.data.phone) === true
      return result
    },
    isEmailValid() {
      const result = this.emailRules(this.data.email) === true
      return result
    },
  },
  mounted() {
    console.log(Meteor.user())
  },
  methods: {

    // 把email截取部分字段顯示
    emailHandler(email) {
      const start = email.substring(0,3)
      const end = email.split('@')[1]
      const result = `${start}...@${end}`
      return result
    },

    validate() {
      this.$refs.form.validate()
    },

    // 清空表單
    reset() {
      this.data = {
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
        phone: '',
        phoneCode: '+886',
        verificationCode: '',
        email: '',
        oldDealPassword: '',
        dealPassword: '',
        confirmDealPassword: '',
      }
      this.$refs.form.reset() // 重置表單驗證狀態
    },

    // 關閉密碼修改彈窗、重製表單
    closeModifyPasswordDialog() {
      this.reset()
      this.isModifyPasswordShow = false
      this.isModifyPasswordValid = false
    },

    // 關閉綁定手機彈窗、重製表單
    closeBindPhoneDialog() {
      this.reset()
      this.isBindPhoneShow = false
      this.isBindPhoneValid = false
    },

    // 關閉綁定郵箱、重製表單
    closeBindEmailDialog() {
      this.reset()
      this.isBindEmailShow = false
      this.isBindEmailValid = false
    },

    // 打開修改密碼彈窗，並帶入用戶帳號資料
    openDealPasswordDialog() {
      if (this.user.registerType === 'email') {
        this.data.email = this.user.username
      } else {
        this.data.phone = this.user.username
        this.data.phoneCode = `+${this.user.iddCode}`
      }
      this.isDealPasswordShow = true
    },

    // 關閉修改密碼彈窗
    closeDealPasswordDialog() {
      this.reset()
      this.isDealPasswordShow = false
      this.isDealPasswordValid = false
    },

    // 送出修改密碼請求
    modifyPassword(){
      if (this.isModifyPasswordValid) {
        this.isLoading = true

        Accounts.changePassword(this.data.oldPassword, this.data.newPassword, (err, res)=>{
          if (err) {
            console.error('modifyPassword err', err)
            this.toasterErr(Number(err.reason) || 20010)
          } else {
            console.log('modifyPassword res', res)
            this.toasterSuccess(this.$t('tip.modifySuccess'))
          }

          this.isLoading = false
          this.closeModifyPasswordDialog()
        })
      }
    },

    // 綁定手機 (與metaMask註冊用戶設定密碼)
    bindPhone() {
      if (this.isBindPhoneValid) {
        this.isLoading = true

        // 視是否有密碼情況帶入密碼參數
        const phone = this.data.phone
        const verificationCode = this.data.verificationCode
        const newPassword = this.data.newPassword
        const countryCode = this.data.phoneCode.substring(1)

        const payload = newPassword ? [phone, verificationCode, newPassword, countryCode] : [phone, verificationCode, newPassword, countryCode]

        Meteor.call('bindContactMethod', ...payload, (err, res)=>{
          if (err) {
            console.error('bindPhone err', err)
            this.toasterErr(Number(err.reason) || err.reason)
          } else {
            console.log('bindPhone res', res)
            this.toasterSuccess(this.$t('tip.bindSuccess'))
          }

          this.isLoading = false
          this.closeBindPhoneDialog()
          this.user()
        })
      }
    },

    // 綁定郵箱 (與metaMask註冊用戶設定密碼)
    bindEmail() {
      if (this.isBindEmailValid) {
        this.isLoading = true

        // 視是否有密碼情況帶入密碼參數
        const email = this.data.email
        const verificationCode = this.data.verificationCode
        const newPassword = this.data.newPassword

        const payload = newPassword ? [email, verificationCode, newPassword] : [email, verificationCode]

        Meteor.call('bindContactMethod', ...payload, (err, res)=>{
          if (err) {
            console.error('bindEmail err', err)
            this.toasterErr(Number(err.reason) || err.reason)
          } else {
            console.log('bindEmail res', res)
            this.toasterSuccess(this.$t('tip.bindSuccess'))
          }

          this.isLoading = false
          this.closeBindEmailDialog()
          this.user()
        })
      }
    },

    // 修改交易密碼
    setDealPassword() {
      if (this.isDealPasswordValid) {
        let params = {}
        if (!this.user.tradePassword) {
          params = {
            password: this.data.dealPassword,
            code: this.data.verificationCode,
          }
        } else {
          params = {
            password: this.data.dealPassword,
            oldPassword: this.data.oldDealPassword,
          }
        }

        this.isLoading = true

        Meteor.call('setTradePassword', params, (err, res)=>{
          if (err) {
            console.error('setTradePassword err', err)
            this.toasterErr(Number(err.reason) || 20010)
          } else {
            console.log('setTradePassword res', res)
            this.toasterSuccess(this.$t('tip.setSuccess'))
          }

          this.isLoading = false
          this.user()
          this.closeDealPasswordDialog()
        })
      }
    },

    // ******** input格式驗證 start ********

    // 手機格式驗證
    phoneRules(v) {
      if (!v)
        return this.$t('topbar.phoneRequired')
      // if (!(/^((13[0-9])|(17[0-1,6-8])|(15[^4,\\D])|(18[0-9]))\d{8}$/).test(v)) {
      //   return this.$t('topbar.phoneValid')
      // }
      return true
    },

    // 郵箱格式驗證
    emailRules(v) {
      if (!v)
        return this.$t('topbar.emailRequired')
      if (!(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(v))) {
        return this.$t('topbar.emailValid')
      }
      return true
    },

    // 密碼格式驗證
    passwordRules(v) {
      if (!v)
        return this.$t('topbar.passwordRequired')
      let length = v.length
      if (length < 6 || length > 18)
        return this.$t('topbar.passwordValid')
      return true
    },

    // 密碼確認格式驗證
    confirmPasswordRules(v) {
      if (!v)
        return this.$t('topbar.passwordRequired')
      if (v !== this.data.newPassword)
        return this.$t('topbar.againSetUpPasswordValid')
      return true
    },

    // 交易密碼確認格式驗證
    confirmDealPasswordRules(v) {
      if (!v)
        return this.$t('topbar.passwordRequired')
      if (v !== this.data.dealPassword)
        return this.$t('topbar.againSetUpPasswordValid')
      return true
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
  background: $commonBackground3;
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
      background: $commonContentColor30 !important;
      border-radius: 5px;
      padding: 24px 24px 0px 24px;
      // box-shadow: 0px 5px 8px 1px rgba(0, 20, 15, 0.5);

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
              color: $commonContentColor;
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
            color: $commonContentColor;
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

.CustomDialog {
  .v-card__text {
    .old-password,
    .new-password,
    .confirm-password {
      display: flex;
      flex-basis: row;
      align-items: center;
      justify-content: space-between;

      p {
        width: 100px;
        color: #FFFFFF;
        // font-size: 16px;
      }

      .v-text-field {
        flex-grow: 1;
        
        // input {
        //   color: #44675F;
        // }
      }
    }

    .bindPhone-description,
    .bindEmail-description {
      color: #FFFFFF;
      // font-size: 14px;
      margin-top: 24px;
      margin-bottom: 18px;
    }

    .phone,
    .email,
    .phoneVerificationCode,
    .emailVerificationCode {
      color: #FFFFFF;
      // font-size: 14px;
      margin-bottom: 0px;

      span {
        color: #CF2C46;
      }
    }

    .dealPassword-firstBind {
      margin-top: 24px;

      p {
        font-size: 16px;
        color: #FFFFFF;

        span {
          color: #F7CD0A;
        }
      }

    }

    .oldDealPassword {
      margin-top: 24px;
    }

    .dealPassword-description {
      color: #95C6B7;
      font-size: 14px;
      margin-top: 24px;
      margin-bottom: 18px;
    }

    .dealPassword,
    .confirmDealPassword {
      padding-top: 0px;
    }
  }
}

@media screen and (max-width: 1264px) {
  // .AccountSetting {
  //   .left {
  //     .content {
  //       .login-password,
  //       .bind-phone,
  //       .bind-email,
  //       .deal-password {
  //         // flex-direction: column;
  //       }
  //     }
  //   }
  // }
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
