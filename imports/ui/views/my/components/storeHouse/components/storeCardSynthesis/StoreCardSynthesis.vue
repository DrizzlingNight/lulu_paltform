<template>
  <v-card class="storeSynthesis_card">
    <div class="cardDiv">
      <img @click="closeDialog" :src="'/static/ui/assets/img/cross-white.png'">
      <p>{{ $t("my.storehouse.synthesisTitle") }}</p>
      <div class="cardSynthesis d-flex flex-column">
        <div class="d-flex align-center justify-space-between cardSynthesis_div">
          <div class="divImg">
            <v-img class="img1" :src="img"></v-img>
            <div class="div1">{{ cardDetail.number }}</div>
          </div>
          <div class="backIconDiv">
            <v-img class="backIcon" :src="'/static/ui/my/backIcon.png'"></v-img>
          </div>
          <div class="divImg">
            <v-img class="img2" :src="imgTotal"></v-img>
            <div class="div2">{{ numConvert }}</div>
          </div>
        </div>
        <p class="synthesis_text">{{ $t("my.storehouse.every") }} <span>{{ cardDetail.info.name[$i18n.locale] }}*{{
            cardDetail.info.numConvert

          }} </span>{{ $t("my.storehouse.CanText") }} <span>{{ $t(`my.storehouse.${cardDetail.articleId}`) }}*{{
            1
          }}</span>
        </p>
      </div>
      <div class="d-flex justify-center clickBtnDiv" style="margin-top: 3px;mar">
        <v-btn @click="makeArticle" elevation="0" color="white" :disabled="isBtn" height="46" width="91"
               class="clickBtn">
          {{ $t("my.storehouse.clickBtn") }}
        </v-btn>
      </div>
    </div>
  </v-card>
</template>

<script>
export default {
  name: "StoreCardSynthesis",
  props: ["cardDetail"],
  data: () => ({}),
  computed: {
    isBtn() {
      if (this.numConvert <= 0) {
        return true
      }
    },
    img() {
      return '/static/ui/store/' + this.cardDetail.info.type + '_' + this.cardDetail.info._id + '.png'
    },
    imgTotal() {
      if (this.cardDetail) {
        if (this.cardDetail.articleId === 1030001) {
          return '/static/ui/store/seed_1010001.png'
        } else if (this.cardDetail.articleId === 1030002) {
          return '/static/ui/store/goods_1000001.png'
        }
      } else return ''

    },
    numConvert() {
      return Math.floor(this.cardDetail.number / this.cardDetail.info.numConvert)
    }
  },
  methods: {
    closeDialog() {
      this.$emit("closeSynthesisDialog")
    },
    //合成碎片
    makeArticle() {
      Meteor.call("makeArticle", this.cardDetail.articleId, (err, res) => {
        if (err) {
          this.$toast.error(this.$t("my.storehouse.errorText"))
        } else {
          this.toasterSuccess(this.$t("my.storehouse.successText"))
          this.$emit("makeArticleSuccess")
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.storeSynthesis_card {
  margin: 0 auto;
  max-width: 544px;
  height: 402px;
  background: linear-gradient(142.1deg, #727272 -41.15%, #CACACA 94.16%);
  border: 1px solid #071816;
  box-sizing: border-box;
  border-radius: 10px;
  padding: 16px;

  .cardDiv {
    position: relative;
    height: 100%;
    border: 2px solid #FFFFFF;
    box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.31);
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.5);


    img {
      position: absolute;
      top: 25px;
      right: 25px;
      cursor: pointer;
    }

    > p {
      text-align: center;
      color: #000000;
      font-size: 24px;
      font-weight: bold;
      font-size: 24px;
      line-height: 34px;
      margin-top: 26px;
      margin-bottom: 0px;
    }

    .cardSynthesis {
      height: 216px;
      position: relative;
      margin-left: 59px;
      margin-right: 59px;
      margin-top: 16px;
      background: url("/static/ui/my/storeBackImg.png");
      background-repeat: no-repeat;
      background-size: contain;


      .backIcon {
        left: -25px;
        width: 68px;
      }

      .divImg {
        width: 100%;
        height: 180px;
        position: relative;
        color: white;


        .img1 {
          position: relative;
          top: -10px;
          left: -17px;
        }

        .img2 {
          position: relative;
          left: 20px;
        }

        .div1 {
          width: 42px;
          height: 42px;
          background: linear-gradient(136.3deg, #06261F 2.34%, #08322D 98.54%);
          border-radius: 50%;
          position: absolute;
          bottom: 15px;
          left: 0px;
          text-align: center;
          line-height: 42px;
        }

        .div2 {
          width: 42px;
          height: 42px;
          background: linear-gradient(142.1deg, #007254 -41.15%, #16C9A2 94.16%);
          border-radius: 50%;
          position: absolute;
          bottom: 20px;
          left: 30px;
          text-align: center;
          line-height: 42px;
        }
      }


      p {
        text-align: center;
        color: #00322E;
        font-size: 16px;

        span {
          font-weight: bold;
          line-height: 22px;
        }
      }
    }
  }

  .clickBtn {
    background: linear-gradient(170.64deg, #FFB030 14.15%, #FF8000 85.1%);
    border-radius: 8px;
    min-width: 50px;
  }

  .clickBtn.v-btn--disabled {
    background: linear-gradient(142.1deg, #727272 -41.15%, #CACACA 94.16%);;
    color: white !important;
  }
}

@media screen and (max-width: 600px) {
  .storeSynthesis_card {
    max-width: 300px;
    height: 222px;
    padding: 8px;

    .cardDiv {
      img {
        top: 15px;
        right: 13px;
        width: 15px;
      }

      > p {
        font-size: 18px;
        line-height: 25px;
        margin-top: 15px;
        margin-bottom: 0px;
      }

      .cardSynthesis {
        height: auto;
        margin-top: 3px;
        margin-left: 31px;
        margin-right: 32px;

        .backIconDiv {
          .backIcon {
            left: -15px;
            width: 38px;
          }
        }

        .divImg {
          width: 100px;
          height: 100px;
          position: relative;
          color: white;

          .img1 {
            top: -5px;
            left: -8px;
          }

          .img2 {
            position: relative;
            left: 0px;
          }

          .div1 {
            width: 24px;
            height: 24px;
            line-height: 25px;
          }

          .div2 {
            width: 24px;
            height: 24px;
            line-height: 25px;
            left: 5px;
            bottom: 13px;

          }
        }

        .synthesis_text {
          font-size: 12px;
          letter-spacing: -0.338823px;
          margin-bottom: 0px;
          line-height: 17px;
          position: relative;
          top: -2px;
        }
      }
    }
  }
  .clickBtnDiv{
    margin-top:0px !important;
  }
  .clickBtn {
    width: 50px !important;
    height: 25px !important;
    border-radius: 8px;
    ::v-deep span {
      font-size: 12px !important;
    }

  }
}
</style>