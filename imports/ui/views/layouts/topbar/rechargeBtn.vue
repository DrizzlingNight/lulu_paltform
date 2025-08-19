<template>
  <div class="d-flex align-center justify-space-between recharge-container">
    <v-menu open-on-hover offset-y nudge-left="10">
      <template v-slot:activator="{ on, attrs }">
        <div v-bind="attrs" v-on="on" class="d-flex">
          <v-img
            max-height="24"
            max-width="24"
            :src="
              imgSrc ? imgSrc : `/static/ui/utils/coins/${itemsList[0]}.svg`
            "
          ></v-img>
          <div
            v-if="attrs['aria-expanded'] === 'false'"
            class="div my-auto"
            style="margin-left: 4px"
          ></div>
          <div v-else class="div2 my-auto" style="margin-left: 4px"></div>
        </div>
      </template>
      <v-list
        width="149px"
        min-width="97"
        class="list-bg"
        style="
          margin-top: 17px;
          border-radius: 8px;
          box-shadow: 0px 5px 8px 1px rgba(0, 20, 15, 0.5);
        "
      >
        <v-list-item
          v-for="(item, index) in itemsList"
          :key="index"
          style="min-height: 46px; padding-left: 13px"
          @click="choiceCoinType(item)"
        >
          <v-img
            max-width="24"
            max-height="24"
            style="margin-right: 14px"
            class="d-inline-block"
            :src="`/static/ui/utils/coins/${item}.svg`"
          ></v-img>
          <span style="color: #95c6b7" class="span">{{ item }}</span>
        </v-list-item>
      </v-list>
    </v-menu>
    <div
      class="text-truncate white--text"
      style="
        font-size: 18px;
        font-weight: 600;
        line-height: 20px;
        height: 20px;
        margin-left: 8px;
        margin-right: 8px;
      "
    >
      {{ money }}
    </div>
    <v-btn @click="goRecharge" :disabled="isBtn" class="recharge-btn">
      {{ $t("recharge.title") }}
    </v-btn>
  </div>
</template>
<script>
import { numFormat } from "../../../../utils/math";
import { mapGetters } from "vuex";
import * as _ from "lodash";

export default {
  name: "rechargeBtn",
  data: () => ({
    // money: '',
    code: "",
    imgSrc: "",
    itemsList: [],
  }),
  computed: {
    ...mapGetters(["balance", "tokens"]),
    isBtn() {
      for (let o = 0; o < this.tokens.length; o++) {
        if (this.tokens[o]._id === this.code) {
          if (!this.tokens[o].deposit) {
            return true;
            break;
          } else return false;
        }
      }
    },
    money() {
      let length = this.balance.length;
      for (let i = 0; i < length; i++) {
        if (this.balance[i].token === this.code) {
          return numFormat(this.balance[i].amount.toFixed(2));
        } else {
          // return '0.00'
        }
      }
      return "0.00";
    },
  },
  created() {
    this.tokens.map((o) => {
      this.itemsList.push(o._id);
    });
    // this.itemsList = [...new Set(this.itemsList)]
    this.code = this.itemsList[0];
  },

  methods: {
    goRecharge() {
      this.$store.commit("ui/SET_IS_SHOW_MONEY_DIALOG", true);
      this.$store.commit("ui/SET_IS_SHOW_RECHARGE_DIALOG", true);
      this.$store.commit("ui/SET_CODE_TYPE", this.code);
    },
    choiceCoinType(item) {
      this.imgSrc = `/static/ui/utils/coins/${item}.svg`;
      this.code = item;
    },
  },
};
</script>
<style scoped lang="scss">
@import "/imports/ui/scss/theme";

.list-bg {
  background: $commonBackgroundColor !important;
}

.recharge-btn {
  background: linear-gradient(
    226.58deg,
    #ffd12f 51.75%,
    #ff8e00 95.54%
  ) !important;
  height: 34px !important;
  width: 84px;
  border-radius: 6px;

  &:hover {
    background: linear-gradient(
      170.64deg,
      #ffb030 14.15%,
      #ff8000 85.1%
    ) !important;
  }
}

.recharge-container {
  background: $lightBackground2;
  border-radius: 8px;
  height: 46px;
  gap: 8px;
  // width: 234px;
  padding-left: 13px;
  padding-right: 6px;
}

.div {
  width: 0;
  height: 0;
  border-right: 4px solid transparent;
  border-left: 4px solid transparent;
  border-top: 5px solid #d8d8d8;
}

.div2 {
  width: 0;
  height: 0;
  border-right: 4px solid transparent;
  border-left: 4px solid transparent;
  border-bottom: 5px solid #d8d8d8;
}

.span:hover {
  color: $mainLightColor !important;
  font-weight: 600;
}

@media screen and (max-width: 1264px) {
}
</style>
