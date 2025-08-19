<template>
  <div class="default-page">
    <!-- 圖片 -->
    <div class="image">
      <v-img contain :src="`/static/ui/components/defaultPage/status_image_${status}.svg`" />
    </div>
    <!-- 描述 -->
    <p class="description">
      {{ $t(`defaultPage.statusText${status}`) }}
    </p>
  </div>
</template>

<script>

export default {
  name: 'DefaultPage',
  props: {
    status: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      statusMap: [
        {
          id: 0,
          text: 'noRecord',
          img: 'no-record',
        },
      ],
    }
  },
  methods: {
    reload() {
      window.location.reload()
    }
  }
}
</script>

<style lang="scss" scoped>

.default-page {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;;
  border: 1px solid #00322E;
  border-radius: 8px;
  padding: 40px;

  .image {
    width: 196px;
    height: auto;
    margin: 0 auto;
    margin-bottom: 30px;

    // img {
    //   width: 100%;
    //   height: 100%;
    // }
  }

  .description {
    color: #ffffff;
    font-size: 16px;
    line-height: 16px;
  }
}

@media screen and (max-width: 960px) {
  .default-page {
    width: 100%;
  }
}
</style>
