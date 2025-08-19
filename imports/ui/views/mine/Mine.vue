<template>
  <div class="mine-wrapper">
    <div class="mine-content">
      <!-- 新流通總量卡片 -->
      <TotalCirculationCard
        v-if="percentageData" 
        :totalCirculation="totalCirculation"
        :percentageData="percentageData"
        :progressData="progressData"
      />
      <!-- 總流通量模糊卡片 -->
      <!-- <div class="total-circulation-card d-flex flex-column justify-space-between mb-3 mb-sm-6 mb-md-8 mb-lg-14" :class="{ 'darken-bg': isFirefox }">
        <span class="description">{{ $t('mine.totalCirculation') }}</span>
        <p class="total-circulation-text-wrapper d-flex align-end mb-0">
          <span class="number mr-2 mr-sm-4 mr-md-6" id="totalCirculation">
            {{ totalCirculation.toLocaleString() }}
          </span>
          <span class="unit">LUCK</span>
        </p>
      </div> -->
      <!-- 種植挖礦卡片 -->
      <ProcessCard :process-data="plantMiningProcessData" :type="'mine'" />
      <!-- 邀請挖礦卡片 -->
      <ProcessCard :process-data="referralMiningProcessData" :type="'referral'" />
    </div>
  </div>
</template>

<script>
import { CountUp } from 'countup.js'

import ProcessCard from './components/processCard/ProcessCard.vue'
import TotalCirculationCard from './components/TotalCirculationCard'

