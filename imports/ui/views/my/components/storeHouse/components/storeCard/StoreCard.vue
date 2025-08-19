<template>
  <v-card
      class="store_card"
      :class="(activeClass === 0 || activeClass === 2) ? 'goods':activeClass === 1 ?'seed':activeClass === 3? 'fragment':'key'">
    <div class="cardDiv">
      <div class="div-bg">
        <v-img
            :src="img"
            class="img"
        >
        </v-img>
      </div>
      <div class="cardDetail">
        <p>{{ data.info.name[$i18n.locale] }}</p>
        <p>{{ $t("my.storehouse.owned") }}{{ data.number }}</p>
      </div>
    </div>
  </v-card>
</template>

<script>
export default {
  name: "StoreCard",
  props: ["data"],
  data: () => ({}),
  computed: {
    img() {
      return '/static/ui/store/' + this.data.info.type + '_' + this.data.info._id + '.png'
    },
    activeClass() {
      if (this.data.articleId === 1000001) {
        return 0
      } else if (this.data.articleId === 1010001) {
        return 1
      } else if (this.data.articleId === 1020001) {
        return 2
      } else if (this.data.articleId === 1030001 || this.data.articleId === 1030002) {
        return 3
      } else if (this.data.articleId === 1090001) {
        return 4
      }
    }
  }
}
</script>

<style scoped lang="scss">
.store_card {
  //position: relative;
  width: 206px;
  height: 206px;
  border-radius: 10px;
  padding: 10px 9px 9px 10px;

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
    //position: relative;
    border: 2px solid #FFFFFF;
    height: 100%;
    box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.31);
    border-radius: 10px;

    .div-bg {
      background: rgba(255, 255, 255, 0.5);

      .img {
        height: 139px;
        width: 130px;
        margin: 0 auto;
        //position: absolute;
        //top: 0px;
        //bottom: 47px;
        //left: 0px;
        //right: 0px;
      }
    }

  }

  .cardDetail {
    background: linear-gradient(136.3deg, #06261F 2.34%, #08322D 98.54%);
    height: 45px;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;

    p:nth-child(1) {
      padding-top: 4px;
      color: white;
      line-height: 22px;
      text-align: center;
      font-weight: 600;
      font-size: 16px;
      margin-bottom: 0px;
    }

    p:nth-child(2) {
      color: #95C6B7;
      font-size: 12px;
      line-height: 17px;
      margin-bottom: 0px;
      text-align: center;
    }
  }

}
</style>