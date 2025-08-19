<template>
  <div class="process-card">
    <!-- 種植挖礦 -->
    <p v-if="type === 'mine'" class="description mb-4 mb-md-7">{{ $t('mine.processCard.plantMining') }}</p>
    <!-- 邀請挖礦 -->
    <p v-if="type === 'referral'" class="description mb-4 mb-md-7">{{ $t('mine.processCard.referralMining') }}</p>
    <!-- 第*輪 -->
    <p class="stage-text-wrapper d-flex align-center mb-3">
      {{ $t('mine.processCard.stageText1') }}
      <span class="numbers mx-3">
        {{ processData.currentStage.stage }} / {{ $t(`mine.processCard.${ type === 'mine' ? 'plantMiningTotalStagesVal' : 'referralMiningTotalStagesVal'}`) }}
      </span>
      {{ $t('mine.processCard.stageText2') }}
    </p>
    <!-- 進度條卡片 -->
    <div class="inner-card mb-4 mb-md-7">
      <!-- 本輪種植挖礦數量 -->
      <p v-if="type === 'mine'" class="description mb-5">{{ $t('mine.processCard.currentStagePlantMineAmount') }} :</p>
      <!-- 本輪邀請挖礦數量 -->
      <p v-if="type === 'referral'" class="description mb-5">{{ $t('mine.processCard.currentStageReferralMineAmount') }} :</p>
      <!-- 已挖出... -->
      <p class="amount-text-wrapper mb-3">
        <span class="prefix">{{ $t('mine.processCard.haveMined') }}:</span>
        <span class="number">{{ processData.currentStage.minedCoin.toLocaleString() }}</span>
        <span class="unit">LUCK</span>
      </p>
      <!-- 進度條 -->
      <v-progress-linear :value="processData.currentStage.stagePercentage" class="mb-4"></v-progress-linear>
      <!-- 百分比、本輪總量 -->
      <p class="bar-below-text-wrapper d-flex mb-0">
        <span>{{ processData.currentStage.stagePercentage }} %</span>
        <v-spacer></v-spacer>
        <span>{{ processData.currentStage.totalCoin.toLocaleString() }} LUCK</span>
      </p>
    </div>
    <!-- 規則描述 (根據種類渲染) -->
    <div class="rules pl-0 pl-md-6">
      <!-- 種植挖礦規則 -->
      <div v-if="type === 'mine'" class="plant-mining-rules-wrapper">
        <p class="mb-5">
          <span v-html="$t('mine.processCard.plantMiningRules.rule1')" class="text-mute"></span>
          <span class="text-light">1 LUSD : {{ processData.currentStage.ratio }} LUCK</span>
        </p>
        <p class="mb-0 text-mute">
          {{ $t('mine.processCard.plantMiningRules.rule2.prefix') }}
          <span class="text-light mx-1">{{ $t('mine.processCard.plantMiningRules.rule2.totalAmountVal') }} LUCK</span>
          {{ $t('mine.processCard.plantMiningRules.rule2.suffix') }}
        </p>
      </div>
      <!-- 邀請挖礦規則 -->
      <div v-if="type === 'referral'" class="referral-mining-rules-wrapper">
        <p class="text-mute mb-2 mb-md-5">
          {{ $t('mine.processCard.referralMiningRules.rule1') }}
        </p>
        <p class="text-light mb-2 mb-md-5">
          {{ $t('mine.processCard.referralMiningRules.rule2') }} : 1 LUSD : 
          {{ processData.currentStage.ratio }} LUCK
        </p>
        <p class="text-light mb-2 mb-md-5">
          {{ $t('mine.processCard.referralMiningRules.rule3') }} : 1 LUSD : 
          {{ processData.currentStage.ratio / 2 }} LUCK
        </p>
        <p class="text-mute mb-0">
          {{ $t('mine.processCard.referralMiningRules.rule4.prefix') }}
          <span class="text-light">{{ $t('mine.processCard.referralMiningRules.rule4.totalAmountVal') }} LUCK</span>
          {{ $t('mine.processCard.referralMiningRules.rule4.suffix') }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProcessCard',
  props: {
    processData: {
      type: Object,
      default: () => ({
        totalStage: 20,
        totalCoin: 5000000000,
        currentStage: {
          stage: 4,
          totalCoin: 250000000,
          minedCoin: 1000000,
          stagePercentage: 18.90,
          ratio: 1
        }
      })
    },
    type: {
      type: String,
      default: ''
    }
  },
}
</script>

<style lang="scss" scoped>
@import './../../../../assets/css/utils/variables.scss';
@import '/imports/ui/scss/theme';

.process-card {
  background: #00322E;
  width: 100%;
  padding: 44px 40px;
  border-radius: 10px;
  margin-bottom: 64px;

  .description {
    font-weight: 600;
    font-size: 20px;
  }

  .stage-text-wrapper {
    font-weight: 600;
    font-size: 18px;
    line-height: 44px;

    .numbers {
      font-size: 36px;
      font-weight: 600;
    }
  }

  .inner-card {
    background: rgba(7, 24, 22, 0.5);
    width: 100%;
    padding: 32px 24px 12px 24px;
    border-radius: 6px;

    .description {
      font-weight: 600;
      font-size: 18px;
      color: $darkFontColor;
    }

    .amount-text-wrapper {
      font-size: 18px;

      .prefix {
        font-weight: 600;
        color: #95C6B7;
      }
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

    // 百分比、本輪總量文字
    .bar-below-text-wrapper span {
      font-weight: 700;
      font-size: 18px;
      color: #95C6B7;
    }

  }

  // 規則描述
  .rules {
    .text-mute {
      font-size: 16px;
      color: #44675F;
    }
    .text-light {
      font-size: 16px;
      color: #95C6B7;
    }
  }
}

@media screen and (max-width: 960px) {
  .process-card {
    padding: 20px 16px;
    margin-bottom: 24px;

    .description {
      font-size: 20px;
    }

    .stage-text-wrapper {
      font-size: 16px;
      line-height: 20px;

      .numbers {
        font-size: 20px;
      }
    }

    .inner-card {
      padding: 20px 16px 16px 16px;

      .description {
        font-size: 16px;
      }

      .amount-text-wrapper {
        font-size: 16px;
      }

      // 百分比、本輪總量文字
      .bar-below-text-wrapper span {
        font-size: 16px;
      }

    }

    // 規則描述
    .rules {
      .text-mute {
        font-size: 16px;
      }
      .text-light {
        font-size: 16px;
      }
    }
  }
}

@media screen and (max-width: 600px) {
  .process-card {
    padding: 24px 10px;
    margin-bottom: 10px;

    .description {
      font-size: 18px;
    }

    .stage-text-wrapper {
      font-size: 12px;
      line-height: 16px;

      .numbers {
        font-size: 18px;
      }
    }

    .inner-card {
      padding: 16px 10px 16px 10px;

      .description {
        font-size: 12px;
      }

      .amount-text-wrapper {
        font-size: 12px;
      }

      // 百分比、本輪總量文字
      .bar-below-text-wrapper span {
        font-size: 12px;
      }

    }

    // 規則描述
    .rules {
      .text-mute {
        font-size: 12px;
      }
      .text-light {
        font-size: 12px;
      }
    }
  }
}

</style>