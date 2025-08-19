<template>
  <div id="rare-mint-page">
    <div class="rare-mint-page2">
      <banner-box />
    </div>
  </div>
</template>

<script>
import BannerBox from "./components/BannerBox.vue";

export default {
  components: {
    BannerBox,
  },
};
</script>

<style lang="scss" scoped>
#rare-mint-page {
  width: 100%;
  height: 100%;
  position: relative;

  background: radial-gradient(50% 50% at 50% 50%, #150b23 0%, #1e1026 100%);
}

.rare-mint-page2 {
  width: 100%;
  height: 100%;

  background-image: url("/static/ui/mystery_boxes/rare-mint-bg2.png");
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
