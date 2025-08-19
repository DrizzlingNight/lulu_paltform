<template>
  <v-dialog v-model="isOpen" width="1000">
    <!-- 服務條款按鈕 -->
    <template v-slot:activator="{ on, attrs }">
      <a
          dark
          v-bind="attrs"
          v-on="on"
          class="active-btn pa-0"
      >
        <span style="height: 12px;line-height: 12px;font-size: 12px">{{ $t("topbar.serviceTerms") }}</span>
      </a>
    </template>


    <!-- 服務條款彈窗卡片 -->
    <v-card class="service-terms-card d-flex flex-column align-center px-6 px-md-11 py-7 py-md-14">
      <!-- 關閉按鈕 -->
      <v-img @click="isOpen = false" class="close-btn" src="static/ui/topbar/close.png" width="18" height="18"
             contain></v-img>

      <h2 class="mb-2 mb-md-11">{{ $t("topbar.serviceTerms") }}</h2>

      <v-divider class="divider mb-2 mb-md-10" style="border: 1px solid #2D4742;"></v-divider>

      <p class="service-terms-content mb-0">{{ $t('serviceTerms') }}</p>
    </v-card>

  </v-dialog>
</template>

<script>
export default {
  name: 'ServiceTermsDialog',
  data() {
    return {
      isOpen: false,
      serviceTermsText: ''
    }
  },
  methods: {},
  mounted() {
  }
}
</script>

<style lang="scss" scoped>

a {
  font-size: 12px;
  height: 12px;
  line-height: 12px;
  margin-left: 4px;
}

// 激活按鈕
.active-btn {
  max-height: 16px;

  /deep/ .v-btn__content {
    font-size: 12px;
    color: #59CF9E;
  }
}

// 卡片
.service-terms-card {
  position: relative;
  max-height: 90vh;
  height: 820px;
  background: linear-gradient(136.3deg, #06261F 2.34%, #08322D 98.54%);
  border: 1px solid #00FFCA !important;
  border-radius: 8px;
  overflow: hidden;

  .close-btn {
    position: absolute;
    top: 20px;
    right: 20px;
    cursor: pointer;
  }

  .divider {
    width: 100%;
    border: 1px solid #2D4742;
  }

  .service-terms-content {
    width: 100%;
    height: 100%;
    color: #ffffff;
    white-space: pre-line;
    overflow: auto;
  }
}

// scroll bar style

// chrome
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 2.5px;
}

::-webkit-scrollbar-corner {
  background: transparent;
}

// firefox
* {
  scrollbar-color: rgba(0, 0, 0, 0.3); /* thumb and track color */
  scrollbar-width: thin;
}

</style>
