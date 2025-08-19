<template>
  <div class="base">
    <topbar></topbar>
    <router-view></router-view>
    <Footer />
  </div>
</template>

<script>
import Topbar from "./topbar/Topbar";
import Footer from './footer/Footer.vue'
export default {
name: "TheBaseLayout",
  components: {Topbar, Footer}
}
</script>

<style scoped>

.base {
  padding-top: 80px;
}

@media screen and (max-width: 960px) {
  .base {
    padding-top: 64px;
  }
}

@media screen and (max-width: 600px) {
  .base {
    padding-top: 56px;
  }
}

</style>
