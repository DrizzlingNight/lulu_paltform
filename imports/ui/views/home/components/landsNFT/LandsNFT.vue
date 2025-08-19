<template>
  <div class="lands-nft-wrapper">
    <div class="lands-nft-content">
      <h1 class="section-title d-flex align-center pl-3 pl-sm-5 pl-md-10 mb-1 mb-sm-4 mb-md-6">{{ $t('home.landsNFT.sectionTitle') }}</h1>
      <p class="section-description">{{ $t('home.landsNFT.sectionDescription') }}</p>

      <!-- LandsNFT Slide Group -->

      <div class="slide-group-wrapper">
        <!-- 向左一張 箭頭 -->
        <!-- // TODO 按鈕要改成與列表狀態是否觸底連動顯示 -->
        <v-btn v-if="selectedIndex !== 0" @click="prevOnclick()" :ripple="false" text class="action-btn prev-btn">
          <v-img contain src="/static/ui/home/landsNFT/arrow_right.svg" class="arrow-img"></v-img>
        </v-btn>
        <!-- 展示列 -->
        <v-slide-group
          class="slide-group"
          :show-arrows="true"
          v-model="selectedIndex"
          center-active
        >
          <v-slide-item
            v-for="landNFT in landsNFT"
            :key="landNFT.id"
          >
            <LandNFTCard :level="landNFT.rarity" :type="'riverbank'"  class="nft-card" :class="{ active: selectedIndex === landNFT.id }" />
          </v-slide-item>
        </v-slide-group>
        <!-- 向右一張 箭頭 -->
        <!-- // TODO 按鈕要改成與列表狀態是否觸底連動顯示 -->
        <v-btn v-if="selectedIndex !== landsNFT.length - 1" @click="nextOnclick()" :ripple="false" text class="action-btn next-btn">
          <v-img contain src="/static/ui/home/landsNFT/arrow_right.svg" class="arrow-img"></v-img>
        </v-btn>
      </div>
    </div>

    <!-- 雲朵們 -->
    <v-img width="18%" height="auto" src="/static/ui/home/landsNFT/cloud_1.png" class="cloud cloud1"></v-img>
    <v-img width="10%" height="auto" src="/static/ui/home/landsNFT/cloud_2.png" class="cloud cloud2"></v-img>
    <v-img width="5%" height="auto" src="/static/ui/home/landsNFT/cloud_3.png" class=" cloud cloud3"></v-img>
  </div>
</template>

<script>
import LandNFTCard from '/imports/ui/components/mysteryCard/MysteryCard.vue'
// import LandNFTCard from './components/landNFTCard/LandNFTCard.vue'

export default {
  name: 'LandsNFT',
  components: {
    LandNFTCard
  },
  data() {
    return {
      selectedIndex: 0,
      isPrevButtonDisplay: false,
      isNextButtonDisplay: true,
      landsNFT: [
        {
          id: 0,
          rarity: 'SSS',
          name: '沙漠土地',
          properties: {
            foison: 10,
            common: 1,
            poor: -30,
          }
        },
        {
          id: 1,
          rarity: 'SS',
          name: '沙漠土地',
          properties: {
            foison: 10,
            common: 1,
            poor: -30,
          }
        },
        {
          id: 2,
          rarity: 'S',
          name: '沙漠土地',
          properties: {
            foison: 10,
            common: 1,
            poor: -30,
          }
        },
        {
          id: 3,
          rarity: 'A',
          name: '沙漠土地',
          properties: {
            foison: 10,
            common: 1,
            poor: -30,
          }
        },
        {
          id: 4,
          rarity: 'B',
          name: '沙漠土地',
          properties: {
            foison: 10,
            common: 1,
            poor: -30,
          }
        },
      ]
    }
  },
  methods: {
    prevOnclick() {
      // const prevButton = document.querySelector('.v-slide-group__prev')
      // prevButton.click()
      if (this.selectedIndex > 0) {
        this.selectedIndex --
      }
    },
    nextOnclick() {
      // const nextButton = document.querySelector('.v-slide-group__next')
      // nextButton.click()
      if (this.selectedIndex < this.landsNFT.length - 1) {
        this.selectedIndex ++
      }
    },
    // checkArrowDisplayStatus() {
    //   const prevButton = document.querySelector('.v-slide-group__prev')
    //   const nextButton = document.querySelector('.v-slide-group__next')
    //   console.log('prev class: ', prevButton.classList)
    //   console.log('next class: ', nextButton.classList)
      
    //   this.isPrevButtonDisplay = prevButton.classList.contains('v-slide-group__prev--disabled') ? false : true
    //   this.isNextButtonDisplay = nextButton.classList.contains('v-slide-group__next--disabled') ? false : true
    // }
  }
}
</script>

