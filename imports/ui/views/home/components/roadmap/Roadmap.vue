<template>
  <div class="roadmap-wrapper">

    <!-- 背景圖 -->
    <v-img width="100%" height="100%" src="/static/ui/home/roadmap/bg.png" class="bg"></v-img>
    
    <!-- 內容 -->
    <div class="roadmap-content d-flex flex-column align-center">
      <h1 class="section-title">{{ $t('home.roadmap.sectionTitle') }}</h1>
      <h2 class="section-description">{{ $t('home.roadmap.sectionDescription') }}</h2>

      <!-- 步驟卡片群 -->
      <div class="step-cards-wrapper d-flex justify-space-between">
        
        <!-- 步驟1 -->
        <div class="step-card step-card-complete d-flex flex-row flex-xl-column align-center px-0">
          <div class="complete-wrapper mb-xl-4">
            <v-img src="/static/ui/home/roadmap/complete.svg" contain class="complete-img mx-8 mx-sm-11 mx-xl-0 mb-3"></v-img>
            <span class="complete-text">{{ $t('home.roadmap.completed') }}</span>
          </div>
          <v-divider style="border: 1px solid #2D4742; width: 100%;" class="d-none d-xl-block"></v-divider>
          <v-divider vertical style="border: 1px solid #2D4742;" class="d-block d-xl-none"></v-divider>
          <v-spacer class="d-none d-xl-block"></v-spacer>
          <div class="complete-description-wrapper px-4">
            <span class="description-title mb-2 mt-0 mb-sm-4 mt-sm-4">{{ $t('home.roadmap.step1.stepTitle') }}</span>
            <p class="description-content mb-0">{{ $t('home.roadmap.step1.stepContent') }}</p>
          </div>
        </div>

        <!-- 步驟2 -->
        <div class="step-card d-flex flex-column">
          <p class="step-description" :class="$i18n.locale">
            {{ $t('home.roadmap.step2.stepContent') }}
          </p>
          <v-divider style="border: 1px solid #2D4742;" class="mb-3 mb-md-12"></v-divider>
          <div class="step-chart-wrapper d-flex">
            <!-- 步驟印章圖 -->
            <div class="step-stamp d-flex justify-center align-center step2 mr-3 mr-md-6">
              2
            </div>
            <!-- 右側的部分 -->
            <div class="step-chart d-flex flex-column justify-space-between">
              <div class="chart-up d-flex align-center">
                <span class="chart-up-text mr-10" :class="$i18n.locale">{{ $t('home.roadmap.step2.stepTitle') }}</span>
                <!-- 圈圈圖 -->
                <div class="chart-up-progress d-flex">
                  <!-- 要填滿的 加上 .active -->
                  <div class="circle active"></div>
                  <div class="circle active"></div>
                  <div class="circle active"></div>
                  <div class="circle active"></div>
                  <div class="circle"></div>
                </div>
              </div>
              <span class="chart-down">{{ $t('home.roadmap.step2.date') }}</span>
            </div>
          </div>
        </div>

        <!-- 步驟3 -->
        <div class="step-card d-flex flex-column">
          <p class="step-description" :class="$i18n.locale">
            {{ $t('home.roadmap.step3.stepContent') }}
          </p>
          <v-divider style="border: 1px solid #2D4742;" class="mb-3 mb-md-12"></v-divider>
          <div class="step-chart-wrapper d-flex">
            <!-- 步驟印章圖 -->
            <div class="step-stamp d-flex justify-center align-center step3 mr-3 mr-md-6">
              3
            </div>
            <!-- 右側的部分 -->
            <div class="step-chart d-flex flex-column justify-space-between">
              <div class="chart-up d-flex align-center">
                <span class="chart-up-text mr-10" :class="$i18n.locale">{{ $t('home.roadmap.step3.stepTitle') }}</span>
                <!-- 圈圈圖 -->
                <div class="chart-up-progress d-flex">
                  <!-- 要填滿的 加上 .active -->
                  <div class="circle"></div>
                  <div class="circle"></div>
                  <div class="circle"></div>
                  <div class="circle"></div>
                  <div class="circle"></div>
                </div>
              </div>
              <span class="chart-down">{{ $t('home.roadmap.step3.date') }}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Roadmap',
  data() {
    return {
      // 每個步驟的進度
      stepProgress: {
        step1: 3,
        step2: 0,
        step3: 0
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import './../../../../assets/css/utils/variables.scss';

.roadmap-wrapper {
  position: relative;
  width: 100%;
  padding: 0px 216px;

  // 聖誕背景圖
  .bg {
    z-index: 0;
    position: absolute;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    background-image: url('/static/ui/home/roadmap/bg.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    opacity: .6;
  }

  
  .roadmap-content {
    position: relative;
    z-index: 1;
    margin: 0 auto;
    padding-top: 92px;
    padding-bottom: 140px;
    width: 100%;
    max-width: 1200px;
    
    // 標題
    .section-title {
      position: relative;
      font-size: 48px;

      // 雪花片
      &::before,
      &::after {
        content: '';
        position: absolute;
        top: 50%;
        transform: translate(0%, -50%);
        width: 54px;
        height: 54px;
        background-image: url('/static/ui/home/roadmap/title_img.png');
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

    // 大標題下小字
    .section-description {
      color: #ffffff;
      margin-bottom: 136px;
    }

    // 卡片群組
    .step-cards-wrapper {
      width: 100%;
      gap: 28px;

      .step-card {
        width: 100%;
        background: linear-gradient(136.3deg, #06261F 2.34%, #08322D 98.54%);
        opacity: .9;
        border: 2px solid #00FFCA;
        padding: 32px 32px 36px 32px;
        border-radius: 20px;

        // 已完成的步驟
        .complete-wrapper {
          display: flex;
          height: 140px;
          flex-direction: column;
          align-items: center;

          .complete-img {
            width: 96px;
            height: 96px;
          }

          .complete-text {
            font-size: 24px;
            font-weight: 600;
            color: #13AA6D;
          }
        }

        .complete-description-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;

          .description-title {
            color: #F7CD0A;
            font-size: 18px;
            font-weight: 600;
          }

          .description-content {
            text-align: center;
          }
        }

        .step-description {
          font-size: 24px;
          height: 140px;

          &.vi-VI {
            font-size: 18px;
          }

          &.en-EN {
            font-size: 20px;
          }
        }

        .step-chart-wrapper {
          width: 100%;
          
          .step-stamp {
            width: 68px;
            height: 68px;
            border-radius: 50%;
            font-size: 48px;
            text-align: center;
            font-weight: 600;
            text-shadow: 4px 4px 4px rgba(0, 0, 0, 0.25);

            &.step1 {
              background: #9B5DB1;
            }
            &.step2 {
              background: #807ED5;
            }
            &.step3 {
              background: #3A9AD5;
            }
          }

          .step-chart {
            .chart-up {
              .chart-up-text {
                font-size: 24px;
                font-weight: 600;

                &.vi-VI {
                  font-size: 16px;
                }
              }

              .chart-up-progress {
                gap: 2px;
                
                .circle {
                  position: relative;
                  width: 16px;
                  height: 16px;
                  border: 1px solid #F7CD0A;
                  border-radius: 50%;

                  &.active::after {
                    content: '';
                    position: absolute;
                    display: block;
                    width: 12px;
                    height: 12px;
                    background: #f7cd0a;
                    border-radius: 50%;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                  }
                }
              }
            }

            .chart-down {
              color: $text_price;
            }
          }
        }
      }
    }
  }
}

// 大尺寸 先改變卡片陳列方式
@media screen and (max-width: 1604px) {
  .step-cards-wrapper {
    flex-direction: column;

    .step-card {

      // 已完成的步驟
      &.step-card-complete {
        padding-top: 20px !important;
        padding-bottom: 20px !important;
      }

      .complete-wrapper {
        height: 100% !important;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .complete-img {
          width: 76px !important;
          height: 76px !important;
        }

        .complete-text {
          font-size: 20px !important;
        }
      }

      .complete-description-wrapper {
        align-items: flex-start !important;
        justify-content: center;
        padding-left: 20px;

        .description-title {
          font-size: 16px !important;
        }

        .description-content {
          text-align: start !important;
        }
      }
    }

    .step-description {
      height: auto !important;
    }

    .step-chart-wrapper {
      justify-content: flex-start !important;
    }
  }
}

@media screen and (max-width: 1264px) {
  .roadmap-wrapper {
    padding: 0px 160px;

    .step-card {
      // 已完成的步驟

      &.step-card-complete {
        padding-top: 16px !important;
        padding-bottom: 16px !important;
      }
      .complete-wrapper {
        .complete-img {
          width: 68px !important;
          height: 68px !important;
        }
      }

      .complete-description-wrapper {

        .description-title {
          font-size: 16px !important;
        }
      }
    }

    .roadmap-content {
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
    }
  }
}

@media screen and (max-width: 960px) {
  .roadmap-wrapper {
    padding: 0px 120px;

    .roadmap-content {
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

      .step-cards-wrapper {
        gap: 20px;

        .step-card {
          border-radius: 12px;
          padding: 20px 12px 20px 12px;

          .step-description {
            font-size: 16px;
            height: 64px;

            &.vi-VI {
              font-size: 16px;
            }

            &.en-EN {
              font-size: 16px;
            }
          }

          .step-chart-wrapper {
            
            .step-stamp {
              width: 36px;
              min-width: 36px;
              height: 36px;
              font-size: 24px;
            }

            .step-chart {
              .chart-up {
                .chart-up-text {
                  font-size: 18px;

                  &.vi-VI {
                    font-size: 18px;
                  }
                }

                .chart-up-progress {
                  .circle {
                    width: 14px;
                    height: 14px;

                    &.active::after {
                      width: 10px;
                      height: 10px;
                    }
                  }
                }

              }

              .chart-down {
                font-size: 12px;
              }
            }
          }
        }
      }
    }
  }
}

@media screen and (max-width: 600px) {
  .roadmap-wrapper {
    padding: 0px 10px;

    .roadmap-content {
      padding-top: 24px;
      padding-bottom: 32px;

      .section-title {
        font-size: 18px;
        margin-bottom: 10px;

        &::before,
        &::after {
          width: 20px;
          height: 20px;
        }

        &::before {
          left: -20px;
        }

        &::after {
          right: -20px;
        }
      }
  
      .section-description {
        font-size: 12px;
        margin-bottom: 32px;
      }

      .step-cards-wrapper {
        gap: 20px;

        .step-card {
          // 已完成的步驟
          &.step-card-complete {
            padding-top: 12px !important;
            padding-bottom: 12px !important;
          }
          .complete-wrapper {
            .complete-img {
              width: 60px !important;
              height: 60px !important;
            }

            .complete-text {
              font-size: 12px !important;
            }
          }

          .complete-description-wrapper {

            .description-title {
              font-size: 12px !important;
            }
          }
        }

        .step-card {
          border-radius: 12px;
          padding: 16px 8px 12px 8px;

          .step-description {
            font-size: 12px;
            height: 64px;

            &.vi-VI {
              font-size: 12px;
            }

            &.en-EN {
              font-size: 12px;
            }
          }

          .step-chart-wrapper {
            
            .step-stamp {
              width: 36px;
              min-width: 36px;
              height: 36px;
              font-size: 24px;
            }

            .step-chart {
              width: 100%;
              .chart-up {
                width: 100%;
                justify-content: space-between;
                .chart-up-text {
                  font-size: 18px;
                }

                .chart-up-progress {
                  .circle {
                    width: 14px;
                    height: 14px;

                    &.active::after {
                      width: 10px;
                      height: 10px;
                    }
                  }
                }

              }

              .chart-down {
                font-size: 12px;
              }
            }
          }
        }
      }
    }

  }
}

</style>