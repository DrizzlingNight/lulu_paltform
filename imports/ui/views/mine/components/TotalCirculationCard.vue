<template>
  <div class="total-circulation-card">
    <!-- 種植挖礦 -->
    <p class="description mb-4 mb-md-7">{{ $t('mine.totalCirculationCard.coinDistribute') }}</p>
    <div class="inner-card">
      <div class="total-circulation">
        <img class="coin-image" src="/static/ui/mine/LUCK.svg" />
        <!-- 流通總量文字(<930) -->
        <p class="total-circulation-text-md">{{ `${$t('mine.totalCirculation')}:` }}</p>
        <p class="total-circulation-text-wrapper mb-0">
          <span class="text">{{ `${$t('mine.totalCirculation')}:` }}</span>
          <span class="number mx-2" id="totalCirculation">
            {{ totalCirculation.toLocaleString() }}
          </span>
          <span class="unit">LUCK</span>
        </p>
      </div>
      <div class="percentage-wrapper">
        <div class="percentage-circle">
          <!-- 圓餅圖 -->
          <img src="/static/ui/mine/percentage-circle.svg" />
        </div>
        <!-- 總發行量(<930) -->
        <div class="total-release-md">
          <div class="text">{{ `${$t('mine.totalCirculationCard.totalRelease')}：` }}</div>
          <div class="number">{{ `${percentageData.totalRelease.toLocaleString()} LUCK` }}</div>
        </div>
        <div class="percentage-detail">
          <!-- 挖礦占比 -->
          <div class="mine-percentage">
            <div class="circle"></div>
            <div class="text">{{ `${$t('mine.totalCirculationCard.mineRate')}：` }}</div>
            <div class="percentage">{{ `${percentageData.mineRate}%` }}</div>
            <v-spacer ></v-spacer>
            <dic class="number">{{ `${percentageData.mineAmount.toLocaleString()} LUCK` }}</dic>
          </div>
          <!-- 邀請挖礦占比 -->
          <div class="referral-percentage">
            <div class="circle"></div>
            <div class="text">{{ `${$t('mine.totalCirculationCard.referralRate')}：` }}</div>
            <div class="percentage">{{ `${percentageData.referralRate}%` }}</div>
            <v-spacer ></v-spacer>
            <dic class="number">{{ `${percentageData.referralAmount.toLocaleString()} LUCK` }}</dic>
          </div>
          <!-- 市場運營占比 -->
          <div class="operation-percentage">
            <div class="circle"></div>
            <div class="text">{{ `${$t('mine.totalCirculationCard.operationRate')}：` }}</div>
            <div class="percentage">{{ `${percentageData.operationRate}%` }}</div>
            <v-spacer ></v-spacer>
            <dic class="number">{{ `${percentageData.operationAmount.toLocaleString()} LUCK` }}</dic>
          </div>
          <!-- 銷毀占比 -->
          <div class="burn-percentage">
            <div class="circle"></div>
            <div class="text">{{ `${$t('mine.totalCirculationCard.burnRate')}：` }}</div>
            <div class="percentage">{{ `${percentageData.burnRate}%` }}</div>
            <v-spacer ></v-spacer>
            <dic class="number">{{ `${percentageData.burnAmount.toLocaleString()} LUCK` }}</dic>
          </div>
          <!-- 流通性占比 -->
          <div class="fluidity-percentage">
            <div class="circle"></div>
            <div class="text">{{ `${$t('mine.totalCirculationCard.fluidityRate')}：` }}</div>
            <div class="percentage">{{ `${percentageData.fluidityRate}%` }}</div>
            <v-spacer ></v-spacer>
            <dic class="number">{{ `${percentageData.fluidityAmount.toLocaleString()} LUCK` }}</dic>
          </div>
        </div>
      </div>
      <!-- 總發行量 -->
      <div class="total-release">
        <div class="text">{{ `${$t('mine.totalCirculationCard.totalRelease')}：` }}</div>
        <div class="number">{{ `${percentageData.totalRelease.toLocaleString()} LUCK` }}</div>
      </div>
      <div class="progress-wrapper">
        <!-- 挖礦進度 -->
        <div class="mine-progress">
          <div class="detail">
            <div class="text">{{ `${$t('mine.totalCirculationCard.mineProgress')}：` }}</div>
            <div class="number">{{ `${progressData.mineAmount.toLocaleString()} LUCK` }}</div>
            <v-spacer></v-spacer>
            <div class="percentage">{{ `${progressData.mineProgress}%` }}</div>
          </div>
          <v-progress-linear :value="progressData.mineProgress" class="mb-4"></v-progress-linear>
        </div>
        <!-- 邀請挖礦進度 -->
        <div class="referral-progress">
          <div class="detail">
            <div class="text">{{ `${$t('mine.totalCirculationCard.referralProgress')}：` }}</div>
            <div class="number">{{ `${progressData.referralAmount.toLocaleString()} LUCK` }}</div>
            <v-spacer></v-spacer>
            <div class="percentage">{{ `${progressData.referralProgress}%` }}</div>
          </div>
          <v-progress-linear :value="progressData.referralProgress" class="mb-4"></v-progress-linear>
        </div>
        <!-- 市場運營進度 -->
        <div class="operation-progress">
          <div class="detail">
            <div class="text">{{ `${$t('mine.totalCirculationCard.operationProgress')}：` }}</div>
            <div class="number">{{ `${progressData.operationAmount.toLocaleString()} LUCK` }}</div>
            <v-spacer></v-spacer>
            <div class="percentage">{{ `${progressData.operationProgress}%` }}</div>
          </div>
          <v-progress-linear :value="progressData.operationProgress" class="mb-4"></v-progress-linear>
        </div>
        <!-- 銷毀進度 -->
        <div class="burn-progress">
          <div class="detail">
            <div class="text">{{ `${$t('mine.totalCirculationCard.burnProgress')}：` }}</div>
            <div class="number">{{ `${progressData.burnAmount.toLocaleString()} LUCK` }}</div>
            <v-spacer></v-spacer>
            <div class="percentage">{{ `${progressData.burnProgress}%` }}</div>
          </div>
          <v-progress-linear :value="progressData.burnProgress" class="mb-4"></v-progress-linear>
        </div>
        <!-- 流動性進度 -->
        <div class="fluidity-progress">
          <div class="detail">
            <div class="text">{{ `${$t('mine.totalCirculationCard.fluidityProgress')}：` }}</div>
            <div class="number">{{ `${progressData.fluidityAmount.toLocaleString()} LUCK` }}</div>
            <v-spacer></v-spacer>
            <div class="percentage">{{ `${progressData.fluidityProgress}%` }}</div>
          </div>
          <v-progress-linear :value="progressData.fluidityProgress" class="mb-4"></v-progress-linear>
        </div>
      </div>
    </div>
    <!-- 市場運營解鎖量 -->
    <div class="operation-total">
      <div class="text">{{ `${$t('mine.totalCirculationCard.totalOperation')}：` }}</div>
      <div class="number">{{ `${progressData.totalOperation.toLocaleString()} LUCK` }}</div>
    </div>
    <!-- 市場運營規則 -->
    <div class="operation-rule">
      <div class="text">{{ $t('mine.totalCirculationCard.operationRule') }}</div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'TotalCirculationCard',
  props: {
    totalCirculation:{
      type: Number,
      default: 0
    },
    percentageData: {
      type: Object,
      default: () => {return {}}
    },
    progressData: {
      type: Object,
      default: () => {return {}}
    },
  }
}
</script>

