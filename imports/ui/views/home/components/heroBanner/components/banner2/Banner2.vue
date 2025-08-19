<template>
  <!-- 限量版土地 NFT 鑄造 -->
  <v-carousel-item class="banner banner-2">
    <video preload="auto" playsinline autoplay muted loop class="bgvid">
      <source src="https://s3.ap-southeast-2.amazonaws.com/game-sit.bap.bet/banner/home1.mp4" type="video/mp4">
    </video>
    <!-- <v-img src="/static/ui/home/heroBanner/banner2.png" width="100%" min-height="236" cover class="bgvid"></v-img> -->
    <div class="hero-banner-content d-flex flex-column justify-center align-center">
      <h1 class="slogan" :class="$i18n.locale">{{ $t('home.heroBanner.banner2.slogan') }}</h1>
      <v-spacer></v-spacer>
      <v-btn @click="activitiesOnclick()" class="mint-btn">{{ $t('home.heroBanner.banner2.buttonText') }}</v-btn>
    </div>
  </v-carousel-item>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'HeroBanner2',
  computed: {...mapGetters(['boxInfo'])},
  methods: {
    activitiesOnclick() {
      // 取得最新盲盒鑄造活動id
      const firstBlindBoxActivityOrder = this.boxInfo[this.boxInfo.length - 1]._id
      // 沒有活動就到盲盒活動頁
      if (!firstBlindBoxActivityOrder) {
        this.$router.push('/mystery_boxes')
        return
      }
      this.$router.push(`/mystery_boxes/rare-mint/${firstBlindBoxActivityOrder}`)
      // this.toasterComingSoon()
    },
  },
}
</script>

<style lang="scss" scoped>

@import '/imports/ui/scss/mixin';

.banner-2 {
  position: relative;

  // 影片資源
  .bgvid {
    display: block;
    width: 100%;
    height: 100%;
    min-height: 320px !important;
    object-fit: cover;
  }

  .hero-banner-content {
    position: absolute;
    left: 50%;
    top: 100px;
    bottom: 120px;
    transform: translate(-50%, 0%);
    
    .slogan {
      font-size: 100px;
      font-weight: 600;
      white-space: nowrap;

      &.en-EN {
        font-size: 80px;
      }

      &.vi-VI {
        font-size: 60px;
      }
    }

    .mint-btn {
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
  .banner-2 {

    .hero-banner-content {
      top: 80px;
      bottom: 80px;
      
      .slogan {
        font-size: 60px;

        &.en-EN {
          font-size: 52px;
        }

        &.vi-VI {
          font-size: 44px;
        }
      }

      .mint-btn {
        width: 320px;
        height: 48px;
      }
    }
  }
}

@media screen and (max-width: 960px) {
  .banner-2 {

    .hero-banner-content {
      top: 60px;
      bottom: 60px;
      
      .slogan {
        font-size: 48px;

        &.en-EN {
          font-size: 40px;
        }

        &.vi-VI {
          font-size: 32px;
        }
      }

      .mint-btn {
        width: 240px;
        height: 40px;
      }
    }
  }
}

@media screen and (max-width: 600px) {
  .banner-2 {

    .hero-banner-content {
      top: 40px;
      bottom: 44px;
      
      .slogan {
        font-size: 36px;

        &.en-EN {
          font-size: 24px;
        }

        &.vi-VI {
          font-size: 16px;
        }
      }

      .mint-btn {
        width: 160px;
        height: 36px;
      }
    }
  }
}

</style>