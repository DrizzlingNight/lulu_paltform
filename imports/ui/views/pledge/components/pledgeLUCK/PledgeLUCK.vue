<template>
  <div class="pledge-LUCK-wrapper">
    <div class="pledge-LUCK-title">
      <p>{{ $t('pledge.pledgeLUCK.title') }}</p>
    </div>
    <div class="pledge-power">
      <p>{{ `${$t('pledge.pledgeLUCK.power')}： ${stakeInfo.stake && stakeInfo.stake.toString()}` }}</p>
    </div>
    <!-- 我的可質押 -->
    <div class="pledge-remain">
      <p class="title">{{ $t('pledge.pledgeLUCK.myRemain') }}</p>
      <div class="remain">
        <p style="font-weight: 600;">{{ stakeInfo.balance && stakeInfo.balance.toString() }} <span class="coin">{{stakeToken && stakeToken.code}}</span></p>
        <v-spacer />
        <v-btn text class="button" @click="pledge = stakeInfo.balance ? stakeInfo.balance.toString() : '0'">{{ $t('pledge.pledgeLUCK.pledgeAll') }}</v-btn>
      </div>
      <div class="input">
        <input v-model="pledge" type="number" class="number" />
        <img src="/static/ui/utils/coins/LUCK.svg" class="coin-icon" />
        <v-spacer />
        <v-btn :disabled="isPledgeBtnDisabled" class="button" @click="openPledgeDialog()">{{ $t('pledge.pledgeLUCK.pledge') }}</v-btn>
      </div>
      <!-- 可質押上限 -->
      <span v-if="stakeToken && stakeToken.maxTotalStake" class="pledge-maximum-text">{{ $t('pledge.pledgeLUCK.pledgeMaximum', [stakeToken.maxTotalStake]) }}</span>
    </div>
    <!-- 我的已質押 -->
    <div class="pledge-total">
      <p class="title">{{ $t('pledge.pledgeLUCK.myTotal') }}</p>
      <div class="total">
        <p style="font-weight: 600;">{{ stakeInfo.stake && stakeInfo.stake.toString() }} <span>{{stakeToken && stakeToken.code}}</span></p>
        <v-spacer />
        <v-btn v-if="!lastRedeem" text class="button" @click="redeem = stakeInfo.stake.toString()">{{ $t('pledge.pledgeLUCK.redeemAll') }}</v-btn>
      </div>
      <p class="rate">{{ `${$t('pledge.pledgeLUCK.rateOfPledge')} ${stakeInfo.stake && stakeInfo.stake.div(stakeInfo.stakePool.totalStake || 1).times(100).toFixed(2).toString()}%` }}</p>
      <div v-if="!lastRedeem" class="input">
        <input v-model="redeem" type="number" class="number" />
        <img src="/static/ui/utils/coins/LUCK.svg" class="coin-icon" />
        <v-spacer />
        <v-btn :disabled="isRedeemBtnDisabled" class="button" @click="openRedeemDialog()">{{ $t('pledge.pledgeLUCK.redeem') }}</v-btn>
      </div>
      <div v-else class="ongoing">
        <div class="detail">
          <p class="number">{{ $t('pledge.pledgeLUCK.redeemOngoing', [lastRedeem && -lastRedeem.changed]) }}</p>
          <p class="count-down mb-0">{{ $t('pledge.pledgeLUCK.countDown') }} <span class="time">{{ `${timer.hour}:${timer.min}:${timer.sec}` }}</span></p>
        </div>
        <v-spacer />
        <v-btn class="button" @click="openCancelRedeemDialog()">
          {{ $t('pledge.pledgeLUCK.cancelRedeem') }}
        </v-btn>
      </div>
      <!-- 可質押上限 -->
      <span v-if="stakeToken && stakeToken.maxTotalStake" class="pledge-maximum-text">{{ $t('pledge.pledgeLUCK.pledgeMaximum', [stakeToken.maxTotalStake]) }}</span>
    </div>
    <!-- 確認質押彈窗 -->
    <CustomDialog
      :show="isPledgeDialogShow"
      :title="$t('pledge.pledgeLUCK.confirmPledge')"
      @closeDialog="isPledgeDialogShow = false"
      @confirm="confirmPledge()"
    >
      <template #content>
        <div class="content">
          <p>{{ $t('pledge.pledgeLUCK.confirmPledgeContent', [pledge]) }}</p>
        </div>
      </template>
    </CustomDialog>

    <!-- 確認贖回彈窗 -->
    <CustomDialog
      :show="isRedeemDialogShow"
      :title="$t('pledge.pledgeLUCK.confirmRedeem')"
      @closeDialog="isRedeemDialogShow = false"
      @confirm="confirmRedeem()"
    >
      <template #content>
        <div class="content">
          <p>{{ $t('pledge.pledgeLUCK.confirmRedeemContent', [redeem]) }}</p>
        </div>
      </template>
    </CustomDialog>

    <!-- 確認取消贖回彈窗 -->
    <CustomDialog
      :show="isCancelRedeemDialogShow"
      :title="$t('pledge.pledgeLUCK.confirmCancelRedeem')"
      @closeDialog="isCancelRedeemDialogShow = false"
      @confirm="confirmCancelRedeem()"
    >
      <template #content>
        <div class="content">
          <p>{{ $t('pledge.pledgeLUCK.confirmCancelRedeemContent') }}</p>
        </div>
      </template>
    </CustomDialog>
  </div>
