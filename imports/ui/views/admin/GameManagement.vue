<template>
  <div class="admin-main">
    <div class="routeTitle">
      <div class="mainTitle">{{$t('admin.systemSetting')}}</div>
      <div class="subTitle">{{$t('admin.gameManage')}}</div>
    </div>
    <div v-for="(game,i) in games" :key="i">
      <v-checkbox
          v-model="game.active"
          :label="game._id"
          hide-details
      ></v-checkbox>
    </div>
    <!--數據更新-->
    <el-button type="primary" @click="update">{{$t('admin.refresh')}}</el-button>
    <el-button type="primary" @click="save">{{$t('admin.save')}}</el-button>
    <div class="logShow">

    </div>

  </div>
</template>

<script>
import logging from "/imports/api/logging";
const logger = logging.getLogger(module.id);

export default {
  name: "GameManagement",
  data() {
    return {
      games:[]
    };
  },
  mounted() {
    this.update()
  },
  methods: {
    update(){
      Meteor.call("getGames", (err,res)=>{
        if(err)
          logger.error(err)
        else
          this.games = res
      })
    },
    save(){
      Meteor.call("admin_setGameActive", this.games, (err,res)=>{
        if(err)
          logger.error(err)
        else
          this.update()
      })
    }
  },
};
</script>

<style  lang="scss" scoped>
</style>
