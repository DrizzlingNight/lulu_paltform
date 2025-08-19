<template>
  <div id="mystery-card" :class="$i18n.locale">
    <div :class="['level-box', `level-box__${level.toLowerCase()}`]">
      <div class="level-inner-box">
        <v-img
          contain
          :src="`/static/ui/components/card/${level.toLowerCase()}.png`"
          class="level-icon"
        />
      </div>
    </div>
    <v-card :class="['card-frame', `card-frame__${level.toLowerCase()}`]">
      <v-card class="card-frame__middle">
        <v-card class="card-frame__inner">
          <v-card-title :class="showIdPath.includes($route.path) ? 'land' : ''">
            <div v-if="showIdPath.includes($route.path)">ID:{{ id }}</div>
          </v-card-title>
          <v-card-text class="d-flex justify-center mb-4">
            <v-img
              contain
              :src="`/static/ui/components/card/${type}-${level.toLowerCase()}.png`"
              class="card-image"
            />
          </v-card-text>
        </v-card>
        <v-card-text class="card-info pa-2">
          <div class="card-info-1 mb-2 d-flex justify-space-between">
            <v-card
              style="width: 32%"
              class="d-flex flex-column justify-center py-2"
            >
              <div class="title font">{{ $t("blindBox.harvest") }}</div>
              <card-ratings
                v-if="cardInfo && cardInfo.multiple"
                class="rating"
                :rating="cardInfo.multiple[0]"
              />
            </v-card>
            <v-card
              style="width: 32%"
              class="d-flex flex-column justify-center align-center py-2"
            >
              <div class="title font">{{ $t("blindBox.simple") }}</div>
              <card-ratings
                v-if="cardInfo && cardInfo.multiple"
                class="rating"
                :rating="cardInfo.multiple[1]"
              />
            </v-card>
            <v-card
              style="width: 32%"
              class="d-flex flex-column justify-center py-2"
            >
              <div class="title font">{{ $t("blindBox.famine") }}</div>
              <card-ratings
                v-if="cardInfo && cardInfo.multiple"
                class="rating"
                :rating="cardInfo.multiple[2]"
              />
            </v-card>
          </div>
          <v-card class="card-info-2 px-1 py-1">
            <div class="d-flex my-auto" style="height: 34px">
              <div style="width: 50%" class="my-auto d-flex justify-center">
                <div class="d-flex align-center ">
                  <div>
                    <v-img
                      contain
                      src="/static/ui/components/card/power.png"
                      class="info-image mr-2"
                    />
                  </div>
                  <div class="tips">
                    <span class="tip-title font"
                      >{{ $t("blindBox.power") }}：</span
                    >
                    <span
                      v-if="cardInfo && cardInfo.calc"
                      class="tip-text font"
                      >{{ cardInfo.calc[0] }}</span
                    >
                  </div>
                </div>
              </div>
              <div style="width: 50%" class="my-auto d-flex justify-center">
                <div class="d-flex align-center">
                  <div>
                    <v-img
                      contain
                      src="/static/ui/components/card/terrain.png"
                      class="info-image mr-2"
                    />
                  </div>
                  <div class="tips">
                    <span class="tip-title font">
                      {{ $t("blindBox.terrain") }}：
                    </span>
                    <span class="tip-text font">{{
                      $t(`blindBox.${type}`)
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="d-flex" style="height: 34px">
              <div class="d-flex flex-grow-1 my-auto">
                <div style="width: 50%" class="my-auto d-flex justify-center">
                  <div class="d-flex align-center">
                    <div>
                      <v-img
                        contain
                        src="/static/ui/components/card/supply.png"
                        class="info-image mr-2"
                      />
                    </div>
                    <div class="tips">
                      <span class="tip-title font"
                        >{{ $t("blindBox.supply") }}：</span
                      >
                      <span
                        v-if="cardInfo && cardInfo.calc"
                        class="tip-text font"
                        >{{ cardInfo.calc[1] }}</span
                      >
                    </div>
                  </div>
                </div>
                <div
                  :class="['rate', 'my-auto', { inactive: !isMint }]"
                  style="width: 50%"
                  class="d-flex justify-center"
                >
                  <div class="d-flex align-center">
                    <div>
                      <v-img
                        contain
                        src="/static/ui/components/card/rate.png"
                        class="info-image mr-2"
                      />
                    </div>
                    <div class="tips">
                      <span class="tip-title font"
                        >{{ $t("blindBox.rate") }}：</span
                      >
                      <span
                        v-if="cardInfo && cardInfo.calc"
                        class="tip-text font"
                      >
                        {{ cardInfo.calc[2] }}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </v-card>
        </v-card-text>
      </v-card>
    </v-card>
  </div>
</template>

<script>
import CardRatings from "./components/cardRatings/CardRatings.vue";
import { mapGetters } from "vuex";

export default {
  props: {
    id: {
      type: String,
      default: "------",
    },
    level: {
      type: String,
      default: "sss",
    },
    type: {
      type: String,
      default: "forest",
    },
    hiddenID: {
      type: Boolean,
      default: true,
    },
    isMint: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    CardRatings,
  },
  data() {
    return {
      showIdPath: ['/my/land', '/my/landWithdraw'],
      multiple: {
        desert: {
          sss: ["9", "6", "2"],
          ss: ["9", "6", "2"],
          s: ["9", "6", "2"],
          a: ["9", "6", "2"],
          b: ["9", "6", "2"],
        },
        plain: {
          sss: ["9", "6", "2"],
          ss: ["9", "6", "2"],
          s: ["9", "6", "2"],
          a: ["9", "6", "2"],
          b: ["9", "6", "2"],
        },
        forest: {
          sss: ["9", "6", "2"],
          ss: ["9", "6", "2"],
          s: ["9", "6", "2"],
          a: ["9", "6", "2"],
          b: ["9", "6", "2"],
        },
        mountain: {
          sss: ["9", "6", "2"],
          ss: ["9", "6", "2"],
          s: ["9", "6", "2"],
          a: ["9", "6", "2"],
          b: ["9", "6", "2"],
        },
        island: {
          sss: ["9", "6", "2"],
          ss: ["9", "6", "2"],
          s: ["9", "6", "2"],
          a: ["9", "6", "2"],
          b: ["9", "6", "2"],
        },
        riverbank: {
          sss: ["9", "6", "2"],
          ss: ["9", "6", "2"],
          s: ["9", "6", "2"],
          a: ["9", "6", "2"],
          b: ["9", "6", "2"],
        },
      },
      calc: {
        desert: {
          sss: [1000, 3, 3],
          ss: [700, 7, 7],
          s: [500, 10, 10],
          a: [200, 30, 30],
          b: [100, 50, 50],
        },
        plain: {
          sss: [1000, 3, 3],
          ss: [700, 7, 7],
          s: [500, 10, 10],
          a: [200, 30, 30],
          b: [100, 50, 50],
        },
        mountain: {
          sss: [1000, 3, 3],
          ss: [700, 7, 7],
          s: [500, 10, 10],
          a: [200, 30, 30],
          b: [100, 50, 50],
        },
        island: {
          sss: [1000, 3, 3],
          ss: [700, 7, 7],
          s: [500, 10, 10],
          a: [200, 30, 30],
          b: [100, 50, 50],
        },
        riverbank: {
          sss: [1000, 3, 3],
          ss: [700, 7, 7],
          s: [500, 10, 10],
          a: [200, 30, 30],
          b: [100, 50, 50],
        },
        forest: {
          sss: [1000, 3, 3],
          ss: [700, 7, 7],
          s: [500, 10, 10],
          a: [200, 30, 30],
          b: [100, 50, 50],
        },
      },
    };
  },
  computed: {
    ...mapGetters(["boxNftPool"]),
    cardInfo() {
      if (this.boxNftPool.length > 0) {
        let card_info = {};

        this.boxNftPool.forEach((element) => {
          // console.log("element:", element);
          const info = element.info;
          const type = info.name.toLowerCase();
          if (
            type === this.level.toLowerCase()
          ) {
            // const info2 = info.harvest;
            // console.log("info", info);

            card_info = {
              calc: [info.hashrate, info.total, info.probability],
              multiple: [
                String(info.bumper_harvest_star),
                String(info.harvest_star),
                String(info.poor_harvest_star),
              ],
            };
          }
        });

        return { ...card_info };
      } else {
        return {
          calc: this.calc[this.type][this.level.toLowerCase()],
          multiple: this.multiple[this.type][this.level.toLowerCase()],
        };
      }
    },
  },
};
</script>

<style lang="scss" scoped>
#mystery-card {
  width: 370px;
  height: 566px;
  position: relative;
  padding: 0 8px 0 8px;
}

.font {
  font-style: normal;
  font-weight: normal;
  font-weight: 600;
  font-size: 16px;
  letter-spacing: -0.338823px;
}

.rate.inactive {
  display: none;
}

.level-box {
  position: absolute;
  width: 88px;
  height: 88px;
  top: -10px;
  left: -10px;

  /* 投影 */
  box-shadow: 0px 5px 8px 1px rgba(0, 20, 15, 0.5);
  border-radius: 180px;
  border: 4px solid transparent;
  z-index: 4;

  .level-inner-box {
    width: 80px;
    height: 80px;

    background: #071816;
    border-radius: 180px;
    padding-top: 5px;
  }

  .level-icon {
    width: 88px;
    height: 66px;
  }
}

/deep/ .card-frame.v-card {
  background: linear-gradient(
        rgba(255, 255, 255, 0.3),
        rgba(255, 255, 255, 0.3)
      )
      padding-box,
    linear-gradient(to right, #e53368, #a92545) border-box;
  box-shadow: 0px 5px 8px 1px rgba(0, 20, 15, 0.5);
  border-radius: 8px;
  border: 4px solid transparent;
}

/deep/ .card-frame__middle.v-card {
  border: 4px solid rgba(0, 20, 15, 0.5);
  background: rgba(0, 20, 15, 0.5);
  border-radius: 8px !important;
}

/deep/ .card-frame__inner.v-card {
  border: 1px solid rgba(0, 20, 15, 0.5);
  background: #071816;
  border-radius: 8px 8px 0 0 !important;

  .v-card__title {
    height: 47.5px;
    //line-height: 47.5px;
    display: flex;
    justify-content: center;
    align-content: center;
    // border-bottom: 2px solid #2d4742;
    div {
      height: 34px;
      line-height: 34px;
      color: white;
      font-size: 24px;
    }
  }

  .land {
    height: 47.5px;
    border-bottom: 1px solid #2d4742;
  }

  .v-card__text {
    height: 308.5px;
    padding: 10.5px 27px;
  }
}

.card-info-1 {
  height: 77px;

  .title {
    text-align: center;
    padding-bottom: 7px;
  }

  .font {
    font-size: 16px !important;
    line-height: 22px !important;
    color: #ffffff;
  }

  .rating {
    margin: 0 auto;
  }
}

.card-info-2 {
  height: 89px;
}

/deep/ .card-info.v-card__text {
  background: #b8595f;

  .v-card {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 8px !important;
  }
}

.multiple-icon,
.info-image {
  width: 32px;
  height: 32px;
}

.multiple-frame {
  font-size: 14px;

  .title.font {
    color: #ffffff;
    font-size: 16px !important;
    opacity: 0.5;
  }

  .text.font {
    padding-top: 6px;
    color: #ffffff;
    font-size: 15px !important;
  }
}

.tips {
  .tip-title.font {
    color: #ffffff;
    opacity: 0.5;
    font-size: 15px !important;
  }

  .tip-text.font {
    color: #ffffff;
    font-size: 15px !important;
  }
}

.level-box__sss,
/deep/ .card-frame__sss.v-card {
  background: linear-gradient(
        rgba(255, 255, 255, 0.3),
        rgba(255, 255, 255, 0.3)
      )
      padding-box,
    linear-gradient(to right, #e53368, #a92545) border-box;
}

.level-box__ss,
/deep/ .card-frame__ss.v-card {
  background: linear-gradient(
        rgba(255, 255, 255, 0.3),
        rgba(255, 255, 255, 0.3)
      )
      padding-box,
    linear-gradient(to right, #ffb030, #ff8000) border-box;
}

.level-box__s,
/deep/ .card-frame__s.v-card {
  background: linear-gradient(
        rgba(255, 255, 255, 0.3),
        rgba(255, 255, 255, 0.3)
      )
      padding-box,
    linear-gradient(to right, #cc33e5, #6725a9) border-box;
}

.level-box__a,
/deep/ .card-frame__a.v-card {
  background: linear-gradient(
        rgba(255, 255, 255, 0.3),
        rgba(255, 255, 255, 0.3)
      )
      padding-box,
    linear-gradient(to right, #33bbe5, #1945b6) border-box;
}

.level-box__b,
/deep/ .card-frame__b.v-card {
  background: linear-gradient(
        rgba(255, 255, 255, 0.3),
        rgba(255, 255, 255, 0.3)
      )
      padding-box,
    linear-gradient(to right, #10f58d, #007254) border-box;
}

.card-frame__sss /deep/ .card-info.v-card__text {
  background: #b8595f;

  .v-card {
    border: none;
  }
}

.card-frame__ss /deep/ .card-info.v-card__text {
  background: #bc8655;

  .v-card {
    border: none;
  }
}

.card-frame__s /deep/ .card-info.v-card__text {
  background: #a472bb;

  .v-card {
    border: none;
  }
}

.card-frame__a /deep/ .card-info.v-card__text {
  background: #5a8b9f;

  .v-card {
    border: none;
  }
}

.card-frame__b /deep/ .card-info.v-card__text {
  background: #4d8c66;

  .v-card {
    border: none;
  }
}

.en-EN .card-info-2 .mt-2 {
  margin-top: 1px !important;
}

.en-EN .card-info-2 .mr-2 {
  margin-right: 5px !important;
}

.en-EN .card-info-2.py-2 {
  padding-top: 1px !important;
  padding-bottom: 1px !important;
}

// @media screen and (max-width: 1264px) {
#mystery-card {
  width: 270px;
  height: 414px !important;
}

// @media screen and (max-width: 960px) {
//   #mystery-card {
//     width: 90% !important;
//     height: 414px !important;
//   }
// }

.level-box {
  width: 70px;
  height: 70px;

  .level-inner-box {
    width: 62px;
    height: 62px;
  }

  .level-icon {
    width: 65px;
    height: 43px;
    margin-top: 5px;
  }
}

.card-image {
  width: 190px;
  max-width: 190px;
  max-height: 200px;
}

/deep/ .card-frame__inner.v-card .v-card__text {
  padding: 0 25px !important;
  height: 200px !important;
}
/deep/ .card-frame__inner.v-card {
  .v-card__title {
    height: 38px;
    div {
      height: 25px;
      line-height: 25px;
      color: white;
      font-size: 18px;
    }
  }
}
.multiple-icon,
.info-image {
  width: 24px;
  height: 24px;
}

.font {
  font-size: 12px !important;
}

.multiple-frame {
  font-size: 14px;

  .title.font,
  .text.font {
    font-size: 12px !important;
  }
}

.tips {
  line-height: 12px;

  .tip-title.font {
    color: #ffffff;
    opacity: 0.5;
    font-size: 12px !important;
  }

  .tip-text.font {
    color: #ffffff;
    font-size: 12px !important;
  }
}

.card-info-1 {
  height: 100%;
  max-height: 58px;

  .font {
    font-size: 12px !important;
    line-height: 12px !important;
  }
}

.card-info-2 {
  height: 72px;
}

.mr-2 {
  margin-right: 3px !important;
}
// }
</style>
