<template>
  <!-- 各鏈按鈕 -->
  <div
      @click="selectChain(chain.chainId)"
      class="chain-btn d-flex justify-center align-center"
      :class="{ 'selected': isSelected }"
  >
    <v-img :src="`/static/ui/my/landDeposit/selectChain/chain_${chain.chainId}.svg`" contain class="chain-img mr-4 mr-md-5"></v-img>
    <span class="chain-code mr-2">{{ chain.code }}</span>
    <span class="chain-name">{{ $t(`chainName.${chain.code}`) }}</span>
  </div>
</template>

<script>
export default {
  name: 'ChainCard',
  props: {
    chain: {
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
    // 將完整鏈名轉換成縮寫
    // translateShortName(name) {
    //   const nameArr = name.split(' ')
    //   let shortName = ''
    //   nameArr.forEach(word => {
    //     shortName += word[0].toUpperCase()
    //   })
    //   return shortName
    // },

    // 將鏈id轉換成數字供i18n使用
    // chainIdToNumber(chainId) {
    //   return Number(chainId.split('x')[1])
    // },

    selectChain(chainId) {
      this.$emit('selectChain', chainId)
    }
  }
}
</script>

<style lang="scss" scoped>
.chain-btn {
  cursor: pointer;
  outline: 1px solid #2d4742;
  height: 140px;
  border-radius: 8px;

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

  .chain-img {
    max-width: 72px;
    height: auto;
  }

  .chain-code {
    font-size: 24px;
    font-weight: 700;
  }

  .chain-name {
    font-size: 18px;
    color: #95c6b7
  }
}

@media screen and (max-width: 1264px) {
  .chain-btn {
    height: 140px;
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

    .chain-img {
      max-width: 60px;
    }

    .chain-code {
      font-size: 24px;
    }

    .chain-name {
      font-size: 18px;
    }
  }
}

@media screen and (max-width: 960px) {
  .chain-btn {
    height: 140px;
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

    .chain-img {
      max-width: 48px;
    }

    .chain-code {
      font-size: 20px;
    }

    .chain-name {
      font-size: 16px;
    }
  }
}

@media screen and (max-width: 960px) {
  .chain-btn {
    height: 100px;
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

    .chain-img {
      max-width: 48px;
    }

    .chain-code {
      font-size: 20px;
    }

    .chain-name {
      font-size: 16px;
    }
  }
}
</style>