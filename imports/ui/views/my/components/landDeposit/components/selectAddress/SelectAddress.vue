<template>
  <div class="select-address-wrapper">
    <!-- 地址卡片 -->
    <div class="address-card d-flex align-center px-5 py-6">
      <!-- 錢包地址 -->
      <div class="wallet-address-wrapper">
        <p class="wallet-address-description mb-1">{{ $t('my.landDeposit.selectAddress.walletAddressDescription') }}</p>
        <div class="address-wrapper d-flex align-center px-5 py-2 py-sm-5">
          <v-img :src="`/static/ui/my/landDeposit/selectChain/chain_${selectedChain.chainId}.svg`" class="address-img mr-2"></v-img>
          <!-- 錢包地址字串 -->
          <!-- metamask -->
          <span v-if="selectedWallet.id === 1" class="address-text">{{ walletAddress || '-' }}</span>
          <!-- walletConnect -->
          <span v-if="selectedWallet.id === 2 && !isWalletConnectChainInvalid" class="address-text">{{ walletAddress || '-' }}</span>
          <span v-if="selectedWallet.id === 2 && isWalletConnectChainInvalid" class="address-text" v-html="$t('my.landDeposit.selectAddress.wrongChain', [selectedChain.code])"></span>
          <v-spacer></v-spacer>
          <v-icon @click="copyAddress" color="#ffffff" small class="ml-1">mdi-content-copy</v-icon>
        </div>
      </div>
    </div>

    <!-- 合約選擇棄包皮 -->
    <div class="contract-wrapper px-5 pt-2 pt-sm-6 pb-6 pb-sm-13">
      <p class="contract-select-description mb-2 mb-sm-6">{{ $t('my.landDeposit.selectAddress.contractSelectDescription') }}</p>
      <!-- 合約卡片群 -->
      <div class="contract-btn-wrapper">
        <ContractCard v-for="contract in contracts" :key="contract._id" :contract="contract" :isSelected="selectedContract._id === contract._id" @selectContract="contractOnselect" />
      </div>
    </div>
  </div>
</template>

<script>
import ContractCard from './components/ContractCard.vue'

import { mapGetters } from 'vuex'

export default {
  name: 'SelectAddress',
  components: {
    ContractCard
  },
  props: {
    contracts: {
      type: Array,
      default: () => []
    },
    selectedContract: {
      type: Object,
      default: () => {}
    },
    selectedChain: {
      type: Object,
      default: () => ({})
    },
    selectedWallet: {
      type: Object,
      default: () => ({})
    },
    walletAddress: {
      type: String,
      default: ''
    },
  },
  data: () => ({
  }),
  computed: {
    ...mapGetters(['user', 'walletConnectChainId']),
    // 
    isAddressInvalid() {
      return !this.walletAddress || !this.selectedContract._id
    },
    isWalletConnectChainInvalid() {
      return this.selectedChain.chainId.split('x')[1].toString() !== parseInt(this.walletConnectChainId).toString(16)
    },
  },
  methods: {
    // 複製地址
    copyAddress() {
      const el = document.createElement('textarea')
      el.value = this.walletAddress
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      this.toasterSuccess(this.$t('my.landDeposit.selectAddress.copySucceed'))
    },

    // 合約被選了
    contractOnselect(contractId) {
      this.$emit('contractSelected', contractId)
    }
  }
}
</script>

<style lang="scss" scoped>
.select-address-wrapper {
  width: 100%;

  .address-card {
    width: 100%;
    border: 1px solid #2d4742;
    background: #00322e;
    border-radius: 8px;
    margin-bottom: 24px;

    .wallet-address-wrapper {
      width: 100%;
      
      .wallet-address-description {
        font-size: 14px;
        font-weight: 600;
      }

      .address-wrapper {
        background: rgba(0, 50, 46, 0.5);
        box-shadow: 0px 5px 8px 1px rgba(0, 20, 15, 0.5);
        border-radius: 8px;

        .address-img {
          max-width: 20px;
          height: auto;
        }

        .address-text {
          display: block;
          max-width: 80%;
          font-size: 14px;
          word-break: break-all;
        }
      }
    }
  }

  .contract-wrapper {
    width: 100%;
    border: 1px solid #2d4742;
    background: #00322e;
    border-radius: 8px;

    .contract-select-description {
      font-size: 14px;
      font-weight: 600;
    }

    .contract-btn-wrapper {
      display: grid;
      width: 100%;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }
  }
}

@media screen and (max-width: 1264px) {
  .select-address-wrapper {
    width: 100%;

    .address-card {
      width: 100%;
      border: 1px solid #2d4742;
      background: #00322e;
      border-radius: 8px;
      margin-bottom: 24px;

      .wallet-address-wrapper {
        width: 100%;
        
        .wallet-address-description {
          font-size: 14px;
          font-weight: 600;
        }

        .address-wrapper {
          background: rgba(0, 50, 46, 0.5);
          box-shadow: 0px 5px 8px 1px rgba(0, 20, 15, 0.5);
          border-radius: 8px;

          .address-img {
            max-width: 20px;
            height: auto;
          }

          .address-text {
            display: block;
            max-width: 80%;
            font-size: 14px;
            word-break: break-all;
          }
        }
      }
    }

    .contract-wrapper {
      width: 100%;
      border: 1px solid #2d4742;
      background: #00322e;
      border-radius: 8px;

      .contract-select-description {
        font-size: 14px;
        font-weight: 600;
      }

      .contract-btn-wrapper {
        display: grid;
        width: 100%;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
      }
    }
  }
}

@media screen and (max-width: 960px) {
  .select-address-wrapper {
    .address-card {
      gap: 0px;
      flex-direction: column;

      .wallet-address-wrapper {
        width: 100%;
        margin-bottom: 40px;
        
        .wallet-address-description {
          font-size: 14px;
        }

        .address-wrapper {

          .address-img {
            max-width: 20px;
          }

          .address-text {
            display: block;
            max-width: 80%;
            font-size: 14px;
          }
        }
      }
    }

    .contract-wrapper {
      .contract-select-description {
        font-size: 14px;
      }

      .contract-btn-wrapper {
        grid-template-columns: 1fr;
        gap: 16px;
      }
    }
  }
}

@media screen and (max-width: 600px) {
  .select-address-wrapper {
    .address-card {

      .wallet-address-wrapper {
        width: 100%;
        margin-bottom: 16px;
        
        .wallet-address-description {
          font-size: 14px;
        }

        .address-wrapper {
          .address-img {
            max-width: 20px;
          }

          .address-text {
            max-width: 80%;
            font-size: 12px;
          }
        }
      }
    }

    .contract-wrapper {
      .contract-select-description {
        font-size: 14px;
      }

      .contract-btn-wrapper {
        grid-template-columns: 1fr;
        gap: 16px;
      }
    }
  }
}
</style>