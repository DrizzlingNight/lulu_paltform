<template>
  <!-- 主Banner 邊玩遊戲邊生產 -->
  <v-carousel-item class="banner banner-1">
    <video v-if="showVideo" preload="auto" playsinline autoplay muted loop class="bgvid">
      <source src="https://s3.ap-southeast-2.amazonaws.com/game-sit.bap.bet/banner/home.mp4" type="video/mp4">
    </video>
    <v-img v-else :src="bgImg" width="100%" min-height="236" cover class="bgvid"></v-img>
    <div v-if="showPlayDialog" class="hero-banner-content d-flex flex-column justify-center align-center" :class="[$i18n.locale, {'firefox': isFirefox}]">
      <h1 class="slogan" :class="$i18n.locale">{{ $t('home.heroBanner.banner1.slogan') }}</h1>
      <p class="description text-center" :class="$i18n.locale">{{ $t('home.heroBanner.banner1.description') }}</p>
      <v-btn @click="demoOnclick()" class="demo-btn">{{ $t('home.heroBanner.banner1.buttonText') }}</v-btn>
    </div>
    <div v-if="showStartBtn" class="d-flex flex-row align-center justify-center">
      <button 
        style="position: absolute;top:65%;"
        @click="demoOnclick()"
      >
        <v-img max-width="400px" src="/static/ui/home/heroBanner/startgame.png"></v-img>
      </button>
    </div>
  </v-carousel-item>
</template>

<script>
import { Game } from './../../../../../../../api/games/collections'
import { settings } from '/imports/settings';

export default {
  name: 'HeroBanner1',
  computed: {
    showPlayDialog() {
      return settings.display.home.showPlayDialog
    },
    showStartBtn() {
      return settings.display.home.showStartGameBtn
    },
    showVideo() {
      return false
    },
    bgImg() {
      return '/static/ui/home/heroBanner/' + settings.theme + '.png'
    }
  },
  data: () => ({
    // 是否為 firefox ( blur效果無法生效 )
    isFirefox: false,
  }),
  created() {
    this.detectIsFirefox()
  },
  methods: {
    // 查看是否為 firefox瀏覽器
    detectIsFirefox() {
      this.isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1
    },
    demoOnclick() {
      // 如果遊戲不開放就會跳提示

      if (!this.games[0] || this.games[0]._id !== 'market') {
        // TODO
        this.toasterComingSoon()
        return
        // console.log('market !ready')
      }
      this.$router.push({ name: 'game' })
    }
  },
  meteor: {
    $subscribe: {
      games: []
    },
    games() {
      return Game.find({}).fetch()
    }
  }
}
</script>

<style lang="scss" scoped>

@import '/imports/ui/scss/mixin';

.banner-1 {
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
    padding: 56px 76px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    backdrop-filter: blur(30px);
    border-radius: 20px;

    // firefox無法顯示 blur效果，監測到firefox瀏覽器改用透明黑色遮罩顯示
    &.firefox {
      background: rgba(105, 105, 105, 0.5) !important;
    }

    .slogan {
      font-size: 90px;
      white-space: nowrap;
      margin-bottom: 32px;
      // -webkit-text-stroke: 2.5px #7e8c67;
      font-weight: 600;
      text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
      text-align: center;

      &.en-EN {
        font-size: 80px;
      }

      &.vi-VI {
        font-size: 56px;
      }
    }

    .description {
      // max-width: 440px;
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 56px;
      text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
      color: #ffffff;
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
  .banner-1 {
    .hero-banner-content {
      padding: 48px 60px;

      .slogan {
        font-size: 60px;
        margin-bottom: 28px;
        // -webkit-text-stroke: 2px #7e8c67;

        &.en-EN {
          font-size: 40px;
        }

        &.vi-VI {
          font-size: 36px;
        }
      }

      .description {
        font-size: 20px;
        margin-bottom: 40px;
      }

      .demo-btn {
        width: 320px;
        height: 48px;
      }
    }
  }
}

@media screen and (max-width: 960px) {
  .banner-1 {
    .hero-banner-content {
      padding: 24px 16px;
      border-radius: 12px;

      .slogan {
        font-size: 40px;
        margin-bottom: 16px;
        // -webkit-text-stroke: 1px #7e8c67;

        &.en-EN {
          font-size: 36px;
        }

        &.vi-VI {
          font-size: 28px;
        }
      }

      .description {
        font-size: 16px;
        margin-bottom: 32px;

        &.vi-VI {
          font-size: 12px;
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
  .banner-1 {
    .hero-banner-content {
      padding: 16px 10px;

      .slogan {
        font-size: 36px;
        margin-bottom: 10px;

        &.en-EN {
          font-size: 32px;
        }

        &.vi-VI {
          font-size: 24px;
        }
      }

      .description {
        font-size: 12px;
        margin-bottom: 24px;

        &.vi-VI {
          max-width: 300px;
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
