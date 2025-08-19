<template>
  <div class="statistics-wrapper">
    <div class="statistics-content d-flex justify-space-between">
      <!-- 腳色類型數量 -->
      <div class="statistic-card d-flex flex-column align-center pt-11 pb-8">
        <v-img width="228" height="228" contain src="/static/ui/home/statistics/land.png" class="mb-5"></v-img>
        <span class="statistic-amount mb-1">{{ data.characters }}</span>
        <span>{{ $t('home.statistics.subjectDescription1') }}</span>
      </div>

      <!-- 設施數量 -->
      <div class="statistic-card d-flex flex-column align-center pt-11 pb-8">
        <v-img width="228" height="228" contain src="/static/ui/home/statistics/land.png" class="mb-5"></v-img>
        <span class="statistic-amount mb-1">{{ data.facilities }}</span>
        <span>{{ $t('home.statistics.subjectDescription2') }}</span>
      </div>

      <!-- 商品種類 -->
      <div class="statistic-card d-flex flex-column align-center pt-11 pb-8">
        <v-img width="228" height="228" contain src="/static/ui/home/statistics/land.png" class="mb-5"></v-img>
        <span class="statistic-amount mb-1">{{ data.products }}</span>
        <span>{{ $t('home.statistics.subjectDescription3') }}</span>
      </div>

      <!-- 首次私募幣數量 -->
      <div class="statistic-card d-flex flex-column align-center pt-11 pb-8">
        <v-img width="228" height="228" contain src="/static/ui/home/statistics/land.png" class="mb-5"></v-img>
        <span class="statistic-amount mb-1">{{ data.coins }}</span>
        <span>{{ $t('home.statistics.subjectDescription4') }}</span>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'Statistics',
  data() {
    return {
      data: {
        characters: '12',
        facilities: '42',
        products: '69',
        coins: '69,420',
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import './../../../../assets/css/utils/variables.scss';

.statistics-wrapper {
  position: relative;
  width: 100%;
  height: 760px;
  
  .statistics-content {
    z-index: 1;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 1200px;

    .statistic-card {
      width: 284px;
      background: linear-gradient(142.1deg, #007254 -41.15%, #16C9A2 94.16%);
      border: 1px solid #00FFCA;
      border-radius: $radius_card;

      .statistic-amount {
        font-size: 48px;
        font-weight: 600;
      }
    }
  }
}

</style>