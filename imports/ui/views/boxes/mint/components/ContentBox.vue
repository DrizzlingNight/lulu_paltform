<template>
  <div id="mint-content-box">
    <div class="mint-content-box ml-auto mr-auto">
      <open-box class="pc-open-box" />
      <mobile-open-box class="mobile-open-box" />
      <!-- 系統內容 -->
      <title-box class="title-box" :content="$t('blindBox.system_content')"/>

      <cards-box />
      <!-- 活動說明 -->
      <title-box class="title-box" :content="$t('blindBox.describe')"/>
      <div class="describe-box">
        <p class="describe-tips pb-10" style="white-space: pre-wrap; line-height: 36px;">{{ tip }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import OpenBox from "./OpenBox.vue";
import MobileOpenBox from "./MobileOpenBox.vue";
import TitleBox from "./TitleBox.vue"
import CardsBox from "./CardsBox.vue";

import { mapGetters } from "vuex";

export default {
  components: {
    MobileOpenBox,
    OpenBox,
    CardsBox,
    TitleBox,
  },
  data() {
    return {
      boxId: 2,
      tip: '',
    }
  },
  watch: {
    // 監聽 boxInfo傳入 更新加載資源資料
    'boxInfo': {
        handler(newVal) {
          if (newVal) {
            this.getTip()
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
    getTip() {
      const targetBoxInfoId = this.$route.params.id
      const targetBoxInfo = this.boxInfo.find(box => (box._id).toString() === (targetBoxInfoId).toString())
      const currentLocale = this.$i18n.locale
      if (targetBoxInfo) {
          this.tip = targetBoxInfo[`des_${currentLocale}`]
        }
    }
  },
  created() {
    this.boxId = this.$route.params.id || 2;
  },
};
</script>

<style lang="scss" scoped>
#mint-content-box {
  width: 100%;
  // height: 100%;
  text-align: center;
  padding: 100px 216px 0 216px;
}

.mint-content-box {
  width: 100%;
  max-width: 1200px;
}

.mobile-open-box {
  display: none;
}

.title,
.title2 {
  width: 100% !important;
  margin: 150px 0 150px 0;

  .title-content {
    width: 100% !important;
    max-width: 100px !important;
    padding: 0 32px 0 32px;
    font-style: normal;
    font-weight: 600;
    font-size: 32px;
    line-height: 45px;
    color: #ffffff;
  }
}

.describe-box {
  width: 100%;
  height: 100%;
  text-align: left;

  padding: 0 30px;
  background-image: url("/static/ui/mystery_boxes/describe-box.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.content-box {
  height: auto;
  min-height: 267px;
}

.describe-box {
  line-height: 22px;
  font-size: 16px;
  color: #ffffff;
}

.describe-tips {
  padding-top: 22px;
}

@media screen and (max-width: 1264px) {
  #mint-content-box {
    padding: 100px 160px 52px 160px !important;
  }

  .title,
  .title2 {
    margin: 100px auto 120px auto;
  }
}

@media screen and (max-width: 960px) {
  #mint-content-box {
    padding: 100px 120px 52px 120px !important;
  }

  .title,
  .title2 {
    margin: 100px auto 120px auto;
  }

  .title-content {
    font-size: 18px !important;
    line-height: 24px !important;
    letter-spacing: -0.152942px;

    padding: 0 5px 0 5px;
  }
}

@media screen and (max-width: 600px) {
  #mint-content-box {
    padding: 0 10px 0 10px !important;
  }

  .mint-content-box {
    width: 100%;
    // max-width: 320px !important;
  }

  .pc-open-box {
    display: none;
  }

  .mobile-open-box {
    display: block;
  }

  .title-content {
    font-size: 14px !important;
    line-height: 20px !important;
    letter-spacing: -0.152942px;

    padding: 0 5px 0 5px;
  }

  .title {
    position: relative;
    width: 100% !important;
    padding: 0 !important;
    margin: 61px 0 62px 0 !important;
    text-align: center;
  }

  .title2 {
    position: relative;
    width: 100% !important;
    padding: 0 !important;
    margin: 40px 0 20px 0 !important;
  }

  .title-content {
    padding: 0 5px !important;
  }

  .describe-tips {
    font-size: 12px;
    line-height: 17px;
  }

  .describe-box {
    background-image: url("/static/ui/mystery_boxes/mobile-describe-box.png");
  }
}
</style>
