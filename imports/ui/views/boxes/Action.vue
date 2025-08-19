<template>
  <div id="action-page">
    <banner-1 />
  </div>
</template>

<script>
import Banner1 from "./components/Banner1.vue";

export default {
  components: {
    Banner1,
  }
}
</script>

<style lang="scss" scoped>
.action-frame {
  display: inline-flex;
  padding: calc(100vw * 69 / 1920) 0 0 calc(100vw * 36 / 192);
  color: #00ffca;
  font-size: 24px;
}


.banner-1 {
  background-image: url("static/ui/mystery_boxes/banner1.png");
  background-repeat: no-repeat;
  background-size: 100% auto;
}
</style>
