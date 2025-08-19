<template>
  <div id="rare-nft-box">
    <div class="content-box">
      <div class="mx-2">{{ $t("blindBox.limited") }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.content-box {
  display: inline-block;

  border: 1px solid transparent;
  border-radius: 8px 8px 0 8px;
  background-image: linear-gradient(315deg, #6b0684 0%, #f30fb3 100%),
    linear-gradient(90deg, #f74646 0%, #ffb4d8 100%);
  box-shadow: 0px 0px 8px #2f0687;
  background-attachment: fixed, scroll;
  background-clip: padding-box, border-box;
  background-origin: padding-box, border-box;
}

.content-box div {
  color: #ffffff;
  font-weight: bold;
  font-size: 18px;
  line-height: 25px;
  padding: 2px 4px !important;
}
</style>
