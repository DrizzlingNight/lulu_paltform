<template>
  <div id="banner2" :class="$i18n.locale">
    <!-- 活動標題 -->
    <action-title-box class="action-frame" :status="status" />
    <!-- 限量版 -->
    <limit-box class="limit-img__box" />
    <!-- 左側 -->
    <div class="left-frame">
      <!-- <v-img
        contain
        width="30.208vw"
        :aspect-ratio="116 / 51"
        :src="
          $i18n.locale === 'en-EN'
            ? '/static/ui/mystery_boxes/banner2-title-en.svg'
            : '/static/ui/mystery_boxes/banner2-title.svg'
        "
      /> -->
      <!-- 查看詳情 -->
      <v-btn width="470" height="60" class="btn-detail rounded" @click="go" :disabled="disabled">
        {{ $t("blindBox.details") }}
      </v-btn>
    </div>
    <!-- 右側 -->
    <!-- <v-img
      contain
      width="30.729vw"
      :aspect-ratio="1"
      src="/static/ui/mystery_boxes/banner2-image.png"
      class="right-frame"
    /> -->

    <div class="down-frame">
      <v-img
        contain
        width="30.208vw"
        :aspect-ratio="116 / 51"
        class="banner2-title"
        :src="
          $i18n.locale != 'zh-TW'
            ? '/static/ui/mystery_boxes/banner2-title-en.svg'
            : '/static/ui/mystery_boxes/banner2-title.svg'
        "
      />
      <!-- 查看詳情 -->
      <div class="d-flex justify-center">
        <v-btn width="470" height="60" class="btn-detail rounded" @click="go">
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
    ActionTitleBox,
    LimitBox,
  },
  props: {
    boxId: {
      type: Number,
      default: 2
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
    };
  },
  computed: {
    ...mapGetters(["boxNftPool"]),
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

@import '/imports/ui/scss/mixin';

#banner2 {
  position: relative;
  width: 100vw;
  height: calc(100vw * 800 / 1920);

  background-image: url("static/ui/mystery_boxes/oldBanner/3/bg_zh-TW.png");
  background-repeat: no-repeat;
  background-size: 100% auto;
}

#banner2.en-EN,
#banner2.kr-KR,
#banner2.vi-VI {
  background-image: url("static/ui/mystery_boxes/oldBanner/3/bg_en-EN.png");
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

.action-frame {
  position: absolute;
  top: 8.625%;
  left: 18.75%;
}

.limit-img__box {
  position: absolute;
  left: 76%;
  top: 7.5%;
}

.left-frame {
  position: absolute;
  left: 18.053%;
  top: 30.75%;
}

.right-frame {
  position: absolute;
  top: 13.125%;
  right: 18.646%;
}

.btn-detail {
  margin: 70% 0 0 17px;
  width: 24.46vw !important;
}

/deep/ .btn-detail.v-btn {
  .v-btn__content {
    @include common-btn-title;
  }
  
  background: linear-gradient(268.14deg, #ffd12f 14.27%, #ff8e00 91.59%);
}

.down-frame,
.shadow-1 {
  display: none;
}

/deep/ .btn-detail.rounded {
  border-radius: 8px !important;
}

@media screen and (max-width: 1264px) {
  .action-frame {
    left: 160px !important;
    top: 50px !important;
  }

  .limit-img__box {
    // right: 160px !important;
    top: 7.5% !important;
  }

  .right-frame {
    position: absolute;
    right: 10.167%;
    top: 20.75%;
  }

}

@media screen and (max-width: 960px) {
  .action-frame {
    left: 120px !important;
    top: 30px !important;
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

  .right-frame {
    position: absolute;
    right: 10.167%;
    top: 20.75%;
  }

  /deep/ .btn-detail.v-btn {
    // width: 158px !important;
    height: 28px !important;
  }
}

@media screen and (max-width: 600px) {
  #banner2 {
    height: calc(100vw * 440 / 320);
    background-image: url("/static/ui/mystery_boxes/oldBanner/3/mobile-bg_en-EN.png") !important;

    background-repeat: no-repeat;
    background-size: 100% auto;
  }

  #banner2.zh-TW {
    background-image: url("/static/ui/mystery_boxes/oldBanner/3/mobile-bg_zh-TW.png") !important;
  }

  .right-frame {
    // position: absolute;
    right: 10% !important;
    top: 2% !important;

    /deep/ &.v-image {
      width: calc(100vw * 240 / 300) !important;
      height: calc(100vw * 214.39 / 300) !important;
    }
  }

  .limit-img__box {
    right: 13px !important;
    top: 10px !important;
  }

  .left-frame,
  .banner2-title,
  .right-frame {
    display: none;
  }

  .action-frame {
    left: 10px !important;
    top: 10px !important;
  }

  .down-frame {
    display: inline-block;
    width: 100vw;
    text-align: center;
    // position: absolute;
    // top: calc(100vw * 234.39 / 300) !important;

    /deep/ .v-image {
      margin: 0 auto !important;
      width: 240px !important;
      height: 105.52px !important;
    }
  }

  .btn-detail {
    margin: 0px;
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translate(-50%, 0%);
    // margin: 42px 0 0 17px;
  }

  /deep/ .btn-detail.v-btn {
    width: 158px !important;
    height: 28px !important;
  }
}
</style>
