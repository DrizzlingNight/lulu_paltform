<template>
  <!-- 主Banner 邊玩遊戲邊生產 -->
  <v-carousel-item class="banner banner-5">
    <v-img src="/static/ui/home/heroBanner/banner5.png" width="100%" min-height="236" cover class="bg"></v-img>
    <div class="hero-banner-content d-flex flex-column justify-center">
      <h1 class="slogan" v-html="$t('home.heroBanner.banner5.slogan')" :class="$i18n.locale"></h1>
      <!-- <v-spacer></v-spacer> -->
      <v-btn @click="joinOnclick()" class="join-btn">{{ $t('home.heroBanner.banner5.buttonText') }}</v-btn>
    </div>
  </v-carousel-item>
</template>

<script>

import { settings } from '/imports/settings';

export default {
  name: 'HeroBanner5',
  computed: {
    logoImg() {
      return '/static/ui/utils/brands/' + settings.theme + '.png'
    }
  },
  methods: {
    joinOnclick() {
      this.$router.push({ name: 'mystery_boxes', params: { id: 5 } }) // TODO: id後端還未配置，待配置後修改成對應目標id
    }
  }
}
</script>

<style lang="scss" scoped>

@import '/imports/ui/scss/mixin';

.banner-5 {
  position: relative;

  // 影片資源
  .bg {
    display: block;
    width: 100%;
    height: 100%;
    min-height: 320px !important;
    object-fit: cover;
  }

  // 主內容
  .hero-banner-content {
    width: 100%;
    height: 100%;
    padding: 200px 0px 100px 0px;
    position: absolute;
    top: 50%;
    transform: translate(0%, -50%);

    .slogan {
      padding-left: 240px;
      font-size: 100px;
      line-height: 1.4;
      white-space: nowrap;
      margin-bottom: 32px;
      font-weight: 600;
      text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

      &.en-EN {
        font-size: 76px;
      }

      &.vi-VI {
        font-size: 76px;
      }
    }

    .brands {
      padding-left: 240px;
      width: 100%;
      margin-bottom: 120px;

      .binance {
        max-width: 460px;
        height: auto;
      }

      .divider {
        border: 1px solid #ffffff;
        margin: 0px 48px;
      }

      .lulu {
        max-width: 160px;
        height: auto;
      }
    }

    .join-btn {
      left: 240px;
      width: 380px;
      height: 60px;
      border-radius: 4px;
      background: linear-gradient(268.14deg, #FFD12F 14.27%, #FF8E00 91.59%);

      /deep/ .v-btn__content {
        @include common-btn-title;
      }

    }
  }
}

@media screen and (max-width: 1904px) {
  
.banner-5 {
  position: relative;

  // 主內容
  .hero-banner-content {
    padding: 100px 0px 100px 0px;

    .slogan {
      padding-left: 240px;
      font-size: 76px;
      line-height: 1.4;
      margin-bottom: 32px;

      &.en-EN {
        font-size: 60px;
      }

      &.vi-VI {
        font-size: 60px;
      }
    }

    .brands {
      padding-left: 240px;
      margin-bottom: 80px;

      .binance {
        max-width: 400px;
      }

      .divider {
        margin: 0px 36px;
      }

      .lulu {
        max-width: 120px;
      }
    }

    .join-btn {
      width: 380px;
      height: 60px;

    }
  }
}

}

@media screen and (max-width: 1264px) {
  
.banner-5 {
  position: relative;

  // 主內容
  .hero-banner-content {
    padding: 100px 0px 100px 0px;

    .slogan {
      padding-left: 160px;
      font-size: 56px;
      line-height: 1.4;
      margin-bottom: 20px;

      &.en-EN {
        font-size: 40px;
      }

      &.vi-VI {
        font-size: 40px;
      }
    }

    .brands {
      padding-left: 160px;
      margin-bottom: 56px;

      .binance {
        max-width: 300px;
      }

      .divider {
        margin: 0px 20px;
      }

      .lulu {
        max-width: 80px;
      }
    }

    .join-btn {
      left: 160px;
      width: 320px;
      height: 48px;

    }
  }
}

}

@media screen and (max-width: 960px) {
  
.banner-5 {
  position: relative;

  // 主內容
  .hero-banner-content {
    padding: 100px 0px 100px 0px;

    .slogan {
      padding-left: 80px;
      font-size: 32px;
      line-height: 1.4;
      margin-bottom: 20px;

      &.en-EN {
        font-size: 32px;
      }

      &.vi-VI {
        font-size: 32px;
      }
    }

    .brands {
      padding-left: 80px;
      margin-bottom: 32px;

      .binance {
        max-width: 160px;
      }

      .divider {
        margin: 0px 16px;
      }

      .lulu {
        max-width: 40px;
      }
    }

    .join-btn {
      left: 80px;
      width: 240px;
      height: 40px;

    }
  }
}

}

@media screen and (max-width: 600px) {
  
.banner-5 {
  position: relative;

  // 主內容
  .hero-banner-content {
    padding: 120px 0px 100px 0px;

    .slogan {
      padding-left: 40px;
      font-size: 32px;
      line-height: 1.4;
      margin-bottom: 20px;

      &.en-EN {
        font-size: 20px;
      }

      &.vi-VI {
        font-size: 20px;
      }
    }

    .brands {
      padding-left: 40px;
      margin-bottom: 40px;

      .binance {
        max-width: 120px;
      }

      .divider {
        margin: 0px 12px;
      }

      .lulu {
        max-width: 40px;
      }
    }

    .join-btn {
      left: 40px;
      width: 160px;
      height: 36px;

    }
  }
}

}

</style>
