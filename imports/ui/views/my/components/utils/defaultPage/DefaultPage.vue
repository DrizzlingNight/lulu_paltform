<template>
  <div class="default-page">
    <!-- 圖片 -->
    <div class="image">
      <img :src="`/static/ui/my/${statusMap[status].img}.png`" />
    </div>
    <!-- 描述 -->
    <p class="description">
      {{ $t(`my.defaultPage.${statusMap[status].text}`) }}
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
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: inherit;
  width: 62.5vw;
  height: 31.7vw;
  margin: 0px;
  border: 1px solid #00322E;
  border-top: 0px;
  border-radius: 0px 0px 8px 8px;

  .image {
    width: 196px;
    height: auto;
    margin-top: 0px;
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
    height: 70vw;
  }
}
</style>
