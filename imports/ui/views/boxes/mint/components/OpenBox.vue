<template>
  <div id="openbox-frame">
    <!--    <user-login class="mr-5" :show="loginShow" @close="loginShow = false" />-->
    <div class="openbox-frame__box d-flex pa-17">
      <div class="d-flex left flex-grow-1" style="width: 50%">
        <div class="waiting-frame">
          <div class="waiting-frame__inner">
            <open-image
              type="waiting"
              :class="{ boxStatus: imgType == 'open' }"
            />
            <open-image
              type="open"
              :switch="imgType == 'open'"
              :class="{ boxStatus: imgType == 'waiting' }"
            />
          </div>
        </div>
        <div
          v-if="active"
          class="tip-box2 d-flex justify-center"
          style="width: 100%"
          :class="[{ active }]"
        >
          <div class="d-flex align-center">
            <div class="font">{{ $t("blindBox.action_award") }}</div>
            <div>
              <v-img
                width="80"
                height="60"
                contain
                :src="`/static/ui/components/card/${highestGrade}.png`"
                class="level-icon"
              />
            </div>
            <div class="font">{{ $t("blindBox.rare_level") }}</div>
          </div>
        </div>
      </div>
      <div class="right" style="width: 50%">
        <div class="d-flex flex-grow-1">
          <div class="total-box d-flex flex-grow-1">
            <div class="title font d-flex flex-grow-1">
              {{ $t("blindBox.limit_time_card") }}
            </div>
            <div class="total font">{{ total }}</div>
          </div>
        </div>
        <div
          class="title-box d-flex flex-grow-1 align-center mt-12"
          style="width: 100%"
        >
          <div class="title-icon d-flex">
            <v-img
              width="21"
              height="28"
              contain
              src="/static/ui/mystery_boxes/countdown.png"
              class="icon"
            />
          </div>
          <div v-if="!active" class="title-content font">
            {{ $t("blindBox.countdown") }}
          </div>
          <div
            v-else
            class="title-content font d-flex flex-wrap"
            style="width: 100%"
          >
            <span class="pr-1">{{
              $t("blindBox.activity_remaining_supply")
            }}</span>
            <span>({{ remaining }}/{{ total }})</span>
          </div>
        </div>
        <div
          v-if="!active"
          class="datetime-box d-flex justify-space-between mt-6"
        >
          <div class="day font">{{ timer.day || 0 }}</div>
          <div class="time-box d-flex justify-space-between">
            <div class="font time">{{ timer.hour || 0 | fillZero }}</div>
            <div class="time font" style="margin: 0 20px">
              {{ timer.min || 0 | fillZero }}
            </div>
            <div class="time font">{{ timer.sec || 0 | fillZero }}</div>
          </div>
        </div>
        <div
          v-else
          class="quantity-box d-flex justify-space-between mt-6 mb-16"
          style="width: 100%"
        >
          <div
            :class="[
              'quantity-item-box',
              { inactive: remaining < 10 ** (5 - index) },
            ]"
            v-for="index in 5"
            :key="index"
          >
            <span>{{ quantityStr[index - 1] }}</span>
          </div>
        </div>
        <div
          v-if="!active"
          class="btn-box d-flex flex-grow-1 mt-21 mb-13"
          style="width: 100%"
        >
          <div
            class="btn-box__inner d-flex flex-grow-1 align-center justify-center"
            @click="share"
          >
            <div class="pr-3">
              <v-img
                width="62"
                contain
                src="/static/ui/mystery_boxes/icon_money.png"
                class="icon"
              />
            </div>
            <div class="font btn-tip">{{ $t("blindBox.award") }}</div>
          </div>
        </div>
        <div v-else class="open-ben-box" style="width: 100%">
          <div class="d-flex flex-grow-1">
            <v-btn
              :class="['one d-flex flex-grow-1', { isLoading: isLoading[0] }]"
              :disabled="remaining < 1 || isLoading[0] || !isLogin"
              :loading="isLoading[0]"
              @click="make(0, 1)"
            >
              {{ $t("blindBox.make") }} ( {{ openFee }} {{ token }} )
            </v-btn>
          </div>
          <div class="d-flex flex-grow-1 mt-6">
            <v-btn
              :class="['ten d-flex flex-grow-1', { isLoading: isLoading[1] }]"
              :disabled="remaining < 10 || isLoading[1] || !isLogin"
              :loading="isLoading[1]"
              @click="make(1, 10)"
            >
              {{ $t("blindBox.make10") }} ( {{ openFee * 10 }} {{ token }} )
            </v-btn>
          </div>
        </div>
        <div
          v-if="!active"
          class="tip-box d-flex flex-grow-1 justify-center align-center"
        >
          <div class="font">{{ $t("blindBox.action_award") }}</div>
          <div>
            <v-img
              width="28"
              height="28"
              contain
              :src="`/static/ui/components/card/${highestGrade}.png`"
              class="level-icon"
            />
          </div>
          <div class="font">{{ $t("blindBox.rare_level") }}</div>
        </div>
        <div
          v-else
          class="open-tip-box d-flex justify-center align-center mt-8"
          @click="share"
        >
          <div class="mr-2">
            <v-img
              contain
              src="/static/ui/mystery_boxes/icon_money.png"
              class="icon"
            />
          </div>
          <div class="font btn-tip">{{ $t("blindBox.award") }}</div>
        </div>
      </div>
    </div>

    <open-success
      :datas="openDatas"
      :show="openShow"
      @closed="openShow = false"
    />

    <v-dialog v-model="errShow" width="468" height="322">
      <v-card height="322">
        <v-card-title class="err-card-bg" style="display: flex">
          <div style="width: 380px">{{ $t("errorCode.20006") }}</div>
          <v-img
            width="18"
            height="18"
            contain
            src="/static/ui/components/close.svg"
            class="icon-close"
            @click="errShow = false"
          />
        </v-card-title>

        <v-card-text>
          <div class="content-frame">
            <div class="content-box">{{ $t("blindBox.recharge_content") }}</div>
          </div>
          <v-btn
            :class="['recharge']"
            :loading="isLoading[0]"
            @click="recharge"
          >
            {{ $t("blindBox.deposit") }}
          </v-btn>
        </v-card-text>

        <v-divider></v-divider>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import OpenImage from "./OpenImage.vue";
