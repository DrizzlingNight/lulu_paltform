<template>
  <div id="open-success-frame">
    <v-overlay :value="overlay" opacity="0.85" @click="overlay = false">
      <v-progress-circular
        v-if="isLoading"
        indeterminate
        size="64"
        class="loading"
      />
      <div v-if="!isLoading" class="overlay-content">
        <div class="title">{{ $t("blindBox.congratulation_title") }}</div>
        <div class="look-tip">{{ $t("blindBox.congratulation_tip") }}</div>

        <div
          class="card-item"
          v-for="(count, key, index) in cardsClass"
          :key="index"
        >
          <span>{{ key }} {{ $t("blindBox.land") }}NFT x {{ count }}</span>
        </div>

        <div class="card-list-frame d-flex justify-center">
          <div class="consten-frame__inline d-flex flex-wrap">
            <v-row v-if="datas.length < 4" justify="center" align-content="center" align="center">
              <v-col
                v-for="(item, index) in datas"
                :key="index"
                align-self="center"
                cols="auto"
              >
                <mystery-card
                  class="cards my-1"
                  :level="levelTransform(item.level)"
                  :type="typeTransform(item.type)"
                  :isMint="true"
                />
              </v-col>
            </v-row>
            <v-row v-else justify="center" align-content="start" align="start">
              <v-col
                v-for="(item, index) in datas"
                :key="index"
                align-self="start"
                cols="auto"
              >
                <mystery-card
                  class="cards my-1"
                  :level="levelTransform(item.level)"
                  :type="typeTransform(item.type)"
                  :isMint="true"
                />
              </v-col>
              <div style="height: 0.1px; width: 297px" />
              <div style="height: 0.1px; width: 297px" />
              <div style="height: 0.1px; width: 297px" />
            </v-row>
            <!-- <div
              v-for="(item, index) in datas"
              :key="index"
              class="mb-10 mx-1 d-flex flex-grow-1 justify-center"
            >
              <mystery-card
                :id="item.id"
                :level="levelTransform(item.level)"
                :type="typeTransform(item.type)"
                class="card-frame-box"
              />
            </div> -->
          </div>
        </div>
        <div class="btn-box">
          <v-btn @click.stop="overlay = false">{{
            $t("blindBox.continue")
          }}</v-btn>
        </div>
      </div>
    </v-overlay>
  </div>
</template>

<script>
import MysteryCard from "/imports/ui/components/mysteryCard/MysteryCard.vue";
import {
  NonFungibleTokenPoolLevel,
  NonFungibleTokenPoolType,
} from "/imports/api/nft/collections";
export default {
  components: {
    MysteryCard,
  },
  filters: {
    LevelTransform(num) {
      return this.levelTransform(num);
    },
  },
  computed: {
    cardsClass() {
      const info = {};

      this.datas.forEach((element) => {
        const level = this.levelTransform(element.level);

        if (info[level]) {
          info[level]++;
        } else {
          info[level] = 1;
        }
      });
      return info;
    },
  },
  props: {
    datas: {
      type: Array,
      default: () => {
        return [];
      },
    },
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isLoading: false,
      overlay: false,
    };
  },
  watch: {
    show: {
      immediate: true,
      handler(val) {
        this.overlay = val;
      },
    },
    overlay: {
      immediate: true,
      handler(val) {
        if (!val) {
          this.$emit("closed");
        }
      },
    },
  },
  created() {
    // this.getOpenCards();
  },
  methods: {
    typeTransform: (num) => {
      const type = Object.keys(NonFungibleTokenPoolType).find(key => NonFungibleTokenPoolType[key] === num)

      if (type) {
        return type.toLowerCase()
      }
    },
    levelTransform: (num) => {
      return Object.keys(NonFungibleTokenPoolLevel).find(key => NonFungibleTokenPoolLevel[key] === num)
    },
    reMint() {
      this.$emit("closed");
      this.$emit("doReMint");
    },
  },
};
</script>

<style lang="scss" scoped>
#open-success-frame {
  z-index: 22 !important;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;

  width: 100%;
  height: 100%;
}

/deep/ .v-overlay {
  z-index: 20 !important;
  width: 100vw;
  height: 100%;
}

/deep/ .v-overlay__content {
  z-index: 22;
  width: 100vw;
  height: 100%;
}

.overlay-content {
  overflow-y: scroll;
  padding: 100px 140px;
  height: 100%;
  width: 100%;
  margin: 0 auto;
  z-index: 22 !important;
}

.title {
  font-size: 48px !important;
  line-height: 67px !important;
  padding-bottom: 4px;
}

.look-tip {
  padding: 20px 0;
}

.card-item {
  color: #f7cd0a;
  padding: 5px 0;
}

.card-list-frame {
  padding-top: 60px;
}

.btn-box /deep/ .v-btn {
  z-index: 50 !important;
  width: 500px;
  height: 64px;
  margin-top: 68px;

  background: linear-gradient(268.14deg, #ffd12f 14.27%, #ff8e00 91.59%);

  /* 投影 */
  box-shadow: 0px 5px 8px rgba(0, 20, 15, 0.5);
  border-radius: 8px;

  .v-btn__content {
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 20px;

    /* identical to box height, or 125% */
    text-align: center;
    letter-spacing: -0.376471px;

    /* 文字-普通 */
    color: #ffffff;
  }
}

.consten-frame__inline {
  max-width: 1200px;
}

@media screen and (max-width: 1264px) {
  .overlay-content {
    padding: 100px 160px;
  }
}

@media screen and (max-width: 960px) {
  .overlay-content {
    padding: 100px 120px;
  }
}

@media screen and (max-width: 600px) {
  .overlay-content {
    padding: 100px 10px;
  }

  .card-list-frame {
    padding-top: 20px;
  }

  .title {
    font-size: 24px !important;
    line-height: 34px !important;
  }

  .look-tip {
    font-size: 12px;
    line-height: 20px;
    padding: 10px 0 4px 0;
  }

  .card-item {
    font-size: 14px;
    line-height: 20px;
    padding: 4px 0;
  }

  .btn-box /deep/ .v-btn {
    width: 158px;
    height: 28px;
    margin-top: 48px !important;

    .v-btn__content {
      font-size: 12px;
      line-height: 20px;

      /* identical to box height, or 125% */
      text-align: center;
      letter-spacing: -0.376471px;

      /* 文字-普通 */
      color: #ffffff;
    }
  }
}
</style>
