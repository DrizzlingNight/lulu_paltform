<template>
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
                    :src="showPassword ? '/static/ui/topbar/openPassword.svg':'/static/ui/topbar/closePassword.svg'"></v-img>
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
</template>

<script>
import CustomDialog from '/imports/ui/components/customDialog/CustomDialog'
import VerificationCodeInput from '/imports/ui/components/verificationCodeInput/VerificationCodeInput'

import { mapGetters } from 'vuex'

export default {
  name: 'BindEmailDialog',
  components: {
    VerificationCodeInput,
    CustomDialog
  },
  props: {
    isBindEmailShow: {
      type: Boolean,
      default: false,
    }
  },
  data: () => ({
    showPassword: false,
    isLoading: false,
    isBindEmailValid: false,
    data: {
      email: '',
      verificationCode: '',
      newPassword: '',
      confirmPassword: '',
    }
  }),
  computed: {
    ...mapGetters(['user']),
    isEmailValid() {
      const result = this.emailRules(this.data.email) === true
      return result
    },
  },
  watch: {
    isBindEmailShow(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          this.reset()
        })
      }
    }
  },
  methods: {
    // 清空表單
    reset() {
      this.data = {
        email: '',
        verificationCode: '',
        newPassword: '',
        confirmPassword: '',
      }
      this.$refs.form.resetValidation() // 重置表單驗證狀態
    },
    // 關閉密碼修改彈窗、重製表單
    closeBindEmailDialog() {
      this.reset()
      this.isBindEmailValid = false
      this.$emit('close')
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
    // ******* 輸入格式驗證 ********
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
    validate() {
      this.$refs.form.validate()
    },
  },
  meteor: {
    user() {
      return Meteor.user()
    },
  }
}
</script>

<style lang="scss" scoped>
.CustomDialog {
  .v-card__text {
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
  }
}

</style>