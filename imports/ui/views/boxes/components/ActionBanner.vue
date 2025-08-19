<template>
  <div>
    <div
      class="action-banner"
      :style="`background: url(static/ui/mystery_boxes/banner/action/${order}/bg.png)`"
    >
      <div
        class="action-banner-frame mx-auto"
        :class="{ reverse: order % 2 == 0 }"
      >
        <!-- 活動j狀態 -->
        <action-title-box class="action-frame" :status="status" />
        <!-- 限量版 -->
        <limit-box class="limit-img__box" />

        <div
          class="action-banner-frame__innder d-flex"
          :class="{ 'flex-row-reverse': order % 2 == 0 }"
        >
          <div class="inner-frame__left">
            <div :class="`box-icon_${order}`">
              <div :class="['box-title', `${$i18n.locale}`]">
                <v-img
                  v-if="order == 1"
                  :src="`static/ui/mystery_boxes/banner/action/${order}/box-title_${$i18n.locale}.png`"
                  contain
                />
              </div>
              <v-img
                :src="`static/ui/mystery_boxes/banner/action/${order}/box-icon.png`"
                contain
              />
            </div>
          </div>
          <div class="inner-frame__right">
            <div :class="['title-box', `order${order}`]">
              <div class="round-count-frame">
                <round-count v-if="order != 1" />
              </div>
              <v-img
                :src="`static/ui/mystery_boxes/banner/action/${order}/title_${$i18n.locale}.png`"
                contain
              />
            </div>
            <div
              class="d-flex flex-grow-1"
              :class="{ 'mt-16 ': order % 2 == 0 }"
            >
              <v-btn
                width="470"
                height="60"
                class="btn-detail rounded"
                :class="{ 'ml-auto ': order % 2 == 1 }"
                @click="go"
              >
                <span>{{ $t("blindBox.details") }}</span>
              </v-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="mobile-action-banner"
      :style="`background: url(static/ui/mystery_boxes/banner/action/${order}/mobile-bg.png)`"
    >
      <div class="mobile-header-frame">
        <action-title-box class="mobile-action-frame" :status="status" />
        <limit-box class="mobile-limit-img__box" />
      </div>
      <div :class="['mobile-box-icon', `order${order}`]">
        <div :class="['mobile-box-title', `${$i18n.locale}`]">
          <v-img
            v-if="order == 1"
            :src="`static/ui/mystery_boxes/banner/action/${order}/box-title_${$i18n.locale}.png`"
            contain
          />
        </div>
        <div>
          <v-img
            :src="`static/ui/mystery_boxes/banner/action/${order}/mobile-box-icon.png`"
            contain
          />
        </div>
      </div>
      <div class="mobile-content-frame">
        <div class="mobile-title-icon mx-auto mb-10">
          <div class="mobile-round-count-frame">
            <round-count v-if="order != 1" />
          </div>
          <v-img
            :src="`static/ui/mystery_boxes/banner/action/${order}/mobile-title-icon_${$i18n.locale}.png`"
            contain
          />
        </div>
        <div class="d-flex flex-grow-1">
          <v-btn
            width="470"
            height="60"
            class="btn-detail rounded mx-auto"
            :class="{ 'ml-auto ': order % 2 == 1 }"
            @click="go"
          >
            <span>{{ $t("blindBox.details") }}</span>
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ActionTitleBox from "./components/ActionTitleBox.vue";
import LimitBox from "./components/LimitBox.vue";
import RoundCount from "./components/RoundCount.vue";
import { mapGetters } from "vuex";

export default {
  props: {
    order: {
      type: Number,
      default: 2,
    },
  },
  components: {
    ActionTitleBox,
    LimitBox,
    RoundCount,
  },
  data() {
    return {
      status: "1",
    };
  },
  computed: {
    ...mapGetters(["boxNftPool"]),
  },
  watch: {
    boxNftPool: {
      immediate: true,
      deep: true,
      handler(newVal, oldVal) {
        if (newVal && newVal !== oldVal && newVal.length > 0) {
          let sumNDefined = 0;

          newVal.forEach((element, index) => {
            if (this.order == element.bboxId) {
              sumNDefined += element.nDefined;
            }
          });

          if (sumNDefined > 0) {
            this.status = "1";
          } else {
            this.status = "2";
          }
        }
      },
    },
  },
  methods: {
    go() {
      // this.$toast.warning(this.$t(`comingSoon`));
      this.$router.push("/mystery_boxes/rare-mint/2");
    },
  },
};
</script>

<style lang="scss" scoped>
.mobile-action-banner {
  display: none;
}

