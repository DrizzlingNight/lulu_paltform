<template>
  <div>
    <v-dialog v-model="show"
              @click:outside="close" max-width="480px">
      <v-card class="card list" style="overflow-y: auto">
        <div style="max-height: 84vh">
          <v-card-subtitle class="text-right pa-0 cardSubtitle"
              style="margin-right: 21px;margin-top: 14px;height: 18px">
            <v-btn text x-small class="pa-0" min-width="18">
              <v-img @click="close" class="float-right" style="cursor: pointer;z-index: 999"
                  src="/static/ui/topbar/close.png" width="18" height="18" contain></v-img>
            </v-btn>
          </v-card-subtitle>
          <div class="d-flex flex-column">
            <!--        logo-->
            <div style="margin-top: -11px" class="topImg">
              <v-img class="col-12 pa-0" :src="logoImg" height="60" contain></v-img>
            </div>
            <!--        登录/注册方式选择-->
            <div class="divLogin" style="margin: 33px auto 33px;">
              <v-btn
                  text
                  class="pa-0"
                  height="24px"
                  :class="loginWay === 'email' ? 'isbtnColor' : 'disBtnColor'"
                  @click="setLoginWay('email')"
                  style="font-size: 24px;line-height: 24px;height: 24px;background: transparent !important;height: 24px !important;"
              >
              <span class="titleLogin text-capitalize" style="font-size: 24px">{{
                  $t(loginState === "signIn" ? "topbar.emailSignIn" : loginState === "signUp" ? "topbar.emailSignUp" : "topbar.emailRetrieve")
                }}</span>
              </v-btn>
              <div class="d-inline-block" style="width: 16px"></div>
              <v-btn
                  text
                  class="pa-0"
                  height="24px"
                  :class="loginWay === 'phone' ? 'isbtnColor' : 'disBtnColor'"
                  @click="setLoginWay('phone')"
                  style="font-size: 24px;line-height: 24px;height: 24px;background: transparent !important;height: 24px !important;"
              >
              <span class="titleLogin text-capitalize" style="font-size: 24px">{{
                  $t(loginState === "signIn" ? "topbar.phoneSignIn" : loginState === "signUp" ? "topbar.phoneSignUp" : "topbar.phoneRetrieve")
                }}</span>
              </v-btn>
            </div>
            <!--        表单输入-->
            <v-container class="py-0 container">
              <v-row no-gutters>
                <v-col cols="12" class="pa-0 mx-auto formCol" style="max-width: 380px;margin-bottom: 12px">
                  <v-form
                      class="loginForm"
                      ref="form"
                      v-model="valid"
                      style="margin: 0">
                    <!--          邮箱-->
                    <v-text-field
                        color="btnColor"
                        name="email"
                        v-if="loginWay === 'email'"
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
                        v-else-if="loginWay === 'phone'"
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
                    <div v-if="loginState != 'signIn'">
                      <v-text-field
                          :readonly="isCodeInputReadonly"
                          type="text"
                          name="code"
                          @focus="isCodeInputReadonly = false"
                          v-model="form.code"
                          class="verification-code textField"
                          style="margin-top: 11px"
                          color="btnColor"
                          :label="$t(loginWay === 'phone' ? 'topbar.phoneVerificationCode' : 'topbar.emailVerificationCode')"
                          :rules="[verificationCodeRules]"
                          validate-on-blur
                      >
                        <template v-slot:append>
                        </template>
                      </v-text-field>
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
                      <!--                        <v-progress-circular v-if="sendLoading" indeterminate color="fontColor"-->
                      <!--                                             :value="20"></v-progress-circular>-->
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
                    </div>
                    <!--          密码-->
                    <div>
                      <v-text-field
                          style="margin-top: 11px"
                          name="password"
                          autocomplete="new-password"
                          color="btnColor"
                          id="search"
                          class="textField"
                          :type="isPassword ? 'text':'password'"
                          :label="$t( loginState === 'signIn'?'topbar.inputPassword':'topbar.setUpPassword')"
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
                              :src="isPassword ? '/static/ui/topbar/openPassword.svg':'/static/ui/topbar/closePassword.svg'"></v-img>
                        </template>
                      </v-text-field>
                    </div>
                    <!--          验证密码-->
                    <v-text-field
                        v-if="loginState != 'signIn'"
                        style="margin-top: 11px"
                        color="btnColor"
                        class="textField"
                        v-model="form.againPassword"
                        :type="isPassword ? 'text':'password'"
                        :label="$t('topbar.againSetUpPassword')"
                        :rules="[againVerificationCodeRules]"
                        validate-on-blur
                    >
                    </v-text-field>
                    <!--                  邀请码-->
                    <v-text-field
                        color="btnColor"
                        v-if="loginState === 'signUp'"
                        v-model="form.referral"
                        :label="$t('topbar.inputinvitationCode')"
                        validate-on-blur
                        class="textField"
                        :rules="[referralRules]"
                    ></v-text-field>
                    <v-btn class="goBtn" :disabled="isBtnDisabled" :loading="isLoading" style="margin-top: 19px;border-radius: 6px" block @click="loginOrRegOrPassword"><span
                        class="span">{{
                        $t(loginState === "signIn" ? "topbar.signIn" : loginState === "signUp" ? "topbar.signUp" : "topbar.passwordConfirm")
                      }}</span>
                    </v-btn>
                  </v-form>
                </v-col>
              </v-row>
              <v-row no-gutters style="font-size: 12px">
                <v-col
                    v-if="loginState === 'signIn'"
                    cols="12" class="d-flex justify-space-between mx-auto"
                    style="max-width: 380px">
                  <div class="white--text">
                    {{ $t("topbar.noAccount") }}
                    <a
                        class="fontColor--text goSignUp"
                        style="font-size: 12px"
                        @click="goSignUp"
                    > {{ $t("topbar.signUp") }}</a>
                  </div>
                  <v-spacer></v-spacer>
                  <a @click="goPassword" style="font-size: 12px">{{ $t("topbar.forgetPassword") }}</a>
                </v-col>
                <v-col v-else cols="12" class="pa-0 mx-auto" style="max-width: 380px">
                  <div class="white--text">
                    {{ $t("topbar.haveAccount") }}<a class="fontColor--text" style="font-size: 12px" @click="goSignIn">
                    {{
                      $t("topbar.signIn")
                    }}</a>
                  </div>
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col
                    cols="12"
                    class="mx-auto text-center d-flex align-center justify-center white--text bottomCol"
                    style="margin-top: 22px;max-width: 380px;font-size: 12px;height: 12px;line-height: 12px"
                >
                  {{ $t(loginState === 'signIn' ? "topbar.loginAgreeService" : $t("topbar.registerAgreeService")) }}
                  <!-- <a class="btnColor--text" style="font-size: 12px">{{ $t("topbar.serviceTerms") }}</a> -->
                  <!-- // 插入 服務條款彈窗組件 -->
                  <ServiceTermsDialog/>
                </v-col>
              </v-row>
            </v-container>
          </div>
          <login-type @close="close"></login-type>
        </div>
      </v-card>
    </v-dialog>
    <!--    <login-prompt-box v-if="dialog" :loginDialogState="loginDialogState" :dialog="dialog"-->
    <!--                      @replyState="replyState"></login-prompt-box>-->
  </div>


