<template>
    <div class="hero-banner-wrapper">
      <v-carousel id="carousel" v-model="currentBanner" :continuous="true" :cycle="true" interval="6000" :show-arrows="false" height="100%" hide-delimiter-background hide-delimiters>
        <component v-for="banner in banners" :key="banner" :is="'Banner' + banner"></component>
      </v-carousel>
      <!-- 輪播進度條 -->
      <!-- 因為只有兩個輪播banner，因此暫時先隱藏 -->
      <div v-if="bannerLength > 1" class="delimiters-wrapper d-flex justify-center align-center">
        <div @click="currentBanner = index - 1" v-for="index in bannerLength" :key="index" class="delimiter rounded-pill" :class="{ 'active': currentBanner === index - 1 }"></div>
      </div>
      <!-- 為只有兩個輪播banner客製化的進度條 -->
      <!-- <div class="delimiters-wrapper d-flex justify-center align-center">
        <div @click="currentBanner = index - 1" v-for="index in bannerLength" :key="index" class="delimiter rounded-pill" :class="{ 'active': (currentBanner + 1 - index) % 2 === 0 }"></div>
      </div> -->
    </div>
</template>

<script>
// 體驗遊戲
import Banner1 from './components/banner1/Banner1.vue'
// 限量版NFT鑄造
import Banner2 from './components/banner2/Banner2.vue'
// 質押NFT獲得分紅
import Banner3 from './components/banner3/Banner3.vue'
// A/B級土地NFT鑄造
import Banner4 from './components/banner4/Banner4.vue'
// 幣安NFT發售中
import Banner5 from './components/banner5/Banner5.vue'

import { settings } from '/imports/settings';

export default {
  name: 'HeroBanner',
  components: {
    Banner1,
    Banner2,
    Banner3,
    Banner4,
    Banner5
  },
  data() {
    return {
      bannerLength: settings.display.home.showBanner.length,
      currentBanner: 0,
      banners: settings.display.home.showBanner
    }
  },
  methods: {
    showBanner(banner) {
      return settings.display.home.showBanner.indexOf(banner) != -1
    }
  }
}
</script>

<style lang="scss" scoped>

.hero-banner-wrapper {
  position: relative;
  width: 100%;
  height: 100%;

  .delimiters-wrapper {
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0%);
    bottom: 48px;
    gap: 20px;

    .delimiter {
      background: #95C6B7;
      width: 8px;
      height: 8px;
      transition: all .2s;
      cursor: pointer;

      &.active {
        width: 40px;
        background: #00FFCA;
        transition: all .2s;
      }
    }
  }
}

@media screen and (max-width: 1264px) {
  .hero-banner-wrapper {

    .delimiters-wrapper {
      bottom: 36px;
    }
  }
}

@media screen and (max-width: 960px) {
  .hero-banner-wrapper {

    .delimiters-wrapper {
      bottom: 28px;
      gap: 12px;
    }
  }
}

@media screen and (max-width: 600px) {
  .hero-banner-wrapper {

    .delimiters-wrapper {
      bottom: 16px;
    }
  }
}
</style>