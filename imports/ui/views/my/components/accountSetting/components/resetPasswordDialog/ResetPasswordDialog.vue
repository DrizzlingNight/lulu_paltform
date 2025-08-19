<template>
  <div>
    <v-dialog
        v-model="isResetPasswordDialogShow"
        max-width="480px"
        persistent
    >
      <v-card class="card list pb-4 pb-sm-10" style="overflow-y: auto">
        <div style="max-height: 84vh">
          <v-card-subtitle class="text-right pa-0 cardSubtitle"
              style="margin-right: 21px;margin-top: 14px;height: 18px">
            <v-btn text x-small class="pa-0" min-width="18">
              <v-img @click="close" class="float-right" style="cursor: pointer;z-index: 999"
                  src="/static/ui/topbar/close.png" width="18" height="18" contain></v-img>
            </v-btn>
          </v-card-subtitle>
          <div class="d-flex flex-column">
            <!--        找回方式選擇-->
            <div class="divLogin" style="margin: 33px auto 33px;">
              <v-btn
                  text
                  class="pa-0"
                  height="24px"
                  :class="resetWay === 'email' ? 'isbtnColor' : 'disBtnColor'"
                  @click="setResetWay('email')"
                  style="font-size: 24px;line-height: 24px;height: 24px;background: transparent !important;height: 24px !important;"
              >
              <span class="titleLogin text-capitalize" style="font-size: 24px">{{
                  $t('topbar.emailRetrieve')
                }}</span>
              </v-btn>
              <div class="d-inline-block" style="width: 16px"></div>
              <v-btn
                  text
                  class="pa-0"
                  height="24px"
                  :class="resetWay === 'phone' ? 'isbtnColor' : 'disBtnColor'"
                  @click="setResetWay('phone')"
                  style="font-size: 24px;line-height: 24px;height: 24px;background: transparent !important;height: 24px !important;"
              >
              <span class="titleLogin text-capitalize" style="font-size: 24px">{{
                  $t('topbar.phoneRetrieve')
                }}</span>
              </v-btn>
            </div>
            <!--        表单输入-->
            <v-container class="py-0 container">
              <v-row no-gutters>
                <v-col cols="12" class="pa-0 mx-auto formCol" style="max-width: 380px;">
                  <v-form
                      class="loginForm"
                      ref="form"
                      style="margin: 0">
                    <!--          邮箱-->
                    <v-text-field
                        color="btnColor"
                        name="email"
                        v-if="resetWay === 'email'"
                        v-model="form.email"
                        :label="$t('topbar.inputEmail')"
                        :rules="[emailRules]"
                        validate-on-blur
                    ></v-text-field>
                    <!--          电话-->
                    <v-text-field
                        color="btnColor"
                        name="phone"
                        class="phonenumber-label"
                        v-else-if="resetWay === 'phone'"
                        v-model="showPhone"
                        :label="$t('topbar.inputPhone')"
                        :rules="[phoneRules]"
                        @keyup="inputMobile" @paste="inputMobile"
                        validate-on-blur
                    >
                      <!-- 手機國碼選單 -->
                      <v-menu
                          slot="prepend-inner"
                          offset-y
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn plain
                              text
                              color="white"
                              class="pa-0 mr-5"
                              style="background: transparent !important;height: 32px !important;width: 20px;"
                              v-bind="attrs"
                              v-on="on">
                          <span style="font-size: 18px;height: 18px;line-height: 18px;font-weight: 600"
                                class="white--text">{{
                              phoneCode
                            }}</span>
                            <v-img v-if="attrs['aria-expanded'] === 'true'" style="margin-left: 7px;" max-width="12"
                                max-height="8"
                                src="/static/ui/components/menu-up.png"></v-img>
                            <v-img v-else style="margin-left: 7px;" max-width="12" max-height="8"
                                src="/static/ui/components/menu-down.png"></v-img>
                          </v-btn>
                        </template>
                        <v-list min-width="144" max-height="500" style="background: #00322E;">
                          <v-list-item
                              v-for="(item, index) in countryCodes"
                              :key="index"
                              class="listItem"
                              @click="choicePhone(item)"
                              style="padding-left: 14px;padding-right: 17px;min-height: 46px;border-bottom: 0.5px solid #2D4742"
                          >
                            <span class="white--text" style="font-size: 17px;font-weight: 600">{{
                                `${item.code}`
                              }}</span>
                            <v-spacer></v-spacer>
                            <span class="white--text" style="font-size: 17px;font-weight: 600">{{
                                `${item.countryCode}`
                              }}</span>
                          </v-list-item>

                        </v-list>
                      </v-menu>
                    </v-text-field>
                    <!--                验证码-->
                    <v-text-field
                        :readonly="isCodeInputReadonly"
                        type="text"
                        name="code"
                        @focus="isCodeInputReadonly = false"
                        v-model="form.code"
                        class="verification-code textField"
                        style="margin-top: 11px"
                        color="btnColor"
                        :label="$t(resetWay === 'phone' ? 'topbar.phoneVerificationCode' : 'topbar.emailVerificationCode')"
                        :rules="[verificationCodeRules]"
                        validate-on-blur
                    >
                      <template v-slot:append>
                      </template>
                    </v-text-field>
                    <!-- 發送驗證碼按鈕 -->
                    <v-btn
                        height="34px"
                        class="d-flex float-right px-3 codeBtn"
                        @click.prevent="sendCode"
                        :loading="sendLoading"
                        :disabled="verificationBtn"
                        :class="verificationBtn ? 'defaultSend':'activeSend'"
                        style="border-radius: 20px;background:transparent !important;margin-top: -63px;z-index: 999"
                    >
                      <span
                          v-if="sendFirst" :class="verificationBtn ? 'fontColor4--text':'white--text'"
                          style="font-size: 10px"
                      >
                        {{ $t("topbar.getVerificationCode") }}
                      </span>
                      <span
                          v-if="sendPassword"
                          style="height: 32px;line-height: 32px;font-size: 12px"
                          class="white--text"><span
                          class="fontColor--text" style="font-size: 10px"
                      >
                        {{time}}S
                      </span>
                        {{ $t("topbar.verificationCodeMessage") }}
                      </span>
                    </v-btn>
                    <!--          密码-->
                    <v-text-field
                        style="margin-top: 11px"
                        name="password"
                        autocomplete="new-password"
                        color="btnColor"
                        id="search"
                        class="textField"
                        :type="showPassword ? 'text':'password'"
                        :label="$t('topbar.setUpPassword')"
                        :rules="[passwordRules]"
                        v-model="form.password"
                        validate-on-blur
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
                    <!--          验证密码-->
                    <v-text-field
                        style="margin-top: 11px"
                        color="btnColor"
                        class="textField"
                        v-model="form.againPassword"
                        :type="showPassword ? 'text':'password'"
                        :label="$t('topbar.againSetUpPassword')"
                        :rules="[confirmPasswordRules]"
                        validate-on-blur
                    >
                    </v-text-field>
                    <v-btn class="goBtn" :disabled="isBtnDisabled" style="margin-top: 19px;border-radius: 6px" block @click="resetPassword"><span
                        class="span">{{
                        $t('topbar.passwordConfirm')
                      }}</span>
                    </v-btn>
                  </v-form>
                </v-col>
              </v-row>
            </v-container>
          </div>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import countryCode from "/imports/settings/countryCode";
