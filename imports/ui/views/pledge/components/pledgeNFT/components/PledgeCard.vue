<template>
  <div id="pledge-NFT-card" @click="showPledge = true">
    <v-card class="pledge-NFT-card" :class="`card-frame__${info.info.nftPool.info.grade}`">
      <div class="inner-frame">
        <div class="land-id">{{info.state.idOnChain || ''}}</div>
        <div class="title-id">{{ info.id }}</div>
        <div class="d-flex flex-grow-1 justify-center">
          <div>
            <v-img
              contain
              :src="`/static/ui/components/card/${typeTransform(info.info.nftPool.info.type)}-${levelTransform(info.info.nftPool.info.level).toLowerCase()}.png`"
              class="card-image"
            />
          </div>
        </div>

        <div class="energe-frame mt-1">
          <div class="energe-frame__up"></div>
          <div
            class="energe-frame__down d-flex flex-column flex-grow-1 justify-center align-center"
          >
            <div
              :class="['level-box', `level-box__${info.info.nftPool.info.grade.toLowerCase()}`]"
            >
              <div class="level-inner-box">
                <v-img
                  contain
                  :src="`/static/ui/components/card/${info.info.nftPool.info.grade.toLowerCase()}.png`"
                  class="level-icon"
                />
              </div>
            </div>
            <div class="title-energy">{{ $t("pledge.pledgeNFT.power") }}</div>
            <div class="number">{{ info.info.nftPool.info.power.toLocaleString() }}</div>
          </div>
        </div>
      </div>
    </v-card>

    <div class="hover"></div>
    <PledgeDialog :show="showPledge" @closeDialog="showPledge = false"
                  @redeem="doRedeem" :loadingRedeem="loadingRedeem"
                  @change="doChange"/>
  </div>
</template>

<script>
import PledgeDialog from "./PledgeDialog.vue";
import {NonFungibleTokenPoolLevel, NonFungibleTokenPoolType} from "../../../../../../api/nft/collections";

export default {
  name: "PledgeCard",
  props: {
    info: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      showPledge: false,
      loadingRedeem: false,
      loadingChange: false,
    };
  },
  components: {
    PledgeDialog,
  },
  methods:{
    initData() {

    },
    doChange() {
      this.$emit("change", this.info._id)
      this.showPledge = false
    },
    doRedeem() {
      this.loadingRedeem = true
      Meteor.call("redeemMyNFT", this.info._id, (err, res) => {
        this.loadingRedeem = false
        if (err) {
          console.log("Error", err);
          this.toasterErr(this.$t("pledge.pledgeNFT.redeemFail"));
        } else {
          // console.log("Success:", res);
          this.showPledge = false
          this.$emit("update")
          this.toasterSuccess(this.$t("pledge.pledgeNFT.redeemSuccess"));
          this.$store.commit("pledge/UPDATE_PLEDGE");
        }
      });
    },
    typeTransform: (num) => {
      return NonFungibleTokenPoolType.getName(num).toLowerCase();
    },
    levelTransform: (num) => {
      return NonFungibleTokenPoolLevel.getName(num);
    },
  }
};
</script>

<style lang="scss" scoped>
@import "./../../../../../assets/css/utils/variables.scss";

#pledge-NFT-card {
  position: relative;
  cursor: pointer;
  border: 4px solid rgba(0, 0, 0, 0);
  border-radius: 10px;
}

#pledge-NFT-card:focus,
#pledge-NFT-card:hover {
  .hover {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.5);
    border: 4px solid #00ffca;

    /* 投影 */
    box-shadow: 0px 5px 8px 1px rgba(0, 20, 15, 0.5);
    border-radius: 10px;
    z-index: 100;
  }
}

.pledge-NFT-card {
  border-radius: 8px;
  border: 4px solid transparent;
}

