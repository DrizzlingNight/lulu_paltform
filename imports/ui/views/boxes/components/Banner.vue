<template>
  <div :id="`banner${boxInfo._id}`" class="banner-wrapper">
    <!-- 960px以上的背景 -->
    <v-img :src="bgUrl" min-height="600" max-height="800" width="100%" class="d-none d-md-block"></v-img>
    <!-- 600px - 960px 的背景 -->
    <v-img :src="bgUrl" max-height="800" min-height="800" width="100%" class="d-none d-sm-block d-md-none"></v-img>
    <!-- 600px以下的背景 -->
    <v-img :src="bgUrl" max-height="800" min-height="532" width="100%" class="d-block d-sm-none"></v-img>

    <!-- 主內容 -->
    <div class="banner-content" :class="{ 'left-img': boxInfo.style === 'left', 'right-img': boxInfo.style === 'right' }">
      <!-- 盲盒主視覺 -->
      <v-img class="main-img" :src="mainImgUrl" :aspect-ratio="1" height="auto" contain></v-img>
      <!-- 盲盒文字區塊 -->
      <div class="text-wrapper">
        <!-- 標題 -->
        <p class="banner-title" :class="$i18n.locale">{{ boxInfo[`title_${$i18n.locale}`] }}</p>
        <!-- 副標 -->
        <p class="banner-subtitle">{{ boxInfo[`note_${$i18n.locale}`] }}</p>
        <!-- 按鈕 -->
        <v-btn @click="btnOnclick" class="view-detail-btn" :class="{ 'disabled': !boxInfo.show }">{{ $t("blindBox.details") }}</v-btn>
      </div>

      <!-- 活動狀態 -->
      <div class="status-tag d-flex justify-center align-center" :class="`status${activeStatus}`">
        <span v-if="activeStatus == 2">{{ $t("blindBox.closed") }}</span>
        <span v-if="activeStatus == 1">{{ $t("blindBox.opening") }}</span>
        <span v-if="activeStatus == 0">{{ $t("blindBox.waiting") }}</span>
      </div>
      <!-- 限量 hot 標籤 -->
      <v-img v-if="boxInfo.limited" :src="'/static/ui/mystery_boxes/banner/limited_hot.png'" width="82" height="40" class="limited-img"></v-img>

    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"

export default {
  name: "MysteryBoxBanner",
  props: {
    boxInfo: {
      type: Object,
      require: true,
      default: () => ({})
    }
  },
  data: () => ({
    currentDomain: '',
    bgUrl: '',
    mainImgUrl : '',
  }),
  computed: {
    ...mapGetters(['boxNftPool']),

    // 換算當前活動狀態 (0: 未開始, 1: 進行中, 2: 已結束)
    activeStatus() {
      const startTime = this.boxInfo.startTime
      const now = new Date()
      
      if (startTime > now) {
        return 0 // 未開始 (還沒startTime)
      }

      let remain = 0
      this.boxNftPool.forEach(boxNft => {
        if (this.boxInfo._id == boxNft.bboxId) {
          remain += boxNft.nDefined
        }
      })

      if (remain > 0) {
        return 1 // 進行中 (還有盲盒沒開完)
      } else {
        return 2 // 結束了 (盲盒剩餘數量為0)
      }
    }
  },
  watch: {
    // 監聽 boxInfo傳入 更新加載資源資料
    'boxInfo': {
        handler() {
          this.prepareResources()
        },
        deep: true,
        immediate: true,
    },
  },
  created() {
    this.getCurrentDomain()
  },
  methods: {
    // 準備加載資源
    prepareResources() {
      this.combineBgUrl()
      this.combineMainImgUrl()
    },
    // 組合背景資源url
    combineBgUrl() {
      this.bgUrl = `${this.currentDomain}${this.boxInfo['banner-bg']}`
    },
    // 組合主視覺資源url
    combineMainImgUrl() {
      this.mainImgUrl = `${this.currentDomain}${this.boxInfo['banner-box']}`
    },

    // 查看詳情按鈕點按
    btnOnclick() {
      if (!this.boxInfo.show) {
        return
      }
      this.$router.push(`/mystery_boxes/rare-mint/${this.boxInfo._id}`)
    },

    // 判斷當前domain
    getCurrentDomain() {
      const currentDomain = window.location.hostname
      if (currentDomain.includes('localhost')) {
        this.currentDomain = 'https://dev.lulu.market'
        return
      }
      this.currentDomain = currentDomain
    }
  },
}
</script>

<style lang="scss" scoped>