<style lang="scss" scoped>
@import './../../../assets/css/utils/variables.scss';
@import '/imports/ui/scss/theme';

.total-circulation-card {
  background: #00322E;
  width: 100%;
  min-height: 1330px;
  display: flex;
  flex-direction: column;
  padding: 44px 40px;
  border-radius: 10px;
  margin-bottom: 64px;

  .description {
    font-weight: 600;
    font-size: 20px;
  }

  // 共用文字樣式
  .text {
    color: #95C6B7;
    font-size: 18px;
  }
  .percentage {
    color: #00FFCA;
    font-size: 18px;
  }
  .number {
    color: #00FFCA;
    font-size: 18px;
  }


  .inner-card {
    background: rgba(7, 24, 22, 0.5);
    width: 100%;
    padding: 32px 24px 12px 24px;
    border-radius: 6px;

    // 總流通量
    .total-circulation {
      background: url("/static/ui/mine/total-circulation-background.svg");
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 265px;
      border-radius: 24px;

      .total-circulation-text-md {
        display: none;
      }

      .total-circulation-text-wrapper {
        .text {
          color: #FFFFFF;
          font-size: 24px;
          font-weight: 600; 
        }
        .number {
          color: #FFFFFF;
          font-size: 64px;
          font-weight: 700;
        }
        .unit {
          color: #FFFFFF;
          font-size: 24px;
          font-weight: 700;
        }
      }
    }

    // 占比區
    .percentage-wrapper {
      display: flex;
      flex-direction: row;
      align-items: center;
      width: 100%;
      margin-top: 48px;

      .percentage-circle {
        min-width: 240px;
        min-height: 240px;
        margin-right: 78px;
      }

      .total-release-md {
        display: none;
      }

      .percentage-detail {
        display: flex;
        flex-direction: column;
        width: 100%;
        
        .mine-percentage,
        .referral-percentage,
        .operation-percentage,
        .burn-percentage,
        .fluidity-percentage {
          display: flex;
          flex-direction: row;
          align-items: center;
          width: 100%;
          padding: 8px 16px;

          .circle {
            width: 12px;
            height: 12px;
            border-radius: 6px;
            margin-right: 16px;
          }
        }

        .mine-percentage,
        .operation-percentage,
        .fluidity-percentage {
          background: rgba(73, 135, 121, 0.08);
          border-radius: 4px;
        }



        .mine-percentage {
          .circle {
            background: #FF7500;
          }
        }
        .referral-percentage {
          .circle {
            background: #FFA20D;
          }
        }
        .operation-percentage {
          .circle {
            background: #FFBD13;
          }
        }
        .burn-percentage {
          .circle {
            background: #FFD336;
          }
        }
        .fluidity-percentage {
          .circle {
            background: #FFDD65;
          }
        }
      }
    }

    // 總發行量
    .total-release {
      display: flex;
      flex-direction: row;
      margin-top: 17px;
    }

    // 進度區
    .progress-wrapper {
      display: flex;
      flex-direction: column;
      margin-top: 48px;

      .mine-progress,
      .referral-progress,
      .operation-progress,
      .burn-progress,
      .fluidity-progress {
        display: flex;
        flex-direction: column;
        width: 100%;
        margin-bottom: 24px;

        .detail {
          display: flex;
          flex-direction: row;
          margin-bottom: 8px;
        }

        // 進度條
        /deep/ .v-progress-linear {
          height: 12px !important;
          border-radius: 6px;

          // 進度條底色
          .v-progress-linear__background {
            background: #2D4742 !important;
          }

          // 進度條顏色
          .v-progress-linear__determinate {
            background: linear-gradient(170.64deg, #FFB030 14.15%, #FF8000 85.1%) !important;
            border-radius: 6px;
          }
        }
      }
      
      .fluidity-progress {
        margin-bottom: 0px;
      }
    }
  }

  .operation-total {
    display: flex;
    flex-direction: row;
    margin-top: 8px;
    margin-left: 24px;

    .text,
    .number {
      font-size: 16px;
    }
  }

  .operation-rule {
    margin-top: 8px;
    margin-left: 24px;

    .text {
      font-size: 16px;
    }
  }
}

@media screen and (max-width: 930px) {
  .total-circulation-card {
    min-height: 1550px;
  
    .inner-card {
      // 總流通量
      .total-circulation {
        .total-circulation-text-md {
          display: block;
          color: #FFFFFF;
          font-size: 24px;
          font-weight: 600; 
          margin-bottom: 0px;
        }

        .total-circulation-text-wrapper {
          .text {
            display: none;
          }
          .number {
            font-size: 48px;
          }
        }
      }
      // 占比區
      .percentage-wrapper {
        display: flex;
        flex-direction: column;

        .percentage-circle {
          margin-right: 0px;
        }

        .total-release-md {
          display: flex;
          flex-direction: row;
          margin-top: 25px;
          margin-bottom: 35px;
        }
      }

      .total-release {
        display: none;
      }
    }
  }
}

@media screen and (max-width: 600px) {
  .total-circulation-card {
    min-height: 1130px;
  
    // 共用文字樣式
    .text {
      font-size: 12px;
    }
    .percentage {
      color: #00FFCA;
      font-size: 12px;
    }
    .number {
      color: #00FFCA;
      font-size: 12px;
    }

    .inner-card {
      padding: 16px 8px 12px 8px;

      // 總流通量
      .total-circulation {
        height: 146px;
        .coin-image {
          width: 48px;
          height: 48px;
        }

        .total-circulation-text-md {
          font-size: 16px;
        }

        .total-circulation-text-wrapper {
          .number {
            font-size: 24px;
          }
          .unit {
            font-size: 16px;
          }
        }
      }

      // 占比區
      .percentage-wrapper {
        .total-release-md {
          margin-bottom: 17px;
        }

        .percentage-detail {
          .mine-percentage,
          .referral-percentage,
          .operation-percentage,
          .burn-percentage,
          .fluidity-percentage { 
            padding: 4px 8px;

            .circle {
              width: 8px;
              height: 8px;
              border-radius: 4px;
              margin-right: 4px;
            }
          }
        }
      }

       // 進度區
      .progress-wrapper {
        margin-top: 16px;

        .mine-progress,
        .referral-progress,
        .operation-progress,
        .burn-progress,
        .fluidity-progress {
          margin-bottom: 0px;
        }
      }
    }
  }
}
</style>
