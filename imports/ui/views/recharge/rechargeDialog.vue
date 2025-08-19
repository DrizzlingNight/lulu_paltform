<template>
  <v-dialog v-model="rechargeDialog" max-width="600px" @click:outside="close">
    <recharge v-if="dialog" @close="close"></recharge>
  </v-dialog>
</template>

<script>
import Recharge from "./recharge";
import {mapGetters} from "vuex";

export default {
  name: "rechargeDialog",
  data: () => ({}),
  components: {Recharge},
  computed: {
    ...mapGetters(["isShowMoneyDialog"]),
    rechargeDialog() {
      return this.dialog
    },
    dialog: {
      get() {
        return this.isShowMoneyDialog;
      },
      set(val) {
        this.$store.commit("ui/SET_IS_SHOW_MONEY_DIALOG", val);
      },
    },
  },
  methods: {
    //关闭
    close() {
      this.$store.commit("ui/SET_IS_SHOW_MONEY_DIALOG", false);
      // this.$store.commit("ui/SET_IS_SHOW_RECHARGE_DIALOG", false);
    },
  }
}
</script>

<style scoped>
>>>.v-dialog{
  margin: 10px;
  z-index: 100;
}
</style>