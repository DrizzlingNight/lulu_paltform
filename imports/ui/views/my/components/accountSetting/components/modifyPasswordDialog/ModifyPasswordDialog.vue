<template>
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
        style="margin: 0"
      >
        <div class="old-password">
          <!-- <p>{{ $t('my.accountSetting.oldPassword') }}</p> -->
          <v-text-field
            v-model="data.oldPassword"
            class="custom-placeholer-color"
            :label="$t('my.accountSetting.placeholder_oldPassword')"
            :rules="[passwordRules]"
            :type="showPassword ? 'text':'password'"
            color="textColor"
            @input="validate"
          >
            <template v-slot:append>
              <v-img
                  @click="clickHidePassword"
                  class="eyeImg my-auto"
                  style="cursor:pointer"
                  width="32px"
                  height="32px"
                  :src="showPassword ? '/static/ui/topbar/openPassword.svg':'/static/ui/topbar/closePassword.svg'"></v-img>
            </template>
          </v-text-field>
        </div>
        <div class="new-password">
          <!-- <p>{{ $t('my.accountSetting.newPassword') }}</p> -->
          <v-text-field
            v-model="data.newPassword"
            :label="$t('my.accountSetting.placeholder_newPassword')"
            :rules="[passwordRules]"
            :type="showPassword ? 'text':'password'"
            color="textColor"
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
            :type="showPassword ? 'text':'password'"
            color="textColor"
            @input="validate"
          >
          </v-text-field>
        </div>
      </v-form>
    </template>
    <template #afterBtnText>
      <span @click="forgetPasswordOnclick" class="forget-password align-self-end pt-1">{{$t('topbar.forgetPassword')}}</span>
    </template>
  </CustomDialog>
</template>

<script>
import CustomDialog from '/imports/ui/components/customDialog/CustomDialog'

import { Accounts } from 'meteor/accounts-base'

export default {
  name: 'ModifyPasswordDialog',
  components: {
    CustomDialog
  },
  props: {
    isModifyPasswordShow: {
      type: Boolean,
      default: false,
    }
  },
  data: () => ({
    showPassword: false,
    isLoading: false,
    isModifyPasswordValid: false,
    data: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    }
  }),
  watch: {
    isModifyPasswordShow(newVal) {
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
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
      this.$refs.form.resetValidation() // 重置表單驗證狀態
    },
    // 關閉密碼修改彈窗、重製表單
    closeModifyPasswordDialog() {
      this.reset()
      this.isModifyPasswordValid = false
      this.$emit('close')
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
          this.$emit('close')
        })
      }
    },
    clickHidePassword() {
      this.showPassword = !this.showPassword
    },
    forgetPasswordOnclick() {
      this.closeModifyPasswordDialog()
      this.$emit('resetPassword')
    },
    // ******* 輸入格式驗證 ********
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
}
</script>

<style lang="scss" scoped>

.eyeImg {
  margin-top: 5px !important;
  width: 28px !important;
  height: 28px !important;
}

.forget-password {
  font-size: 12px;
  color: #59CF9E;
  cursor: pointer;
}

.custom-placeholer-color input::placeholder {
  color: #59CF9E !important;
  opacity: 1;
}

</style>