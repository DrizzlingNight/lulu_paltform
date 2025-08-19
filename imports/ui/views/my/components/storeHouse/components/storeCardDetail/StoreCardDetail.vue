<template>
  <v-card
      class="storeDetail_card"
      :class="(activeClass === 0 || activeClass === 2) ? 'goods':activeClass === 1 ?'seed':activeClass === 3? 'fragment':'key'">
    <div class="cardDiv">
      <img @click="closeDialog" :src="'/static/ui/assets/img/cross-white.png'">
      <p>{{ $t("my.storehouse.detailTitle") }}</p>
      <div class="cardDetail d-flex">
        <div>
          <v-img width="200px" height="200px" class="ma-auto img" :src="img"></v-img>
        </div>
        <div class="d-flex flex-column">
          <p class="rightTitle">{{ cardDetail.info.name[$i18n.locale] }}</p>
          <p class="rightText">{{ $t("my.storehouse.owned") }}{{ cardDetail.number }}</p>
          <div class="describe">{{ cardDetail.info.des[$i18n.locale] }}
          </div>
        </div>
      </div>
      <div class="describe">{{ cardDetail.info.des[$i18n.locale] }}</div>
    </div>
  </v-card>
</template>

<script>
export default {
  name: "StoreCardDetail",
  props: ["cardDetail"],
  computed: {
    img() {
      return '/static/ui/store/' + this.cardDetail.info.type + '_' + this.cardDetail.info._id + '.png'
    },
    activeClass() {
      if (this.cardDetail.articleId === 1000001) {
        return 0
      } else if (this.cardDetail.articleId === 1010001) {
        return 1
      } else if (this.cardDetail.articleId === 1020001) {
        return 2
      } else if (this.cardDetail.articleId === 1030001 || this.cardDetail.articleId === 1030002) {
        return 3
      } else if (this.cardDetail.articleId === 1090001) {
        return 4
      }
    }
  },
  methods: {
    closeDialog() {
      this.$emit("closeDetailDialog")
    }
  }
}
</script>

<style scoped lang="scss">
.storeDetail_card {
  width: 466px;
  height: 325px;
  background: linear-gradient(170.64deg, #FFB030 14.15%, #FF8000 85.1%);
  border: 1px solid #071816;
  box-sizing: border-box;
  border-radius: 10px;
  padding: 14px;
  margin: 0 auto;
  &.fragment {
    background: linear-gradient(142.1deg, #727272 -41.15%, #CACACA 94.16%);
  }

  &.seed {
    background: linear-gradient(170.64deg, #10F58D 14.15%, #007254 85.1%);
  }

  &.goods {
    background: linear-gradient(170.64deg, #FFB030 14.15%, #FF8000 85.1%);
  }

  &.key {
    background: linear-gradient(170.64deg, #CC33E6 14.15%, #6725A9 85.1%);
  }
  .cardDiv {
    position: relative;
    height: 100%;
    border: 2px solid #FFFFFF;
    box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.31);
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.5);


    img {
      position: absolute;
      top: 16px;
      right: 15px;
      cursor: pointer;
    }

    > p {
      text-align: center;
      color: #000000;
      font-size: 24px;
      font-weight: bold;
      font-size: 24px;
      line-height: 34px;
      margin-top: 32px;
      margin-bottom: 0px;
    }

    .cardDetail {
      margin-left: 50px;
      margin-right: 50px;
      //height: 185px;
      background: url("/static/ui/my/storeBackImg.png");
      background-size: contain;
      background-repeat: no-repeat;

      div:nth-child(1) {
        width: 50%;
        margin-right: 14px;

        .img {
          position: relative;
          left: -15px;
        }
      }

      div:nth-child(2) {
        width: 50%;
        margin-top: 30px;

        p {
          margin-bottom: 0px;
        }

        .rightTitle {
          font-weight: 600;
          font-size: 24px;
          line-height: 34px;
          color: #00322E;
        }

        .rightText {
          color: #00322E;
          font-size: 16px;
          line-height: 22px;
          margin-top: 8px;
          margin-bottom: 19px;
        }

        .describe {
          display: block;
          max-width: 100%;
          max-height: 70px;
          font-size: 12px;
          line-height: 17px;
          color: #00322E;
          overflow: hidden;
        }
      }
    }

    .describe {
      display: none;
    }
  }

}

@media screen and (max-width: 600px) {
  .storeDetail_card {
    width: 300px;
    padding: 11px 9px;
    height: auto;
    .cardDiv {
      padding-bottom: 15px;
      img {
        top: 8px;
        right: 10px;
        width: 15px;
      }

      > p {
        font-size: 18px;
        line-height: 25px;
        margin-top: 15px;
        margin-bottom: 0px;
      }

      .cardDetail {
        margin-right: 32px;
        margin-left: 32px;

        div:nth-child(1) {
          margin-right: 14px;

          .img {
            width: 119px !important;
            height: 119px !important;
            background-size: contain;
            background-position: center;
            position: relative;
            left: -15px;
          }
        }

        div:nth-child(2) {
          margin-top: 48px;

          p {
            margin-bottom: 0px;
          }

          .rightTitle {
            font-size: 16px;
            line-height: 22px;
          }

          .rightText {
            font-size: 12px;
            line-height: 17px;
            margin-top: 4px;
          }

          .describe {
            display: none;
          }
        }
      }

      .describe {
        display: block;
        padding-left: 27px;
        padding-right: 27px;
      }
    }
  }
}
</style>