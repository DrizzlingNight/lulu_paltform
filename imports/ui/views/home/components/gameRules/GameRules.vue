<template>
  <div class="game-rules-wrapper">
    <div class="game-rules-content d-flex flex-column align-center">
      <h1 class="section-title d-flex align-center mb-3 mb-sm-4">{{ $t('home.gameRules.sectionTitle') }}</h1>
      <h2 class="section-description">{{ $t('home.gameRules.sectionDescription') }}</h2>

      <!--步驟圖 -->
      <div class="steps-wrapper d-none d-md-flex justify-space-between align-center">

        <!-- 步驟1 -->
        <div class="step">
          <div class="step-img-box d-flex justify-center align-center">
            <v-img width="70%" height="70%" contain src="/static/ui/home/gameRules/step_img_1.png"></v-img>
          </div>
          <div class="step-text-wrapper text-center">
            <p class="step-title mb-0 mb-sm-2">{{ $t('home.gameRules.step1.title') }}</p>
            <p class="step-description mb-0">{{ $t('home.gameRules.step1.description') }}</p>
          </div>
        </div>

        <v-img contain src="/static/ui/home/gameRules/arrow_up.svg" class="step-arrow"></v-img>

        <!-- 步驟2 -->
        <div class="step">
          <div class="step-img-box d-flex justify-center align-center">
            <v-img width="60%" height="60%" contain src="/static/ui/home/gameRules/step_img_2.png"></v-img>
          </div>
          <div class="step-text-wrapper text-center">
            <p class="step-title mb-0 mb-sm-2">{{ $t('home.gameRules.step2.title') }}</p>
            <p class="step-description mb-0">{{ $t('home.gameRules.step2.description') }}</p>
          </div>
        </div>

        <v-img contain src="/static/ui/home/gameRules/arrow_up.svg" class="step-arrow" style="transform: scaleY(-1);"></v-img>

        <!-- 步驟3 -->
        <div class="step">
          <div class="step-img-box d-flex justify-center align-center">
            <v-img width="60%" height="60%" contain src="/static/ui/home/gameRules/step_img_3.png"></v-img>
          </div>
          <div class="step-text-wrapper text-center">
            <p class="step-title mb-0 mb-sm-2">{{ $t('home.gameRules.step3.title') }}</p>
            <p class="step-description mb-0">{{ $t('home.gameRules.step3.description') }}</p>
          </div>
        </div>

        <v-img contain src="/static/ui/home/gameRules/arrow_up.svg" class="step-arrow"></v-img>

        <!-- 步驟4 -->
        <div class="step">
          <div class="step-img-box d-flex justify-center align-center">
            <v-img width="70%" height="70%" contain src="/static/ui/home/gameRules/step_img_4.png"></v-img>
          </div>
          <div class="step-text-wrapper text-center">
            <p class="step-title mb-0 mb-sm-2">{{ $t('home.gameRules.step4.title') }}</p>
            <p class="step-description mb-0">{{ $t('home.gameRules.step4.description') }}</p>
          </div>
        </div>

      </div>

      <!-- 手機版步驟圖 -->
      <StepsMobile />

      <!-- 鏈結錢包 -->
      <v-btn v-show="!user" @click="linkWalletOnclick" class="connect-btn rounded-pill">{{ $t('home.gameRules.connectYourWallet') }}</v-btn>
    </div>

    <!-- 雲朵們 -->
    <v-img width="8%" height="auto" contain src="/static/ui/home/gameRules/cloud_4.png" class="cloud cloud4"></v-img>
    <v-img width="8%" height="auto" contain src="/static/ui/home/gameRules/cloud_5.png" class="cloud cloud5"></v-img>
    <v-img width="15%" height="auto" contain src="/static/ui/home/gameRules/cloud_6.png" class=" cloud cloud6"></v-img>

    <!-- 鏈結錢包彈窗 -->
    <WalletDialog :show="isWalletDialogShow" @close="isWalletDialogShow = false" />

  </div>
</template>

<script>
import StepsMobile from './components/StepsMobile.vue'
import WalletDialog from './components/WalletDialog.vue'

import {mapGetters} from 'vuex'

export default {
  name: 'GameRules',
  components: {
    StepsMobile,
    WalletDialog
  },
  computed:{
    ...mapGetters(["user"]),
  },
  data() {
    return {
      isWalletDialogShow: false,
    }
  },
  methods: {
    linkWalletOnclick() {
      this.isWalletDialogShow = true
    }
  }
}
</script>

