<template>
  <v-menu open-on-hover offset-y left>
    <template v-slot:activator="{ on, attrs }">
      <div v-bind="attrs" v-on="on" class="d-flex" style="height: 25px">
        <v-img max-height="24" max-width="24" :src="imgSrc ? imgSrc : `/static/ui/utils/coins/${codeType}.svg`"></v-img>
        <div v-if="attrs['aria-expanded'] === 'false'" class="div my-auto" style="margin-left: 8px"></div>
        <div v-else class="div2  my-auto" style="margin-left: 8px"></div>
      </div>
    </template>
    <v-list class="list-bg" min-width="97">
      <v-list-item
          v-for="(item, index) in itemsList"
          :key="index"
          style="min-height: 46px;padding-left: 13px"
          @click="choiceCoinType(item)"
      >
        <v-img max-width="24" max-height="24" style="margin-right: 14px" class="d-inline-block"
               :src="`/static/ui/utils/coins/${item}.svg`"></v-img>
        <span class="span" style="color: #95C6B7">{{ item }}</span>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "iconType",
  data: () => ({
    imgSrc: '',
    itemsList: [],
  }),
  created() {
    if (this.isShowRechargeDialog) {
      this.tokens.map((o) => {
        if (o.deposit) {
          this.itemsList.push(o._id)
        }
      })
    } else {
      this.tokens.map((o) => {
        if (o.withdraw) {
          this.itemsList.push(o._id)
        }
      })
    }
    // this.itemsList = [...new Set(this.itemsList)]
  },
  computed: {
    ...mapGetters(["tokens", "codeType", "isShowRechargeDialog"]),
  },
  methods: {
    choiceCoinType(item) {
      this.imgSrc = `/static/ui/utils/coins/${item}.svg`
      this.$emit("changeToken", item)
    }
  }
}
</script>

<style scoped lang="scss">

@import '/imports/ui/scss/theme';

.list-bg {
  background: $commonBackgroundColor !important;
}

.div {
  width: 0;
  height: 0;
  border-right: 4px solid transparent;
  border-left: 4px solid transparent;
  border-top: 5px solid #D8D8D8;
}

.div2 {
  width: 0;
  height: 0;
  border-right: 4px solid transparent;
  border-left: 4px solid transparent;
  border-bottom: 5px solid #D8D8D8;
}

.span:hover {
  color: $mainLightColor !important;
  font-weight: 600
}
</style>