.banner-wrapper {
  position: relative;
  width: 100%;

  .banner-content {
    position: absolute;
    width: 100%;
    max-width: 1200px;
    height: 100%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 40px;
    padding: 24px 32px;

    .main-img {
      max-width: 60%;
    }

    .text-wrapper {
      max-width: 40%;
      text-align: right;

      .banner-title {
        font-size: 88px;
        line-height: 1.2;
        white-space: pre-wrap;
        max-width: 100%;
        color: white;
        font-weight: 600 !important;
        margin-bottom: 8px;

        &.zh-TW {
          font-size: 88px !important;
        }

        &.en-EN,
        &.kr-KR,
        &.vi-VI {
          font-size: 64px !important;
        }
      }

      .banner-subtitle {
        font-size: 32px;
        white-space: pre-wrap;
        max-width: 100%;
        background: linear-gradient(226.58deg, #FFD12F 51.75%, #FF8E00 95.54%);
        background: -webkit-linear-gradient(226.58deg, #FFD12F 51.75%, #FF8E00 95.54%);
        background-clip: text;
        -webkit-background-clip: text;
        color: transparent;
        font-weight: 600 !important;
        margin-bottom: 40px;
      }

      .view-detail-btn {
        width: 100%;
        max-width: 400px;
        height: 64px;
        background: linear-gradient(226.58deg, #FFD12F 51.75%, #FF8E00 95.54%);

        &:hover {
          background: linear-gradient(170.64deg, #FFB030 14.15%, #FF8000 85.1%);
        }

        /deep/ .v-btn__content {
          font-size: 18px;
          color: black !important;
        }

        &.disabled {
          background: linear-gradient(142.1deg, #727272 -41.15%, #CACACA 94.16%);
          cursor: none;
        }
      }
    }

    .status-tag {
      position: absolute;
      padding: 8px 12px;
      margin-left: 32px;
      border-radius: 8px;
      top: 5%;
      left: 0px;
      
      span {
        color: white;
        font-size: 18px;
        font-weight: 600;
      }

      &.status0, &.status2 { // 未開始, 已結束
        background: linear-gradient(142.1deg, #727272 -41.15%, #CACACA 94.16%);
      }

      &.status1 { // 進行中
        background: linear-gradient(170.64deg, #FFB030 14.15%, #FF8000 85.1%);
      }
    }

    .limited-img {
      position: absolute;
      margin-right: 32px;
      top: 5%;
      right: 0px;
    }

    &.right-img {
      flex-direction: row-reverse;

      .text-wrapper {
        text-align: left;
      }
    }
  }
}

@media screen and (max-width: 1904px) {
  .banner-wrapper {
    .banner-content {
      gap: 32px;
      padding: 24px 32px;
      justify-content: space-between;
  
      .main-img {
        max-width: 50%;
      }
  
      .text-wrapper {
        max-width: 35%;
  
        .banner-title {
          font-size: 72px;
          margin-bottom: 8px;

          &.zh-TW {
            font-size: 72px !important;
          }

          &.en-EN,
          &.kr-KR,
          &.vi-VI {
            font-size: 52px !important;
          }
        }
  
        .banner-subtitle {
          font-size: 32px;
          margin-bottom: 40px;
        }
  
        .view-detail-btn {
          width: 100%;
          max-width: 400px;
          height: 64px;
  
          /deep/ .v-btn__content {
            font-size: 18px;
          }
        }
      }
  
      &.right-img {
        flex-direction: row-reverse;

        .text-wrapper {
          text-align: left;
        }
      }
    }
  }
}

@media screen and (max-width: 1264px) {
  .banner-wrapper {
    .banner-content {
      gap: 0px;
      padding: 24px 32px;
      justify-content: space-between;
  
      .main-img {
        max-width: 50%;
      }
  
      .text-wrapper {
        max-width: 35%;
  
        .banner-title {
          font-size: 60px;
          margin-bottom: 8px;

          &.zh-TW {
            font-size: 60px !important;
          }

          &.en-EN,
          &.kr-KR,
          &.vi-VI {
            font-size: 36px !important;
          }
        }
  
        .banner-subtitle {
          font-size: 32px;
          margin-bottom: 40px;
        }
  
        .view-detail-btn {
          width: 100%;
          max-width: 400px;
          height: 64px;
  
          /deep/ .v-btn__content {
            font-size: 18px;
          }
        }
      }
  
      &.right-img {
        flex-direction: row-reverse;

        .text-wrapper {
          text-align: left;
        }
      }
    }
  }
}

@media screen and (max-width: 960px) {
  .banner-wrapper {
    .banner-content {
      flex-direction: column;
      gap: 0px;
      padding: 24px 32px;
      justify-content: center;
  
      .main-img {
        max-width: 512px;
        min-width: 512px;
        padding-top: 12px;
      }
  
      .text-wrapper {
        margin-top: -64px;
        max-width: 426px;
        text-align: left;
  
        .banner-title {
          font-size: 60px;
          margin-bottom: 4px;

          &.zh-TW {
            font-size: 60px !important;
          }

          &.en-EN,
          &.kr-KR,
          &.vi-VI {
            font-size: 40px !important;
          }
        }
  
        .banner-subtitle {
          font-size: 32px;
          margin-bottom: 32px;
        }
  
        .view-detail-btn {
          width: 100%;
          max-width: 400px;
          height: 64px;
  
          /deep/ .v-btn__content {
            font-size: 18px;
          }
        }
      }
  
      &.right-img {
        flex-direction: column;
      }
    }
  }
}

@media screen and (max-width: 600px) {
  .banner-wrapper {
    .banner-content {
      flex-direction: column;
      gap: 0px;
      padding: 24px 32px;
      justify-content: center;
  
      .main-img {
        max-width: 320px;
        min-width: 320px;
        padding-top: 60px;
      }
  
      .text-wrapper {
        margin-top: -64px;
        max-width: 264px;
  
        .banner-title {
          font-size: 36px;
          margin-bottom: 0px;

          &.zh-TW {
            font-size: 36px !important;
          }

          &.en-EN,
          &.kr-KR,
          &.vi-VI {
            font-size: 24px !important;
          }
        }
  
        .banner-subtitle {
          font-size: 20px;
          margin-bottom: 8px;
        }
  
        .view-detail-btn {
          width: 100%;
          max-width: 192px;
          height: 40px;
  
          /deep/ .v-btn__content {
            font-size: 16px;
          }
        }
      }
  
      &.right-img {
        flex-direction: column;
      }
    }
  }
}

</style>