<style lang="scss" scoped>
@import './../../../../assets/css/utils/variables.scss';

.game-rules-wrapper {
  position: relative;
  padding: 0px 216px;

  // 內容外框
  .game-rules-content {
    position: relative;
    z-index: 2;
    padding-top: 152px;
    padding-bottom: 104px;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;

    // 標題
    .section-title {
      position: relative;
      font-size: 48px;
      font-weight: 600;

      // 聖誕樹
      &::before,
      &::after {
        content: '';
        position: absolute;
        width: 52px;
        height: 52px;
        background-image: url('/static/ui/home/gameRules/title_img.png');
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
      }

      &::before {
        left: -72px;
      }
      &::after {
        right: -72px;
      }
    }

    // 大標題下的小字
    .section-description {
      color: rgba($color: #ffffff, $alpha: .6);
      margin-bottom: 90px;
    }

    // 步驟圖
    .steps-wrapper {
      width: 100%;
      position: relative;
      margin-bottom: 240px;

      .step {
        position: relative;

        .step-img-box {
          width: 148px;
          height: 148px;
          background: #00322e;
          border-radius: 28px;
        }

        .step-text-wrapper {
          position: absolute;
          width: 240px;
          left: 50%;
          top: 120%;
          transform: translate(-50%, 0%);

          .step-title {
            font-size: 24px;
            font-weight: 600;
          }
        }
      }

      // 步驟箭頭
      .step-arrow {
        padding: 0px 10px;
        flex: 1 1 auto;
        max-width: 104px;
        height: auto;
      }
    }
  }

  // 鏈結按鈕
  .connect-btn {
    width: 271px;
    height: 62px !important;
    background: linear-gradient(142.1deg, #007254 -41.15%, #16C9A2 94.16%);

    /deep/ .v-btn__content {
      font-size: 24px;
      font-weight: 600;
    }
  }

  // 雲朵
  .cloud {
    z-index: 0;
    position: absolute;

    &.cloud4 {
      top: 15%;
      left: 20%;
    }
    &.cloud5 {
      top: 25%;
      right: 0%;
    }
    &.cloud6 {
      bottom: 4%;
      left: 0%;
    }
  }
}

@media screen and (max-width: 1264px) {
  .game-rules-wrapper {
    padding: 0px 160px;

    .game-rules-content {
      padding-top: 120px;
      padding-bottom: 96px;
      .section-title {
        font-size: 40px;

        &::before,
        &::after {
          width: 60px;
          height: 60px;
        }

        &::before {
          left: -60px;
        }
        &::after {
          right: -60px;
        }
      }
      .section-description {
        font-size: 16px;
        margin-bottom: 80px;
      }

      .steps-wrapper {
        margin-bottom: 200px;

        .step {
          .step-img-box {
            width: 100px;
            height: 100px;
            border-radius: 10px;
          }

          .step-text-wrapper {
            top: 120%;
            width: 160px;

            .step-title {
              font-size: 20px;
              margin-bottom: 0px;
            }
            .step-description {
              font-size: 14px;
            }
          }
        }
      }

      .connect-btn {
        width: 260px;
        height: 62px !important;

        /deep/ .v-btn__content {
          font-size: 24px;
        }
      }
    }
  }
}

@media screen and (max-width: 960px) {
  .game-rules-wrapper {
    padding: 0px 120px;

    .game-rules-content {
      padding-top: 40px;
      padding-bottom: 48px;
      .section-title {
        font-size: 24px;

        &::before,
        &::after {
          width: 36px;
          height: 36px;
        }

        &::before {
          left: -36px;
        }
        &::after {
          right: -36px;
        }
      }
      .section-description {
        font-size: 14px;
        margin-bottom: 52px;
      }

      .connect-btn {
        width: 160px;
        height: 40px;

        /deep/ .v-btn__content {
          font-size: 16px;
        }
      }
    }
  }
}

@media screen and (max-width: 600px) {
  .game-rules-wrapper {
    padding: 0px 10px;

    .game-rules-content {
      padding-top: 30px;
      padding-bottom: 36px;
      .section-title {
        font-size: 18px;

        &::before,
        &::after {
          width: 24px;
          height: 24px;
        }

        &::before {
          left: -24px;
        }
        &::after {
          right: -24px;
        }
      }
      .section-description {
        font-size: 12px;
        margin-bottom: 42px;
      }

      .connect-btn {
        width: 136px;
        height: 32px;

        /deep/ .v-btn__content {
          font-size: 12px;
        }
      }
    }
  }
}

</style>
