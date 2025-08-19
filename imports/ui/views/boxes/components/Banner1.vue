<template>
  <div id="banner1" :class="$i18n.locale">
    <!-- 活動標題 -->
    <action-title-box class="action-frame" :status="Number(status)" />
    <!-- 限量版 -->
    <limit-box class="limit-img__box" />
    <!-- 限量版 -->

    <!-- 右側 -->
    <div class="right-frame justify-end">
      <v-img
        v-if="$i18n.locale == 'zh-TW'"
        contain
        width="26.46vw"
        :aspect-ratio="127 / 56"
        src="/static/ui/mystery_boxes/oldBanner/2/title_zh-TW.png"
      />
      <v-img
        v-else
        contain
        width="26.46vw"
        :aspect-ratio="127 / 56"
        src="/static/ui/mystery_boxes/oldBanner/2/title_en-EN.png"
      />
      <!-- 查看詳情 -->
      <div class="d-flex justify-end">
        <v-btn width="470" height="60" class="btn-detail rounded" @click="go" :disabled="disabled">
          {{ $t("blindBox.details") }}
        </v-btn>
      </div>
    </div>
    <div class="down-frame">
      <!-- 查看詳情 -->
      <div class="d-flex justify-center">
        <v-btn height="60" class="btn-detail rounded" @click="go">
          {{ $t("blindBox.details") }}
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import ActionTitleBox from "./components/ActionTitleBox.vue";
import LimitBox from "./components/LimitBox.vue";
import { mapGetters } from "vuex";

export default {
  components: {
    LimitBox,
    ActionTitleBox,
  },
  props: {
    boxId: {
      type: Number,
      default: 1
    },
    status: {
      type: Number,
      default: 0
    },
    disabled: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
    }
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
          const order = 1;

          let sumNDefined = 0;

          newVal.forEach((element, index) => {
            if (order == element.bboxId) {
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
      this.$router.push("/mystery_boxes/rare-mint/1");
    },
  },
};
</script>

<style lang="scss" scoped>

@import '/imports/ui/scss/mixin';

#banner1 {
  position: relative;
  width: 100vw;
  height: calc(100vw * 800 / 1920);

  background-image: url("/static/ui/mystery_boxes/oldBanner/2/bg_zh-TW.png");
  background-repeat: no-repeat;
  background-size: 100% auto;
}

#banner1.en-EN,
#banner1.kr-KR,
#banner1.vi-VI {
  position: relative;
  width: 100vw;
  height: calc(100vw * 800 / 1920);

  background-image: url("/static/ui/mystery_boxes/oldBanner/2/bg_en-EN.png");
  background-repeat: no-repeat;
  background-size: 100% auto;
}

.font {
  font-style: normal;
  font-weight: 600;
  font-size: 24px;
  line-height: 34px;

  /* identical to box height */
  letter-spacing: -0.114707px;

  color: #ffffff;
}

.limit-img__box {
  position: absolute;
  left: 76%;
  top: 7.5%;
}

.action-frame {
  position: absolute;
  top: 8.625%;
  left: 18.75%;
}

.down-frame {
  display: none;
}

.right-frame {
  position: absolute;
  left: 57%;
  top: 25.75%;
}

.btn-detail {
  margin: 42px 0 0 17px;
  width: 24.46vw !important;
}

/deep/ .btn-detail.v-btn {
  background: linear-gradient(268.14deg, #ffd12f 14.27%, #ff8e00 91.59%);

  .v-btn__content {
    @include common-btn-title;
  }
}

/deep/ .btn-detail.rounded {
  border-radius: 8px !important;
}

@media screen and (max-width: 1264px) {
  #banner1 {
    // height: 480px;
  }

  .limit-img__box {
    // right: 160px !important;
    top: 7.5% !important;
  }

  .action-frame {
    left: 160px !important;
    top: 50px !important;
  }

  /deep/ .btn-detail.v-btn {
    // width: 158px !important;
    // height: 28px !important;

    .v-btn__content span {
      font-size: 12px !important;
      line-height: 20px !important;
    }
  }
}

@media screen and (max-width: 960px) {
  #banner1 {
    // height: 410px;
  }

  .limit-img__box {
    // right: 120px !important;
    top: 7.5% !important;

    /deep/ .v-image {
      width: 50px !important;
      height: 34.5px !important;

      .pt-2 {
        padding-top: 5px !important;
      }

      .font {
        font-size: 11px !important;
        line-height: 14px !important;
      }
    }
  }

  .action-frame {
    left: 120px !important;
    top: 30px !important;
  }

  /deep/ .btn-detail.v-btn {
    // width: 158px !important;
    height: 28px !important;
  }
}

@media screen and (max-width: 600px) {
  #banner1 {
    width: 100vw;
    height: calc(100vw * 440 / 330);
    // min-height: auto;

    background-image: url("/static/ui/mystery_boxes/oldBanner/2/mobile-bg_zh-CN.svg");
    background-repeat: no-repeat;
    background-size: 100% auto;
  }

  #banner1.en-EN,
  #banner1.kr-KR {
    height: calc(100vw * 440 / 330);
    background-image: url("/static/ui/mystery_boxes/oldBanner/2/mobile-bg_en-EN.png");

    background-repeat: no-repeat;
    background-size: 100% auto;
  }

  .down-frame {
    display: block;
  }

  .right-frame {
    display: none;
  }

  .limit-img__box {
    // right: 13px !important;
    top: 20px !important;
    right: 13px !important;
  }

  .en-EN /deep/ .v-image {
    width: 45px !important;
    height: 35.5px !important;

    .pt-2 {
      padding-top: 3px !important;
      padding-left: 10px !important;
    }

    .font {
      font-size: 8px !important;
      line-height: 10px !important;
    }
  }

  .en-EN .limit-tip {
    width: 45px;
  }

  .action-frame {
    left: 10px !important;
    top: 10px !important;
  }

  .btn-detail {
    margin: 0px;
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translate(-50%, 0%);
    // margin: 42px 0 0 17px;
  }

  .btn-detail {
    margin: 0 !important;
  }

  /deep/ .btn-detail.v-btn {
    width: 158px !important;
    height: 28px !important;
  }
}
</style>