.card-frame__SSS {
  background: linear-gradient(170.64deg, #e63368 14.15%, #a92545 85.1%)
    border-box;
}

.card-frame__SS {
  background: linear-gradient(to right, #ffb030, #ff8000) border-box;
}

.card-frame__S {
  background: linear-gradient(to right, #cc33e5, #6725a9) border-box;
}

.card-frame__A {
  background: linear-gradient(to right, #33bbe5, #1945b6) border-box;
}

.card-frame__B {
  background: linear-gradient(to right, #10f58d, #007254) border-box;
}

.inner-frame {
  position: relative;
  background: rgba(255, 255, 255, 0.5);

  /* 文字-普通 */
  border: 2px solid #ffffff;
  box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.31);
  border-radius: 10px;
}

.land-id {
  position: absolute;
  font-size: 24px;
  font-weight: 700;
  width: 100%;
  margin-top: 8px;
  text-align: center;
  color: #00322E;
  z-index: 99;
}

.title-id {
  position: absolute;
  top: 14px;
  left: 0;
  right: 0;
  font-weight: bold;
  font-size: 24px;
  text-align: center;
  color: $text_dark;
}

.card-image {
  width: 222px;
  height: 222px;
  margin: 33px 14px 0 14px;
}

.energe-frame__up {
  // margin-left: 110px;
  // float: left;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 130px 37px 130px;
  border-color: transparent transparent #08322d transparent;
}

.energe-frame {
  position: relative;
}

.energe-frame__down {
  background: #08322d;
  border-radius: 0 0 8px 8px;
  padding: 8px 0 12px 0;
}

.title-energy {
  font-weight: 600;
  font-size: 16px;
  color: #ffffff;
}

.number {
  font-weight: bold;
  font-size: 36px;
  line-height: 28px;
  color: #ffffff;
}

.level-box {
  position: absolute;
  width: 88px;
  height: 88px;
  top: -44px;
  left: calc(50% - 44px);

  /* 投影 */
  box-shadow: 0px 5px 8px 1px rgba(0, 20, 15, 0.5);
  border-radius: 180px;
  border: 4px solid transparent;
  z-index: 4;

  .level-inner-box {
    width: 80px;
    height: 80px;

    background: #071816;
    border-radius: 180px;
    padding-top: 5px;
  }

  .level-icon {
    width: 88px;
    height: 66px;
  }
}

.level-box__sss,
/deep/ .card-frame__sss.v-card {
  background: linear-gradient(
        rgba(255, 255, 255, 0.3),
        rgba(255, 255, 255, 0.3)
      )
      padding-box,
    linear-gradient(to right, #e53368, #a92545) border-box;
}

.level-box__ss,
/deep/ .card-frame__ss.v-card {
  background: linear-gradient(
        rgba(255, 255, 255, 0.3),
        rgba(255, 255, 255, 0.3)
      )
      padding-box,
    linear-gradient(to right, #ffb030, #ff8000) border-box;
}

.level-box__s,
/deep/ .card-frame__s.v-card {
  background: linear-gradient(
        rgba(255, 255, 255, 0.3),
        rgba(255, 255, 255, 0.3)
      )
      padding-box,
    linear-gradient(to right, #cc33e5, #6725a9) border-box;
}

.level-box__a,
/deep/ .card-frame__a.v-card {
  background: linear-gradient(
        rgba(255, 255, 255, 0.3),
        rgba(255, 255, 255, 0.3)
      )
      padding-box,
    linear-gradient(to right, #33bbe5, #1945b6) border-box;
}

.level-box__b,
/deep/ .card-frame__b.v-card {
  background: linear-gradient(
        rgba(255, 255, 255, 0.3),
        rgba(255, 255, 255, 0.3)
      )
      padding-box,
    linear-gradient(to right, #10f58d, #007254) border-box;
}

@media screen and (max-width: 600px) {
  .pledge-NFT-card {
    max-width: 164px;
  }

  .title-id {
    position: absolute;
    top: 7px;
    font-size: 12px;
  }

  .card-image {
    width: 114px;
    height: 111px;
    margin: 16px 8px 0 8px;
  }

  .energe-frame__up {
    border-width: 0 75px 17px 75px;
  }

  .level-box {
    width: 44px;
    height: 44px;
    top: -22px;
    left: calc(50% - 22px);

    .level-inner-box {
      width: 36px;
      height: 36px;
      padding-top: 1px;
    }

    .level-icon {
      width: 40px;
      height: 33px;
    }
  }

  .energe-frame__down {
    padding: 4px 0 8px 0;
  }

  .title-energy {
    font-size: 12px;
  }

  .number {
    font-size: 12px;
    line-height: 15px;
  }
}
</style>
