<template>
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
import PhoneInput from '/imports/ui/components/phoneInput/PhoneInput'
import VerificationCodeInput from '/imports/ui/components/verificationCodeInput/VerificationCodeInput'
import countryCode from "/imports/settings/countryCode"
import i18n from "../../../../../../lang"

import { mapGetters } from 'vuex'

export default {
  name: 'BindPhoneDialog',
  components: {
    CustomDialog,
    PhoneInput,
    VerificationCodeInput
  },
  props: {
    isBindPhoneShow: {
      type: Boolean,
      default: false,
    }
  },
  data: () => ({
    showPassword: false,
    isLoading: false,
    isBindPhoneValid: false,
    data: {
      phone: '',
      phoneCode: '',
      verificationCode: '',
      newPassword: '',
      confirmPassword: '',
    }
  }),
  mounted () {
    this.data.phoneCode = this.iddCode
  },
  computed: {
    ...mapGetters(['user']),
    isPhoneValid() {
      const result = this.phoneRules(this.data.phone) === true
      return result
    },
    iddCode() {
      let codes = JSON.parse(JSON.stringify(countryCode))

      let twIdx = -1
      let usIdx = -1
      let krIdx = -1
      let vnIdx = -1

      for(let i = 0;i < codes.length;++i) {
        const code = codes[i]
        if (code.countryCode === "TW") twIdx = i
        else if (code.countryCode === "US") usIdx = i
        else if (code.countryCode === "KR") krIdx = i
        else if (code.countryCode === "VN") vnIdx = i
      }

      let usCode = codes.splice(usIdx, 1)[0]
      let krCode = codes.splice(krIdx-1, 1)[0]
      let vnCode = codes.splice(vnIdx-2, 1)[0]
      let twCode = codes.splice(twIdx-3, 1)[0]

      const locale = i18n.locale

      let code = ''

      if (locale === "zh-TW") {
        code = twCode.code
      } else if (locale === "en-EN") {
        code = usCode.code
      } else if (locale === "kr-KR") {
        code = krCode.code
      } else if (locale === "vi-VI") {
        code = vnCode.code
      }
      return code
    },
  },
  watch: {
    isBindPhoneShow(newVal) {
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
        phone: '',
        phoneCode: this.iddCode,
        verificationCode: '',
        newPassword: '',
        confirmPassword: '',
      }
      this.$refs.form.resetValidation() // 重置表單驗證狀態
    },
    // 關閉密碼修改彈窗、重製表單
    closeBindPhoneDialog() {
      this.reset()
      this.isBindPhoneValid = false
      this.$emit('close')
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

        const payload = [phone, verificationCode, newPassword, countryCode]

        Meteor.call('bindContactMethod', ...payload, (err, res)=>{
          if (err) {
            this.toasterErr(Number(err.reason) || err.reason)
          } else {
            this.toasterSuccess(this.$t('tip.bindSuccess'))
          }

          this.isLoading = false
          this.closeBindPhoneDialog()
          this.user()
        })
      }
    },
    // ******* 輸入格式驗證 ********
    // 手機格式驗證
    phoneRules(v) {
      if (!v)
        return this.$t('topbar.phoneRequired')
      // if (!(/^((13[0-9])|(17[0-1,6-8])|(15[^4,\\D])|(18[0-9]))\d{8}$/).test(v)) {
      //   return this.$t('topbar.phoneValid')
      // }
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
      console.log('user', Meteor.user())
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