export default {
  name: 'Mine',
  components: {
    ProcessCard,
    TotalCirculationCard
  },
  mounted () {
    this.logEvent('go_mining')
  },
  data: () =>({
    // 是否為 firefox ( blur效果無法生效 )
    isFirefox: false,
    // 種植挖礦整理後資料
    plantMiningProcessData: {
      totalStage: 0,
      totalCoin: 0,
      currentStage: {
        stage: 0,
        totalCoin: 0,
        minedCoin: 0,
        stagePercentage: 0,
        ratio: 0
      }
    },
    // 邀請挖礦整理後資料
    referralMiningProcessData: {
      totalStage: 0,
      totalCoin: 0,
      currentStage: {
        stage: 0,
        totalCoin: 0,
        minedCoin: 0,
        stagePercentage: 0,
        ratio: 0
      }
    },
    percentageData: null,
    progressData: null,
  }),
  computed: {
    totalCirculation() {
      const plantMiningTotal = this.plantMiningProcessData.totalCoin
      const referralMiningTotal = this.referralMiningProcessData.totalCoin
      return plantMiningTotal + referralMiningTotal
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

    // 開始跳動數字
    startCount(domId, number) {
      // 取得小數點後位數
      const decimalPlaces = this.countDecimals(number)
      // 跳動時間
      const duration = 1.5
      const countUp = new CountUp(domId, number, { decimalPlaces, duration })
      if (!countUp.error) {
        countUp.start()
      } else {
        console.log(countUp.error)
      }
    },

    // 資料結構轉換器 (response -> data)
    rawProcessObjectConvert(rawProcessObject) {

      // 總階段數量
      const totalStage = rawProcessObject.thresholds.length

      // 計算挖礦總幣量
      const totalCoin = Number(rawProcessObject.total)

      // 計算當前輪數
      let currentStageIndex = 0 // 預設第0階段
      // 計算目前總量在第幾區間
      for (let i = 0; i < totalStage; i ++) {
        const currentStageTotal = Number(rawProcessObject.thresholds[i].total)
        const nextStageTotal = Number(rawProcessObject.thresholds[i + 1].total)
        if (currentStageTotal < totalCoin && totalCoin <= nextStageTotal) {
          currentStageIndex = i
          break
        }
      }

      // 當前輪數已挖出的數量
      // 當前輪數的起始數量
      const currentStageTotalFloor = Number(rawProcessObject.thresholds[currentStageIndex].total)
      const currentStageMinedAmount = totalCoin - currentStageTotalFloor

      // 當前輪數的總量
      // 下階段的起始數量
      const nextStageTotalFloor = Number(rawProcessObject.thresholds[currentStageIndex + 1].total)
      const currentStageTotal = nextStageTotalFloor - currentStageTotalFloor


      // 當前輪數百分比進度
      // 當前階段已挖出 / 當前階段總量
      const currentStagePercentage = (currentStageMinedAmount / currentStageTotal * 100).toFixed(2) // 省略到小數後兩位

      // 當前階段一級用戶獎勵比值
      const currentStageRatio = Number(rawProcessObject.thresholds[currentStageIndex].rate)

      return {
        totalStage,
        totalCoin,
        currentStage: {
          stage: currentStageIndex + 1,
          totalCoin: currentStageTotal,
          minedCoin: currentStageMinedAmount,
          stagePercentage: currentStagePercentage,
          ratio: currentStageRatio
        }
      }
    },
    // 占比資料轉換
    percentageDataConvert(data) {
      const total = Number(data.total)

      return {
        mineRate: data.mine_rate * 100,
        referralRate: data.referral_rate * 100,
        operationRate: data.operation_rate * 100,
        burnRate: data.burn_rate * 100,
        fluidityRate: data.fluidity_rate * 100,
        mineAmount: data.mine_rate * total,
        referralAmount: data.referral_rate * total,
        operationAmount: data.operation_rate * total,
        burnAmount: data.burn_rate * total,
        fluidityAmount: data.fluidity_rate * total,
        totalRelease: total
      }
    },
    // 進度資料轉換
    progressDataConvert(percentageData, data) {
      return {
        mineAmount: Number(data.mine),
        referralAmount: Number(data.referral),
        operationAmount: Number(data.operation_amount),
        burnAmount: Number(data.burn_amount),
        fluidityAmount: Number(data.fluidity_amount),
        mineProgress: (Number(data.mine) / percentageData.mineAmount * 100).toFixed(4),
        referralProgress: (Number(data.referral) / percentageData.referralAmount * 100).toFixed(4),
        operationProgress: (Number(data.operation_amount) / percentageData.operationAmount * 100).toFixed(4),
        burnProgress: (Number(data.burn_amount) / percentageData.burnAmount * 100).toFixed(4),
        fluidityProgress: (Number( data.fluidity_amount) / percentageData.fluidityAmount * 100).toFixed(4),
        totalOperation: Number(data.operation_unlock_amount)
      }
    },
    // 進入頁面時間測是否為 firefox
    detectIsFirefox() {
      this.isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1
    }
  },
  created() {
    // 監測firefox
    this.detectIsFirefox()

    // meteor 拉資料
    Meteor.call('getMiningInfo',(err,res)=>{
      if (err) {
        console.log(err)
      } else {
        console.log(res)
        const rawMineResponse = res.mine
        const rawReferralResponse = res.referral

        this.plantMiningProcessData = {...this.rawProcessObjectConvert(rawMineResponse)}
        this.referralMiningProcessData = {...this.rawProcessObjectConvert(rawReferralResponse)}

        // 總流通量跳動
        this.startCount('totalCirculation', this.totalCirculation)
      }
    })

    Meteor.call('getMiningProgress',(err,res)=>{
      if (err) {
        console.log('getMiningProgress err',err)
      } else {
        console.log('getMiningProgress res',res)
        const percentageData = this.percentageDataConvert(res.conf)
        const progressData = this.progressDataConvert(percentageData, res.progress)

        this.percentageData = percentageData
        this.progressData = progressData
      }
    })
  },
}
</script>

<style lang="scss" scoped>
@import './../../assets/css/utils/variables.scss';

.mine-wrapper {
  position: relative;
  background-image: url('/static/ui/mine/bg.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: top;
  padding: 344px 216px 20px 216px;

  color: #ffffff;

  .mine-content {
    max-width: 1200px;
    margin: 0 auto;

    // 總流通量模糊卡片
    // .total-circulation-card {
    //   width: 60%;
    //   max-width: 716px;
    //   height: 176px;
    //   padding: 32px 40px 20px 40px;
    //   backdrop-filter: blur(10px);
    //   border-radius: 10px;

    //   &.darken-bg {
    //     background: rgba(0, 20, 15, 0.5);
    //   }

    //   .description {
    //     font-size: 20px;
    //     font-weight: 600;
    //     text-shadow: 0px 5px 8px rgba(0, 20, 15, 0.5);
    //   }

    //   .total-circulation-text-wrapper {
    //     .number {
    //       font-size: 64px;
    //       line-height: 64px;
    //       text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    //       font-weight: 600;
    //     }

    //     .unit {
    //       font-size: 24px;
    //       text-shadow: 0px 5px 8px rgba(0, 20, 15, 0.5);
    //     }
    //   }
    // }
  }
}

@media screen and (max-width: 1490px) {
  .mine-wrapper {
    .mine-content {
      // 總流通量模糊卡片
      .total-circulation-card {
        height: 148px;
        .total-circulation-text-wrapper {
          .number {
            font-size: 48px;
            line-height: 48px;
          }
          .unit {
            font-size: 20px;
          }
        }
      }
    }
  }
}

@media screen and (max-width: 1264px) {
  .mine-wrapper {
    padding: 300px 32px 20px 32px;

    // .mine-content {

    //   // 總流通量模糊卡片
    //   .total-circulation-card {
    //     height: 136px;
    //     padding: 32px 40px 20px 40px;

    //     .description {
    //       font-size: 16px;
    //     }

    //     .total-circulation-text-wrapper {
    //       .number {
    //         font-size: 36px;
    //         line-height: 36px;
    //       }

    //       .unit {
    //         font-size: 20px;
    //       }
    //     }
    //   }
    // }
  }
}

@media screen and (max-width: 960px) {
  .mine-wrapper {
    padding: 240px 32px 20px 32px;

    // .mine-content {

    //   // 總流通量模糊卡片
    //   .total-circulation-card {
    //     width: 100%;
    //     height: 120px;
    //     padding: 20px 32px 16px 32px;

    //     .description {
    //       font-size: 16px;
    //     }

    //     .total-circulation-text-wrapper {
    //       .number {
    //         font-size: 32px;
    //         line-height: 32px;
    //       }

    //       .unit {
    //         font-size: 16px;
    //       }
    //     }
    //   }
    // }
  }
}

@media screen and (max-width: 600px) {
  .mine-wrapper {
    padding: 66px 10px 10px 10px;

    // .mine-content {

    //   // 總流通量模糊卡片
    //   .total-circulation-card {
    //     width: 200px;
    //     height: 68px;
    //     padding: 12px 12px 12px 12px;

    //     .description {
    //       font-size: 12px;
    //     }

    //     .total-circulation-text-wrapper {
    //       .number {
    //         font-size: 18px;
    //         line-height: 24px;
    //       }

    //       .unit {
    //         font-size: 18px;
    //       }
    //     }
    //   }
    // }
  }
}

</style>