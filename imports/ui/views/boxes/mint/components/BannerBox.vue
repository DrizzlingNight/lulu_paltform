<template>
  <div id="banner-frame" :class="[$i18n.locale, `order${$route.params.id}`]">
    <div class="banner-title-frame d-flex flex-grow-1 justify-center">
      <div class="banner-title ml-5">
        <!-- <div v-if="$route.params.id == 2" class="round-box">
          <round-count v-if="$route.params.id == 2" />
        </div> -->
        <span>{{ title }}</span>
      </div>
    </div>
    <div class="go-back" @click="$router.push({ name: 'mystery_boxes' })">
      <v-img
        width="18"
        height="auto"
        contain
        src="/static/ui/components/goback.svg"
        class="arrow-img"
      />
      <span>{{ $t("blindBox.back") }}</span>
    </div>
    <content-box class="content-box-frame" />
  </div>
</template>

<script>
import RoundCount from "../../components/components/RoundCount.vue";
import ContentBox from "./ContentBox.vue";
import LimitBox from "../../components/components/LimitBox.vue";

import { mapGetters } from "vuex";

export default {
  components: {
    RoundCount,
    ContentBox,
    LimitBox,
  },
  data: () => ({
    title: '',
  }),
  watch: {
    // 監聽 boxInfo傳入 更新加載資源資料
    'boxInfo': {
        handler(newVal) {
          if (newVal) {
            this.getTitle()
          }
        },
        deep: true,
        immediate: false,
    },
  },
  computed: {
    ...mapGetters(["boxInfo"]),
  },
  methods: {
    getTitle() {
      const targetBoxInfoId = this.$route.params.id
      const targetBoxInfo = this.boxInfo.find(box => (box._id).toString() === (targetBoxInfoId).toString())
      const currentLocale = this.$i18n.locale
      if (targetBoxInfoId) {
        this.title = targetBoxInfo[`title_${currentLocale}`]
      }
    }
  },
  mounted () {
    const mintId = this.$route.params.id
    if (mintId === 3) {
      this.logEvent('go_minting_level_a')
    } else if (mintId === 4) {
      this.logEvent('go_minting_level_b')
    }
  }
};
</script>

<style lang="scss" scoped>
#banner-frame {
  position: relative;
  width: 100vw;
  height: 100%;
}

.banner-title-frame {
  position: relative;
  color: #fff;
  padding: 160px 216px 0 216px;

  .banner-title {
    max-width: 1200px;
    position: relative;
    text-align: center;
  }

  span {
    font-size: 80px;
    font-weight: bold;
  }
}

.round-box {
  position: absolute;
  top: -50px;
  left: -30px;
}

.banner-limit {
  position: relative;
  width: 110px;
  height: 69px;
  top: calc(100vw * 75.2 / 1920);
  left: calc(100vw * (1920 - 370) / 1920);

  .limited {
    text-align: center;
    padding-top: 9px;
    font-style: normal;
    font-weight: 600;
    font-size: 24px;
    line-height: 34px;

    /* identical to box height */
    letter-spacing: -0.114707px;

    color: #ffffff;
  }
}

.go-back {
  position: absolute;
  display: inline-flex;
  cursor: pointer;

  top: 55.6px;
  left: 38px;

  span {
    padding-left: 7px;
    color: #f7cd0a;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 22px;
  }
}

@media screen and (max-width: 1264px) {
  .banner-title-frame {
    color: #fff;
    padding: 160px 160px 0 160px;

    span {
      font-size: 60px;
    }
  }

  .banner-limit {
    right: 160px !important;
    top: 50px !important;
    width: 100px !important;
    height: 60px !important;

    .limited {
      padding-top: 10px !important;
      font-size: 20px !important;
      line-height: 22px !important;
    }
  }
}

@media screen and (max-width: 960px) {
  .banner-title-frame {
    color: #fff;
    padding: 160px 120px 0 120px;

    span {
      font-size: 36px;
      line-height: 20px;
    }
  }

  .banner-limit {
    right: 120px !important;
    top: 40px !important;
    width: 90px !important;
    height: 50px !important;

    .limited {
      padding-top: 9px !important;
      font-size: 16px !important;
      line-height: 18px !important;
    }
  }

  .content-box-frame {
    padding-top: calc(100vw * 800 / 1920);
  }
}

@media screen and (max-width: 600px) {
  .banner-title-frame {
    color: #fff;
    padding: 100px 10px 0 10px;
    max-width: 90vw;
    text-align: center;

    .banner-title {
      // position: static;
      text-align: center;
    }

    span {
      font-size: 40px;
      line-height: 50px;
    }
  }

  .round-box {
    .v-image {
      width: 100px !important;
    }

    top: -30px;
    left: 10px;
  }

  .content-box-frame {
    position: relative;
  }

  .banner-limit {
    display: none;
  }

  .go-back {
    left: 10px !important;
    top: 9px !important;

    span {
      padding-left: 7px;
      font-size: 12px;
      line-height: 17px;
    }
  }
}
</style>
