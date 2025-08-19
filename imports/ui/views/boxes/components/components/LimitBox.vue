<template>
  <div id="limit-box" :class="$i18n.locale"></div>
</template>

<style lang="scss" scoped>
#limit-box {
  position: absolute;
  width: 96px;
  height: 55px;

  background-image: url("/static/ui/mystery_boxes/limit-box/zh-TW.svg");
  background-repeat: no-repeat;
  background-size: contain;
}

.en-EN#limit-box,
.kr-KR#limit-box {
  background-image: url("/static/ui/mystery_boxes/limit-box/en-EN.svg");
  width: 96px;
  height: 56.74px;

  background-repeat: no-repeat;
  background-size: contain;
}

@media screen and (max-width: 600px) {
  #limit-box {
    position: absolute;
    width: 84px;
    height: 45px;

    background-image: url("/static/ui/mystery_boxes/limit-box/mobile_zh-TW.svg");
    background-repeat: no-repeat;
    background-size: contain;
  }

  .en-EN#limit-box,
  .kr-KR#limit-box {
    background-image: url("/static/ui/mystery_boxes/limit-box/mobile_en-EN.svg");
    width: 84px;
    height: 45px;

    background-repeat: no-repeat;
    background-size: contain;
  }
}
</style>
