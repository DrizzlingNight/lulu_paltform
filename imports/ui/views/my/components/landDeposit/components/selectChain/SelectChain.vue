<template>
  <div class="select-chain-wrapper d-flex flex-column align-center">
    <p class="select-chain-description mb-5">{{ $t('my.landDeposit.selectChain.description') }}</p>
    <!-- 各NFT鏈按鈕包皮 -->
    <div class="chain-btn-wrapper">
      <ChainCard v-for="chain in chains" :key="chain.id" :chain="chain" :isSelected="selectedChainId === chain.chainId" @selectChain="chainOnselect" />
    </div>
    <!-- 確定按鈕 -->
    <v-btn @click="submit()" :disabled="!selectedChainId" class="submit-btn">{{ $t('my.landDeposit.selectChain.submit') }}</v-btn>
  </div>
</template>

<script>
import ChainCard from './../ChainCard.vue'

export default {
  name: 'SelectChain',
  components: {
    ChainCard
  },
  props: {
    chains: {
      type: Array,
      default:() => ([])
    },
  },
  data: () => ({
    selectedChainId: '',
  }),
  methods: {
    // 鏈被選了
    chainOnselect(chainId) {
      this.selectedChainId = chainId
    },
    
    // 確定
    submit() {
      this.$emit('chainOnSelected', this.selectedChainId)
    }
  }
}
</script>

<style lang="scss" scoped>
.select-chain-wrapper {
  width: 100%;
  height: 100%;

  .select-chain-description {
    width: 100%;
    font-size: 18px;
  }

  .chain-btn-wrapper {
    display: grid;
    width: 100%;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-bottom: 200px;
  }

  .submit-btn {
    width: 380px;
    height: 48px;
    background: linear-gradient(#007254, #16C9A2);
  }
}

@media screen and (max-width: 1264px) {
  .select-chain-wrapper {

    .select-chain-description {
      font-size: 18px;
    }

    .chain-btn-wrapper {
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      margin-bottom: 200px;
    }

    .submit-btn {
      width: 380px;
      height: 48px;
    }
  }
}

@media screen and (max-width: 960px) {
  .select-chain-wrapper {
    .select-chain-description {
      font-size: 18px;
    }

    .chain-btn-wrapper {
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      margin-bottom: 200px;
    }

    .submit-btn {
      width: 380px;
      height: 48px;
    }
  }
}

@media screen and (max-width: 600px) {
  .select-chain-wrapper {
    .select-chain-description {
      font-size: 14px;
    }

    .chain-btn-wrapper {
      grid-template-columns: 1fr;
      gap: 16px;
      margin-bottom: 200px;
    }

    .submit-btn {
      width: 300px;
      height: 48px;
    }
  }
}
</style>