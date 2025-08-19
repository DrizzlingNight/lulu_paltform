<template>
  <animated-image
    ref="animatedImage"
    class="animated-image"
    :imgPaths="imgPaths"
    :type="type"
    :duration="duration"
    @preloadComplete="preloadComplete"
  />
</template>

<script>
import AnimatedImage from "/imports/ui/components/animatedImage/AnimatedImage.vue";

export default {
  components: {
    AnimatedImage,
  },
  props: {
    type: {
      type: String,
      default: "waiting",
    },
    switch: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      imgPaths: [],
      duration: 1000,
    };
  },
  computed: {
    waitingImgs() {
      var paths = [];
      for (var i = 1; i <= 31; ++i) {
        paths.push(`/static/ui/mystery_boxes/waiting/0${i}.png`);
      }
      return paths;
    },
    openImgs() {
      var paths = [];
      for (var i = 1; i <= 20; ++i) {
        paths.push(`/static/ui/mystery_boxes/open/0${i}.png`);
      }
      return paths;
    },
  },
  watch: {
    type: {
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal == "waiting" && newVal !== oldVal) {
          this.duration = 2500;
          this.imgPaths = this.waitingImgs;
        } else if (newVal !== oldVal) {
          // this.stop();
          this.duration = 1500;
          this.imgPaths = this.openImgs;
        }
      },
    },
    switch: {
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal) {
          // console.log("start:", newVal);
          this.start();
        }
      },
    },
  },
  methods: {
    preloadComplete(type) {
      this.$nextTick(() => {
        if (type === "waiting") {
          this.$refs.animatedImage.play(type === "waiting" ? 0 : 1);
        }
      });
    },
    start() {
      this.$nextTick(() => {
        this.$refs.animatedImage.play(1);

        setTimeout(() => {
          this.$refs.animatedImage.stop();
        }, 3000);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.animated-image {
  position: absolute;
  max-width: 485px;
  max-height: 485px;
  bottom: -20px;
  right: 75px;

  min-width: 250px;
  min-height: 250px;

  width: 40vw;
  height: 40vw;
}
</style>