</template>

<script>
import CustomDialog from '/imports/ui/components/customDialog/CustomDialog'
import { getDateDetail } from '/imports/utils/date'
import {mapGetters} from "vuex";


export default {
  name: 'PledgeLUCK',
  props: [
      "stakeInfo"
  ],
  components:{
    CustomDialog
  },
  data() {
    return {
      lastRedeem:null,
      data:{},
      isPledgeDialogShow: false,
      isRedeemDialogShow: false,
      isCancelRedeemDialogShow: false,
      pledge: 0, // 質押
      redeem: 0, // 贖回
      // 以下為測試資料
      testData: {
        power: 100000,
        remain: 98.98,
        total: 100,
        rate: 5,
        redeem: 0,
        count_down: null
      },
      timer: {
        hour: 0,
        min: 0,
        sec: 0,
        time: 0,
      },
    }
  },
  computed: {
    ...mapGetters(["stakeToken"]),
    isPledgeBtnDisabled() {
      if (!this.stakeToken || !this.pledge || !this.stakeInfo) return true
      const tmp = Decimal(this.pledge)
      return tmp.gt(this.stakeInfo.balance)
    },
    isRedeemBtnDisabled() {
      if (!this.stakeToken || !this.redeem) return true
      const tmp = Decimal(this.redeem)
      return tmp.lte(0) || tmp.gt(this.stakeInfo.stake)
    }
  },
  created() {
    this.data = {...this.testData}
    this.data.count_down = new Date().getTime() + 86400000 // 24小時
    this.getLastRedeem()
  },
  methods: {
    openPledgeDialog() {
      const tmp = Decimal(this.pledge)
      if (tmp.lt(this.stakeToken.minStake)) {
        this.toasterErr(this.$t('pledge.pledgeLUCK.amountTooLittle', [this.stakeToken.minStake]))
        return
      } else if (tmp.gt(this.stakeToken.maxStake)) {
        this.toasterErr(this.$t('pledge.pledgeLUCK.amountTooMuch', [this.stakeToken.maxStake]))
        return
      }

      this.isPledgeDialogShow = true
    },
    openRedeemDialog() {
      this.isRedeemDialogShow = true
    },
    openCancelRedeemDialog() {
      this.isCancelRedeemDialogShow = true
    },
    countDown() {
      let endTime = Number(this.lastRedeem && this.lastRedeem.toAccountTime.getTime())
      this.timer = getDateDetail(endTime)
      let timer = setTimeout(this.countDown, 500)
      if ( endTime < new Date().getTime()) {
        this.timer = {
          hour: 0,
          min: 0,
          sec: 0,
          time: 0,
        }
        clearTimeout(timer)
        this.getLastRedeem()
      }
    },
    async getLastRedeem() {
      Meteor.call('getLastRedeem', (err,res)=>{
        if (err){
          console.error('getLastRedeem err', err)
        }else{
          this.lastRedeem = res
          if (this.lastRedeem)
            this.countDown()
        }
      })
    },
    async confirmPledge() {
      Meteor.call('stakeToken', Decimal(this.pledge), (err,res)=>{
        if (err){
          console.error('getStakeInfo err', err)
          this.isPledgeDialogShow = false
          this.toasterErr(Number(err.reason) || err.reason)
        }else{
          this.pledge = "0"
          this.isPledgeDialogShow = false
          this.toasterSuccess(this.$t('pledge.pledgeLUCK.pledgeSuccess'))
          this.$emit("updateInfo")
        }
      })
    },
    async confirmRedeem() {
      Meteor.call('redeemToken', Decimal(this.redeem), (err,res)=>{
        if (err){
          console.error('getStakeInfo err', err)
          this.isRedeemDialogShow = false
          this.toasterErr(Number(err.reason) || err.reason)
        }else{
          this.redeem = "0"
          this.isRedeemDialogShow = false
          this.toasterSuccess(this.$t('pledge.pledgeLUCK.redeemSuccess'))
          this.$emit("updateInfo")
          this.getLastRedeem()
        }
      })
      // console.log('redeem')
      // this.data.redeem = this.redeem
      // this.data.total = Number(this.data.total) - Number(this.redeem)
      // this.redeem = 0
      // this.isRedeemDialogShow = false
      // this.toasterSuccess(this.$t('pledge.pledgeLUCK.redeemSuccess'))
      // this.countDown()
    },
    async confirmCancelRedeem() {
      console.log('cancelRedeem')
      Meteor.call('cancelRedeem', (err,res)=>{
        if (err){
          console.error('cancelRedeem err', err)
          this.toasterErr(Number(err.reason) || err.reason)
        }else{
          this.toasterSuccess(this.$t('pledge.pledgeLUCK.cancelRedeemSuccess'))
          this.isCancelRedeemDialogShow = false
          this.getLastRedeem()
          this.$emit("updateInfo")
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>
@import './../../../../assets/css/utils/variables.scss';

input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type=number] {
  -moz-appearance: textfield;
}

.pledge-LUCK-wrapper {
  background: linear-gradient(136.3deg, #06261F 2.34%, #08322D 98.54%);
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px 100px;

  .pledge-LUCK-title {
    margin-top: 114px;
    p {
      color:#FFFFFF;
      font-size: 36px;
      font-weight: 600;
    }
  }

  .pledge-power {
    margin-bottom: 50px;

    p {
      color: #95C6B7;
      font-size: 18px;
      font-weight: 600;
    }
  }

  .pledge-remain,
  .pledge-total {
    background: #00322E;
    box-shadow: 0px 5px 8px 1px rgba(0, 20, 15, 0.5);
    border-radius: 10px;
    width: 100%;
    max-width: 1200px;
    padding: 44px 32px 44px 40px;
    margin-bottom: 50px;

    .title {
      color:#FFFFFF;
      font-size: 20px;
    }

    .remain,
    .total {
      display: flex;
      flex-direction: row;
      align-items: center;

      p {
        color: #F7CD0A;
        font-size: 36px;

        span {
          color: #F7CD0A;
          font-size: 18px;
        }
      }

      .button {
        color: #00FFCA;
      }
    }

    .total {
      p {
        color: #13AA6D;
        margin-bottom: 0px;

        span {
          color: #13AA6D;
        }
      }
    }

    .rate {
      color: #95C6B7;
      font-size: 14px;
    }

    .input {
      display: flex;
      flex-direction: row;
      align-items: flex-end;
      position: relative;

      .number {
        background: rgba(7, 24, 22, 0.5);
        border-radius: 6px;
        width: 100%;
        max-width: 970px;
        height: 66px;
        color: #FFFFFF;
        font-size: 24px;
        padding-left: 64px;
        font-weight: 600;

        &:focus {
          outline: 0px;
        }
      }

      .coin-icon{
        position: absolute;
        top: 50%;
        transform: translate(0%, -50%);
        left: 18px;
        width: 32px;
        height: 32px;
      }

      .button {
        background: linear-gradient(226.58deg, #FFD12F 51.75%, #FF8E00 95.54%);
        width: 139px;
        height: 66px;
        margin-left: 20px;

        /deep/ .v-btn__content {
          font-size: 18px;
          font-weight: 600;
        }
      }

      /deep/ .v-btn--disabled {
        background: linear-gradient(142.1deg, #727272 -41.15%, #CACACA 94.16%);
      }
    }

    .ongoing {
      display: flex;
      flex-direction: row;
      border-top: 1px solid #2D4742;
      padding-top: 34px;

      .detail {
        display: flex;
        flex-direction: column;

        .number {
          color: #F7CD0A;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 10px;
        }

        .count-down {
          color: #95C6B7;
          font-size: 14px;
          font-weight: 600;

          span {
            color: #00FFCA;
            font-size: 14px;
            font-weight: 400;
          }
        }
      }

      .button {
        background: linear-gradient(142.1deg, #007254 -41.15%, #16C9A2 94.16%);
        width: 118px;
        height: 46px;

        /deep/ .v-btn__content {
          font-size: 18px;
          font-weight: 600;
        }
      }
    }

    .pledge-maximum-text {
      color: #498779;
    }
  }

  .pledge-total {
    .input {
      .button {
        background: linear-gradient(142.1deg, #007254 -41.15%, #16C9A2 94.16%);
      }

      /deep/ .v-btn--disabled {
        background: linear-gradient(142.1deg, #727272 -41.15%, #CACACA 94.16%);
      }
    }
  }
}

.CustomDialog {
  .v-card__text {
    .content {
      width: 100%;
      display: flex;
      justify-content: center;
      margin-top: 69px;
      margin-bottom: 72px;

      p {
        color: #FFFFFF;
        font-size: 18px;
      }
    }
  }
}

@media screen and (max-width: 960px) {
  .pledge-LUCK-wrapper {
    padding: 0px 10px;
    padding-bottom: 20px;

    .pledge-LUCK-title {
      margin-top: 29px;

      p {
        font-size: 18px;
      }
    }

    .pledge-power {
      margin-bottom: 25px;

      p {
        font-size: 12px;
      }
    }

    .pledge-remain,
    .pledge-total {
      padding: 24px 10px 15px 10px;
      margin-bottom: 10px;

      .title {
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 10px;
      }

      .remain,
      .total {
        p {
          font-size: 18px;

          span {
            font-size: 12px;
          }
        }
      }

      .input {

        .number {
          height: 40px;
          color: #FFFFFF;
          font-size: 18px;
        }

        .coin-icon{
          position: absolute;
          left: 18px;
          width: 24px;
          height: 24px;
        }

        .button {
          width: 80px;
          height: 40px;
          border-radius: 8px;
          margin-left: 5px;

          /deep/ .v-btn__content {
            font-size: 14px;
            font-weight: 600;
          }
        }
      }

      .ongoing {
        display: flex;
        flex-direction: column;
        padding-top: 10px;

        .detail {
          .number {
            font-size: 12px;
          }

          .count-down {
            font-size: 12px;

            span {
              font-size: 12px;
            }
          }
        }

        .button {
          width: 100%;
          height: 40px;

          /deep/ .v-btn__content {
            font-size: 14px;
            font-weight: 600;
          }
        }
      }
    }
  }
}
</style>