.action-banner {
  width: 100vw;
  height: 800px;
  padding: 0 216px;

  background-repeat: no-repeat !important;
  background-position: center center !important;
  background-size: cover !important;
}

.action-banner-frame {
  position: relative;
  // border: 1px solid red;
  height: 621px;
  max-width: 1200px;

  top: 65px;
  bottom: 116px;
}

.round-count-frame {
  position: absolute;
  top: -70px;
  left: -35px;
}

.limit-img__box {
  position: relative;
  top: 68.8px;
  right: 0;
}

.inner-frame__left {
  position: relative;
  // border: 1px solid blue;
  width: 50%;
  height: 567px;
}

.inner-frame__right {
  // border: 1px solid greenyellow;
  width: 50%;
  height: 567px;
}

.box-icon_1 {
  position: absolute;
  width: 130% !important;
  max-width: 130% !important;
  top: 3%;
  left: -8%;
}

.box-icon_2 {
  position: absolute;
  width: 200% !important;
  max-width: 200% !important;
  top: 3%;
  right: -35%;
}

.title-box {
  position: relative;
  width: 90% !important;
  margin: 30% 0 0 auto;
}

.box-title {
  position: absolute;
  width: 60% !important;
  z-index: 100;
  bottom: 40%;
  left: 20.5%;
}

.en-EN.box-title {
  position: absolute;
  width: 60% !important;
  z-index: 100;
  bottom: 40%;
  left: 20.5%;
}

.title-box.order1 {
  margin: 23% 0 0 auto;
}

.reverse .title-box {
  margin: 30% 0 0 0;
}

.inner-frame__right .btn-detail {
  margin-left: 40px;
}

.reverse .inner-frame__right .btn-detail {
  margin-right: 10px;
}

.btn-detail {
  width: 80% !important;
  height: 60px;

  /deep/ &.rounded {
    border-radius: 8px !important;
  }

  /deep/ &.v-btn {
    background: linear-gradient(268.14deg, #ffd12f 14.27%, #ff8e00 91.59%);

    .v-btn__content {
      font-style: normal;
      font-weight: bold !important;
      font-size: 16px;
      line-height: 20px;

      /* identical to box height, or 125% */
      text-align: center;
      letter-spacing: -0.376471px;

      /* 文字-普通 */
      color: #ffffff;

      span {
        font-weight: bolder !important;
      }
    }
  }
}

.reverse .btn-detail {
  margin: 0 0 0 0;
}

@media screen and (max-width: 1264px) {
  .action-banner {
    padding: 0 160px;
    height: 60vw;
    // height: calc(100vw * 800 / 1920) !important;
  }

  .inner-frame__left {
    height: 40.53vw !important;
  }

  .inner-frame__right {
    height: 40.53vw !important;
  }

  .btn-detail {
    height: 40px !important;

    /deep/ &.v-btn {
      .v-btn__content {
        font-size: 14px !important;
        line-height: 20px;
      }
    }
  }

  .round-count-frame {
    position: absolute;
    top: -50px;
    left: -35px;
  }
}

@media screen and (max-width: 960px) {
  .action-banner {
    padding: 0 120px;
    height: 60vw;
  }

  .limit-img__box {
    position: relative;
    top: 35.8px;
    right: 0;
  }

  .round-count-frame {
    position: absolute;
    top: -35px;
    left: -25px;
  }
}

@media screen and (max-width: 600px) {
  .action-banner {
    display: none;
  }

  .mobile-action-banner {
    display: block;
    position: relative;
    padding: 16px 10px;

    width: 100vw;
    height: 137.5vw;

    background-size: cover !important;
    background-position: top !important;
    background-repeat: no-repeat !important;
  }

  .mobile-limit-img__box {
    position: absolute;
    top: 10px;
    right: 0;
  }

  .mobile-box-icon .v-image {
    position: absolute;
    width: 100vw;
    max-width: 100vw;
    top: -16px;
    right: 0;
  }

  .order1.mobile-box-icon .v-image {
    position: absolute;
    max-width: 100vw;
    top: 5%;
    right: 0;
  }

  .mobile-round-count-frame {
    position: absolute;
    top: -35px;
    left: -20px;
  }

  .mobile-box-title {
    position: absolute;
    z-index: 100;
    top: 31%;
    right: 16%;

    .v-image {
      width: 66vw !important;
    }
  }

  .mobile-content-frame {
    position: absolute;
    width: 100%;
    bottom: 25px;
  }

  .mobile-title-icon {
    position: relative;
    width: 80vw !important;
  }
}
</style>
