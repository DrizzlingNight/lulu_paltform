<template>
  <div id="mystery-boxes-page">
    <!-- 動態 Banner 組件渲染 -->
    <Banner
      v-for="box in boxOrder"
      :key="box._id"
      :box-info="box"
    />
  </div>
</template>

<script>
import Banner from './components/Banner.vue'

import { mapGetters } from "vuex";

export default {
  components: {
    Banner,
  },
  mounted () {
    this.logEvent('go_mystery_boxes')
  },
  data() {
    return {
      // 調整過順序用來排列在列表中的陣列
      boxOrder: [],
    };
  },
  computed: {
    ...mapGetters(["boxInfo", "boxNftPool"]),
  },
  watch: {
    boxInfo: {
      immediate: true,
      deep: true,
      handler(newVal, oldVal) {
        if (newVal && newVal !== oldVal && newVal.length > 0) {
          // 按照陣列內的活動id排序 小 -> 大
          this.boxOrder = newVal.sort(function(a, b) {
            return a.order - b.order
          })
        }
      },
    },
  },
  mounted() {
    // 取得url中有沒有指定要scroll到哪個盲盒活動Banner，有的話就scroll
    const toBannerId = this.$route.params.id
    if (!toBannerId) {
      return
    }

    const toBannerElement = document.querySelector(`#banner${toBannerId}`)
    console.log(toBannerElement)
    const elementTopPosition = toBannerElement.offsetTop

    setTimeout(() => {
      window.scrollTo({
        top: elementTopPosition - 60, // -60 (扣掉navbar高度)
        behavior: 'smooth'
      })
    }, 80)

    }
}
</script>

<style lang="scss" scoped>
</style>
