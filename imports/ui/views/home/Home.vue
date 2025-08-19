<template>
  <div class="home-wrapper">
    <!-- 區塊照順序向下排 -->
    <!-- 根據版本需牛隱藏部分區塊 v-if="0" -->

    <!-- 统计 -->
<!--    <TotalStatistics />-->
    <!-- 首屏 Banner -->
    <HeroBanner v-if="isShow('banner')" />
    <!-- DEMO 與介紹 -->
    <Intro v-if="isShow('intro')"/>
    <!-- 排行榜 -->
    <Ranking v-if="isShow('ranking')"/>
    <!-- 土地NFT -->
    <LandsNFT v-if="isShow('landNFT')"/>
    <!-- 遊戲玩法的核心機制 -->
    <GameRules v-if="isShow('gameRules')"/>
    <!-- NFT遊戲設施 -->
    <FacilitiesNFT v-if="isShow('facilitiesNFT')" />
    <!-- 數量統計 -->
    <Statistics v-if="isShow('statistics')" />
    <!-- 上周商品銷量排名 -->
    <SalesRank v-if="isShow('salesRank')" />
    <!-- 邀請好友 -->
    <Invite v-if="isShow('invite')"/>
    <!-- LULU MARKETS發展路線圖 -->
    <Roadmap v-if="isShow('roadmap')"/>
    <!-- 訂閱最新訊息 -->
    <Subscribe v-if="isShow('subscribe')"/>
    <!-- 合作夥伴 -->
    <Partners v-if="isShow('partners')"/>
    

    <!-- 側邊 fixed 社群按鈕群 -->
    <SideContacts />

  </div>
</template>

<script>
// import TotalStatistics from './components/totalStatistics/TotalStatistics.vue'
import HeroBanner from './components/heroBanner/HeroBanner.vue'
import Intro from './components/intro/Intro.vue'
import Ranking from './components/ranking/Ranking.vue'
import LandsNFT from './components/landsNFT/LandsNFT.vue'
import GameRules from './components/gameRules/GameRules.vue'
import FacilitiesNFT from './components/facilitiesNFT/FacilitiesNFT.vue'
import Statistics from './components/statistics/Statistics.vue'
import SalesRank from './components/salesRank/SalesRank.vue'
import Invite from './components/invite/Invite.vue'
import Roadmap from './components/roadmap/Roadmap.vue'
import Subscribe from './components/subscribe/Subscribe.vue'
import Partners from './components/partners/Partners'

import SideContacts from './components/sideContacts/SideContacts.vue'

import Storage from '/imports/utils/storage'
import { settings } from "/imports/settings";

export default {
  name: "Home.vue",
  components: {
    // TotalStatistics,
    HeroBanner,
    Intro,
    Ranking,
    LandsNFT,
    GameRules,
    FacilitiesNFT,
    Statistics,
    SalesRank,
    Invite,
    Roadmap,
    Subscribe,
    Partners,
    SideContacts
  },
  created() {
    // 小步帳號綁定判斷
    const singUpDataJson = this.$route.query
    if (singUpDataJson.app) {
      Storage.setSession('singUpDataJson', singUpDataJson)
    }
  },
  methods: {
    isShow(name) {
      return settings.display.home[name]
    }
  }
}
</script>

<style lang="scss" scoped>
@import './../../assets/css/utils/variables.scss';

.home-wrapper {
  // TODO 字體顏色部分要拉到全域設定一個預設字型
  color: #ffffff;
}

</style>
