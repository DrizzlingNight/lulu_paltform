<template>
  <div class="facilities-nft-wrapper">
    <div class="facilities-nft-content d-flex flex-column align-center">
      <h1 class="section-title">{{ $t('home.facilitiesNFT.sectionTitle') }}</h1>
      <h2 class="section-description">{{ $t('home.facilitiesNFT.sectionDescription') }}</h2>

      <!-- 設施群組 -->
      <div class="facility-cards-wrapper d-flex flex-column align-center">
        <FacilityNFTCard v-for="facility in facilities" :key="facility.id" :facility-nft-data="facility" />
      </div>
    </div>
  </div>
</template>

<script>
import FacilityNFTCard from './components/facilityNFTCard/FacilityNFTCard.vue'

export default {
  name: 'FacilitiesNFT',
  components: {
    FacilityNFTCard
  },
  data() {
    return {
      facilities: [
        {
          id: 1,
          name: '白糖-傳統交易所',
          endTime: '時間戳記',
          enterPrice: 5,
          tradeScale: '100,000',
          gasFee: 'low',
          timeLimit: 64,
          level: 1,
          salePrice: 739
        },
        {
          id: 2,
          name: '白糖-傳統交易所',
          endTime: '時間戳記',
          enterPrice: 5,
          tradeScale: '100,000',
          gasFee: 'low',
          timeLimit: 64,
          level: 1,
          salePrice: 739
        },
        {
          id: 3,
          name: '白糖-傳統交易所',
          endTime: '時間戳記',
          enterPrice: 5,
          tradeScale: '100,000',
          gasFee: 'low',
          timeLimit: 64,
          level: 1,
          salePrice: 739
        },
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
@import './../../../../assets/css/utils/variables.scss';

.facilities-nft-wrapper {
  width: 100%;
  padding-top: 132px;
  padding-bottom: 212px;
  background-image: url('/static/ui/home/facilitiesNFT/bg.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  
  .facilities-nft-content {
    width: 1200px;
    margin: auto;
    
    // 標題
    .section-title {
      position: relative;
      font-size: 48px;

      // 聖誕樹
      &::before,
      &::after {
        content: '';
        position: absolute;
        top: 0px;
        width: 58px;
        height: 58px;
        background-image: url('/static/ui/home/facilitiesNFT/gift.png');
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
      }

      &::before {
        left: -72px;
      }
      &::after {
        right: -72px;
      }
    }

    // 大標題下小字
    .section-description {
      color: rgba($color: #ffffff, $alpha: .6);
      margin-bottom: 90px;
    }

    // 卡片群組
    .facility-cards-wrapper {
      width: 100%;
      gap: 20px;
    }
  }
}

</style>