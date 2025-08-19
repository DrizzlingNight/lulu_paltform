<template>
  <!-- DEMO影片 彈窗卡片 -->
  <v-card class="video-dialog-card d-flex flex-column align-center px-3 px-md-11 pt-14 pb-3 py-md-14">
    <div class="video-wrapper">
      <iframe width="100%" height="100%" :src="videoLink[$i18n.locale] || videoLink['en-EN']" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div>
    <!-- 關閉按鈕 -->
    <v-img @click="closeDialog()" class="close-btn" src="static/ui/topbar/close.png" width="18" height="18" contain></v-img>
  </v-card>
</template>

<script>
export default {
  name: 'VideoDialogCard',
  data: () => ({
    videoLink: {
      "zh-TW": "https://www.youtube.com/embed/6NGmkTSibI0",
      "en-EN": "https://www.youtube.com/embed/BWmbkzz3Now",
      "vi-VI": "https://www.youtube.com/embed/XWOcaEIU4oA",
      "kr-KR": "https://www.youtube.com/embed/BWmbkzz3Now"
    }
  }),
  methods: {
    closeDialog() {
      this.$emit('closeVideoDialog')
    }
  }
}
</script>

<style lang="scss" scoped>

.video-dialog-card {
  position: relative;
  height: 80vh;
  width: 90vw;
  background: linear-gradient(136.3deg, #06261F 2.34%, #08322D 98.54%);
  border: 1px solid #00FFCA !important;
  border-radius: 8px !important;
  overflow: hidden;

  .video-wrapper {
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-radius: 8px !important;
  }

  .close-btn {
    position: absolute;
    top: 20px;
    right: 20px;
    cursor: pointer;
  }
}

@media screen and (max-width: 960px) {
  .video-dialog-card {
    width: 95vw;
    height: 60vh;
  }
}

</style>