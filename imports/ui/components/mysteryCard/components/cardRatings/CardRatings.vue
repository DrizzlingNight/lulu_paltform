<template>
  <div id="ratings-list" class="d-flex justify-center">
    <div class="d-flex justify-start">
      <div v-if="numInt >= 1" class="d-flex justify-start">
        <v-img
          :aspect-ratio="1"
          contain
          src="/static/ui/components/card/star.png"
          v-for="index in Number(numInt)"
          :key="index"
          class="icon-star"
        />
      </div>
      <!--      <div v-else>-->
      <!--        <v-img src="/static/ui/components/card/star.png" class="icon-star" />-->
      <!--      </div>-->
      <v-img
        :aspect-ratio="1"
        contain
        v-if="numFloat != 0"
        src="/static/ui/components/card/star-half.png"
        class="icon-star justify-start ml-auto"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    rating: {
      type: String,
      default: "10",
    },
  },
  data() {
    return {
      numInt: 0,
      numFloat: 0,
    };
  },
  watch: {
    rating: {
      immediate: true,
      handler(val) {
        const num = (Number(val) / 2).toFixed(1);
        this.numInt = num[0];
        this.numFloat = num[2];
      },
    },
  },
};
</script>

<style lang="scss" scoped>
// #ratings-list {
//   width: 95px;
//   height: 20px;

//   .icon-star {
//     width: 17px !important;
//     height: 17px !important;
//   }
// }

// @media screen and (max-width: 1264px) {
//   #ratings-list {
//     width: 65px !important;
//     height: 13px !important;

//     .icon-star {
//       width: 13px !important;
//       height: 13px !important;
//     }

//     /deep/ .icon-star.v-img {
//       width: 13px !important;
//       height: 13px !important;
//     }
//   }
// }

#ratings-list {
  width: 65px !important;
  height: 13px !important;

  .icon-star {
    width: 13px !important;
    height: 13px !important;
  }

  /deep/ .icon-star.v-img {
    width: 13px !important;
    height: 13px !important;
  }
}
</style>
