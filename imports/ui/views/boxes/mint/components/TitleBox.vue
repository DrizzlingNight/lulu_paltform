<template>
  <div id="title-box" class="d-flex flex-grow-1 align-center">
    <div class="left flex-column flex-grow-1 align-center my-auto">
      <div class="line-left my-auto"></div>
    </div>
    <div class="content d-flex justify-center mx-4 mx-md-8">{{ content }}</div>
    <div class="right d-flex flex-grow-1 align-center my-auto">
      <div class="line-right my-auto"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    content: {
      type: String,
      default: "",
    },
  },
};
</script>

<style lang="scss" scoped>
#title-box {
  height: 100%;
  width: 100%;
  margin: 150px 0 150px 0;
}

.content {
  max-width: 360px;
  width: 30%;
  font-style: normal;
  font-weight: 600;
  font-size: 32px;
  line-height: 36px;
  color: #ffffff;
}

.line-left {
  width: 100%;
  height: 45px;
  background-image: url("/static/ui/mystery_boxes/line-left.svg");
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.line-right {
  width: 100%;
  height: 45px;
  background-image: url("/static/ui/mystery_boxes/line-right.svg");
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

@media screen and (max-width: 960px) {
  .content {
    max-width: 300px;
    width: auto;
    font-size: 16px;
    line-height: 20px;
  }
}

@media screen and (max-width: 600px) {
  #title-box {
    height: 100%;
    width: 100%;
    margin: 62px 0;
  }

  .content {
    // max-width: 60px;
    margin: 0 16px;
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
  }

  .line-left {
    width: 100%;
    height: 10px;
    background-image: url("/static/ui/mystery_boxes/line-left2.svg");
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }

  .line-right {
    width: 100%;
    height: 10px;
    background-image: url("/static/ui/mystery_boxes/line-right2.svg");
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
}
</style>
