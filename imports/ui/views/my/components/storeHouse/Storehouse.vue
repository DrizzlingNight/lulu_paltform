<template>
  <div class="Storehouse">
    <div class="title">
      <p class="thing_title">{{ $t('my.storehouse.title') }}</p>
      <p class="thing_text">{{ $t('my.storehouse.text') }}</p>
    </div>
    <div class="table">
      <v-tabs v-model="tab" background-color="bgColor" active-class="activeTab" color="#37F4FF" class="tabs">
        <v-tab class="tab" v-for="item in items" active-class="activeTab" :key="item.id">
          {{ $t(`my.storehouse.${item}`) }}
        </v-tab>
      </v-tabs>
      <div v-if="data[0]" class="content-card">
        <div class="content-frame__inline d-flex flex-wrap justify-start">
          <div v-for="(item, index) in data"
               :key="index"
               class="mystery-card d-flex"
               @click="choiceCard(item)"
          >
            <store-card
                :data="item"
            ></store-card>
          </div>
        </div>
      </div>
      <default-page :statusCode="2" v-else></default-page>
    </div>
    <!--    <div class="pagination text-center">-->
    <!--      <v-pagination-->
    <!--          v-model="page"-->
    <!--          :length="length"-->
    <!--          color="#F7CD0A"-->
    <!--      ></v-pagination>-->
    <!--    </div>-->
    <v-dialog v-model="storeDetailDialog" @click:outside="storeDetailDialog = false"
              max-width="466">
      <store-card-detail v-if="tab === 0" :cardDetail="cardDetail"
                         @closeDetailDialog="closeDetailDialog"></store-card-detail>
      <store-card-treasure v-if="tab === 2" :cardDetail="cardDetail"
                           @closeDetailDialog="closeDetailDialog"></store-card-treasure>
    </v-dialog>
    <v-dialog max-width="544" v-model="storeSynthesisDialog" @click:outside="storeSynthesisDialog = false"
              >
      <store-card-synthesis :cardDetail="cardDetail"
                            @closeSynthesisDialog="closeSynthesisDialog"
                            @makeArticleSuccess="makeArticleSuccess"></store-card-synthesis>
    </v-dialog>
  </div>

</template>

<script>
import StoreCard from "./components/storeCard/StoreCard";
import StoreCardDetail from "./components/storeCardDetail/StoreCardDetail";
import StoreCardSynthesis from "./components/storeCardSynthesis/StoreCardSynthesis";
import StoreCardTreasure from "./components/storeCardTreasure/StoreCardTreasure";
import {log} from "winston";
import DefaultPage from "/imports/ui/components/defaultPage/DefaultPage";
// import {ArticalType} from "/imports/api/games/article/collections"
export default {
  name: "Storehouse",
  components: {DefaultPage, StoreCardTreasure, StoreCardSynthesis, StoreCardDetail, StoreCard},
  data: () => ({
    tab: "",
    items: ["finished", "fragment"],
    page: 1,
    length: 1,
    storeDetailDialog: false,
    storeSynthesisDialog: false,
    cardDetail: "",
    data: [],
  }),
  computed: {},
  watch: {
    tab() {
      this.getArticles()
    }
  },
  methods: {
    getArticles() {
      let type
      if (this.tab === 0) {
        type = ['goods', "seed", "fruit"]
      } else if (this.tab === 1) {
        type = ['fragment']
      }
      Meteor.call('getArticles', type, (err, res) => {
        if (err) {
          console.log(err)
        } else {
          this.data = res

        }
      })
    },
    choiceCard(item) {
      this.cardDetail = item
      if (this.tab === 0 || this.tab === 2) {
        this.storeDetailDialog = true
      } else {
        this.storeSynthesisDialog = true
      }
    },
    //碎片合成成功
    makeArticleSuccess() {
      this.storeSynthesisDialog = false
      this.getArticles()
    },
    //关闭弹窗
    closeDetailDialog() {
      this.storeDetailDialog = false
    },
    closeSynthesisDialog() {
      this.storeSynthesisDialog = false
    }
  }
}
</script>

<style scoped lang="scss">

@import '/imports/ui/scss/theme';

.Storehouse {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: $commonBackground3;
  padding-top: 0px;
  padding-left: 80px;
  padding-bottom: 100px;

  .title {
    margin-top: 55px;
    width: 62.5vw;

    .thing_title {
      font-weight: 600;
      font-size: 24px;
      line-height: 34px;
      margin-bottom: 7px;
      color: #FFFFFF;
    }

    .thing_text {
      font-style: normal;
      font-weight: normal;
      font-size: 16px;
      line-height: 22px;
      color: #44675F;
    }
  }

  .table {
    min-height: 65vh;
    width: 62.5vw;

    .tabs {
      .activeTab.tab {
        color: $mainLightColor;
      }

      .tab {
        color: $mainLightColor;
        min-width: auto;
        margin-right: 26px;
        font-size: 16px !important;
        width: auto !important;
        padding: 0px !important;
        font-weight: normal !important;

        &:hover {
          background-color: transparent !important;
        }
      }
    }

    .content-card {
      .content-frame__inline {
        .mystery-card {
          margin-top: 20px;
          padding: 0;
          margin-right: 42px;
          justify-content: start;
        }
      }
    }

    /deep/ .default-page {
      margin-top: 10vh;

    }
  }

  .pagination {
    width: 62.5vw;
    margin-top: 60px;
  }
}
/deep/ .v-dialog{
   box-shadow: 0 0px 0px transparent !important;
 }

@media screen and (max-width: 960px) {
  .Storehouse {
    width: 100vw;

    .title {
      margin-top: 14px;
      width: 100vw;

      .thing_title {
        font-size: 18px;
        line-height: 25px;
        height: 25px;
        margin-bottom: 3px;
      }

      .thing_text {
        font-size: 12px;
        line-height: 17px;
        height: 17px;
        margin-bottom: 0px;
      }
    }

    .table {
      width: 100vw;

      .content-card {
        display: flex;

        .content-frame__inline {
          .mystery-card {
            justify-content: center;
          }
        }
      }
    }

  }
}

@media screen and (max-width: 600px) {
  .Storehouse {
    width: 100vw;
    padding-top: 14px;
    padding-left: 10px;
    padding-right: 10px;
    padding-bottom: 100px;

    .title {
      margin-top: 14px;
      width: 100vw;

      .thing_title {
        font-size: 18px;
        line-height: 25px;
        height: 25px;
        margin-bottom: 3px;
      }

      .thing_text {
        font-size: 12px;
        line-height: 17px;
        height: 17px;
        margin-bottom: 0px;
      }
    }

    .table {
      width: 100vw;

      .content-card {
        display: flex;
        justify-content: center !important;

        .content-frame__inline {
          .mystery-card {
            flex-grow: 1;
            justify-content: center;
          }
        }
      }
    }

    .storeSynthesisDialog {
      width: 300px !important;
    }
  }
}

</style>