</template>

<script>
import countryCode from "../../../../../settings/countryCode";
import LoginType from "./loginType";
// import LoginPromptBox from "./loginPromptBox";
import ServiceTermsDialog from "./ServiceTermsDialog";
import {mapGetters} from "vuex";
import { settings } from '/imports/settings';

import Storage from '/imports/utils/storage'
import i18n from '../../../../lang';

export default {
  name: "loginDialog",
  components: {LoginType, ServiceTermsDialog},
  props: [
    "show"
  ],
  data: () => ({
    loginState: "signIn", // "signIn", // "signUp", // password
    loginWay: "email", // "email", // "phone" ,
    loginDialogState: 0,
    valid: true,
    isPassword: false,
    showPhone: '',
    time: null,
    phoneCode: '',
    dialog: false,
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
      referral: null,
    },
    isCodeInputReadonly: true,
    isLoading: false,
  }),
  created() {
    // 進入網站時直接拿邀請碼
    this.getReferralFromUrl()
  },
  mounted() {
    this.time = this.config.sms.timeLimit
    this.initCountryCode()
  },
  watch: {},
  computed: {
    ...mapGetters(["config"]),
    logoImg() {
      return '/static/ui/topbar/' + settings.theme + '.png'
    },
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
      if (this.loginWay === 'email') {
        // 登入
        if (this.loginState === 'signIn') {
          return this.form.email === null
            || (!(/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(this.form.email)))
            || this.form.password === null
            || this.form.password.length < 6
            || this.form.password.length > 18
        // 註冊
        } else if (this.loginState === 'signUp') {
          return this.form.email === null
            || (!(/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(this.form.email)))
            || this.form.password === null
            || this.form.password.length < 6
            || this.form.password.length > 18
            || this.form.code === null
            || this.form.againPassword === null
            || this.form.againPassword !== this.form.password
            // 邀請碼改為非必填
            // || this.form.referral === ""
            // || this.form.referral === null
        // 找回密碼
        } else {
          return this.form.email === null
            || (!(/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(this.form.email)))
            || this.form.password === null
            || this.form.password.length < 6
            || this.form.password.length > 18
            || this.form.code === null
            || this.form.againPassword === null
            || this.form.againPassword !== this.form.password
        }
      // 手機
      } else {
        // 登入
        if (this.loginState === 'signIn') {
          return this.form.phone === null
            || (!(/^[0-9０-９٠-٩۰-۹]{2}$|^[+＋]*(?:[-x‐-―−ー－-／  ­ ⁠ ()（）［］.\[\]/~⁓∼～*]*[0-9０-９٠-٩۰-۹]){3,}[-x‐-―−ー－-／  ­ ⁠ ()（）［］.\[\]/~⁓∼～0-9０-９٠-٩۰-۹]*(?:;ext=([0-9０-９٠-٩۰-۹]{1,7})|[  \t,]*(?:e?xt(?:ensi(?:ó?|ó))?n?|ｅ?ｘｔｎ?|[,xｘ#＃~～]|int|anexo|ｉｎｔ)[:\.．]?[  \t,-]*([0-9０-９٠-٩۰-۹]{1,7})#?|[- ]+([0-9０-９٠-٩۰-۹]{1,5})#)?$/i).test(this.form.phone))
            || this.form.password === null
            || this.form.password.length < 6
            || this.form.password.length > 18
        // 註冊
        } else if (this.loginState === 'signUp') {
          return this.form.phone === null
            || (!(/^[0-9０-９٠-٩۰-۹]{2}$|^[+＋]*(?:[-x‐-―−ー－-／  ­ ⁠ ()（）［］.\[\]/~⁓∼～*]*[0-9０-９٠-٩۰-۹]){3,}[-x‐-―−ー－-／  ­ ⁠ ()（）［］.\[\]/~⁓∼～0-9０-９٠-٩۰-۹]*(?:;ext=([0-9０-９٠-٩۰-۹]{1,7})|[  \t,]*(?:e?xt(?:ensi(?:ó?|ó))?n?|ｅ?ｘｔｎ?|[,xｘ#＃~～]|int|anexo|ｉｎｔ)[:\.．]?[  \t,-]*([0-9０-９٠-٩۰-۹]{1,7})#?|[- ]+([0-9０-９٠-٩۰-۹]{1,5})#)?$/i).test(this.form.phone))
            || this.form.password === null
            || this.form.password.length < 6
            || this.form.password.length > 18
            || this.form.code === null
            || this.form.againPassword === null
            || this.form.againPassword !== this.form.password
            // 邀請碼改為非必填
            // || this.form.referral === ""
            // || this.form.referral === null
        // 找回密碼
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
      }
    },
    verificationBtn() {
      if (this.loginWay === 'email') {
        if (this.form.email === null || !(/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(this.form.email)) || this.sendPassword) {
          return true
        } else return false
      } else if (this.loginWay === 'phone') {
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
    },
    //手机号中加空格
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
    //发送验证码
    sendCode() {
      if (this.sendPassword) {
        return
      }
      this.sendFirst = false
      this.sendLoading = true
      let first
      let type
      let code
      if (this.loginWay === 'email') {
        first = this.form.email
      } else {
        code = this.phoneCode.substring(1)
        first = this.form.phone
      }
      if (this.loginState === 'signUp') {
        type = 1
      } else type = 2
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
    //登录/注册/密码
    loginOrRegOrPassword() {
      if (this.loginState === "signIn") {
        this.loginDialogState = 1
        this.isLoading = true
        this.dialog = true
      }
      let first
      let code
      if (this.loginWay === 'email') {
        first = this.form.email
      } else {
        code = this.phoneCode.substring(1)
        first = this.form.phone
      }
      if (this.loginState === 'signIn') {
        Meteor.loginWithPassword(first, this.form.password, (err, res) => {
          this.isLoading = false
          if (err) {
            this.form.email = null
            this.form.phone = null
            this.form.password = null
            this.$nextTick(() => {
              this.$refs.form.validate()
            })
            this.toasterErr('10000')
          } else {
            this.logEvent('login_success', {
              type: this.loginWay
            })
            this.toasterSuccess(this.$t('topbar.loginSuccess'))
            this.loginDialogState = 2
          }
        })
      } else if (this.loginState === 'signUp') {
        // 小步帳號綁定判斷
        const singUpDataJson = Storage.getSession('singUpDataJson')
        console.log('singUpDataJson', singUpDataJson)
        if (singUpDataJson) {
          Meteor.call("signUp", first, this.form.password, this.form.code, this.form.referral, code, singUpDataJson, (err, res) => {
            if (err) {
              console.log('signUp err', err)
              if (err.reason === '10101') {
                this.form.code = null
                this.$nextTick(() => {
                  this.$refs.form.validate()
                })
              }
              if (err.reason === '20003') {
                this.form.referral = null
                this.$nextTick(() => {
                  this.$refs.form.validate()
                })
              }
              this.logEvent('register_failed', {
                reason: err.reason
              })
              this.toasterErr(Number(err.reason) || err.reason)
            } else {
              this.logEvent('register_success', {
                type: this.loginWay
              })
              this.toasterSuccess(this.$t('topbar.registerSuccess'))
              Storage.removeSession('singUpDataJson')
              this.loginDialogState = 3
              this.dialog = true
              this.loginState = "signIn"
              this.loginWay = "email"
              this.$refs.form.reset()
            }
          })
        } else {
          Meteor.call("signUp", first, this.form.password, this.form.code, this.form.referral, code, (err, res) => {
            if (err) {
              if (err.reason === '10101') {
                this.form.code = null
                this.$nextTick(() => {
                  this.$refs.form.validate()
                })
              }
              if (err.reason === '20003') {
                this.form.referral = null
                this.$nextTick(() => {
                  this.$refs.form.validate()
                })
              }
              this.logEvent('register_failed', {
                reason: err.reason
              })
              this.toasterErr(Number(err.reason) || err.reason)
            } else {
              this.logEvent('register_success', {
                type: this.loginWay
              })
              this.toasterSuccess(this.$t('topbar.registerSuccess'))
              this.loginDialogState = 3
              this.dialog = true
              this.loginState = "signIn"
              this.loginWay = "email"
              this.$refs.form.reset()
            }
          })
        }
        
      } else if (this.loginState === 'password') {
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
            this.loginDialogState = 4
            this.dialog = true
            this.loginState = "signIn"
            this.loginWay = "email"
            this.$refs.form.reset()
          }
        })
      }
    },
    //回复状态
    replyState() {
      this.dialog = false
    },
    //关闭
    close() {
      this.loginState = 'signIn'
      this.loginWay = 'email'
      this.$emit('close')
    },
    //点击选择区号
    choicePhone(item) {
      this.phoneCode = item.code
    },
    //点击隐藏密码图标
    clickHidePassword() {
      this.isPassword = !this.isPassword
    },

    goPassword() {
      this.loginState = 'password'
      this.reset()
      this.$refs.form.reset()
    },
    goSignIn() {
      this.loginState = 'signIn'
      this.loginWay = 'email'
      this.reset()
      this.$refs.form.reset()
    },
    goSignUp() {
      this.loginState = 'signUp'
      this.loginWay = 'email'
      this.reset()
      this.$refs.form.reset()
      this.logEvent('go_register')
    },
    initCountryCode() {
      this.phoneCode = this.countryCodes[0].code
      this.form.countryCode = this.countryCodes[0]
    },
    setLoginWay(w) {
      this.loginWay = w
      this.reset()
      this.$refs.form.resetValidation()
    },
    emailRules(v) {
      if (!v)
        return this.$t('topbar.emailRequired')
      if (!(/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(v))) {
        return this.$t('topbar.emailValid')
      }
      return true
    },
    phoneRules(v) {
      if (!v)
        return this.$t('topbar.phoneRequired')
      if (!(/^[0-9０-９٠-٩۰-۹]{2}$|^[+＋]*(?:[-x‐-―−ー－-／  ­ ⁠ ()（）［］.\[\]/~⁓∼～*]*[0-9０-９٠-٩۰-۹]){3,}[-x‐-―−ー－-／  ­ ⁠ ()（）［］.\[\]/~⁓∼～0-9０-９٠-٩۰-۹]*(?:;ext=([0-9０-９٠-٩۰-۹]{1,7})|[  \t,]*(?:e?xt(?:ensi(?:ó?|ó))?n?|ｅ?ｘｔｎ?|[,xｘ#＃~～]|int|anexo|ｉｎｔ)[:\.．]?[  \t,-]*([0-9０-９٠-٩۰-۹]{1,7})#?|[- ]+([0-9０-９٠-٩۰-۹]{1,5})#)?$/i).test(this.form.phone)) {
        return this.$t('topbar.phoneValid')
      }
      return true
    },
    verificationCodeRules(v) {
      if (!v)
        return this.$t('topbar.verificationCodeRequired')
      return true
    },
    passwordRules(v) {
      if (!v) {
        return this.$t('topbar.passwordRequired')
      }
      let length = v.length
      if (length < 6 || length > 18)
        return this.$t('topbar.passwordValid')
      return true
    },
    againVerificationCodeRules(v) {
      if (!v)
        return this.$t('topbar.verificationCodeRequired')
      if (this.form.againPassword !== this.form.password)
        return this.$t('topbar.againSetUpPasswordValid')
      return true
    },
    referralRules(v) {
      if (!v) {
        // 邀請碼改為非必填
        // return this.$t('topbar.referralRequired')
      }
      return true
    },
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
    // 取得邀請碼 若有則存入localStorage與帶入表單
    getReferralFromUrl() {
      const referral = this.$route.query.referral
      if (referral) {
        // 存入 localStorage
        localStorage.setItem('referral', referral)
        // 直接把狀態切到註冊
        this.loginState = 'signUp'
        // 帶入邀請碼
        this.form.referral = referral
      } else {
        localStorage.removeItem('referral')
      }
    }
  }
}
</script>

<style lang="scss">

input:-webkit-autofill {
    -webkit-text-fill-color: white !important;
    transition: background-color 5000s ease-in-out 0s;
}
@import "/imports/ui/scss/theme";

.listItem {
  background: $commonBackground2;
}

.listItem:nth-last-child(1) {
  border-bottom: 0 !important;
}

.phonenumber-label {
  .v-label--active {
    left: -87px !important;
  }
}

#input-216 {
  width: 80% !important;
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
  border: $commonBorder;
}

.card {
  background: $dialogBackground !important;
  border-radius: 8px !important;
  border: $commonBorder;
  box-shadow: $commonBoxShadow !important;
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
    height: 29px !important;
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
  .bottomCol {
    margin-top: 17px !important;
  }
}
</style>
