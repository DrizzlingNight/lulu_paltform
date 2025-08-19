<template>
  <div @click="nftOnclick()" class="binance-land-card">
    <!-- 名稱 -->
    <p class="land-name mb-0">{{ info && (info.name || info.tokenId) }}</p>
    <v-divider class="divider"></v-divider>
    <!-- 圖片 -->
    <v-img :src="info && info.image" class="land-img" contain ></v-img>
  </div>
</template>

<script>
export default {
  name: 'BinanceLandCard',
  props: ['info'],
  methods: {
    // 卡片被點按了
    nftOnclick() {
      this.$emit('cardOnclick', this.info.tokenId)
    },
  }
}
</script>

<style lang="scss" scoped>

.binance-land-card {
  width: 100%;
  max-height: 300px;
  border: 1px solid #00322E;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;

  &:hover {
    border: 1px solid #00FFCA;
  }

  .land-name {
    padding: 0px 20px;
    font-size: 20px;
    height: 36px;
    line-height: 36px;
    text-align: center;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .divider {
    border: 1px solid #00322E;
  }

  .land-img {
    // width: 100%;
    height: 100%;
    width: auto;
    // height: calc(100% - 36px);
  }
}

</style>
