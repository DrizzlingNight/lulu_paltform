<template>
  <div class="select-wallet-wrapper d-flex flex-column align-center">
    <p class="selected-chain-description mb-5">{{ $t('my.landDeposit.selectWallet.description1') }}</p>
    <div class="chain-card-wrapper mb-8 mb-sm-15">
      <ChainCard :chain="selectedChain" :isSelected="true" />
    </div>

    <!-- 選擇錢包 -->
    <p class="select-wallet-description mb-2">{{ $t('my.landDeposit.selectWallet.description2') }}</p>
    <!-- metamask -->
    <div class="wallet-btn-wrapper">
      <div @click="selectWallet(wallet.id)" v-for="wallet in wallets" :key="wallet.id" class="wallet-btn px-3 d-flex justify-space-between align-center" :class="{ 'selected': wallet.id === selectedWallet }">
        <span class="wallet-name">{{ wallet.name }}</span>
        <v-img contain :src="`/static/ui/my/landDeposit/selectWallet/${wallet.name}.png`" class="wallet-img"></v-img>
      </div>
    </div>
    <!-- 確定按鈕 -->
    <v-btn @click="submit()" :disabled="selectedWallet === 0" class="submit-btn mb-7">{{ $t('my.landDeposit.selectWallet.submit') }}</v-btn>
  </div>
</template>

<script>
import ChainCard from './../ChainCard.vue'

export default {
  name: 'SelectWallet',
  components: {
    ChainCard
  },
  props: {
    selectedChain: {
      type: Object,
      default: () => ({})
    },
    wallets: {
      type: Array,
      default: () => ([])
    }
  },
  data: () => ({
    selectedWallet: 0,
  }),
  methods: {
    // 選擇錢包
    selectWallet(walletId) {
      this.selectedWallet = walletId
    },

    // 送出確定
    submit() {
      this.$emit('walletOnSelected', this.selectedWallet)
    },
  }
}
</script>

<style lang="scss" scoped>
.select-wallet-wrapper {
  .selected-chain-description,
  .select-wallet-description {
    width: 100%;
    font-size: 18px;
  }

  .chain-card-wrapper {
    display: grid;
    width: 100%;
    grid-template-columns: repeat(3, 1fr);
  }

  .wallet-btn-wrapper {
    display: grid;
    width: 100%;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
    margin-bottom: 200px;

    .wallet-btn {
      cursor: pointer;
      // width: 280px;
      height: 60px;
      border-radius: 8px;
      border: 1px solid #00322e;

      &.selected {
        // border-width: 0px;
        background: linear-gradient(#007254, #16c9a2);
      }
  
      .wallet-name {
        font-size: 18px;
        font-weight: 600;
      }
  
      .wallet-img {
        max-width: 40px;
        height: auto;
      }
    }
  }

  .submit-btn {
    width: 380px;
    height: 48px;
    background: linear-gradient(#007254, #16C9A2);
  }
}

@media screen and (max-width: 1264px) {
  .select-wallet-wrapper {
    .selected-chain-description,
    .select-wallet-description {
      font-size: 18px;
    }

    .chain-card-wrapper {
      grid-template-columns: repeat(2, 1fr);
    }

    .wallet-btn-wrapper {
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
      margin-bottom: 200px;

      .wallet-btn {
        height: 60px;
        border-radius: 8px;
    
        .wallet-name {
          font-size: 14px;
        }
    
        .wallet-img {
          max-width: 36px;
        }
      }
    }

    .submit-btn {
      width: 380px;
      height: 48px;
    }
  }
}

@media screen and (max-width: 600px) {
  .select-wallet-wrapper {
    .selected-chain-description,
    .select-wallet-description {
      font-size: 12px;
    }

    .chain-card-wrapper {
      grid-template-columns: 1fr;
    }

    .wallet-btn-wrapper {
      grid-template-columns: 1fr;
      margin-bottom: 120px;

      .wallet-btn {
        height: 60px;
        border-radius: 8px;
    
        .wallet-name {
          font-size: 18px;
        }
    
        .wallet-img {
          max-width: 36px;
        }
      }
    }

    .submit-btn {
      width: 300px;
      height: 48px;
    }
  }
}
</style>