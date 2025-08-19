<template>
  <v-dialog
      v-model="text"
      class="ma-0 pa-0"
      style="margin: 0 !important;"
      :width="loginDialogState === 1? 131: loginDialogState === 2 ?153:loginDialogState === 3?299:299"
  >
    <v-card color="rgba(68, 103, 95, .6)" class="text-center ma-0" height="131" v-if="loginDialogState === 1">
      <v-img class="mx-auto d-inline-block" style="margin-top: 37px" max-height="39" max-width="40"
             src="static/ui/topbar/loading.png"></v-img>
      <div style="margin-top: 15px;font-size: 14px;height: 18px;line-height: 18px" class="white--text mx-auto">
        {{ $t("topbar.loginLoading") }}
      </div>
    </v-card>
    <v-card color="rgba(68, 103, 95, .6)" class="text-center d-flex align-center justify-center" height="62" v-else>
      <div style="font-size: 21px;height: 21px;line-height: 21px" class="white--text">
        {{
          $t(loginDialogState === 2 ? "topbar.loginSuccess" : loginDialogState === 3 ? "topbar.registerSuccess" : "topbar.passwordSuccess")
        }}
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "loginDialogState",
  data: () => ({
    text: true
  }),
  props: ["loginDialogState", "dialog"],
  created() {
    setTimeout(this.replyState, 3000)
  },
  methods: {
    replyState() {
      this.$emit("replyState")
    }
  }
}
</script>

<style scoped>

</style>