<template>
  <v-card
    class="land-nft-card d-flex flex-column ma-1"
    :class="{
      sss: landNftData.rarity === 'SSS',
      ss: landNftData.rarity === 'SS',
      s: landNftData.rarity === 'S',
      a: landNftData.rarity === 'A',
      b: landNftData.rarity === 'B',
    }"
  >
    <v-img width="auto" height="68" contain :src="`/static/ui/home/landsNFT/rarity_text_${landNftData.rarity}.svg`" class="rarity-text"></v-img>
    <v-img min-width="300" height="300" contain :src="`/static/ui/home/landsNFT/landNFT_${landNftData.rarity}.png`" class="mb-5"></v-img>
    <div class="card-content d-flex flex-column align-center pa-5">
      <h2 class="mb-1">{{ landNftData.name }}</h2>
      <p class="card-content-text-wrapper text-center pa-6">
        豐收: +{{ landNftData.properties.foison }}%，
        正常: +{{ landNftData.properties.common }}%，
        歉收: {{ landNftData.properties.poor }}%
      </p>
    </div>
  </v-card>
</template>

<script>
export default {
  name: 'LandNFTCard',
  props: {
    landNftData: {
      type: Object,
      default() {
        return {}
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import './../../../../../../assets/css/utils/variables.scss';

.land-nft-card {
  width: 360px;
  padding-top: 68px;
  overflow: hidden;
  border-radius: $radius_card;

  // 浮水印
  &::before {
    content: 'LULU  LULU  LULU  LULU  LULU  LULU  LULU  LULU  LULU  LULU  LULU  LULU  LULU LULU  LULU';
    display: block;
    width: 1000px;
    transform: rotate(45deg);
    top: -30%;
    left: -70%;
    position: absolute;
    font-size: 96px;
    line-height: 180px;
    color: rgba($color: #ffffff, $alpha: .15)
  }

  // 卡片稀有度背景設定
  &.sss {
    background: linear-gradient(315deg, #370684 0%, #991DE0 100%);
    box-shadow: 0px 0px 8px 2px #991DE0;
  }
  &.ss {
    background: linear-gradient(311.75deg, #E09110 5.07%, #FFE987 100%);
    box-shadow: 0px 0px 8px 2px #F09200;
  }
  &.s {
    background: linear-gradient(311.75deg, #760000 5.07%, #EB1212 100%);
    box-shadow: 0px 0px 8px 2px #CF2C46;
  }
  &.a {
    background: linear-gradient(311.75deg, #005BEA 5.07%, #00C6FB 100%);
    box-shadow: 0px 0px 8px 2px #018EF3;
  }
  &.b {
    background: linear-gradient(311.75deg, #0BA360 5.07%, #3CBA92 100%);
    box-shadow: 0px 0px 8px 2px #0CA462;
  }

  .rarity-text {
    position: absolute;
    top: 10px;
    left: 20px;
  }

  .card-content {
    background: rgba(0, 0, 0, 0.5);

    .card-content-text-wrapper {
      width: 100%;
      background: rgba(0, 0, 0, 0.3);
      color: #ffffff;
      white-space: nowrap;
      border-radius: $radius_card;
    }
  }
}

</style>