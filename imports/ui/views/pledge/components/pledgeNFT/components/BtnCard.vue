<template>
  <div id="pledge-NFT-card" @click="showPledgeDialog">
    <v-card class="pledge-NFT-card">
      <div class="inner-frame">
        <div class="image-box d-flex">
          <v-img
            contain
            src="/static/ui/pledge/nft/add.svg"
            class="add-image"
          />
        </div>
        <div
          class="btn-frame d-flex flex-column flex-grow-1 justify-center align-center py-2"
        >
          <div class="btn">
            {{ $t("pledge.pledgeNFT.pledgeBtn") }}
          </div>
        </div>
      </div>
    </v-card>
    <div class="hover"></div>
  </div>
</template>

<script>
import ChoicePledge from "./ChoicePledge.vue";
import MysteryCard from "/imports/ui/components/mysteryCard/MysteryCard.vue";
import {
  NonFungibleTokenPoolLevel,
  NonFungibleTokenPoolType,
} from "/imports/api/nft/collections";

export default {
  name: "BtnCard",
  components: {
    ChoicePledge,
    MysteryCard,
  },
  data() {
    return {
      active: -1,
    };
  },
  methods: {
    confirmPledgeChoice() {

      if (this.active !== -1) {
        this.toasterSuccess(this.$t("pledge.pledgeNFT.pledgeSuccess"));
      }
    },
    showPledgeDialog() {
      this.$emit("openShow");
    },

  },
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
  }
}

.pledge-NFT-card {
  background: linear-gradient(166.11deg, #ebebeb 0.69%, #bbbbbb 82.38%);
  box-shadow: 0px 5px 8px 1px rgba(0, 20, 15, 0.5);
  border-radius: 8px;
  border: 4px solid transparent;
  min-width: 270px;
}

.inner-frame {
  position: relative;
  background: rgba(255, 255, 255, 0.5);

  /* 文字-普通 */
  border: 2px solid #ffffff;
  box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.31);
  border-radius: 10px;
}

.image-box {
  margin: 114px auto 102px auto;
  text-align: center;
}

.add-image {
  width: 80px;
  height: 80px;
}

.btn-frame {
  background: #08322d;
  border-radius: 0 0 8px 8px;
  height: 70px;
}

.btn {
  font-weight: 600;
  font-size: 16px;
  color: #ffffff;
  cursor: pointer;
}





/deep/ .CustomDialog {
  .v-card__text {
    padding: 0 !important;
  }
}

@media screen and (max-width: 600px) {
  .pledge-NFT-card {
    width: 142px !important;
    min-width: 142px !important;
  }

  .image-box {
    margin: 58px auto 57px auto;
  }

  .add-image {
    width: 40px;
    height: 40px;
  }

  .btn-frame {
    height: 38px;
  }

  .btn {
    font-size: 12px;
  }

}
</style>
