<template>
  <v-dialog v-model="logOut" @click:outside="close" max-width="466px">
    <v-card class="card">
      <v-card-subtitle class="text-right pa-0" style="margin-right: 31px;margin-top: 30px;height: 18px">
        <v-btn text x-small class="pa-0" min-width="18">
          <v-img @click="close" class="float-right" style="cursor: pointer;z-index: 999"
                 src="/static/ui/topbar/close.png" width="18" height="18" contain></v-img>
        </v-btn>
      </v-card-subtitle>
      <div class="white--text"
           style="font-weight: 600;font-size: 24px;height: 34px;line-height: 34px;margin-left: 40px;margin-top: -28px">
        {{ $t("topbar.quitConfirm") }}
      </div>
      <v-divider style="margin-top: 24px;margin-bottom: 20px;background:#2D4742;"></v-divider>
      <div class="d-flex justify-center align-center div"
           style="max-width: 389px;height: 120px;border-radius: 8px">
        <div style="height: 22px;font-size: 16px;line-height: 22px" class="white--text">{{ $t("topbar.quitText") }}
        </div>
      </div>
      <div style="max-width: 362px" class="pa-0 col">
        <v-btn block style="margin-top: 26px;margin-bottom: 31px;" @click="logOutBtn">
          {{ $t("confirmBtn") }}
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import walletConnect from '/imports/api/walletConnect/walletConnect'

export default {
  name: "logOut",
  data: () => ({}),
  props: ["logOut"],
  methods: {
    close() {
      this.$emit("close")
    },
    logOutBtn() {
      walletConnect.killSession() // 刪除 WC connector
      Meteor.logout((err,res) => {
        location.reload()
      })
      if (this.$route.path != "/home") {this.$router.push("/home")}
    }
  }
}
</script>

<style scoped>
.div{
  margin: 0 auto;
}
.col{
  margin: 0 auto;
}
@media screen and (max-width: 466px) {
  .div{
    margin-left: 18px;
    margin-right: 18px;
  }
  .col{
    width: 80% !important;
  }
}
.div{
}
</style>