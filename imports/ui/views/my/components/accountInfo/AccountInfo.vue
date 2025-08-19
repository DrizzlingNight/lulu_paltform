<template>
  <div class="AccountInfo">
    <div class="info-area">
      <p class="account">{{ `Hi,${userInfo.username}` }}</p>

      <div class="bind-email mt-4 mt-sm-9">
          <p class="text">UID</p>
          <p class="show">{{ `${userInfo._id}` }}</p>
          <v-spacer></v-spacer>
          <v-icon @click="copyUid(userInfo._id)" small color="#fff" class="pl-2">mdi-content-copy</v-icon>
      </div>

      <div class="mt-3 mt-sm-10" v-if="userInfo.registerType === 'email' || userInfo.registerType === 'mobile'">
        <div v-if="userInfo.registerType === 'mobile'" class="bind-phone">
          <p class="text">{{ $t('base.phone') }}</p>
          <p class="show">{{ `+${userInfo.iddCode} ${userInfo.username}` }}</p>
        </div>
        <div v-else class="bind-email">
          <p class="text">{{ $t('base.email') }}</p>
          <p class="show">{{ `${userInfo.username}` }}</p>
        </div>
      </div>
    </div>
    <div class="recent-login">
      <p class="title">{{ $t('my.accountInfo.recentLogin', ['5']) }}</p>
      <p class="uid">{{ `UID: ${userInfo._id}` }}</p>
      <div class="table">
        <div class="head">
          <p class="text-left">{{ $t('my.accountInfo.time') }}</p>
          <p class="text-left">{{ $t('my.accountInfo.ip') }}</p>
          <p class="text-left">{{ $t('my.accountInfo.address') }}</p>
          <p class="text-right os">{{ $t('my.accountInfo.os') }}</p>
        </div>
        <div v-if="recentLoginList[0]" class="body">
          <div
            v-for="(item, index) in recentLoginList"
            :key="index"
            :class="(index + 1) % 2 === 0 ? 'light' : 'dark'"
          >
            <p>{{ item.time }}</p>
            <p>{{ item.ip }}</p>
            <p>{{ item.address || $t('base.unknown') }}</p>
            <p class="os">{{ item.os }}</p>
          </div>
        </div>
        <!-- 缺省頁 -->
        <DefaultPage v-else />
      </div>
    </div>
    <!-- 手機綁定彈窗 -->
    <CustomDialog
      :show="isBindPhoneShow"
      :title="$t('my.accountSetting.bindPhone')"
      @closeDialog="closeBindPhoneDialog"
      @confirm="bindPhone"
    >
      <template #content>
        <p class="bindPhone-description">{{ $t('my.accountSetting.bindPhoneDialog_description') }}</p>
        <v-form
          ref="form"
          v-model="isValid"
          lazy-validation
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
          <VerificationCodeInput :data="data" :codeType="4" />
        </v-form>
      </template>
    </CustomDialog>
  </div>
</template>

<script>
import DefaultPage from './../utils/defaultPage/DefaultPage'
import { dateFormat } from '/imports/utils/dateFormat'
import CustomDialog from '/imports/ui/components/customDialog/CustomDialog'
import PhoneInput from '/imports/ui/components/phoneInput/PhoneInput'
import VerificationCodeInput from '/imports/ui/components/verificationCodeInput/VerificationCodeInput'

