<template>
  <div id="cards-box">
    <!-- 頁籤區 -->
    <div class="tab-frame">
      <div v-for="(item, index) in tabs" :key="index">
        <v-btn
          v-ripple="false"
          depressed
          :class="['tab', { active: active == index }]"
          :style="
            active !== index
              ? `transform: translateX(${-50 * index}px) !important; z-index: ${
                  9 - index
                } !important;`
              : `transform: translateX(${
                  -50 * index
                }px) !important; z-index: 9;`
          "
          @click="tabClick(index, item)"
        >
          {{ $t(`blindBox.${item}`) }}
        </v-btn>
        <v-btn
          v-ripple="false"
          depressed
          :class="['tab-2', { active: active == index }]"
          :style="
            active !== index
              ? `transform: translateX(${-69 * index}px) !important; z-index: ${
                  9 - index
                } !important;`
              : `transform: translateX(${
                  -69 * index
                }px) !important; z-index: 9;`
          "
          @click="tabClick(index, item)"
        >
          {{ $t(`blindBox.${item}`) }}
        </v-btn>
        <v-btn
          v-ripple="false"
          depressed
          :class="['tab-3', { active: active == index }]"
          :style="
            active !== index
              ? `transform: translateX(${-50 * index}px) !important; z-index: ${
                  9 - index
                } !important;`
              : `transform: translateX(${
                  -50 * index
                }px) !important; z-index: 9;`
          "
          @click="tabClick(index, item)"
        >
          {{ $t(`blindBox.${item}`) }}
        </v-btn>
        <v-btn
          v-ripple="false"
          depressed
          :class="['tab-4', { active: active == index }]"
          :style="
            active !== index
              ? `transform: translateX(${-35 * index}px) !important; z-index: ${
                  9 - index
                } !important;`
              : `transform: translateX(${
                  -35 * index
                }px) !important; z-index: 9;`
          "
          @click="tabClick(index, item)"
        >
          {{ $t(`blindBox.${item}`) }}
        </v-btn>
      </div>
    </div>
    <!-- 卡片區 -->
    <div class="content-frame d-flex justify-center">
      <div class="content-frame__inline d-flex flex-wrap pl-2">
        <v-row justify="center" align-content="center" align="center" class="py-2" style="gap: 28px;">
          <!-- <v-col
              v-for="(card, index) in cards"
              :key="index"
              align-self="start"
              cols="auto"
          > -->
            <mystery-card
                v-for="(card, index) in cards"
                :key="index"
                class="cards my-1"
                :level="card"
                :type="currentActiveType"
                :isMint="true"
            />
            <!-- <div style="height: 0px; width: 297px" />
            <div style="height: 0px; width: 297px" />
            <div style="height: 0px; width: 297px" /> -->
          <!-- </v-col> -->
        </v-row>
      </div>
    </div>
  </div>
</template>

<script>
// TODO !!! 有時間要重構 - :資料流向混亂、控制tabs跟cards的flag需調整為single data driven

import MysteryCard from "/imports/ui/components/mysteryCard/MysteryCard.vue";
import { NonFungibleTokenPoolType } from "/imports/api/nft/collections";
import { mapGetters } from 'vuex'

export default {
  components: {
    MysteryCard,
  },
  data() {
    return {
      // 盲盒活動id
      boxId: 0,
      // 地#個tab被開啟
      active: 0,
      // 下方顯示中的土地種類
      currentActiveType: 'forest',
    };
  },
  computed: {
    ...mapGetters(['boxNftPool']),

    // 此活動有哪些土地種類
    tabs() {
      const tabsInNumber = []
      let tabs
      const currentBoxNftPools = this.boxNftPool.filter(pool => pool.bboxId === this.boxId)
      currentBoxNftPools.forEach(pool => {
        // tabs沒有該種類就塞進去
        const poolType = pool.info.type
        if (poolType && !tabsInNumber.includes(poolType)) {
          tabsInNumber.push(poolType)
        }

      })

      // 把當中的id轉為名稱
      tabs = tabsInNumber.map(tabNumber => this.typeTransform(tabNumber))

      return tabs
    },

    // 當前選中種類有哪些級別
    cards() {
      const cards = []
      // 過濾出此活動id & 當前選擇土地種類的pool
      const currentTypeNftPool = this.boxNftPool.filter(pool => pool.bboxId === this.boxId && pool.type === NonFungibleTokenPoolType[pool.info.type])
      currentTypeNftPool.forEach(pool => {
        const grade = pool.info.grade
        if (!cards.includes(grade)) {
          cards.push(grade)
        }
      })

      return cards
    }
  },
  created() {
    const boxId = Number(this.$route.params.id);
    this.boxId = boxId
    // this.type = this.typeTransform(boxId);
    // this.tabs = [this.type];
  },
  methods: {
    // 將土地種類id轉換為名稱
    typeTransform: (num) => {
      const type = Object.keys(NonFungibleTokenPoolType).find(key => NonFungibleTokenPoolType[key] === num)

      if (type) {
        return type.toLowerCase()
      }
    },

    // 頁籤被點按
    tabClick(active, value) {
      // active tab頁籤 index 改為點案的index
      this.active = active
      // 內容顯示中的土地種類改為
      this.currentActiveType = value
    }
  },
};
</script>

