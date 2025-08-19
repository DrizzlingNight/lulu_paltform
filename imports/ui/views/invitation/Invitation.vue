<template>
  <div class="invitation-wrapper">
    <div class="invitation-content">
      <!-- 標題 -->
      <h2 class="mb-7" style="font-weight: 600;">{{ $t('invitation.myInvitation') }}</h2>

      <!-- 邀請好友與累積獎勵 -->
      <div v-if="user" class="achievement-wrapper d-flex justify-space-between mb-6 mb-md-15">
        <div class="achievement d-flex align-center">
          <v-img width="30" height="30" contain src="/static/ui/invitation/my_invitation.svg" class="mr-3"></v-img>
          <p class="achievement-text d-flex flex-column mb-0">
            <span class="amount-number">{{ achievement.inviteFriends }}</span>
            <span class="description">{{ $t('invitation.friendsInvited') }}</span>
          </p>
        </div>
        <v-divider vertical class="mx-2" style="border-color: #95c6b7"></v-divider>
        <div class="achievement d-flex align-center">
          <v-img width="30" height="30" contain src="/static/ui/utils/coins/LUCK.svg" class="mr-3"></v-img>
          <p class="achievement-text d-flex flex-column mb-0">
            <span class="amount-number">{{ achievement.rewards }}</span>
            <span class="description">{{ $t('invitation.rewardAccumulation') }}</span>
          </p>
        </div>
        <v-divider vertical class="mx-2" style="border-color: #95c6b7"></v-divider>
        <div class="achievement d-flex align-center">
          <v-img width="30" height="30" contain src="/static/ui/invitation/mint.svg" class="mr-3"></v-img>
          <p class="achievement-text d-flex flex-column mb-0">
            <span class="amount-number">{{ achievement.mints }}</span>
            <span class="description">{{ $t('invitation.mintAmount') }}</span>
          </p>
        </div>
      </div>

      <!-- 邀請方式 -->
      <p v-if="user" class="card-title mb-3 mb-md-4">{{ $t('invitation.inviteWays') }}</p>
      <div v-if="user" class="block invite-options d-flex px-3 px-md-8 py-9 mb-8 mb-md-15">
        <!-- 左側區塊 -->
        <div class="block-left">
          <p class="invitation-title">{{ $t('invitation.registerLink') }}</p>
          <div class="block-sm d-flex justify-space-between align-center pa-3 mb-4">
            <p class="block-sm-text address pl-lg-3 mb-0">{{ registerLink }}</p>
            <v-btn @click="copyStringToClipboard(registerLink)" class="block-sm-btn">{{ $t('invitation.copy') }}</v-btn>
          </div>
          <p class="invitation-title">{{ $t('invitation.invitationCode') }}</p>
          <div class="block-sm d-flex justify-space-between align-center pa-3">
            <p class="block-sm-text pl-lg-3 mb-0">{{ inviteCode }}</p>
            <v-btn @click="copyStringToClipboard(inviteCode)" class="block-sm-btn">{{ $t('invitation.copy') }}</v-btn>
          </div>
        </div>
        <!-- 右側區塊 -->
        <div class="block-right">
          <p class="invitation-title">{{ $t('invitation.invitationQRCode') }}</p>
          <div class="block-md d-flex justify-center align-center py-5">
            <!-- QRCode 在這 -->
            <div class="mr-10">
              <VueQr :text="registerLink" :size="104" :margin="8"/>
            </div>
            <div class="block-md-action d-flex flex-column justify-center">
              <p class="block-md-text text-center mb-0">{{ $t('invitation.QRCodeDescription') }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 邀請獎勵規則  -->
      <!--    <p class="card-title">{{ $t('invitation.inviteRules') }}</p>-->
      <!--    <div class="block px-14 py-12 mb-4">-->
      <!--      <v-row no-gutters class="mb-10" style="font-weight: 600;">-->
      <!--        <v-col col="4">{{ $t('invitation.level') }}</v-col>-->
      <!--        <v-col col="4">{{ $t('invitation.friendInvite') }}</v-col>-->
      <!--        <v-col col="4">{{ $t('invitation.friendConsume') }}</v-col>-->
      <!--      </v-row>-->
      <!--      <v-row no-gutters class="mb-10">-->
      <!--        <v-col col="4">{{ $t('invitation.level1') }}</v-col>-->
      <!--        <v-col col="4">{{ $t('invitation.friendInvitationReward', {var: 0.001}) }}</v-col>-->
      <!--        <v-col col="4">{{ $t('invitation.friendConsumeReward', {var: 10}) }}</v-col>-->
      <!--      </v-row>-->
      <!--      <v-row no-gutters>-->
      <!--        <v-col col="4">{{ $t('invitation.level2') }}</v-col>-->
      <!--        <v-col col="4">{{ $t('invitation.friendInvitationReward', {var: 0.005}) }}</v-col>-->
      <!--        <v-col col="4">{{ $t('invitation.friendConsumeReward', {var: 5}) }}</v-col>-->
      <!--      </v-row>-->
      <!--    </div>-->
      <!--    <div class="block px-14 py-12 mb-4">-->
      <!--      <v-row no-gutters class="mb-10" style="font-weight: 600;">-->
      <!--        <v-col col="6">{{ $t('invitation.total') }}</v-col>-->
      <!--        <v-col col="6">{{ $t('invitation.text') }}</v-col>-->
      <!--      </v-row>-->
      <!--      <v-row no-gutters class="mb-10">-->
      <!--        <v-col col="6">{{ 1 }}</v-col>-->
      <!--        <v-col col="6">{{ 200 }}</v-col>-->
      <!--      </v-row>-->
      <!--      <v-row no-gutters class="mb-10">-->
      <!--        <v-col col="6">{{ 3 }}</v-col>-->
      <!--        <v-col col="6">{{ 600 }}</v-col>-->
      <!--      </v-row>-->
      <!--      <v-row no-gutters class="mb-10">-->
      <!--        <v-col col="6">{{ 10 }}</v-col>-->
      <!--        <v-col col="6">{{ 2400 }}</v-col>-->
      <!--      </v-row>-->
      <!--      <v-row no-gutters class="mb-10">-->
      <!--        <v-col col="6">{{ 50 }}</v-col>-->
      <!--        <v-col col="6">{{ 15000 }}</v-col>-->
      <!--      </v-row>-->
      <!--      <v-row no-gutters>-->
      <!--        <v-col col="6">{{ 100 }}</v-col>-->
      <!--        <v-col col="6">{{ 36000 }}</v-col>-->
      <!--      </v-row>-->
      <!--    </div>-->

      <!-- 邀請說明 -->
      <!--    <div class="invitation-description-wrapper">-->
      <!--      <p class="invitation-description mb-3">{{ $t('invitation.ruleDescription1') }}</p>-->
      <!--      <p class="invitation-description mb-0">{{ $t('invitation.ruleDescription2') }}</p>-->
      <!--    </div>-->

      <!--   活動獎勵規則 -->
      <p v-if="showActivity" class="card-title">{{ $t('invitation.activityRules') }}</p>
      <div v-if="showActivity" class="block px-4 px-md-14 py-5 py-md-12">
        <!-- 獎勵規則 標題 row -->
        <v-row no-gutters class="mb-10" style="font-weight: 600; gap: 20px;">
          <v-col col="4">{{ $t('invitation.castingCount') }}</v-col>
          <v-col col="3">{{ $t('invitation.text') }}</v-col>
          <v-col col="3">{{ $t('invitation.castingSchedule') }}</v-col>
          <v-col col="2">{{ $t('invitation.operate') }}</v-col>
        </v-row>
        <!-- 缺省頁 -->
        <DefaultPage :statusCode="2" v-if="!user"/>
        <!-- 獎勵規則 row -->
        <div v-else>
          <v-row v-for="(reward, index) in activityList.rewards" :key="index" no-gutters class="align-center mb-10"
                 style="gap: 20px;">
            <v-col col="4">{{ reward.mintCount }}</v-col>
            <v-col col="3">{{ reward.amount }}</v-col>
            <v-col col="3" class="colSpan">
            <span :class="{ 'lightSpanColor': isReferralStatistical }">
              {{
                (user.referralStatistical && user.referralStatistical.mintCount) ? user.referralStatistical.mintCount : 0
              }}
            </span>
              / {{ reward.mintCount }}
            </v-col>
            <v-col col="2" class="colBtn">
              <v-btn class="btn pa-0" :disabled="isBtnDisabled(reward)" @click="goReceiveTaskReward(reward)">
                {{ $t("invitation.receive") }}
              </v-btn>
            </v-col>
          </v-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueQr from 'vue-qr'

import {mapGetters} from 'vuex'

import DefaultPage from './../../components/defaultPage/DefaultPage.vue'
import { settings } from '/imports/settings';

export default {
  name: 'Invitation',
  components: {
    VueQr,
    DefaultPage
  },
  data() {
    return {
      achievement: {
        inviteFriends: 0,
        rewards: 0,
        mints: 0,
      },
      activityList: [],
      activityType: 'referralMint',
      activityTaskAwardRecord: [],
    }
  },
  mounted () {
    this.logEvent('go_invitation')
  },
  computed: {
    ...mapGetters(["user"]),
    showActivity() {
      return settings.display.invitation.activity
    },
    // 組成邀請連結
    registerLink() {
      const referralUrl = Meteor.absoluteUrl() // 取得網站根位址
      return `${referralUrl}?referral=${this.user ? this.user._id : '0'}`
    },
    // 取得邀請碼 ( 目前為 userId )
    inviteCode() {
      return this.user ? this.user._id : 0
    },
    //是否有referralStatistical
    isReferralStatistical() {
      if (this.user && this.user.referralStatistical && this.user.referralStatistical.mintCount) {
        return true
      } else return false
    },
  },
  watch: {
    user(newVal) {
      this.getTaskList()
      this.getUserReferralCount()
    }
  },
  methods: {
    copyStringToClipboard(string) {
      // 產生一個文字區塊 -> 置入要複製的字串 -> 將文字區塊塞入body -> 選取文字區塊 -> 執行複製選取的api -> 移除該文字區塊 -> 跳alert完成動作
      const el = document.createElement('textarea')
      el.value = string
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      // 跳複製成功通知
      this.toasterSuccess(this.$t('invitation.copySucceed'))
    },
    // 拉取邀請成就資料
    getUserReferralCount() {
      // 沒登入就擋掉
      // if (!this.user) {
      //   return
      // }
      // 有登入
      Meteor.call('getReferralCount', (err, res) => {
        if (err) {
          console.error('sendCode err', err)
          // this.toasterErr(Number(err.reason) || err.reason)
        } else {
          const {subCount, subProfitAmount, subMintCount} = res
          this.achievement.inviteFriends = subCount || 0 // 已邀請好友
          this.achievement.rewards = subProfitAmount || 0 // 累積獎勵
          this.achievement.mints = subMintCount || 0 // 邀請鑄造
        }
      })
    },
    //拉取活动奖励数据
    getTaskList() {
      Meteor.call("taskList", (err, res) => {
        if (err) {
          this.toasterErr(Number(err.reason) || err.reason)
        } else {
          let length = res.length
          for (let i = 0; i < length; i++) {
            if (res[i].type === this.activityType) {
              this.activityList = res[i]
              this.getTaskAwardRecord()
            }
          }
        }
      })
    },
    //获取领奖记录
    getTaskAwardRecord() {
      Meteor.call("taskAwardRecord", this.activityList._id, (err, res) => {
        if (err) {
          this.toasterErr(Number(err.reason) || err.reason)
        } else {
          this.activityTaskAwardRecord = res
        }
      })
    },
    //领奖
    goReceiveTaskReward(item) {
      Meteor.call("receiveTaskReward", this.activityList._id, item.id, (err, res) => {
        if (err) {
          this.toasterErr(Number(err.reason) || err.reason)
        } else {
          this.toasterSuccess(this.$t('invitation.receiveSuccess'))
          this.getTaskAwardRecord()
        }
      })
    },
    //领取是否可点击
    isBtnDisabled(reward) {
        // 沒有相關資料就不能領
        if (!this.user.referralStatistical || !this.user.referralStatistical.mintCount)
          return true
        // 沒有達成獎勵要求就不能領
        if (reward.mintCount > this.user.referralStatistical.mintCount) {
          return true
        }
        // 已經領過的就不能領
        if (this.activityTaskAwardRecord.length) {
          // 查看領獎紀錄中是否有匹配的紀錄
          return this.activityTaskAwardRecord.find(record => record.reward.id === reward.id) ? true : false
        }
        return false
    }
  },
  created() {
    this.getUserReferralCount()
    this.getTaskList()
  }
}
</script>

<style lang="scss" scoped>
@import './../../assets/css/utils/variables.scss';
@import '/imports/ui/scss/theme';

.invitation-wrapper {
  width: 100%;
  min-height: 800px;
  padding: 0px 216px;
  background: $commonBackground3;

  .invitation-content {
    max-width: 1200px;
    padding-top: 55px;
    padding-bottom: 100px;
    color: #ffffff;
    margin: auto;

    // 我的邀請
    .achievement-wrapper {
      height: 38px;
      width: 520px;

      .achievement {
        .achievement-text {
          // .amount-number {}
          .description {
            font-size: $font_sm;
          }
        }
      }
    }

    // 區塊樣式
    .card-title {
      font-size: $font_sm;
    }

    .block {
      width: 100%;
      background: $lightBackground50;
      box-shadow: 0px 5px 8px 1px rgba(0, 20, 15, 0.5);
      border-radius: $radius_card;
    }

    // 邀請方式
    .invite-options {
      gap: 36px;

      .block-left,
      .block-right {
        width: 100%;

        .invitation-title {
          position: relative;
          font-size: $font_sm;
          padding-left: 6px;
          margin-bottom: 10px;

          &::before {
            content: '';
            display: block;
            position: absolute;
            top: 50%;
            left: 0px;
            transform: translate(0%, -50%);
            width: 2px;
            height: 12px;
            background: #00ffca;
          }
        }

        .block-sm {
          width: 100%;
          background: rgba(0, 50, 46, 0.499416);
          box-shadow: 0px 5px 8px 1px rgba(0, 20, 15, 0.5);
          border-radius: $radius_card;

          .block-sm-text {
            color: #fff;

            &.address {
              font-size: $font_basic;
            }
          }

          .block-sm-btn {
            width: 84px;
            max-height: 34px;
            border-radius: $radius_btn;
            background: $btnColor2;
          }
        }

        .block-md {
          width: 100%;
          height: 160px;
          background: rgba(0, 50, 46, 0.499416);
          box-shadow: $commonBoxShadow;
          border-radius: $radius_card;

          #qrcode {
            width: 104px;
            height: 104px;
          }

          .block-md-action {
            .block-md-text {
              // font-size: $font_sm;
            }

            .block-md-btn {
              width: 120px;
              text-transform: none;
              background: $btnColor;
              height: 46px;
              color: #ffffff;
              border-radius: $radius_btn;
              font-size: $font_sm;
            }
          }
        }
      }
    }

    .invitation-description-wrapper {
      .invitation-description {
        font-size: $font_sm;
        color: $text_info;
      }
    }

    .colSpan {

      .lightSpanColor {
        color: $mainLightColor;
        font-weight: 800;
      }
    }

    .colBtn {

      .btn {
        height: 34px;
        width: 84px;
        border-radius: 8px;
        background: linear-gradient(268.14deg, #FFD12F 14.27%, #FF8E00 91.59%);


        &.v-btn--disabled {
          background: linear-gradient(142.1deg, #727272 -41.15%, #CACACA 94.16%) !important;

          /deep/ .v-btn__content {
            color: #ffffff;
          }
        }
      }
    }
  }
}

@media screen and (max-width: 1264px) {
  .invitation-wrapper {
    padding: 0px 160px;

    .invitation-content {

      // 邀請方式
      .invite-options {
        flex-direction: column;

        .block-left,
        .block-right {
          width: 100%;

          .invitation-title {
            margin-bottom: 20px;
          }

          .block-sm-btn {
            max-width: 72px;
            max-height: 34px;
            border-radius: $radius_btn;
            background: $btnColor2;
          }
        }
      }
    }

    .colBtn {
      .btn {
        max-height: 24px;
        max-width: 60px;
        min-width: 60px;
      }
    }
  }
}

@media screen and (max-width: 960px) {
  .invitation-wrapper {
    padding: 0px 120px;

    .invitation-content {
      padding-top: 20px;
      padding-bottom: 36px;

      // 我的邀請
      .achievement-wrapper {
        height: 38px;
        width: 100%;
      }

      // 邀請方式
      .invite-options {
        gap: 20px;
      }
    }
  }
}

@media screen and (max-width: 600px) {
  .invitation-wrapper {
    padding: 0px 10px;

    .invitation-content {
      padding-top: 20px;
      padding-bottom: 36px;

      // 我的邀請
      .achievement-wrapper {
        height: 38px;
        width: 100%;
      }
    }

    .colBtn {
      .btn {
        max-height: 16px;
        max-width: 40px;
        min-width: 40px;

        /deep/ .v-btn__content {
          font-size: 10px;
        }
      }
    }
  }
}

</style>
