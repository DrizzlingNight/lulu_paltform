<template>
  <!-- 各合約按鈕 -->
  <div
      @click="selectContract(contract._id)"
      class="contract-btn d-flex flex-column align-center"
      :class="{ 'selected': isSelected }"
  >
    <div class="contract-img-wrapper d-flex align-center justify-center">
      <v-img :src="`/static/ui/my/landDeposit/selectAddress/contract_${contract.name}.png`" max-width="224px" contain class="contract-img"></v-img>
    </div>
    <div class="contract-text d-flex align-center">
      <span class="contract-name">{{ $t(`contractName.${contract.name}`) }}</span>
      <span>NFT</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContractCard',
  props: {
    contract: {
      type: Object,
      default: () => ({})
    },
    isSelected: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({

  }),
  methods: {
    selectContract(contractId) {
      this.$emit('selectContract', contractId)
    }
  }
}
</script>

<style lang="scss" scoped>
.contract-btn {
  width: 100%;
  cursor: pointer;
  outline: 1px solid #2d4742;
  border-radius: 8px;
  box-shadow: 0px 5px 8px 1px rgba(0, 20, 15, 0.5);

  &.selected {
    position: relative;
    outline: 2px solid #00ffca;

    &::after {
      content: '';
      display: block;
      position: absolute;
      top: -1px;
      right: -1px;
      width: 40px;
      height: 40px;
      background: #00ffca;
      clip-path: polygon(0% 0%, 100% 0%, 100% 100%);
      border-radius: 0px 6px 0px 0px;
      background-image: url('/static/ui/my/landDeposit/selectChain/check.png');
      background-size: 10px;
      background-position: top 8px right 8px;
      background-repeat: no-repeat;
    }

  }

  .contract-img-wrapper {
    background: #00221A;
    height: 120px;
    width: 100%;

    .contract-img {
      width: 100% !important;
      height: 52px;
      margin-left: 0px;
    }
  }

  .contract-text {
    height: 52px;
    font-size: 18px;
    font-weight: 600;

    .contract-name {
      color: #95c6b7
    }
  }

}

@media screen and (max-width: 1264px) {
  .contract-btn {
    border-radius: 8px;

    &.selected {
      &::after {
        width: 40px;
        height: 40px;
        border-radius: 0px 6px 0px 0px;
        background-size: 10px;
        background-position: top 8px right 8px;
      }
    }

    .contract-img-wrapper {
      height: 120px;
      width: 100%;

      .contract-img {
        height: 40px;
      }
    }

    .contract-text {
      height: 52px;
      font-size: 18px;
      font-weight: 600;

      .contract-name {
        color: #95c6b7
      }
    }
  }
}

@media screen and (max-width: 960px) {
  .contract-btn {
    height: 172px;
    border-radius: 8px;

    &.selected {
      &::after {
        width: 40px;
        height: 40px;
        border-radius: 0px 6px 0px 0px;
        background-size: 10px;
        background-position: top 8px right 8px;
      }
    }

    .contract-img-wrapper {
      height: 120px;
      width: 100%;

      .contract-img {
        height: 36px;
      }
    }

    .contract-text {
      height: 52px;
      font-size: 16px;
      font-weight: 600;

      .contract-name {
        color: #95c6b7
      }
    }
  }
}

@media screen and (max-width: 960px) {
  .contract-btn {
    height: 172px;
    border-radius: 8px;

    &.selected {
      &::after {
        width: 40px;
        height: 40px;
        border-radius: 0px 6px 0px 0px;
        background-size: 10px;
        background-position: top 8px right 8px;
      }
    }

    .contract-img-wrapper {
    height: 120px;
    width: 100%;

    .contract-img {
      width: auto;
      max-height: 32px;
    }
  }

    .contract-code {
      font-size: 20px;
    }

    .contract-text {
      height: 52px;
      font-size: 16px;
      font-weight: 600;

      .contract-name {
        color: #95c6b7
      }
    }
  }
}
</style>