// import UserLogin from "../../../layouts/topbar/login/loginDialog.vue";
import OpenSuccess from "./OpenSuccess.vue";
import MessageBox from "/imports/ui/components/messageBox/MessageBox.vue";
import { mapGetters } from "vuex";

export default {
  components: {
    // UserLogin,
    OpenSuccess,
    MessageBox,
    OpenImage,
  },
  filters: {
    fillZero(value) {
      const num = Number(value);
      return num > 9 ? `${num}` : `0${num}`;
    },
  },
  data() {
    return {
      openShow: false,
      loginShow: false,
      errShow: false,
      show: false,
      resType: "",
      msg: "",
      isLoading: [false, false],
      active: false,
      total: 10000,
      quantity: 7000,
      remaining: 300,
      octimer: null,
      startTime: new Date("2021-11-30 20:00:00").getTime(),
      timestamp: 1640315615000,
      timer: {},
      isLogin: false,
      bbid: "",
      openFee: 0,
      token: '',
      imgType: "waiting",
      num: 1,
      counts: {
        waiting: 31,
        open: 20,
      },
      openDatas: [],
      ocTimer: null,
    };
  },
  computed: {
    ...mapGetters(["user", "tokens", "boxInfo", "boxNftPool"]),
    quantityStr() {
      const quantity = "0000" + this.remaining.toString();
      return quantity.slice(-5, quantity.length);
    },

    // 此活動有哪些土地種類
    highestGrade() {
      const grades = []
      const currentBoxNftPools = this.boxNftPool.filter(pool => pool.bboxId == this.bbid)
      currentBoxNftPools.forEach(pool => {
        // tabs沒有該種類就塞進去
        const poolGrade = pool.info.grade
        if (poolGrade && !grades.includes(poolGrade.toLowerCase())) {
          grades.push(poolGrade.toLowerCase())
        }
      })
      // early return 最高階級
      if (grades.includes('sss')) return 'sss'
      if (grades.includes('ss')) return 'ss'
      if (grades.includes('s')) return 's'
      if (grades.includes('a')) return 'a'
      if (grades.includes('b')) return 'b'
    },
  },
  watch: {
    show: {
      immediate: true,
      handler(newVal, oldVal) {
        if (!newVal && newVal !== oldVal && this.resType === "success") {
          this.resType = "";
          this.openShow = true;
        }
      },
    },
    openShow: {
      immediate: true,
      handler(val) {
        const foo = document.childNodes[1];
        if (val) {
          foo.style.overflow = "hidden";
        } else {
          foo.style.overflow = "hidden scroll";
        }
      },
    },
    user: {
      immediate: true,
      deep: true,
      handler(newVal, oldVal) {
        // console.log("user:", newVal)
        if (newVal && newVal !== oldVal) {
          // console.log(newVal)
          this.isLogin = true;
        } else {
          this.isLogin = false;
          // this.isLogin = true;
        }
      },
    },
    boxInfo: {
      immediate: true,
      deep: true,
      handler(newVal, oldVal) {
        if (newVal && newVal !== oldVal && newVal.length > 0) {
          const boxId = this.$route.params.id;
          const info = newVal.find((element) => element._id == boxId);
          // console.log("boxInfo:", info);

          this.bbid = info._id;
          this.startTime = info.startTime.getTime();
          // console.log(this.startTime);
          // this.active = info.active;
          this.openFee = info.openFee;
          this.active = this.startTime <= new Date().valueOf();
          this.token = info.token
          // this.active = false;
          // console.log(newVal)

          if (!this.active) {
            this.timer = this.getDt();
            this.countDown();
          }
        }
      },
    },
    boxNftPool: {
      immediate: true,
      deep: true,
      handler(newVal, oldVal) {
        if (newVal && newVal !== oldVal && newVal.length > 0) {
          // console.log("boxNftPool", newVal);
          let sumTotal = 0;
          let sumNDefined = 0;

          newVal.forEach((element, index) => {
            if (this.bbid == element.bboxId) {
              sumTotal += element.total;
              sumNDefined += element.nDefined;
            }
          });

          this.total = sumTotal;
          this.remaining = sumNDefined;
        }
      },
    },
    openShow: {
      immediate: true,
      deep: true,
      handler(newVal, oldVal) {
        console.log("openShow:", newVal);
        if (!newVal && newVal !== oldVal) {
          this.$set(this, "imgType", "waiting");
        }
      },
    },
  },
  beforeDestroy() {
    this.octimer = this.octimer = null;
  },
  methods: {
    getDt() {
      const dt = parseInt(this.startTime.toString().slice(0, 10));
      const now = parseInt(new Date().getTime().toString().slice(0, 10));

      const time = dt - now;
      const sec = time % 60;
      const min = Math.floor(time / 60) % 60;
      const hour = Math.floor(time / 3600) % 24;
      const day = Math.floor(time / (3600 * 24));

      return { day, hour, min, sec, time };
    },
    countDown() {
      this.octimer = setInterval(() => {
        this.timer = this.getDt();
        this.active = this.startTime <= new Date().valueOf();
      }, 1500);
    },
    make(loading, num) {
      if (this.isLogin) {
        this.$set(this.isLoading, loading, true);
        const bbId = this.bbid;
        const number = String(num);
        console.log("bbId:", bbId);

        Meteor.call("openBlindBox", bbId, number, (err, res) => {
          this.$set(this.isLoading, loading, false);
          if (err) {
            if (Number(err.reason) == 20006 || err.reason == 20006) {
              this.errShow = true;
            } else {
              console.error("openBlindBox err", err);
              this.toasterErr(Number(err.reason) || err.reason);
            }
          } else {
            // console.log("bindPhone res", res);
            this.openDatas = res.map((item) => item.info.nftPool.info);
            this.$set(this, "imgType", "open");
            this.toasterSuccess(this.$t("base.success"));

            setTimeout(() => {
              this.openShow = true;
            }, 1500);
          }
        });
        // this.$set(this.isLoading, loading, false);
        // this.$set(this, "imgType", "open");
        // this.toasterSuccess(this.$t("base.success"));

        // setTimeout(() => {
        //   this.openShow = true;
        // }, 1500);
      } else {
        this.loginShow = true;
      }
    },
    share() {
      if (this.isLogin) {
        this.$router.push("/invitation");
        pass;
      } else {
        this.toasterErr("10103");
        // this.loginShow = true;
      }
    },
    recharge() {
      this.errShow = false;
      this.$store.commit("ui/SET_IS_SHOW_MONEY_DIALOG", true);
      this.$store.commit("ui/SET_IS_SHOW_RECHARGE_DIALOG", true);
      this.$store.commit("ui/SET_CODE_TYPE", "BNB");
    },
  },
};
</script>

