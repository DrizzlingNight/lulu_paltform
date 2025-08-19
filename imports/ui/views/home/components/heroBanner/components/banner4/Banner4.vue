<template>
  <!-- 主Banner 邊玩遊戲邊生產 -->
  <v-carousel-item class="banner banner-4">
    <!-- <video preload="auto" playsinline autoplay muted loop class="bgvid">
      <source src="https://s3.ap-southeast-2.amazonaws.com/game-sit.bap.bet/banner/home.mp4" type="video/mp4">
    </video> -->
    <v-img src="/static/ui/home/heroBanner/banner4.png" width="100%" min-height="236" cover class="bgvid"></v-img>
    <div class="hero-banner-content d-flex flex-column align-center">
      <h1 class="slogan" :class="$i18n.locale">{{ $t('home.heroBanner.banner4.slogan') }}</h1>
      <v-spacer></v-spacer>
      <v-btn @click="mintOnclick()" class="demo-btn">{{ $t('home.heroBanner.banner4.buttonText') }}</v-btn>
    </div>
  </v-carousel-item>
</template>

<script>

export default {
  name: 'HeroBanner4',
  methods: {
    mintOnclick() {
      this.$router.push({ name: 'mystery_boxes', params: { id: 3 } }) // id: 3為A及盲盒
    }
  }
}
</script>

<style lang="scss" scoped>

@import '/imports/ui/scss/mixin';

.banner-4 {
  position: relative;

  // 影片資源
  .bgvid {
    display: block;
    width: 100%;
    height: 100%;
    min-height: 320px !important;
    object-fit: cover;
  }

  // 主內容
  .hero-banner-content {
    max-width: 852px;
    // padding: 56px 76px;
    position: absolute;
    top: 60px;
    bottom: 88px;
    left: 50%;
    transform: translate(-50%, 0%);

    .slogan {
      font-size: 100px;
      white-space: nowrap;
      font-weight: 600;
      text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

      &.en-EN {
        font-size: 76px;
      }

      &.vi-VI {
        font-size: 76px;
      }
    }

    .demo-btn {
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

@media screen and (max-width: 1264px) {
  .banner-4 {
    .hero-banner-content {
      top: 40px;
      bottom: 64px;
      .slogan {
        font-size: 60px;
        // margin-bottom: 28px;
        // -webkit-text-stroke: 2px #7e8c67;

        &.en-EN {
          font-size: 48px;
        }

        &.vi-VI {
          font-size: 48px;
        }
      }

      .demo-btn {
        width: 320px;
        height: 48px;
      }
    }
  }
}

@media screen and (max-width: 960px) {
  .banner-4 {
    .hero-banner-content {
      top: 20px;
      bottom: 44px;
      .slogan {
        font-size: 48px;
        margin-bottom: 20px;
        line-height: 48px;
        // -webkit-text-stroke: 1px #7e8c67;

        &.en-EN {
          font-size: 32px;
        }

        &.vi-VI {
          font-size: 32px;
        }
      }

      .demo-btn {
        width: 240px;
        height: 40px;
      }
    }
  }
}

@media screen and (max-width: 600px) {
  .banner-4 {
    .hero-banner-content {
      top: 20px;
      bottom: 36px;

      .slogan {
        font-size: 36px;
        margin-bottom: 10px;

        &.en-EN {
          font-size: 24px;
        }

        &.vi-VI {
          font-size: 24px;
        }
      }

      .demo-btn {
        width: 160px;
        height: 36px;
      }
    }
  }
}

</style>