<style lang="scss" scoped>
#cards-box {
  width: 100%;
  height: 100%;
  // margin: 60px auto 100px auto;
  position: relative;
}

.content-frame {
  width: 100%;
  height: 100%;

  padding: 34px 10px 34px 10px;

  background-image: url("/static/ui/mystery_boxes/cards-box-bg.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.content-frame__inline {
  width: 100%;
  display: flex;
  text-align: left;
}

.null-card {
  visibility: hidden;
}

.tab-frame {
  display: flex;
  position: absolute;
  top: -59px;
  left: 5px;
}

.transtorm.inactive {
  position: relative;
  transform: translateX(100px);
}

.tab-2,
.tab-3,
.tab-4 {
  display: none;
}

.tab,
.tab-2,
.tab-3,
.tab-4 {
  &.theme--light.v-btn.v-btn--has-bg {
    width: 182px;
    height: 64px;
    // padding: 18px 66px;
    position: relative;
    cursor: pointer;
    border: none;

    background-image: url("/static/ui/mystery_boxes/tab-box-inactive.png");
    background-repeat: no-repeat;
    background-size: 100% auto;

    &.active {
      background-image: url("/static/ui/mystery_boxes/tab-box-active.png");

      /deep/ .v-btn__content {
        color: #ffffff;
      }
    }

    /deep/ .v-btn__content {
      font-style: normal;
      font-weight: 600;
      font-size: 20px;
      line-height: 28px;

      /* identical to box height */
      letter-spacing: -0.152942px;

      color: rgba(255, 255, 255, 0.5);
    }
  }
}

/deep/ .v-btn::before {
  background: none;
}

@media screen and (max-width: 1264px) {
  .tab,
  .tab-3,
  .tab-4 {
    display: none;
  }

  .tab-frame {
    top: -52px;
  }

  .tab-2 {
    display: block;

    &.theme--light.v-btn.v-btn--has-bg {
      width: 161px;
      height: 64px;
    }
  }
}

@media screen and (max-width: 825px) {
  .null-card {
    display: none !important;
  }
}

@media screen and (max-width: 960px) {
  .tab,
  .tab-2,
  .tab-4 {
    display: none;
  }

  .tab-frame {
    top: -25px;
  }

  .tab-3 {
    display: block;

    &.theme--light.v-btn.v-btn--has-bg {
      width: 100px;
      height: 32px;

      /deep/ .v-btn__content {
        font-size: 15px;
        line-height: 17px;

        /* identical to box height */
        letter-spacing: -0.152942px;
      }
    }
  }
}

@media screen and (max-width: 600px) {
  .tab,
  .tab-3,
  .tab-2,
  .null-card {
    display: none !important;
  }

  .content-frame {
    padding: 34px 10px 34px 10px;
    background-image: url("/static/ui/mystery_boxes/mobile-cards-box-bg.png");
  }

  .tab-frame {
    top: -21px;
  }

  .null-card {
    display: none;
  }

  .tab-4 {
    display: block;
    &.theme--light.v-btn.v-btn--has-bg {
      width: 80px;
      height: 32px;
      margin-left: 10px;

      /deep/ .v-btn__content {
        font-size: 12px;
        line-height: 17px;

        /* identical to box height */
        letter-spacing: -0.152942px;
      }
    }
  }

  #mystery-card {
    width: 90% !important;
    height: 414px !important;
  }
}
</style>
