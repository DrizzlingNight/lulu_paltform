<template>
  <div class="default-page d-flex flex-column align-center justify-center pa-4 pa-md-16">
    <!-- 狀態圖，預設最大寬度 204px，高度 auto -->
    <v-img width="100%" max-width="204" height="auto" contain :src="`/static/ui/components/defaultPage/status_image_${statusCode}.svg`" class="mb-6"></v-img>
    <!-- 狀態文字 -->
    <span class="default-page-text">{{ $t(`defaultPage.statusText${statusCode}`) }}</span>
  </div>
</template>

<script>
export default {
  name: 'DefaultPage',
  props: {
    statusCode: { // 狀態碼 0: 暫無紀錄, 1: 暫無消息, 2: 暫無內容, 3: 檢查網路, 4: 404
      type: Number,
      default: -1
    }
  }
}
</script>

<style lang="scss" scoped>
.default-page {
  width: 100%;
  height: 100%;

  .default-page-text {
    color: #ffffff;
  }
}
</style>