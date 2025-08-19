<template>
  <div class="bonus-wrapper">

    <!-- 分紅內容 -->
    <div class="bonus-content">
      <!-- 分紅球球圖 -->
      <v-img src="/static/ui/pledge/bonus/bonus_tank.png" contain class="bonus-tank-img mt-1 mt-sm-5 mt-md-15"></v-img>
      <!-- 分紅池 -->
      <div class="total-bonus">
        <!-- 總分紅 -->
        <span class="total-amount-text mb-2">{{ $t('pledge.bonus.tankTotalBonus') }}</span>
        <p class="total-amount mb-3">
          <span class="total-amount-number mr-3" style="color:#F7CD0A;" id="tankTotalBonus">{{ tankTotalBonus.toLocaleString() }}</span>
          <span class="total-amount-unit" style="color:#F7CD0A;">LUSD</span>
        </p>
        <!-- 今日總分紅 -->
        <p class="detail mb-2 mb-sm-1 mb-md-2 mb-lg-3">
          <span class="mr-2">{{ $t('pledge.bonus.todayTotalBonus') }} :</span>
          <span id="todayTotalBonus">{{ todayTotalBonus.toLocaleString() }}</span>
          <span>LUSD</span>
        </p>
        <!-- 我的分紅 -->
        <p class="detail mb-2 mb-sm-1 mb-md-2 mb-lg-3">
          <span class="mr-2">{{ $t('pledge.bonus.myBonus') }} :</span>
          <span id="myBonus">{{ myBonus.toLocaleString() }}</span>
          <span>LUSD</span>
        </p>
        <!-- 我的预期年化分紅 -->
        <p class="detail mb-2 mb-sm-1 mb-md-2 mb-lg-3">
          <span class="mr-2">{{ $t('pledge.bonus.myAnnualizedBonus') }} :</span>
          <span id="myYearlyBonus">{{ myYearlyBonus.toLocaleString() }}</span>
          <span>LUSD</span>
        </p>
        <!-- 下次分紅時間 -->
        <p class="detail mb-2 mb-sm-1 mb-md-2 mb-lg-3">
          <span>{{ $t('pledge.bonus.nextBonusTime') }} :</span>
          <span>{{ nextBonusTime }}</span>
        </p>

        <div class="mt-5 mt-sm-12">
          <!-- 历史總分紅 -->
          <span class="total-amount-text mb-2">{{ $t('pledge.bonus.poolHistoryDivAmount') }}</span>
          <p class="total-amount mb-1 mb-sm-3 mt-1">
            <span class="total-amount-number mr-3" style="color:#00FFCA" id="poolHistoryDivAmount">{{ poolHistoryDivAmount.toLocaleString() }}</span>
            <span class="total-amount-unit" style="color:#00FFCA">LUSD</span>
          </p>
          <!-- 我的历史總分紅 -->
          <p class="detail mb-2 mb-sm-1 mb-md-2 mb-lg-3">
            <span class="mr-2">{{ $t('pledge.bonus.userHistoryDivAmount') }} :</span>
            <span id="userHistoryDivAmount">{{ userHistoryDivAmount.toLocaleString() }}</span>
            <span>LUSD</span>
          </p>
        </div>
      </div>
      <!-- 下方卡片區 -->
      <div class="cards-wrapper d-flex">
        <!-- 平台總數具 -->
        <div class="card platform-statistics d-flex flex-column justify-center">
          <!-- 平台總算力 -->
          <span class="description mb-1">{{ $t('pledge.bonus.totalPlatformPower') }}</span>
          <span class="number mb-sm-6 mb-md-5 mb-lg-7"
                id="totalPlatformPower">{{ totalPlatformPower.toLocaleString() }}</span>
          <v-spacer></v-spacer>
          <!-- 平台質押總LUCK -->
          <span class="description mb-1">{{ $t('pledge.bonus.totalPlatformPledgeLUCK') }}</span>
          <span class="number" id="totalPlatformPledgeLUCK">{{
              totalPlatformPledgeLUCK.toLocaleString()
            }}</span>
        </div>
        <!-- 我的分紅收益 -->
        <div class="card my-bonus">
          <div class="my-bonus-inner d-flex flex-md-column align-center align-md-start">
            <div class="bonus-text-wrapper">
              <span class="description mb-1">{{ $t('pledge.bonus.myBonusReward') }}</span>
              <div class="number-wrapper">
                <span class="number mr-4" id="myBonusReward">{{ myBonusReward.toLocaleString() }}</span><span
                  class="unit">LUSD</span>
              </div>
            </div>
            <v-spacer></v-spacer>
            <!-- 領取按鈕 -->
            <v-btn :disabled="!(stakeInfo.availableBonus && stakeInfo.availableBonus.gt(0))" @click="claimOnclick()"
                   class="claim-btn">{{ $t('pledge.bonus.claim') }}
            </v-btn>
          </div>
        </div>
        <!-- 算力數據 -->
        <div class="card power-statistics d-flex flex-column flex-md-row">
          <div class="power-statistics-inner d-flex mb-3 mb-md-0">
            <!-- 我的總算力 -->
            <div class="statistic-wrapper d-flex flex-column align-center justify-center">
              <span class="description mb-1">{{ $t('pledge.bonus.myTotalPower') }}</span>
              <span class="number" id="myTotalPower">{{ myTotalPower.toLocaleString() }}</span>
            </div>
            <!-- 占平台總算力比 -->
            <div class="statistic-wrapper d-flex flex-column align-center justify-center">
              <span class="description mb-1">{{ $t('pledge.bonus.platformPowerPercentage') }}</span>
              <span class="number" id="platformPowerPercentage">{{ platformPowerPercentage }}</span>
            </div>
          </div>
          <div class="power-statistics-inner d-flex">
            <!-- 質押算力 -->
            <div class="statistic-wrapper d-flex flex-column align-center justify-center">
              <span class="description mb-1">{{ $t('pledge.bonus.pledgePower') }}</span>
              <span class="number" id="pledgePower">{{ pledgePower.toLocaleString() }}</span>
            </div>
            <!-- 算力提升 -->
            <div class="statistic-wrapper d-flex flex-column align-center justify-center">
              <span class="description mb-1">{{ $t('pledge.bonus.powerImprovement') }}</span>
              <span class="number" id="powerImprovement">{{ powerImprovement }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {CountUp} from 'countup.js'
import {dateFormat} from '/imports/utils/dateFormat'

export default {
  name: 'Bonus',
  props: ['stakeInfo'],
  data: () => ({
    // 總分紅池
    tankTotalBonus: 0,
    // 平台历史分红
    poolHistoryDivAmount: 0,
    // 我的历史分红
    userHistoryDivAmount: 0,
    // 今日總分紅
    todayTotalBonus: 0,
    // 我的分紅
    myBonus: 0,
    myYearlyBonus: 0,
    // 平台總算力
    totalPlatformPower: 0,
    // 平台總質押LUCK
    totalPlatformPledgeLUCK: 0,
    // 我的分紅收益
    myBonusReward: 0,
    // 下次分紅時間
    nextBonusTime: '00:00:00',

    // 我的總算力
    myTotalPower: 0,
    // 占平台總算力比
    platformPowerPercentage: 0,
    // 質押算力
    pledgePower: 0,
    // 算力提升
    powerImprovement: 0,

    // countUp 物件
    countUps: {

      // 總分紅池
      tankTotalBonus: null,
      poolHistoryDivAmount: null,
      userHistoryDivAmount: null,
      // 今日總分紅
      todayTotalBonus: null,
      // 我的分紅
      myBonus: null,
      myYearlyBonus: null,
      // 平台總算力
      totalPlatformPower: null,
      // 平台總質押LUCK
      totalPlatformPledgeLUCK: null,
      // 我的分紅收益
      myBonusReward: null,
      // 下次分紅時間
      nextBonusTime: null,

      // 我的總算力
      myTotalPower: null,
      // 占平台總算力比
      platformPowerPercentage: null,
      // 質押算力
      pledgePower: null,
      // 算力提升
      powerImprovement: null,
    }
  }),
  watch: {
    stakeInfo: {
      handler(newValue, oldValue) {
        let totalHashrate = newValue.stakePool.hashrate
        const fundPool = newValue.fundPool || {}

        // 總分紅池
        this.countUps.tankTotalBonus.update(parseFloat(fundPool.total || 0))
        this.countUps.poolHistoryDivAmount.update(parseFloat(fundPool.historyDivAmount || 0))
        this.countUps.userHistoryDivAmount.update(newValue.userHistoryDivAmount)
        // 平台總算力
        this.countUps.totalPlatformPower.update(totalHashrate)
        // 今日總分紅
        this.countUps.todayTotalBonus.update(fundPool.total && (Decimal(fundPool.total).times(newValue.divPoolPercent || 0).toNumber()))
        // 下次分红时间
        this.nextBonusTime = fundPool.shareBonusTime && dateFormat(fundPool.shareBonusTime, 'yyyy-MM-dd hh:mm')
        // 平台總質押LUCK
        this.countUps.totalPlatformPledgeLUCK.update(newValue.stakePool.totalStake)

        if (totalHashrate > 0) {
          // 我的分紅
          this.countUps.myBonus.update((Decimal(fundPool.total || 0).times(Decimal(newValue.divPoolPercent || 0)).toNumber()) * newValue.hashrate / totalHashrate)
          this.countUps.myYearlyBonus.update((Decimal(fundPool.total || 0).times(Decimal(newValue.divPoolPercent || 0)).toNumber()) * newValue.hashrate / totalHashrate * 365)
        }
        // 我的分紅收益
        this.countUps.myBonusReward.update(newValue.availableBonus && newValue.availableBonus.toNumber())
        // 我的總算力
        this.countUps.myTotalPower.update(newValue.hashrate)
        // 占平台總算力比
        this.countUps.platformPowerPercentage.update(totalHashrate > 0 ? newValue.hashrate / totalHashrate * 100 : 0)
        // 質押算力
        this.countUps.pledgePower.update(newValue.stake && newValue.stake.toNumber())
        // 算力提升
        this.countUps.powerImprovement.update(parseFloat(newValue.hashrateGrowth || 0) * 100)
      },
      deep: true
    }
  },
  methods: {
    // 計算小數後有幾位
    countDecimals(number) {
      const stringNumber = Number(number).toString()
      // 不包含小數就 return 0
      if (!stringNumber.includes('.')) {
        return 0
      } else {
        // return 小數後字串長度
        return stringNumber.split('.')[1].length
      }
    },
    // 開始跳動
    startCount(domId, number) {
      // 取得小數點後位數
      const decimalPlaces = 2//this.countDecimals(number)

      // 跳動時間
      const duration = 1.5 // 1秒
      const countUp = new CountUp(domId, number, {decimalPlaces, duration})
      if (!countUp.error) {
        countUp.start()
      } else {
        console.log(countUp.error)
      }
      return countUp
    },
    // 領取按鈕點按
    claimOnclick() {
      // 領取 request
      this.claimMyReward()
    },
    // 領取分紅收益
    claimMyReward() {
      if (!this.stakeInfo.availableBonus || this.stakeInfo.availableBonus <= 0) return
      Meteor.call('harvestBonus', null, (err, res) => {
        if (err) {
          this.toasterErr(Number(err.reason) || err.reason)
          return
        }
        if (res.code === 0) {
          this.$toast.success(this.$t('pledge.bonus.claimSucceed'))
          // 將收益扣到0
          this.myBonusReward = 0
          this.countUps.myBonusReward.update(0)
        }
      })
    },

    // 更新質押時做資料更新
    whenPledgeUpdate() {
      // 我的總算力
      this.countUps.myTotalPower.update(this.myTotalPower)
      // 占平台總算力比
      this.countUps.platformPowerPercentage.update(this.platformPowerPercentage)
      // 質押算力
      this.countUps.pledgePower.update(this.pledgePower)
      // 算力提升
      this.countUps.powerImprovement.update(this.powerImprovement)
    }
  },
  mounted() {
    window.bonus = this
    // 總分紅池
    this.countUps.tankTotalBonus = this.startCount('tankTotalBonus', this.tankTotalBonus)
    this.countUps.poolHistoryDivAmount = this.startCount('poolHistoryDivAmount', this.poolHistoryDivAmount)
    this.countUps.userHistoryDivAmount = this.startCount('userHistoryDivAmount', this.userHistoryDivAmount)
    // 今日總分紅
    this.countUps.todayTotalBonus = this.startCount('todayTotalBonus', this.todayTotalBonus)
    // 我的分紅
    this.countUps.myBonus = this.startCount('myBonus', this.myBonus)
    this.countUps.myYearlyBonus = this.startCount('myYearlyBonus', this.myYearlyBonus)
    // 平台總算力
    this.countUps.totalPlatformPower = this.startCount('totalPlatformPower', this.totalPlatformPower)
    // 平台總質押LUCK
    this.countUps.totalPlatformPledgeLUCK = this.startCount('totalPlatformPledgeLUCK', this.totalPlatformPledgeLUCK)
    // 我的分紅收益
    this.countUps.myBonusReward = this.startCount('myBonusReward', this.myBonusReward)

    // 我的總算力
    this.countUps.myTotalPower = this.startCount('myTotalPower', this.myTotalPower)
    // 占平台總算力比
    this.countUps.platformPowerPercentage = this.startCount('platformPowerPercentage', this.platformPowerPercentage)
    // 質押算力
    this.countUps.pledgePower = this.startCount('pledgePower', this.pledgePower)
    // 算力提升
    this.countUps.powerImprovement = this.startCount('powerImprovement', this.powerImprovement)
  }
}
</script>

<style lang="scss" scoped>
@import './../../../../assets/css/utils/variables.scss';
@import '/imports/ui/scss/theme';

.bonus-wrapper {
  position: relative;
  background-image: url('/static/ui/pledge/bonus/bg.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  padding: 84px 216px 52px 216px;

  color: #ffffff;


  .bonus-content {
    position: relative;
    max-width: 1200px;
    margin: 0 auto;

    // 分紅球球
    .bonus-tank-img {
      position: absolute;
      width: 608px;
      height: 520px;
      top: -164px;
      right: 0px;
      z-index: 0;
    }

    // 最上方分紅區塊
    .total-bonus {
      position: relative;
      z-index: 1;
      margin-bottom: 68px;
      // 總分紅池
      .total-amount-text {
        font-weight: 600;
        font-size: 20px;
        text-shadow: 0px 5px 8px rgba(0, 20, 15, 0.5);
      }

      .total-amount {
        white-space: nowrap;

        .total-amount-number {
          font-weight: 700;
          font-size: 72px;
          line-height: 88px;
          text-shadow: 0px 5px 8px rgba(0, 20, 15, 0.5);
        }

        .total-amount-unit {
          font-weight: 700;
          font-size: 24px;
          text-shadow: 0px 5px 8px rgba(0, 20, 15, 0.5);
        }
      }

      // 細項
      .detail {
        span {
          font-weight: 600;
          font-size: 18px;
        }
      }
    }

    // 卡片區塊
    .cards-wrapper {
      position: relative;
      z-index: 1;
      width: 100%;
      flex-wrap: wrap;
      gap: 32px;

      // 卡片
      .card {
        background: $cardBackgroundColor !important;
        border: 1px solid #13AA6D;
        box-shadow: 0px 5px 8px 1px #00140F80;

        border-radius: 8px;

        &.platform-statistics {
          width: calc(64% - 16px);
          height: 260px;
          padding: 44px 48px;

          .description {
            font-weight: 600;
            font-size: 16px;
            color: #95C6B7;
          }

          .number {
            font-weight: 800;
            font-size: 40px;
            line-height: 48px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }

        &.my-bonus {
          width: calc(36% - 16px);
          height: 260px;
          padding: 28px 24px;

          .my-bonus-inner {
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 8px;
            padding: 24px 32px;

            .description {
              font-weight: 600;
              font-size: 16px;
              color: #95C6B7;
            }

            .number-wrapper {
              font-weight: 700;

              .number {
                font-size: 40px;
                line-height: 48px;
              }

              .unit {
                font-size: 20px;
              }
            }

            .claim-btn {
              background: linear-gradient(226.58deg, #FFD12F 51.75%, #FF8E00 95.54%);
              height: 48px;
              min-width: 100%;

              /deep/ .v-btn__content {
                font-weight: 600;
              }

              &.v-btn--disabled {
                background: linear-gradient(142.1deg, #727272 -41.15%, #CACACA 94.16%);
              }
            }
          }
        }

        &.power-statistics {
          width: 100%;
          height: 164px;
          padding: 20px;
          gap: 20px;

          .power-statistics-inner {
            width: calc(50% - 10px);
            height: 100%;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 8px;

            .statistic-wrapper {
              width: 50%;

              .description {
                font-weight: 600;
                font-size: 16px;
                color: #95C6B7;
              }

              .number {
                font-weight: 700;
                font-size: 36px;
                line-height: 44px;

                &#platformPowerPercentage::after,
                &#powerImprovement::after {
                  content: '%';
                }
              }
            }
          }
        }
      }
    }
  }
}

@media screen and (max-width: 1490px) {
  .bonus-wrapper {
    padding: 72px 216px 48px 216px; // !

    .bonus-content {
      // 分紅球球
      .bonus-tank-img {
        width: 520px; // !
        height: 520px; // !
      }

      // 最上方分紅區塊
      .total-bonus {
        .total-amount {
          .total-amount-number {
            font-size: 60px; // !
          }
        }
      }

      // 卡片區塊
      .cards-wrapper {
        // 卡片
        .card {
          &.platform-statistics {
            .number {
              font-size: 32px; // !
            }
          }
        }
      }
    }
  }
}

@media screen and (max-width: 1264px) {
  .bonus-wrapper {
    padding: 72px 160px 48px 160px;

    .bonus-content {
      // 分紅球球
      .bonus-tank-img {
        width: 480px;
        height: 480px;
        top: -164px;
      }

      // 最上方分紅區塊
      .total-bonus {
        margin-bottom: 48px;
        // 總分紅池
        .total-amount-text {
          font-size: 20px;
        }

        .total-amount {
          .total-amount-number {
            font-size: 48px;
            line-height: 60px;
          }

          .total-amount-unit {
            font-size: 20px;
          }
        }

        // 細項
        .detail {
          span {
            font-size: 16px;
          }
        }
      }

      // 卡片區塊
      .cards-wrapper {
        gap: 20px;

        // 卡片
        .card {
          border-radius: 8px;

          &.platform-statistics {
            width: calc(64% - 10px);
            height: 200px;
            padding: 36px 40px;

            .description {
              font-size: 16px;
            }

            .number {
              font-size: 24px;
              line-height: 28px;
            }
          }

          &.my-bonus {
            width: calc(36% - 10px);
            height: 200px;
            padding: 20px 16px;

            .my-bonus-inner {
              border-radius: 8px;
              padding: 16px 20px;

              .description {
                font-size: 16px;
              }

              .number-wrapper {
                .number {
                  font-size: 28px;
                  line-height: 32px;
                }

                .unit {
                  font-size: 14px;
                }
              }

              .claim-btn {
                height: 40px;
                // max-width: 200px;
              }
            }
          }

          &.power-statistics {
            height: 120px;
            padding: 16px;
            gap: 16px;

            .power-statistics-inner {
              width: calc(50% - 8px);
              border-radius: 8px;

              .statistic-wrapper {
                width: 50%;

                .description {
                  font-size: 16px;
                }

                .number {
                  font-size: 24px;
                  line-height: 28px;
                }
              }
            }
          }
        }
      }
    }
  }
}

@media screen and (max-width: 960px) {
  .bonus-wrapper {
    padding: 60px 120px 40px 120px;

    .bonus-content {
      // 分紅球球
      .bonus-tank-img {
        width: 280px;
        height: 280px;
        top: -60px;
      }

      // 最上方分紅區塊
      .total-bonus {
        margin-bottom: 32px;
        // 總分紅池
        .total-amount-text {
          font-size: 16px;
        }

        .total-amount {
          .total-amount-number {
            font-size: 28px;
            line-height: 32px;
          }

          .total-amount-unit {
            font-size: 16px;
          }
        }

        // 細項
        .detail {
          span {
            font-size: 14px;
          }
        }
      }

      // 卡片區塊
      .cards-wrapper {
        gap: 16px;

        // 卡片
        .card {
          border-radius: 8px;

          &.platform-statistics {
            width: 100%;
            height: 160px;
            padding: 16px 20px;

            .description {
              font-size: 14px;
            }

            .number {
              font-size: 20px;
              line-height: 24px;
            }
          }

          &.my-bonus {
            width: 100%;
            height: 120px;
            padding: 12px 12px;

            .my-bonus-inner {
              border-radius: 8px;
              padding: 12px 20px;

              .description {
                font-size: 14px;
              }

              .number-wrapper {
                .number {
                  font-size: 24px;
                  line-height: 28px;
                }

                .unit {
                  font-size: 14px;
                }
              }

              .claim-btn {
                height: 36px;
                min-width: 120px;
              }
            }
          }

          &.power-statistics {
            height: 160px;
            padding: 12px;
            gap: 0px;

            .power-statistics-inner {
              width: 100%;
              border-radius: 8px;

              .statistic-wrapper {
                width: 50%;

                .description {
                  font-size: 14px;
                }

                .number {
                  font-size: 20px;
                  line-height: 24px;
                }
              }
            }
          }
        }
      }
    }
  }
}

@media screen and (max-width: 600px) {
  .bonus-wrapper {
    padding: 20px 10px 20px 10px;

    .bonus-content {
      // 分紅球球
      .bonus-tank-img {
        width: 160px;
        height: 160px;
        top: -20px;
      }

      // 最上方分紅區塊
      .total-bonus {
        margin-bottom: 16px;
        // 總分紅池
        .total-amount-text {
          font-size: 12px;
        }

        .total-amount {
          .total-amount-number {
            font-size: 24px;
            line-height: 24px;
          }

          .total-amount-unit {
            font-size: 12px;
          }
        }

        // 細項
        .detail {
          span {
            font-size: 12px;
          }
        }
      }

      // 卡片區塊
      .cards-wrapper {
        gap: 12px;

        // 卡片
        .card {
          border-radius: 8px;

          &.platform-statistics {
            width: 100%;
            height: 136px;
            padding: 12px 16px;

            .description {
              font-size: 12px;
            }

            .number {
              font-size: 18px;
              line-height: 20px;
            }
          }

          &.my-bonus {
            width: 100%;
            height: 100px;
            padding: 10px 10px;

            .my-bonus-inner {
              border-radius: 8px;
              padding: 12px 16px;

              .description {
                font-size: 12px;
              }

              .number-wrapper {
                .number {
                  font-size: 16px;
                  line-height: 20px;
                }

                .unit {
                  font-size: 12px;
                }
              }

              .claim-btn {
                height: 32px;
                min-width: 76px;
              }
            }
          }

          &.power-statistics {
            height: 148px;
            padding: 10px;
            gap: 0px;

            .power-statistics-inner {
              width: 100%;
              border-radius: 8px;

              .statistic-wrapper {
                width: 50%;

                .description {
                  font-size: 12px;
                }

                .number {
                  font-size: 16px;
                  line-height: 20px;
                }
              }
            }
          }
        }
      }
    }
  }
}

</style>