<style lang="scss" scoped>
@import './../../../../assets/css/utils/variables.scss';

.lands-nft-wrapper {
  background: rgba($color: #00322e, $alpha: .2);
  position: relative;
  width: 100%;
  padding: 0px 216px;

  .lands-nft-content {
    position: relative;
    padding-top: 164px;
    padding-bottom: 112px;
    z-index: 1;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;

    .section-title {
      position: relative;
      width: 100%;
      height: 100px;
      background: linear-gradient(90.04deg, rgba(0, 114, 84, 0.38) 0.04%, rgba(196, 196, 196, 0) 99.98%);
      font-size: 48px;

      &::before {
        content: '';
        display: block;
        position: absolute;
        left: 0px;
        transform: translate(-50%, 0%);
        width: 64px;
        height: 100%;
        background: url('/static/ui/home/landsNFT/title_img.png');
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
      }
    }

    .section-description {
      font-size: $font_bg;
      color: rgba($color: #ffffff, $alpha: .6);
      margin-bottom: 80px;
    }

    .slide-group-wrapper {
      position: relative;

      .action-btn {
        position: absolute;
        top: -64px;

        &.prev-btn {
          transform: scaleX(-1);
          left: 0px;
        }
        &.next-btn {
          right: 0px;
        }

        .arrow-img {
          max-width: 32px;
          height: auto;
        }
      }

      .slide-group {
        width: 100%;
        height: 100%;


        // slider 內容物
        /deep/ .v-slide-group__content {
          width: auto;
          padding-top: 24px;
          padding-bottom: 20px;
          padding-left: 20px;
          gap: 28px;

          .nft-card {
            transform: scale(1);
            bottom: 0px;
            transition: all .3s;
            &.active {
              transform: scale(1.01);
              bottom: 8px;
              transition: all .3s;
            }
          }
        }

        /deep/ .v-slide-group__prev,
        /deep/ .v-slide-group__next {
          display: none;
        }
      }
    }
    
  }

  .cloud {
    z-index: 0;
    position: absolute;

    &.cloud1 {
      top: 25%;
      right: 0%;
    }
    &.cloud2 {
      left: 5%;
      top: 50%;
    }
    &.cloud3 {
      right: 10%;
      bottom: 10%;
    }
  }
}

@media screen and (max-width: 1264px) {
  .lands-nft-wrapper {
    padding: 0px 160px;

    .lands-nft-content {
      padding-top: 120px;
      padding-bottom: 80px;

      .section-title {
        height: 44px;
        font-size: 36px;

        &::before {
          min-width: 36px;
        }
      }

      .section-description {
        font-size: 16px;
        margin-bottom: 60px;
      }

      .slide-group-wrapper {
        .action-btn {
          top: -32px;

          .arrow-img {
            max-width: 28px;
          }
        }

        .slide-group {

          // slider 內容物
          /deep/ .v-slide-group__content {
            width: auto;
            padding-top: 24px;
            padding-bottom:20px;
            padding-left: 20px;
            gap: 24px;
          }
        }
      }
      
    }
  }
}

@media screen and (max-width: 960px) {
  .lands-nft-wrapper {
    padding: 0px 120px;

    .lands-nft-content {
      padding-top: 60px;
      padding-bottom: 60px;

      .section-title {
        height: 40px;
        font-size: 24px;

        &::before {
          width: 24px;
        }
      }

      .section-description {
        font-size: 14px;
        margin-bottom: 60px;
      }

      .slide-group-wrapper {
        .action-btn {
          top: -32px;

          .arrow-img {
            max-width: 24px;
          }
        }

        .slide-group {

          // slider 內容物
          /deep/ .v-slide-group__content {
            width: auto;
            padding-top: 24px;
            padding-bottom: 20px;
            padding-left: 20px;
            gap: 20px;
          }
        }
      }
      
    }
  }
}

@media screen and (max-width: 600px) {
  .lands-nft-wrapper {
    padding: 0px 10px;

    .lands-nft-content {
      padding-top: 44px;
      padding-bottom: 44px;

      .section-title {
        height: 36px;
        font-size: 18px;

        &::before {
          width: 16px;
        }
      }

      .section-description {
        font-size: 11px;
        margin-bottom: 44px;
      }

      .slide-group-wrapper {
        .action-btn {
          top: -32px;

          .arrow-img {
            max-width: 18px;
          }
        }

        .slide-group {

          // slider 內容物
          /deep/ .v-slide-group__content {
            width: auto;
            padding-top: 20px;
            padding-bottom: 20px;
            padding-left: 20px;
            gap: 20px;

            .nft-card {
              width: 296px;
            }
          }
        }
      }
      
    }
  }
}

</style>>