import {mapGetters} from "vuex";
import i18n from '../../../../../../lang';

export default {
  name: 'ResetPasswordDialog',
  props: {
    isResetPasswordDialogShow: {
      type: Boolean,
      default: false,
    }
  },
  data: () => ({
    resetWay: "email", // "email", // "phone" ,
    showPassword: false,
    showPhone: '',
    time: null,
    phoneCode: '',
    sendFirst: true,
    sendLoading: false,
    sendPassword: false,
    form: {
      email: null,
      phone: null,
      countryCode: null,
      code: null,
      password: null,
      againPassword: null,
    },
    isCodeInputReadonly: true,
  }),
  mounted() {
    this.time = this.config.sms.timeLimit
    this.initCountryCode()
  },
  computed: {
    ...mapGetters(["config"]),
    countryCodes() {
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

      // zh-TW
      codes.unshift(vnCode)
      codes.unshift(krCode)
      codes.unshift(usCode)
      codes.unshift(twCode)

      if (locale === "en-EN") {
        codes.splice(1,1)
        codes.unshift(usCode)
      } else if (locale === "kr-KR") {
        codes.splice(2,1)
        codes.unshift(krCode)
      } else if (locale === "vi-VI") {
        codes.splice(3,1)
        codes.unshift(vnCode)
      }

      return codes
    },
    isBtnDisabled() {
      // 信箱
      if (this.resetWay === 'email') {
        return this.form.email === null
          || (!(/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(this.form.email)))
          || this.form.password === null
          || this.form.password.length < 6
          || this.form.password.length > 18
          || this.form.code === null
          || this.form.againPassword === null
          || this.form.againPassword !== this.form.password
      // 手機
      } else {
        return this.form.phone === null
          || (!(/^[0-9０-９٠-٩۰-۹]{2}$|^[+＋]*(?:[-x‐-―−ー－-／  ­ ⁠ ()（）［］.\[\]/~⁓∼～*]*[0-9０-９٠-٩۰-۹]){3,}[-x‐-―−ー－-／  ­ ⁠ ()（）［］.\[\]/~⁓∼～0-9０-９٠-٩۰-۹]*(?:;ext=([0-9０-９٠-٩۰-۹]{1,7})|[  \t,]*(?:e?xt(?:ensi(?:ó?|ó))?n?|ｅ?ｘｔｎ?|[,xｘ#＃~～]|int|anexo|ｉｎｔ)[:\.．]?[  \t,-]*([0-9０-９٠-٩۰-۹]{1,7})#?|[- ]+([0-9０-９٠-٩۰-۹]{1,5})#)?$/i).test(this.form.phone))
          || this.form.password === null
          || this.form.password.length < 6
          || this.form.password.length > 18
          || this.form.code === null
          || this.form.againPassword === null
          || this.form.againPassword !== this.form.password
      }
    },
    verificationBtn() {
      if (this.resetWay === 'email') {
        if (this.form.email === null || !(/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(this.form.email)) || this.sendPassword) {
          return true
        } else return false
      } else if (this.resetWay === 'phone') {
        if (this.form.phone === null || !(/^[0-9０-９٠-٩۰-۹]{2}$|^[+＋]*(?:[-x‐-―−ー－-／  ­ ⁠ ()（）［］.\[\]/~⁓∼～*]*[0-9０-９٠-٩۰-۹]){3,}[-x‐-―−ー－-／  ­ ⁠ ()（）［］.\[\]/~⁓∼～0-9０-９٠-٩۰-۹]*(?:;ext=([0-9０-９٠-٩۰-۹]{1,7})|[  \t,]*(?:e?xt(?:ensi(?:ó?|ó))?n?|ｅ?ｘｔｎ?|[,xｘ#＃~～]|int|anexo|ｉｎｔ)[:\.．]?[  \t,-]*([0-9０-９٠-٩۰-۹]{1,7})#?|[- ]+([0-9０-９٠-٩۰-۹]{1,5})#)?$/i).test(this.form.phone) || this.sendPassword) {
          return true
        } else return false
      }
    },
  },
  methods: {
    //重置数据
    reset() {
      this.initCountryCode()
      this.showPhone = null,
      this.form.email = null,
      this.form.phone = null,
      this.form.code = null,
      this.form.password = null,
      this.form.againPassword = null

      this.$refs.form.resetValidation()
    },
    //手機號碼中加空格
    inputMobile() {
      let value = this.showPhone.replace(/\D/g, '').substr(0, 11) // 不允许输入非数字字符，超过11位数字截取前11位
      let len = value.length
      if (len > 3 && len < 8) {
        value = value.replace(/^(\d{3})/g, '$1 ')
      } else if (len >= 8) {
        value = value.replace(/^(\d{3})(\d{4})/g, '$1 $2 ')
      }
      this.showPhone = value
      this.form.phone = this.showPhone.replace(/\s+/g, "")
    },
    //發送驗證碼
    sendCode() {
      if (this.sendPassword) {
        return
      }
      this.sendFirst = false
      this.sendLoading = true
      let first
      let type
      let code
      if (this.resetWay === 'email') {
        first = this.form.email
      } else {
        code = this.phoneCode.substring(1)
        first = this.form.phone
      }

      type = 2 // 找回密碼
      Meteor.call("sendCode", first, type, code, (err, res) => {
        if (err) {
          this.sendLoading = false
          this.sendFirst = true

          this.toasterErr(Number(err.reason) || err.reason)
        } else {
          this.sendLoading = false
          this.countTime()
          this.sendPassword = true
        }
      })
    },
    //找回密码
    resetPassword() {
      let first
      let code
      if (this.resetWay === 'email') {
        first = this.form.email
      } else {
        code = this.phoneCode.substring(1)
        first = this.form.phone
      }
      Meteor.call("forgetPassword", first, this.form.password, this.form.code, (err, res) => {
        if (err) {
          if (err.reason === '10101') {
            this.form.code = null
            this.$nextTick(() => {
              this.$refs.form.validate()
            })
          }
          this.toasterErr(Number(err.reason) || err.reason)
        } else {
          this.toasterSuccess(this.$t('topbar.passwordSuccess'))
          this.close()
        }
      })
    },
    //關閉
    close() {
      this.reset()
      this.resetWay = 'email'
      this.$emit('close')
    },
    //點擊選擇區號
    choicePhone(item) {
      this.phoneCode = item.code
    },
    //隱藏密碼
    clickHidePassword() {
      this.showPassword = !this.showPassword
    },
    initCountryCode() {
      this.phoneCode = this.countryCodes[0].code
      this.form.countryCode = this.countryCodes[0]
    },
    // 切換找回方式
    setResetWay(way) {
      this.resetWay = way
      this.reset()
    },

    // ******** 輸入欄位格式驗證 ********
    // 郵箱輸入格式驗證
    emailRules(v) {
      if (!v)
        return this.$t('topbar.emailRequired')
      if (!(/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(v))) {
        return this.$t('topbar.emailValid')
      }
      return true
    },
    // 手機號碼輸入格式驗證
    phoneRules(v) {
      if (!v)
        return this.$t('topbar.phoneRequired')
      if (!(/^[0-9０-９٠-٩۰-۹]{2}$|^[+＋]*(?:[-x‐-―−ー－-／  ­ ⁠ ()（）［］.\[\]/~⁓∼～*]*[0-9０-９٠-٩۰-۹]){3,}[-x‐-―−ー－-／  ­ ⁠ ()（）［］.\[\]/~⁓∼～0-9０-９٠-٩۰-۹]*(?:;ext=([0-9０-９٠-٩۰-۹]{1,7})|[  \t,]*(?:e?xt(?:ensi(?:ó?|ó))?n?|ｅ?ｘｔｎ?|[,xｘ#＃~～]|int|anexo|ｉｎｔ)[:\.．]?[  \t,-]*([0-9０-９٠-٩۰-۹]{1,7})#?|[- ]+([0-9０-９٠-٩۰-۹]{1,5})#)?$/i).test(this.form.phone)) {
        return this.$t('topbar.phoneValid')
      }
      return true
    },
    // 驗證碼輸入格式驗證
    verificationCodeRules(v) {
      if (!v)
        return this.$t('topbar.verificationCodeRequired')
      return true
    },
    // 密碼輸入格式驗證
    passwordRules(v) {
      if (!v) {
        return this.$t('topbar.passwordRequired')
      }
      let length = v.length
      if (length < 6 || length > 18)
        return this.$t('topbar.passwordValid')
      return true
    },
    // 密碼確認輸入格式驗證
    confirmPasswordRules(v) {
      if (!v)
        return this.$t('topbar.verificationCodeRequired')
      if (this.form.againPassword !== this.form.password)
        return this.$t('topbar.againSetUpPasswordValid')
      return true
    },
    // 倒數驗證碼發送CD
    countTime() {
      this.time = this.time - 1
      let timer = setTimeout(this.countTime, 1000)
      if (this.time === -1) {
        this.time = 30
        this.sendFirst = true
        this.sendPassword = false
        clearTimeout(timer)
      }
    },
  }
}
</script>

<style lang="scss" scoped>

.listItem {
  background: #00322E;
}

.listItem:nth-last-child(1) {
  border-bottom: 0 !important;
}

.phonenumber-label {
  .v-label--active {
    left: -87px !important;
  }
}

.theme--light.v-label {
  color: #44675F !important;
}

.isbtnColor {
  font-weight: 600 !important;
  color: #FFFFFF !important;
}

.disBtnColor {
  font-weight: 400 !important;
  color: rgba(255, 255, 255, 0.5) !important;
}

.theme--light.v-text-field > .v-input__control > .v-input__slot:before {
  border-color: #2D4742 !important;
}

.theme--light.v-input input {
  color: #FFFFFF !important;
}

.v-text-field .v-input__append-inner, .v-text-field .v-input__prepend-inner {
  margin-top: 0px;
}

.defaultSend {
  border: 1px solid #C3C3C3 !important;
}

.activeSend {
  border: 1px solid #59CF9E !important;
}

.card {
  background: linear-gradient(136deg, #06261F 0%, #08322D 100%);
  border-radius: 8px !important;
  border: 1px solid #00FFCA !important;
  box-shadow: 0px 5px 8px 1px rgba(0, 37, 19, 0.5) !important;
}

.list::-webkit-scrollbar {
  display: none !important;
}

.v-dialog {
  margin: 10px !important;
}
.span {
  color: white;
}

@media screen and (max-width: 600px) {
  .titleLogin {
    height: 24px;
    line-height: 24px;
    font-size: 16px !important;
  }
  .container {
    padding-left: 31px;
    padding-right: 31px;
  }
  .cardSubtitle {
    margin-top: 10px !important;
    margin-right: 13px !important;
  }
  .topImg {
    margin-top: -13px !important;
  }
  .goBtn {
    margin-top: 2px !important;
  }
  .v-btn--disabled {
    .span {
      color: white;

    }
  }
  .span {
    font-size: 12px !important;
  }
  .divLogin {
    margin-top: 16px !important;
    margin-bottom: 14px !important;
  }
  .textField {
    margin-top: 0px !important;
  }
  .formCol {
    margin-bottom: 8px !important;
  }
  .loginForm {

    .v-text-field {
      padding-top: 6px !important;
    }

    .v-label {
      font-size: 12px !important;
    }

    .v-text-field__slot {
      input {
        padding-bottom: 2px !important;
      }

    }

    .eyeImg {
      margin-top: 5px !important;
      width: 28px !important;
      height: 28px !important;
    }
  }
}
</style>
