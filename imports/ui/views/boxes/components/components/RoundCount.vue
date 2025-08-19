<template>
  <div id="round-count-box">
    <div class="content-box d-flex justify-center align-center pr-6 pb-10">
      <div :class="['count-text', `${$i18n.locale}`]">
        {{ $t("blindBox.round2") }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#round-count-box {
  position: relative;
  z-index: 1;
}

.content-box {
  width: 220px;
  height: 99.5px;
  background-image: url("static/ui/mystery_boxes/round-box.svg");
  background-repeat: no-repeat;
  background-size: contain;
}

.count-text {
  color: #603400;
  font-size: 28px;
  font-weight: bolder;
  line-height: 25px;
  max-width: 100px;
  text-align: center;
}

@media screen and (max-width: 1264px) {
  .content-box {
    width: 160px;
    height: 84.5px;
  }

  .count-text {
    color: #603400;
    font-size: 20px;
    line-height: 20px;
  }
}

@media screen and (max-width: 960px) {
  .content-box {
    width: 130px;
    height: 76.5px;
  }

  .count-text {
    color: #603400;
    font-size: 16px;
    line-height: 16px;
  }
}

@media screen and (max-width: 600px) {
  .content-box {
    width: 110px;
    height: 70px;
    background-image: url("static/ui/mystery_boxes/mobile-round-box.svg");
    background-repeat: no-repeat;
    background-size: contain;
  }

  .count-text {
    color: #603400;
    font-size: 14px;
    line-height: 14px;
  }

  .pr-6 {
    padding-right: 20px !important;
    padding-left: 5px;
  }
}
</style>
