<template>
  <div class="pledge-NFT-wrapper" v-resize="onResize">
    <div class="left-bg"></div>
    <div class="right-bg"></div>
    <div class="pledge-NFT-title d-flex flex-grow-1 justify-center">
      {{ $t("pledge.pledgeNFT.title") }}
    </div>
    <div
      class="pledge-NFT-content d-flex flex-grow-1 justify-center mt-4 mb-10"
    >
      <div class="d-flex">
        <div>{{ $t("pledge.pledgeNFT.powerall") }}：</div>
        <div>{{ totalPower }}</div>
      </div>
      <div class="d-flex ml-13">
        <div>{{ $t("pledge.pledgeNFT.promote") }}：</div>
        <div>{{(Decimal(stakeInfo.hashrateGrowth || 0)).times(100).toFixed(2).toString()}}%</div>
      </div>
    </div>
    <v-container class="cards-frame">
      <v-row
        justify="space-around"
        align-content="center"
        align="center"
        no-gutters
      >
        <v-col
          v-for="(item, index) in checkDatas"
          class="mb-5"
          :key="index"
          align-self="center"
          cols="auto"
        >
          <div class="click-cards">
            <pledge-card v-if="item._id" :info="item" @update="updateInfo" @change="openChoicePledge"/>
            <btn-card
              v-else
              @openShow="openChoicePledge"
            />
          </div>
        </v-col>
        <v-col
          v-for="index in 4"
          :key="`null-${index}`"
          align-self="center"
          cols="auto"
        >
          <div class="null-card"></div>
        </v-col>
      </v-row>
    </v-container>
    <ChoicePledge
        active-class="pledg-dialog-class"
        :show="showPledge"
        :title="$t('pledge.pledgeNFT.choice')"
        width="730px"
        @closeDialog="showPledge = false"
        @stakeSuccess="updateInfo"
        :pledgeLists="pledgeLists"
        @update="getMyCanStakeLand"
        :count.sync="count"
        :changeLandId="changeLandId"
    >
    </ChoicePledge>
  </div>
</template>

<script>
import { Decimal } from 'meteor/mongo-decimal';
import PledgeCard from "./components/PledgeCard.vue";
import BtnCard from "./components/BtnCard.vue";
import ChoicePledge from "./components/ChoicePledge";
import MysteryCard from "../../../../components/mysteryCard/MysteryCard";

export default {
  name: "PledgeNFT",
  props:['stakeInfo'],
  components: {
    PledgeCard,
    BtnCard,
    ChoicePledge,
    MysteryCard
  },
  data() {
    return {
      Decimal,
      show: false,
      width: 100,
      height: 200,
      rowLen: 2,
      colLen: 4,
      dataLists: [],
      pledgeLists: [],
      count: 0,
      showPledge: false,
      active:-1,
      changeLandId:null,
    };
  },
  computed: {
    totalPower() {
      let res = 0
      if (this.dataLists.length){
        this.dataLists.forEach(
            p=>{res = p.info.nftPool.info.power + res}
        )
      }
      return res
    },
    checkDatas() {
      if (this.dataLists.length < this.rowLen * this.colLen) {
        const counts = this.rowLen * this.colLen - this.dataLists.length;

        const data = [...this.dataLists];

        for (let i = 0; i < counts; i++) {
          data.push({});
        }
        return data;
      }
      return this.dataLists;
    },
  },
  created() {
    this.getPledgeLists();
  },
  methods: {
    onResize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
    },
    // ? 取得質押資料
    getPledgeLists() {
      Meteor.call("getMyStakedLand", {}, (err, res) => {
        if (err) {
          console.log("Error", err);
        } else {
          // console.log("Success:", res);
          this.dataLists = res.list;
        }
      });
    },
    // ? 取得可以質押之資料
    openChoicePledge(landId){
      this.changeLandId = landId
      this.showPledge = true;
      this.getMyCanStakeLand()
    },
    getMyCanStakeLand(skip) {
      this.pledgeLists = [];

      Meteor.call("getMyCanStakeLand", {offset:skip}, (err, res) => {
        if (!err) {
          this.pledgeLists = res.list;
          this.count = res.count;
        }
      });
    },
    updateInfo(){
      this.getPledgeLists()
      this.$emit("updateInfo")
    }
  },
};
</script>

<style lang="scss" scoped>
@import "./../../../../assets/css/utils/variables.scss";

.pledge-NFT-wrapper {
  position: relative;
  background: linear-gradient(136.3deg, #06261f 2.34%, #08322d 98.54%);
  padding: 85px 216px 120px 216px;
}

.left-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 687px;
  height: 687px;
  background: #034f3c;
  filter: blur(300px);
  z-index: 0;
}

.right-bg {
  position: absolute;
  bottom: 63px;
  right: 90px;
  width: 425px;
  height: 425px;
  background: rgba(173, 0, 255, 0.3);
  filter: blur(300px);
  z-index: 0;
}

.pledge-NFT-title {
  font-weight: 600;
  font-size: 36px;
  color: #ffffff;

  text-shadow: 0px 5px 8px rgba(0, 20, 15, 0.5);
}

.cards-frame {
  max-width: 1200px;

  &.container {
    padding: 0 !important;
  }
}

.pledge-NFT-content div {
  font-weight: 600;
  font-size: 18px;
  color: #95c6b7;
}

.null-card {
  height: 1px;
  width: 270px;
}

@media screen and (max-width: 1264px) {
  .pledge-NFT-wrapper {
    padding: 85px 160px 120px 160px;
  }
}

@media screen and (max-width: 960px) {
  .pledge-NFT-wrapper {
    padding: 85px 120px 120px 120px;
  }
}

@media screen and (max-width: 600px) {
  .pledge-NFT-wrapper {
    padding: 40px 10px 40px 10px;
  }

  .pledge-NFT-title {
    font-size: 18px;
  }

  .left-bg {
    position: absolute;
    top: 51px;
    left: 4px;
    width: 115px;
    height: 114px;
    background: #034f3c;
    filter: blur(80px);
  }

  .right-bg {
    position: absolute;
    top: 1058px;
    right: -27px;
    width: 115px;
    height: 114px;
    background: #034f3c;
    filter: blur(80px);
  }

  .pledge-NFT-content div {
    font-size: 12px;
    color: #95c6b7;
  }

  .v-application .ml-13 {
    margin-left: 40px !important;
  }

  .v-application .mb-10 {
    margin-bottom: 17px !important;
  }

  .v-application .mt-4 {
    margin-top: 9px !important;
  }

  .null-card {
    height: 1px;
    width: 150px;
  }
}
</style>
