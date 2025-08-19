<template>
  <div id="banner3" :class="$i18n.locale">
    <!-- 活動標題 -->
    <action-title-box class="action-frame" :status="status" />

    <!-- 左側 -->
    <div class="left-frame">
      <v-img
        v-if="$i18n.locale == 'zh-TW'"
        contain
        width="30.208vw"
        :aspect-ratio="116 / 51"
        src="/static/ui/mystery_boxes/banner3/banner3-title-zh.png"
      />
      <v-img
        v-else
        contain
        width="30.208vw"
        :aspect-ratio="116 / 51"
        src="/static/ui/mystery_boxes/banner3/banner3-title-en.png"
      />
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
      src="/static/ui/mystery_boxes/banner3/banner3-image.png"
      class="right-frame"
    /> -->

    <div class="down-frame">
      <!-- <v-img
        v-if="$i18n.locale == 'zh-TW'"
        contain
        width="30.208vw"
        :aspect-ratio="116 / 51"
        class="banner2-title"
        src="/static/ui/mystery_boxes/banner3/banner3-title-zh.png"
      />
      <v-img
        v-else
        contain
        width="30.208vw"
        :aspect-ratio="116 / 51"
        class="banner2-title"
        src="/static/ui/mystery_boxes/banner3/banner3-title-en.png"
      /> -->
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

export default {
  components: {
    ActionTitleBox,
  },
  data: () => ({
  }),
  props: {
    boxId: {
      type: Number,
      default: 3
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
  methods: {
    go() {
      // this.$toast.warning(this.$t(`comingSoon`));
      this.$router.push("/mystery_boxes/rare-mint/3");
    },
  },
};
</script>

<style lang="scss" scoped>

@import '/imports/ui/scss/mixin';

#banner3 {
  position: relative;
  width: 100vw;
  height: calc(100vw * 800 / 1920);

  background-image: url("/static/ui/mystery_boxes/banner3/banner3-bg.png"),
    linear-gradient(100.46deg, #054f93 3.43%, #2d0e71 102.29%);
  background-repeat: no-repeat;
  background-size: cover;
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

  .font {
    color: #00ffca;
    /* 投影 */
    text-shadow: 0px 5px 8px rgba(0, 20, 15, 0.5);
  }
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
  margin: 42px 0 0 17px;
  width: 24.46vw !important;
}

/deep/ .btn-detail.v-btn {
  background: linear-gradient(268.14deg, #ffd12f 14.27%, #ff8e00 91.59%);

  .v-btn__content {
    @include common-btn-title;
  }
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

    /deep/ .v-image {
      width: 30px !important;
      height: 30px !important;

      &.mt-1 {
        margin-top: 6px !important;
      }
    }

    .font {
      font-size: 20px !important;
      line-height: 29px !important;
    }
  }

  .right-frame {
    position: absolute;
    right: 10.167%;
    top: 20.75%;
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
  .action-frame {
    left: 120px !important;
    top: 50px !important;

    /deep/ .v-image {
      width: 24px !important;
      height: 28px !important;

      &.mt-1 {
        margin-top: 0px !important;
      }
    }

    .font {
      font-size: 16px !important;
      line-height: 23px !important;
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
  #banner3 {
    height: calc(100vw * 440 / 320);
    background-image: url("/static/ui/mystery_boxes/banner3/banner3-mobile-en.png");

    background-repeat: no-repeat;
    background-size: 100% auto;
  }

  #banner3.zh-TW {
    background-image: url("/static/ui/mystery_boxes/banner3/banner3-mobile-zh.png");
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

  .left-frame,
  .banner2-title,
  .right-frame {
    display: none;
  }

  .action-frame {
    left: 10px !important;
    top: 10px !important;
    &.d-flex {
      display: flex !important;
    }

    /deep/ .v-image {
      width: 22px !important;
      height: 24px !important;

      &.mt-1 {
        margin-top: 0px !important;
      }
    }

    .font {
      font-size: 12px !important;
      line-height: 17px !important;
    }
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
