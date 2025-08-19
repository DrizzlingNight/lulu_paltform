<template>
  <div id="action-title-box">
    <div
      :class="[
        'px-7 py-2',
        { wait: status == 0, open: status == 1, closed: status == 2 },
      ]"
    >
      <span v-if="status == 2">{{ $t("blindBox.closed") }}</span>
      <span v-if="status == 1">{{ $t("blindBox.opening") }}</span>
      <span v-if="status == 0">{{ $t("blindBox.waiting") }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    status: {
      type: Number,
      default: 0,
    },
  },
};
</script>

<style lang="scss" scoped>
#action-title-box {
  width: auto;
  display: inline-block !important;
  display: inline;
}

span {
  font-size: 24px;
  font-weight: bold !important;
  line-height: 34px;
  color: #ffffff;
  text-align: center;
}

.wait,
.closed {
  background: linear-gradient(142.1deg, #727272 -41.15%, #cacaca 94.16%);

  /* 线 */
  border: 1px solid #2d4742;

  /* 投影 */
  box-shadow: 0px 5px 8px 1px rgba(0, 20, 15, 0.5);
  border-radius: 10px;
}

.open {
  background: linear-gradient(170.64deg, #ffb030 14.15%, #ff8000 85.1%);

  /* 投影 */
  box-shadow: 0px 5px 8px 1px rgba(0, 20, 15, 0.5);
  border-radius: 10px;
}

@media screen and (max-width: 1525px) {
  span {
    font-size: 20px;
    line-height: 30px;
  }
}

@media screen and (max-width: 1264px) {
  span {
    font-size: 16px;
    line-height: 26px;
  }

  .px-7 {
    padding-left: 24px !important;
    padding-right: 24px !important;
  }

  .py-2 {
    padding-top: 6px !important;
    padding-bottom: 6px !important;
  }
}

@media screen and (max-width: 960px) {
  span {
    font-size: 14px;
    line-height: 22px;
  }

  .px-7 {
    padding-left: 20px !important;
    padding-right: 20px !important;
  }

  .py-2 {
    padding-top: 4px !important;
    padding-bottom: 4px !important;
  }
}

@media screen and (max-width: 600px) {
  span {
    font-size: 12px !important;
    line-height: 17px !important;
  }

  .px-7 {
    padding-left: 12px !important;
    padding-right: 12px !important;
  }

  .py-2 {
    padding-top: 4px !important;
    padding-bottom: 4px !important;
  }
}
</style>
