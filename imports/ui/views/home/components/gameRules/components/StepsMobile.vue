<template>
  <!--步驟圖 -->
  <div class="steps-wrapper d-flex d-md-none flex-column align-end">
    <!-- 上半部步驟圖 -->
    <div class="steps-up d-flex justify-center align-center">
      <!-- 步驟1 -->
      <div class="step d-flex flex-column align-center">
        <div class="step-img-block d-flex align-center justify-center mb-3">
          <v-img width="70%" height="70%" contain src="/static/ui/home/gameRules/step_img_1.png"></v-img>
        </div>
        <div class="step-text d-flex flex-column align-center">
          <span class="step-title">{{ $t('home.gameRules.step1.title') }}</span>
          <span class="step-description">{{ $t('home.gameRules.step1.description') }}</span>
        </div>
      </div>

      <v-img contain src="/static/ui/home/gameRules/arrow_up.svg" class="arrow"></v-img>

      <!-- 步驟2 -->
      <div class="step d-flex flex-column align-center">
        <div class="step-img-block d-flex align-center justify-center mb-3">
          <v-img width="70%" height="70%" contain src="/static/ui/home/gameRules/step_img_2.png"></v-img>
        </div>
        <div class="step-text d-flex flex-column align-center">
          <span class="step-title">{{ $t('home.gameRules.step2.title') }}</span>
          <span class="step-description">{{ $t('home.gameRules.step2.description') }}</span>
        </div>
        <!-- 向下箭頭 -->
        <v-img contain src="/static/ui/home/gameRules/arrow_down.svg" class="arrow-down"></v-img>
      </div>
    </div>

    <!-- 下半部步驟圖 -->
    <div class="steps-down d-flex justify-center">
      <!-- 步驟4 -->
      <div class="step d-flex flex-column align-center">
        <div class="step-img-block d-flex align-center justify-center mb-3">
          <v-img width="70%" height="70%" contain src="/static/ui/home/gameRules/step_img_4.png"></v-img>
        </div>
        <div class="step-text d-flex flex-column align-center">
          <span class="step-title">{{ $t('home.gameRules.step4.title') }}</span>
          <span class="step-description">{{ $t('home.gameRules.step4.description') }}</span>
        </div>
      </div>

      <v-img contain src="/static/ui/home/gameRules/arrow_up.svg" class="arrow" style="transform: scaleX(-1);"></v-img>

      <!-- 步驟3 -->
      <div class="step d-flex flex-column align-center">
        <div class="step-img-block d-flex align-center justify-center mb-3">
          <v-img width="70%" height="70%" contain src="/static/ui/home/gameRules/step_img_3.png"></v-img>
        </div>
        <div class="step-text d-flex flex-column align-center">
          <span class="step-title">{{ $t('home.gameRules.step3.title') }}</span>
          <span class="step-description">{{ $t('home.gameRules.step3.description') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StepsMobile',
  data() {
    return {
    }
  },
}
</script>

<style lang="scss" scoped>
@import './../../../../../assets/css/utils/variables.scss';

// 步驟圖
.steps-wrapper {
  width: calc(100% - 20px);
  margin-bottom: 120px !important;

  .steps-up, .steps-down {
    width: 100%;
  }

  .steps-up {
    margin-bottom: 120px;
  }

  .step {
    position: relative;
    padding: 0px 32px;

    .step-img-block {
      background: #00322E;
      border-radius: 10px;
      width: 100px;
      height: 100px;

    }
    .step-text {
      position: absolute;
      top: 100%;
      width: 220px;
      text-align: center;

      .step-title {
        font-size: 16px;
        font-weight: 600;
      }
      .step-description {
        // white-space: nowrap;
        font-size: 12px;
      }
    }

    // 向下箭頭
    .arrow-down {
      position: absolute;
      height: 60px;
      width: auto;
      bottom: -112px;
    }
  }
  .arrow {
    max-width: 60px;
    height: auto
  }
}

@media screen and (max-width: 600px) {
  
// 步驟圖
.steps-wrapper {
  margin-bottom: 72px !important;

  .steps-up {
    margin-bottom: 120px;
  }

  .step {
    position: relative;
    padding: 0px 32px;

    .step-img-block {
      width: 72px;
      height: 72px;

    }
    .step-text {
      top: 100%;
      width: 172px;

      .step-title {
        font-size: 12px;
      }
      .step-description {
        font-size: 11px;
      }
    }

    // 向下箭頭
    .arrow-down {
      position: absolute;
      height: 36px;
      width: auto;
      bottom: -100px;
    }
  }

  .arrow {
    max-width: 36px;
    height: auto
  }
}
  
}
</style>