<style lang="scss" scoped>
.font {
  text-align: left;
  font-style: normal;
  font-weight: 600;
  font-size: 24px;
  line-height: 34px;
  letter-spacing: -0.114707px;
}

.boxStatus {
  opacity: 0;
}

.pa-17 {
  padding: 64px !important;
}

.mt-21 {
  margin-top: 84px !important;
}

.btn-tip {
  font-size: 16px;
  line-height: 20px;
  letter-spacing: -0.376471px;

  /* 文字-普通 */
  color: #ffffff;
}

.btn-box {
  height: 64px;
  cursor: pointer;

  background: linear-gradient(142.1deg, #007254 -41.15%, #16c9a2 94.16%);

  /* 投影 */
  box-shadow: 0px 5px 8px rgba(0, 20, 15, 0.5);
  border-radius: 8px;
}

#openbox-frame {
  position: relative;
  width: 100%;
  text-align: center;
  margin-top: 100px;
}

.left {
  position: relative;
}

.openbox-frame__box {
  position: relative;
  width: 100%;
  height: 100%;
  border: 2px solid transparent;
  border-radius: 8px;
  background-image: url("/static/ui/mystery_boxes/open-box-bg.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.total-box {
  .title {
    color: #ffffff;
    text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.69);
  }

  .total {
    letter-spacing: -0.076471px;
    color: #f7cd0a;
    text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.25);
    font-size: 24px;
  }
}

