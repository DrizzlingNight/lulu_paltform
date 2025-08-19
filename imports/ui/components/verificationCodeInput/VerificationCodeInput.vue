<template>
  <div class="VerificationCodeInput">
    <v-text-field
        v-model="data.verificationCode"
        :label="$t(inputType === 'phone' ? 'topbar.phoneVerificationCode' : 'topbar.emailVerificationCode')"
        :rules="[verificationCodeRules]"
        class="text-field"
        color="btnColor"
    >
      <template v-slot:append>
      </template>
    </v-text-field>
    <v-btn
      height="40px"
      class="button d-flex float-right px-3"
      :disabled="disabled"
      @click="sendCode"
    >
      <span v-if="sendPassword" class="sendCode">
          {{ $t("topbar.getVerificationCode") }}
      </span>
      <span v-else class="coolDown">
        <span class="second">{{ time }}</span>
        {{ $t("topbar.verificationCodeMessage") }}
      </span>
    </v-btn>
  </div>
</template>

<script>

export default {
  name: 'VerificationCodeInput',
  props: {
    // 動態綁定父元件的data
    data: {
      type: Object,
      require: true,
      default: function() {
        return { verificationCode: '' }
      }
    },
    inputType: {
      type: String,
      default: 'phone'
    },
    /*
      codeType
      1: 註冊
      2: 忘記密碼
      3: 驗證碼登入
      4: 綁定
      5: 設置安全碼
    */
    codeType: {
      type: Number,
      default: 1,
    },
    disabled: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      sendPassword: true,
      time: 300,
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    verificationCodeRules(v) {
      if (!v)
        return this.$t('topbar.verificationCodeRequired')
      return true
    },
    // 發送驗證碼
    sendCode() {
      if (!this.sendPassword) {
        return
      }

      let payload = []
  
      if (this.inputType === 'email') {
        const first = this.data.email
        const type = this.codeType
        payload = [first, type]
      } else {
        const first = this.data.phone
        const type = this.codeType
        const code = this.data.phoneCode.substring(1)
        payload = [first, type, code]
      }

      Meteor.call("sendCode", ...payload,  (err, res) => {
        if (err) {
          console.error('sendCode err', err)
          this.toasterErr(Number(err.reason) || err.reason)
        } else {
          console.log('sendCode res', res)
          this.toasterSuccess(this.$t('tip.sendSuccess'))
          this.countTime()
          this.sendPassword = !this.sendPassword
        }
      })
    },
    countTime() {
      this.time = this.time - 1
      let timer = setTimeout(this.countTime, 1000)
      if (this.time === -1) {
        this.time = 300
        this.sendPassword = true
        clearTimeout(timer)
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.VerificationCodeInput {
  .text-field {
    // margin-top: 11px;
  }

  .button {
    background: transparent;
    border-radius: 19px;
    border: 1px #59CF9E solid;
    margin-top: -68px;

    .sendCode {
      color: #ffffff;
      font-size: 14px;
      height: 21px;
      line-height: 21px;
    }

    .coolDown {
      color: #ffffff;
      font-size: 12px;
      height: 16px;
      line-height: 16px;

      .second {
        color: #F7CD0A;
        font-size: 12px;
      }
    }
  }

  // 獲取驗證碼disabled狀態時的style
  .theme--light.v-btn.v-btn--has-bg.v-btn--disabled {
    background: transparent;
    border: 1px solid #C3C3C3;

    span {
      color: #c3c3c3;
    }
  }
}
</style>