export default {
  name: 'AccountInfo',
  components: {
    DefaultPage,
    CustomDialog,
    PhoneInput,
    VerificationCodeInput,
  },
  data() {
    return {
      isBindPhoneShow: false,
      isValid: false,
      data:{
        phone: '',
        phoneCode: '+86',
        verificationCode: '',
      },
      testData: {
        time: '2021-12-14 13:44:45',
        ip: '111.250.129.125',
        address: '未知',
        os: 'windows',
      }
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    // 解析userAgent裡的作業系統
    osHandler(userAgent) {
      const start = userAgent.search(/\(/i)
      const end = userAgent.search(/\;/i)
      const os = userAgent.substring(start+1, end-1)
      return os
    },
    closeBindPhoneDialog() {
      this.data = {
        phone: '',
        phoneCode: '+86',
        verificationCode: '',
      }
      this.isBindPhoneShow = false
      this.isValid = false
    },
    bindPhone() {
      if (this.isValid) {
        Meteor.call('bindContactMethod', this.data.phone, this.data.verificationCode, (err, res)=>{
          if (err) {
            console.error('bindPhone err', err)
            this.toasterErr(Number(err.reason) || err.reason)
          } else {
            console.log('bindPhone res', res)
             this.toasterSuccess(this.$t('tip.bindSuccess'))
          }

          this.closeBindPhoneDialog()
        })
      }
    },

    // 複製UID
    copyUid(string) {
      const el = document.createElement('textarea')
      el.value = string
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      // 跳複製成功通知
      this.toasterSuccess(this.$t('tip.copySuccess'))
    }
  },
  meteor: {
    userInfo() {
      console.log('user', Meteor.user())
      return Meteor.user()
    },
    recentLoginList() {
      let list = []
      Meteor.call('loginRecord', {offset:0, limit:5}, (err, res)=>{
        console.log('loginRecord res', res)
        res.docs.forEach(item => {
          list.push({
            time: dateFormat(item.info.loginTime,'yyyy-MM-dd hh:mm:ss'),
            ip: item.info.ipAddr,
            address: null, // 2021.12.23 由於event沒有紀錄所在地，所以直接帶null（未知）
            os: this.osHandler(item.info.userAgent)
          })
        })
      })
      return list
    },
  }
}
</script>

<style lang="scss" scoped>

@import '/imports/ui/scss/theme';

.AccountInfo {
  min-height: 100vh;
  background: $commonBackground3;
  padding-top: 56px;
  padding-left: 80px;
  
  .info-area {
    margin-bottom: 60px;

    .account {
      font-size: 24px;
      color: #ffffff;
      margin-bottom: 7px;
    }

    .uid {
      font-size: 16px;
      color: $commonContentColor;
      margin-bottom: 24px;
    }

    .bind-phone,
    .bind-email {
      width: 62.5vw;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      background: $lightBackground50;
      box-shadow: 0px 5px 8px 1px rgba(0, 20, 15, 0.5);
      border-radius: 5px;
      padding: 24px;

      p {
        // min-width: 180px;
        margin-bottom: 0px;
      }
      
      .text {
        color: #FFFFFF;
      }

      .description {
        display: flex;
        flex-direction: row;
        min-width: 450px;

        img {
          margin-right: 40px;
        }

        .text {
          color: #44675F;
          white-space: nowrap;
        }
      }

      .button {
        cursor: pointer;
        color: $mainLightColor;
        text-align: right;
      }

      .show {
        color: #FFFFFF;
        white-space: nowrap;
        text-align: right;
        margin-left: 300px;
      }

      .modify {
        // min-width: 451px;
      }
    }
  }

  .recent-login {
    .title {
      font-size: 24px;
      color: #ffffff;
      margin-bottom: 7px;
    }

    .uid {
      font-size: 16px;
      color: $commonContentColorGray;
      margin-bottom: 24px;
    }

    .table {
      width: 62.5vw;
      box-shadow: 0px 5px 8px 1px rgba(0, 20, 15, 0.5);

      .head {
        background: $commonBackground2;
        display: flex;
        gap: 20px;
        flex-direction: row;
        justify-content: space-between;
        padding: 24px 24px 22px 24px;
        border-radius: 8px 8px 0px 0px;
        
        p {
          width: 300px;
          // font-size: 16px;
          color: #ffffff;
          margin-bottom: 0px;
        }

        .os {
          width: 300px;
          min-width: 48px;
          white-space: nowrap;
        }
      }

      .body {
        background: $bodyBackgroundColor;
        border: 1px solid $commonBackground2;
        border-top: 0px;
        border-radius: 8px;
        padding-bottom: 5px;

        .light,
        .dark {
          display: flex;
          gap: 20px;
          flex-direction: row;
          justify-content: space-between;
          padding: 17px 24px 0px 26px;

          p {
            width: 300px;
            // font-size: 16px;
            color: #ffffff;
          }

          .os {
            width: 300px;
            text-align: right;
          }
        }

        .dark {
          background: $commonBackground3
        }
      }
    }
  }
}

.CustomDialog {
  .v-card__text {
    .bindPhone-description {
      color: #FFFFFF;
      // font-size: 14px;
      margin-top: 24px;
      margin-bottom: 18px;
    }

    .phone,
    .phoneVerificationCode {
      color: #FFFFFF;
      // font-size: 14px;
      margin-bottom: 0px;

      span {
        color: #CF2C46;
      }
    }
  }
}

@media screen and (max-width: 960px) {
  .AccountInfo {
    width: 100vw;
    padding-top: 30px;
    padding-left: 10px;
    padding-right: 10px;
    padding-bottom: 100px;
    
    .info-area {
      width: 100%;
      .bind-phone,
      .bind-email {
        width: 100%;

        p {
          min-width: 80px;
        }

        .show {
          margin-left: 0px;
        }
      }
    }

    .recent-login {
      .table {
        width: 100%;

        .head {
          padding: 12px 12px 8px 12px;
        }
      }

      .body {
        .light, .dark {
          padding: 12px !important;

          p {
            margin: 0px;
          }
        }
      }
    }
  }
}
</style>