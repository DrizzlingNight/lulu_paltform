<template>
  <div>
    <v-dialog v-model="show" persistent :width="width">
      <v-card class="ChoicePledgeDialog">
        <v-card-title class="">
          <p class="text">{{ title }}</p>
          <v-spacer></v-spacer>
          <img
            :src="'/static/ui/assets/img/cross-white.png'"
            @click="$emit('closeDialog')"
          />
        </v-card-title>

        <v-card-text>
            <v-container
                v-if="pledgeLists.length > 0"
                class="cards-frame mt-4 mb-9 pl-1 pl-sm-9 pr-1 pr-sm-8 pt-10"
            >
              <v-row justify="center" align-content="center" align="center">
                <v-col
                    v-for="(item, index) in pledgeLists"
                    :key="index"
                    align-self="center"
                    cols="auto"
                >
                  <div class="pledge-card" @click="choice(index)">
                    <div class="land-id">{{ 'ID:' + item.state.idOnChain || ''}}</div>
                    <div class="land-line"></div>
                    <mystery-card
                        class="cards"
                        :level="levelTransform(item.info.nftPool.info.level)"
                        :type="typeTransform(item.info.nftPool.info.type)"
                    />

                    <div
                        v-if="active == index"
                        class="pledge-card-choose d-flex justify-center align-center"
                        :class="{ active: active == index }"
                    >
                      <div>
                        <v-img
                            contain
                            src="/static/ui/pledge/nft/choose.svg"
                            class="chooce-image"
                        />
                      </div>
                    </div>
                  </div>
                </v-col>
                <v-col
                    v-for="index in 2"
                    :key="`null-${index}`"
                    align-self="center"
                    cols="auto"
                >
                  <div class="null-card"></div>
                </v-col>
              </v-row>
              <v-pagination
                  v-if="Math.ceil(count / 8) > 1"
                  v-model="page"
                  :length="Math.ceil(count / 8)"
                  :total-visible="5"
              />
            </v-container>
            <div
                v-else
                class="cards-frame null-data d-flex flex-grow-1 justify-center align-center mt-4 mb-9"
            >
              <div>
                <v-img
                    contain
                    width="206px"
                    src="/static/ui/pledge/nft/null-data.svg"
                    class="null-data-image"
                />
                <div class="mt-6 white--text" style="text-align:center;">{{ $t("pledge.pledgeNFT.nothing") }}</div>
              </div>
            </div>
        </v-card-text>

        <v-card-actions>
          <v-btn
            :disabled="pledgeLists.length === 0 || active === -1"
            :loading="loading"
            color="primary"
            @click="isPledge ? doPledge() : confirm()"
          >
            {{ $t("base.confirm") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import {NonFungibleTokenPoolLevel, NonFungibleTokenPoolType} from "../../../../../../api/nft/collections";
import MysteryCard from "../../../../../components/mysteryCard/MysteryCard";

export default {
  name: "ChoicePledgeDialog",
  components: {
    MysteryCard
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
    loading: {
      type: Boolean,
      default: false,
    },
    width: {
      type: String,
      default: "500px",
    },
    pledgeLists: {
      type: Array,
      default: []
    },
    count: {
      type: Number,
      default: 0
    },
    changeLandId: {
      type: String,
      default: null,
    },
    isPledge: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      active:-1,
      page: 1,
    }; 
  },
  watch: {
    page: {
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal && oldVal && newVal != oldVal) {
          this.$emit("update", newVal * 8 - 8)
        }
      },
    },
    show(newVal){
      if (newVal) {
        this.page = 1
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    choice(index) {
      if (this.active === index) {
        this.active = -1;
      } else {
        this.active = index;
      }
    },
    typeTransform: (num) => {
      return NonFungibleTokenPoolType.getName(num).toLowerCase();
    },
    levelTransform: (num) => {
      return NonFungibleTokenPoolLevel.getName(num);
    },
    doPledge() {
      let item = this.pledgeLists[this.active];
      if (this.changeLandId)
        Meteor.call("redeemMyNFT", this.changeLandId, (err, res) => {
          if (err) {
            console.log("Error", err);
            this.toasterErr(this.$t("pledge.pledgeNFT.redeemFail"));
          } else {
            // console.log("Success:", res);
            Meteor.call("stakeMyNFT", { landId: item._id }, (err, res) => {
              if (err) {
                console.log("Error", err);
                this.toasterErr(this.$t("pledge.pledgeNFT.pledgeFail"));
              } else {
                // console.log("Success:", res);
                this.toasterSuccess(this.$t("pledge.pledgeNFT.pledgeSuccess"));
                this.active = -1
                this.$emit("closeDialog")
                this.$emit("stakeSuccess")
              }
            });
            this.toasterSuccess(this.$t("pledge.pledgeNFT.redeemSuccess"));
            this.active = -1
            this.$emit("closeDialog")
            this.$emit("stakeSuccess")
          }
        })
      else
        Meteor.call("stakeMyNFT", { landId: item._id }, (err, res) => {
          if (err) {
            console.log("Error", err);
            this.toasterErr(this.$t("pledge.pledgeNFT.pledgeFail"));
          } else {
            // console.log("Success:", res);
            this.toasterSuccess(this.$t("pledge.pledgeNFT.pledgeSuccess"));
            this.active = -1
            this.$emit("closeDialog")
            this.$emit("stakeSuccess")
          }
        });
    },
    confirm() {
      let item = this.pledgeLists[this.active];
      this.active = -1
      this.page = 1
      this.$emit('confirm', item)
    }
  },
};
</script>

<style lang="scss" scoped>
.ChoicePledgeDialog {
  background: linear-gradient(136deg, #06261f 0%, #08322d 100%);
  border-radius: 8px;
  border: 1px solid #00ffca;
  box-shadow: 0px 5px 8px 1px rgba(0, 37, 19, 0.5);

  .land-id {
    position:absolute;
    z-index:20;
    width:100%;
    font-size:24px;
    font-weight:700;
    color:#fff;
    text-align: center;
    height: 60px;
    line-height: 60px;
  }

  .land-line {
    position:absolute;
    z-index:20;
    width:75%;
    height: 1px;
    background: #2D4742;
    margin-top: 50px;
    margin-left: 50px;
  }

  .v-card__title {
    border-bottom: 1px solid #2d4742;
    padding: 26px 37px 18px 42px;

    .text {
      color: #ffffff;
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 0px;
    }

    img {
      cursor: pointer;
    }
  }

  .v-card__text {
    overflow-y: scroll;
    height: 60vh;
    padding: 0px 37px 0px 42px;
  }

  .v-card__actions {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 31px;

    .v-btn {
      margin-top: 5px;
      width: 362px;
    }
  }
  .cards-frame {
    background: #00221a;
    border-radius: 10px;
  }
  .null-data {
    width: 80vw;
    max-width: 650px;
    height: 500px;
  }
  .pledge-card {
    position: relative;
    cursor: pointer;
  }

  .pledge-card-choose {
    display: none;
    position: absolute;
    top: 0;
    bottom: 10px;
    left: 8px;
    right: 8px;
    border-radius: 8px;

    &.active {
      display: block;
      width: 254px;
      background: rgba(255, 255, 255, 0.5);
      box-shadow: 0px 5px 8px 1px rgba(0, 20, 15, 0.5);
    }
  }
  .chooce-image.v-image {
    width: 154px;
    height: 154px;
  }
  .null-card {
    height: 1px;
    min-width: 270px;
  }
}
/deep/ .CustomDialog {
  .v-card__text {
    padding: 0 !important;
  }
}
@media screen and (max-width: 600px) {
  .chooce-image.v-image {
    width: 110px !important;
    height: 110px !important;
  }

  .null-card {
    height: 1px;
    width: 150px;
  }

  .ChoicePledgeDialog {
    .v-card__text {
    padding: 0px 10px 0px 20px;
    }
  }
}
</style>