.day,
.time {
  width: 105px;
  height: 105px;
  background: #991de0;

  text-align: center;

  /* 投影 */
  box-shadow: 0px 5px 8px 1px rgba(0, 20, 15, 0.5);
  border-radius: 8px;

  font-size: 70px;
  line-height: 98px;

  /* identical to box height */
  letter-spacing: -0.114707px;

  color: #ffffff;
}

.title-icon {
  width: 48px;
  height: 100%;
  padding: 10px 13px;

  background: #8158e1;
  border-radius: 8px 0 0 8px;
}

.title-content {
  text-align: left;
  padding: 13px 0 13px 20px;
  width: 80%;
  height: 100%;
  background-image: url("/static/ui/mystery_boxes/open-box-title-content-bg.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;

  font-size: 16px;
  line-height: 22px;
  letter-spacing: -0.0669121px;

  /* 文字-普通 */
  color: #ffffff;
}

.quantity-item-box {
  width: 100%;
  max-width: 88px !important;
  height: 88px;
  background: #991de0;
  display: flex;

  justify-content: center;
  align-items: center;

  /* 投影 */
  box-shadow: 0px 5px 8px 1px rgba(0, 20, 15, 0.5);
  border-radius: 8px;

  span {
    font-size: 70px;
    line-height: 98px;
    letter-spacing: -0.114707px;

    color: #ffffff;
  }
}

.quantity-item-box.inactive {
  background: linear-gradient(142.1deg, #727272 -41.15%, #cacaca 94.16%);
}

.open-ben-box /deep/ .v-btn {
  height: 64px;

  .v-btn__content {
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 20px;

    /* identical to box height, or 125% */
    text-align: center;
    letter-spacing: -0.376471px;

    /* 文字-普通 */
    color: #ffffff;
  }
}

.open-ben-box /deep/ .one.v-btn {
  background: linear-gradient(142.1deg, #007254 -41.15%, #16c9a2 94.16%);

  /* 投影 */
  box-shadow: 0px 5px 8px rgba(0, 20, 15, 0.5);
  border-radius: 8px;
}

.open-ben-box /deep/ .ten.v-btn {
  background: linear-gradient(268.14deg, #ffd12f 14.27%, #ff8e00 91.59%);

  /* 投影 */
  box-shadow: 0px 5px 8px rgba(0, 20, 15, 0.5);
  border-radius: 8px;
}

.open-ben-box /deep/ .v-btn--disabled.v-btn {
  background: linear-gradient(142.1deg, #727272 -41.15%, #cacaca 94.16%);
}

.open-ben-box /deep/ .one.isLoading.v-btn--disabled.v-btn {
  background: linear-gradient(142.1deg, #007254 -41.15%, #16c9a2 94.16%);
}

.open-ben-box /deep/ .ten.isLoading.v-btn--disabled.v-btn {
  background: linear-gradient(268.14deg, #ffd12f 14.27%, #ff8e00 91.59%);
}

.tip-box .font,
.tip-box2 .font {
  color: #ffffff;
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
}

.tip-box2 {
  position: absolute;
  bottom: 0;
}

.open-tip-box {
  cursor: pointer;

  .font {
    color: #f7cd0a;
    font-size: 16px;
    line-height: 20px;
  }
}

.waiting-frame {
  width: 100%;
  margin: 90px 30px;

  // border: 1px solid #f7cd0a;
  position: relative;

  .waiting-frame__inner {
    position: absolute;
    bottom: -30px;
    right: -20px;

    /deep/ .animated-image {
      bottom: 0 !important;
      right: 0 !important;
      max-width: 685px !important;
      max-height: 685px !important;
      bottom: -20px !important;
      right: 10px !important;

      min-width: 250px !important;
      min-height: 250px !important;

      width: 50vw;
      height: 50vw;
    }
  }
}

/deep/ .v-card {
  background: linear-gradient(136.3deg, #06261f 2.34%, #08322d 98.54%);
  border: 1px solid #00ffca;
  box-sizing: border-box;
  box-shadow: 0px 5px 8px 1px rgba(0, 37, 19, 0.503391);
  border-radius: 8px;

  .v-card__text {
    width: 100%;
    // height: 255px;
  }
}

.icon-close {
  cursor: pointer;
}

.err-card-bg {
  border-bottom: 1px solid #2d4742;
  font-style: normal;
  font-weight: 600;
  font-size: 24px;
  line-height: 34px;

  /* identical to box height */
  letter-spacing: -0.171429px;

  color: #ffffff;
}

.content-frame {
  padding: 20px 38px 28px 40px;

  .content-box {
    height: 120px;
    // background: rgba(0, 0, 0, 0.3);
    border-radius: 8px;
    text-align: center;
    align-items: center;
    padding-top: 50px;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 22px;
    text-align: center;
    letter-spacing: -0.114286px;

    color: #ffffff;
  }
}

.recharge {
  margin: 10px 50px 0 54px;
  width: 312px;
}

@media screen and (max-width: 1744px) {
  .quantity-item-box {
    max-width: 60px !important;
    height: 60px;

    span {
      font-size: 50px;
      line-height: 78px;
      letter-spacing: -0.114707px;

      color: #ffffff;
    }
  }
}

@media screen and (max-width: 1520px) {
  .day,
  .time {
    width: 80px;
    height: 80px;

    font-size: 55px;
    line-height: 78px;
  }

  .waiting-frame {
    width: 100%;
    margin: 100px 10px;

    // border: 1px solid #f7cd0a;
    position: relative;

    .waiting-frame__inner {
      position: absolute;
      bottom: -20px;
      right: -30px;

      /deep/ .animated-image {
        width: 45vw !important;
        height: 45vw !important;
      }
    }
  }

  .tip-box2 {
    /deep/ .v-image {
      width: 60px !important;
    }

    .font {
      font-size: 20px;
      line-height: 34px;
    }
  }
}

@media screen and (max-width: 1320px) {
  .day,
  .time {
    width: 70px;
    height: 70px;

    font-size: 45px;
    line-height: 65px;
  }

  // .waiting-frame {
  //   position: absolute;
  //   max-width: 700px;
  //   max-height: 700px;
  //   width: 80vw;
  //   height: 80vw;
  //   bottom: 0px;
  //   right: -40px;
  // }
}

@media screen and (max-width: 1264px) {
  #openbox-frame {
    margin-top: 0px !important;
  }

  .quantity-item-box {
    max-width: 50px !important;
    height: 50px;

    span {
      font-size: 40px;
      line-height: 68px;
      letter-spacing: -0.114707px;

      color: #ffffff;
    }
  }

  .waiting-frame {
    margin: 150px 20px;

    .waiting-frame__inner {
      position: absolute;
      bottom: -20px;
      right: -40px;
    }
  }

  .tip-box {
    .font {
      font-size: 20px;
      line-height: 34px;
    }
  }

  .tip-box2 {
    /deep/ .v-image {
      width: 35px !important;
    }

    .font {
      font-size: 16px;
      line-height: 34px;
    }
  }
}

@media screen and (max-width: 960px) {
  #openbox-frame {
    margin-top: 0px !important;
  }

  .pa-17 {
    padding: 30px !important;
  }

  // .waiting-frame {
  //   position: absolute;
  //   max-width: 500px;
  //   max-height: 500px;
  //   width: 80vw;
  //   height: 80vw;
  //   bottom: 40px;
  //   right: -40px;
  // }
}

@media screen and (max-width: 820px) {
  #openbox-frame {
    margin-top: 0px !important;
  }

  .quantity-item-box {
    max-width: 40px !important;
    height: 40px;

    span {
      font-size: 30px;
      line-height: 58px;
      letter-spacing: -0.114707px;

      color: #ffffff;
    }
  }

  .tip-box2 {
    /deep/ .v-image {
      width: 35px !important;
    }

    .font {
      font-size: 16px;
      line-height: 34px;
    }
  }
}

@media screen and (max-width: 715px) {
  .quantity-item-box {
    max-width: 30px !important;
    height: 30px;

    span {
      font-size: 20px;
      line-height: 48px;
      letter-spacing: -0.114707px;

      color: #ffffff;
    }
  }

  // .waiting-frame {
  //   position: absolute;
  //   max-width: 400px;
  //   max-height: 400px;
  //   width: 80vw;
  //   height: 80vw;
  //   bottom: 100px;
  //   right: -40px;
  // }
}

@media screen and (max-width: 600px) {
  #openbox-frame {
    margin-top: 0px !important;
  }

  .pa-17 {
    padding: 10px !important;
  }
}
</style>
