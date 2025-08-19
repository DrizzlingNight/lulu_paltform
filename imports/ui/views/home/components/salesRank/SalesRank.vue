<template>
  <div class="sales-rank-wrapper">
    <div class="sales-rank-content d-flex flex-column">
      <h1 class="section-title">{{ $t('home.salesRank.sectionTitle') }}</h1>
      <h2 class="section-description">{{ $t('home.salesRank.sectionDescription') }}</h2>

      <div class="rank-cards-wrapper d-flex justify-space-between">
        <!-- 第二名 -->
        <div class="rank-card rank2 d-flex flex-column align-center justify-start">
          <div class="badge d-flex justify-center pt-3">
            <v-img width="28" height="28" contain src="/static/ui/home/salesRank/star.svg"></v-img>
          </div>
          <v-img width="186" height="186" contain src="/static/ui/home/salesRank/land.png" class="mb-4"></v-img>
          <span class="product-name mb-4">{{ tops.top2.name }}</span>
          <span class="product-description mb-10">{{ tops.top2.description }}</span>
          <p class="product-sales-amount-wrapper d-flex align-center mb-4">
            <v-img width="28" height="28" contain src="/static/ui/home/salesRank/coin.png" class="mr-2"></v-img>
            <span>&#36;{{ tops.top2.totalAmount }} USD</span>
          </p>
          <v-btn width="150" class="checkout-product-btn rounded-pill">{{ $t('home.salesRank.checkoutProduct') }}</v-btn>
        </div>

        <!-- 第一名 -->
        <div class="rank-card rank1 d-flex flex-column align-center justify-start">
          <div class="badge d-flex justify-center pt-3">
            <v-img width="28" height="28" contain src="/static/ui/home/salesRank/star.svg"></v-img>
          </div>
          <v-img width="186" height="186" contain src="/static/ui/home/salesRank/land.png" class="mb-4"></v-img>
          <span class="product-name mb-4">{{ tops.top1.name }}</span>
          <span class="product-description mb-10">{{ tops.top1.description }}</span>
          <p class="product-sales-amount-wrapper d-flex align-center mb-4">
            <v-img width="28" height="28" contain src="/static/ui/home/salesRank/coin.png" class="mr-2"></v-img>
            <span>&#36;{{ tops.top1.totalAmount }} USD</span>
          </p>
          <v-btn width="150" class="checkout-product-btn rounded-pill">{{ $t('home.salesRank.checkoutProduct') }}</v-btn>
        </div>

        <!-- 第三名 -->
        <div class="rank-card rank3 d-flex flex-column align-center justify-start">
          <div class="badge d-flex justify-center pt-3">
            <v-img width="28" height="28" contain src="/static/ui/home/salesRank/star.svg"></v-img>
          </div>
          <v-img width="186" height="186" contain src="/static/ui/home/salesRank/land.png" class="mb-4"></v-img>
          <span class="product-name mb-4">{{ tops.top3.name }}</span>
          <span class="product-description mb-10">{{ tops.top3.description }}</span>
          <p class="product-sales-amount-wrapper d-flex align-center mb-4">
            <v-img width="28" height="28" contain src="/static/ui/home/salesRank/coin.png" class="mr-2"></v-img>
            <span>&#36;{{ tops.top3.totalAmount }} USD</span>
          </p>
          <v-btn width="150" class="checkout-product-btn rounded-pill">{{ $t('home.salesRank.checkoutProduct') }}</v-btn>
        </div>

      </div>
    </div>

    <!-- 雪花們 -->
    <v-img width="15%" height="auto" contain src="/static/ui/home/salesRank/snow_1.png" class="snow snow1"></v-img>
    <v-img width="10%" height="auto" contain src="/static/ui/home/salesRank/snow_2.png" class="snow snow2"></v-img>

  </div>
</template>

<script>
export default {
  name: 'SalesRank',
  data() {
    return {
      tops: {
        top1: {
          id: 1,
          name: '威士忌',
          description: '玉米，小麥 Frank V 酒莊',
          totalAmount: 420,
        },
        top2: {
          id: 2,
          name: '威士忌',
          description: '玉米，小麥 Frank V 酒莊',
          totalAmount: 420,
        },
        top3: {
          id: 2, 
          name: '威士忌',
          description: '玉米，小麥 Frank V 酒莊',
          totalAmount: 420,
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import './../../../../assets/css/utils/variables.scss';

.sales-rank-wrapper {
  position: relative;
  background: rgba($color: #00322e, $alpha: .2);
  width: 100%;
  height: 1176px;
  
  .sales-rank-content {
    position: absolute;
    width: 1200px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    // 標題
    .section-title {
      position: relative;
      font-size: 48px;
      align-self: flex-start;
      margin: auto;

      // 雪人
      &::before,
      &::after {
        content: '';
        position: absolute;
        top: 0px;
        width: 58px;
        height: 58px;
        background-image: url('/static/ui/home/salesRank/snow_man.png');
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
      margin: auto;
      margin-bottom: 255px;
    }

    // 排名卡片群
    .rank-cards-wrapper {
      
      // 排名卡片
      .rank-card {
        position: relative;
        width: 376px;
        padding-top: 72px;
        padding-bottom: 68px;
        background: linear-gradient(136.3deg, #06261F 2.34%, #08322D 98.54%);
        border-radius: 20px;

        // 徽章
        .badge {
          position: absolute;
          top: 0px;
          right: 36px;
          width: 40px;
          height: 68px;
          clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 50% 75%, 0% 100%);
        }

        // 商品標題
        .product-name {
          font-size: 36px;
          font-weight: 600;
        }

        // 銷售總額 wrapper
        .product-sales-amount-wrapper {
          color: $text_price;
        }

        // 查看商品明細 按鈕
        .checkout-product-btn {
          background: linear-gradient(268.14deg, #FFD12F 14.27%, #FF8E00 91.59%);
          
        }

        &.rank1 {
          bottom: 64px;
          box-shadow: 0px 0px 10px #F7CD0A;

          .badge {
            background: #F7CD0A;
          }
        }
        &.rank2 {
          bottom: 20px;
          box-shadow: 0px 0px 10px #3FAEFF;

          .badge {
            background: #3FAEFF;
          }
        }
        &.rank3 {
          box-shadow: 0px 0px 10px #00FFCA;

          .badge {
            background: #00FFCA;
          }
        }
      }
    }
  }

  // 雪花
  .snow {
    position: absolute;
    
    &.snow1 {
      top: -30%;
      right: 0;
    }
    &.snow2 {
      top: 15%;
      left: 0;
    }
  }
}

</style>