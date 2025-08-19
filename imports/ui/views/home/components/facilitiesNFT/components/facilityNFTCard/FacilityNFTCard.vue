<template>
  <div class="facility-nft-card d-flex align-center justify-space-between pt-7 pr-7 pb-7 pl-12">

    <!-- 設施圖片卡 -->
    <div class="land-card d-flex justify-center align-center">
      <v-img width="228" height="228" contain src="/static/ui/home/facilitiesNFT/land.png"></v-img>
    </div>

    <!-- 設施細節 -->
    <div class="facility-details d-flex flex-column">
      <p class="facility-name mb-5">{{ facilityNftData.name }}</p>

      <!-- 過期時間 -->
      <div class="facility-expired d-flex mb-9">
        <div class="expired-time-remain d-flex align-center px-3 mr-3">
          <v-img width="28" height="28" contain src="/static/ui/home/facilitiesNFT/hourglass.png" class="mr-4"></v-img>
          <span class="mr-2">{{ $t('home.facilitiesNFT.facilityNFTCard.closeAt') }}</span>
          <!-- // TODO 計算時間戳去得到剩餘時間 -->
          <span class="time-remain-text">10天 2小時 18分鐘</span>
        </div>
        <div class="expired-time d-flex align-center px-4">
          <!-- // TODO 計算時間戳去得到剩餘時間 -->
          <span>10月21日 05:00</span>
        </div>
      </div>

      <v-divider class="detail-divider mb-13"></v-divider>

      <div class="detail-cards d-flex">
        <div class="detail-card d-flex flex-column justify-center align-center text-center px-2">
          <span class="detail-subject mb-1">{{ $t('home.facilitiesNFT.facilityNFTCard.subjectTitle1') }}</span>
          <span class="detail-content">{{ facilityNftData.enterPrice }} LULU</span>
        </div>
        <div class="detail-card d-flex flex-column justify-center align-center text-center px-2">
          <span class="detail-subject mb-1">{{ $t('home.facilitiesNFT.facilityNFTCard.subjectTitle2') }}</span>
          <span class="detail-content">{{ facilityNftData.tradeScale }}</span>
        </div>
        <div class="detail-card d-flex flex-column justify-center align-center text-center px-2">
          <span class="detail-subject mb-1">{{ $t('home.facilitiesNFT.facilityNFTCard.subjectTitle3') }}</span>
          <span class="detail-content">{{ $t(`home.facilitiesNFT.facilityNFTCard.fee_${facilityNftData.gasFee}`) }}</span>
        </div>
        <div class="detail-card d-flex flex-column justify-center align-center text-center px-2">
          <span class="detail-subject mb-1">{{ $t('home.facilitiesNFT.facilityNFTCard.subjectTitle4') }}</span>
          <span class="detail-content">{{ facilityNftData.timeLimit }}</span>
        </div>
        <div class="detail-card d-flex flex-column justify-center align-center text-center px-2">
          <span class="detail-subject mb-1">{{ $t('home.facilitiesNFT.facilityNFTCard.subjectTitle5') }}</span>
          <span class="detail-content">{{ facilityNftData.level }}</span>
        </div>
      </div>
    </div>

    <!-- 設施拍賣價 -->
    <div class="price-card d-flex flex-column justify-center align-center">
      <div class="price-card-title d-flex align-center mb-3">
        <v-img width="18" height="18" contain src="/static/ui/home/facilitiesNFT/pixel_coin.png" class="mr-1"></v-img>
        <span>{{ $t('home.facilitiesNFT.facilityNFTCard.salePrice') }}</span>
      </div>
      <span class="sale-price mb-3">{{ facilityNftData.salePrice }} LU</span>
      <v-btn width="156" height="48" class="checkout-market-btn rounded-pill mb-8">{{ $t('home.facilitiesNFT.facilityNFTCard.checkoutMarket') }}</v-btn>
      <p v-html="$t('home.facilitiesNFT.facilityNFTCard.saleDescription')"></p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FacilityNFTCard',
  props: {
    facilityNftData: {
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

.facility-nft-card {
  width: 100%;
  height: 400px;
  background: linear-gradient(136.3deg, #06261F 2.34%, #08322D 98.54%);
  box-shadow: 0px 5px 8px 1px rgba(0, 37, 19, 0.503391);
  border-radius: $radius_card;

  // 設施圖片卡
  .land-card {
    width: 276px;
    height: 100%;
    background: linear-gradient(136.3deg, #06261F 2.34%, #08322D 98.54%);
    box-shadow: 0px 5px 8px 1px rgba(0, 37, 19, 0.503391);
    border-radius: $radius_card;
  }

  // 設施細節
  .facility-details {
    max-width: 450px;

    .facility-name {
      font-size: 32px;
      font-weight: 600;
    }

    .facility-expired {

      .expired-time-remain {
        background: #00221A;
        border-radius: $radius_card;
        height: 48px;

        .time-remain-text {
          color: $text_price;
        }
      }

      .expired-time {
        background: #00221A;
        border-radius: $radius_card;
        height: 48px;
      }
    }

    .detail-divider {
      border: 1px solid #2D4742;
    }

    .detail-cards {
      gap: 10px;

      .detail-card {
        border: 1px solid #0BA360;
        height: 96px;
        border-radius: $radius_card;

        .detail-subject {
          font-size: 12px;
        }
  
        .detail-content {
          font-size: 14px;
          color: $text_price;
        }
      }
    }
  }

  .price-card {
    border: 1px solid #F7CD0A;
    border-radius: $radius_card;
    width: 288px;
    height: 100%;

    .price-card-title {
      color: $text_price;
    }

    .sale-price {
      font-size: 32px;
      font-weight: 600;
    }

    .checkout-market-btn {
      background: linear-gradient(268.14deg, #FFD12F 14.27%, #FF8E00 91.59%);
    }
  }
}

</style>