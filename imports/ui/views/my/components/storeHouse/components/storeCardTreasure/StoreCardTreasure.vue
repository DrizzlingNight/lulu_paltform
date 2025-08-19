<template>
  <v-card
      class="storeTreasure_card">
      <div class="cardDiv">
        <img @click="closeDialog" :src="'/static/ui/assets/img/cross-white.png'">
        <p>{{ $t("my.storehouse.detailTitle") }}</p>
        <div class="cardTreasure d-flex">
          <div>
            <v-img class="ma-auto treasure_img" :src="'/static/ui/my/treasure.png'"></v-img>
          </div>
          <div class="d-flex flex-column">
            <p class="rightTitle">{{ $t("my.storehouse.cardName.grape") }}</p>
            <p class="rightText">{{ $t("my.storehouse.owned") }}{{ 1 }}</p>
            <div class="describe">{{
                '564df5aer4t98w4e164df5aer4t98w4e15rf3asd14f958as461fa3s2d1f9as587e4r564df5aer4t98w4e15rf3asd14f958as461fa3s2d1f9as587e4r564df5aer4t98w4e15rf3asd14f958as461fa3s2d1f9as587e4r564df5aer4t98w4e15rf3asd14f958as461fa3s2d1f9as587e4r564df5aer4t98w4e15rf3asd14f958as461fa3s2d1f9as587e4r564df5aer4t98w4e15rf3asd14f958as461fa3s2d1f9as587e4r564df5aer4t98w4e15rf3asd14f958as461fa3s2d1f9as587e4r564df5aer4t98w4e15rf3asd14f958as461fa3s2d1f9as587e4r564df5aer4t98w4e15rf3asd14f958as461fa3s2d1f9as587e4r564df5aer4t98w4e15rf3asd14f958as461fa3s2d1f9as587e4r564df5aer4t98w4e15rf3asd14f958as461fa3s2d1f9as587e4r55rf3asd14f958as461fa3s2d1f9as587e4r51as'
              }}
            </div>
          </div>
        </div>
        <div>
          <v-btn elevation="0"> {{ '开启' }}</v-btn>
        </div>
      </div>

  </v-card>
</template>

<script>
export default {
  name: "StoreCardTreasure",
  methods: {
    closeDialog() {
      this.$emit("closeDetailDialog")
    }
  }
}
</script>

<style scoped lang="scss">
.storeTreasure_card {
  width: 466px;
  height: 352px;
  background: linear-gradient(170.64deg, #CC33E6 14.15%, #6725A9 85.1%);
  border: 1px solid #071816;
  box-sizing: border-box;
  border-radius: 10px;
  padding: 14px;


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

      .cardTreasure {
        //margin-left: 50px;
        //margin-right: 50px;
        max-width: 337px;
        margin: 0 auto;
        margin-top: 16px;
        background: url("/static/ui/my/storeBackImg.png");
        background-repeat: no-repeat;
        //background-size: contain;

        div:nth-child(1) {
          width: 50%;
          width: 126px;
          height: 126px;
          margin-right: 47px;
          margin-top: 9px;
          margin-left: 5px;
        }

        div:nth-child(2) {
          width: 50%;
          margin-top: 8px;

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
            max-width: 100%;
            max-height: 34px;
            font-size: 12px;
            line-height: 17px;
            color: #00322E;
            overflow: hidden;
          }
        }
      }
    }



}

</style>