<template>
  <v-menu
      class="CoinMenu"
      slot="prepend-inner"
      offset-y
    >
    <template v-slot:activator="{ on, attrs }">
      <v-btn 
        plain
        text
        color="white"
        class="coin-select"
        v-bind="attrs"
        v-on="on"
      >
        <div class="coin">
          <img v-if="coin.code" :src="`/static/ui/utils/coins/${coin.code}.svg`" :alt="`/static/ui/assets/img/coin/undefined.png`">
          <p>{{ coin.name || title }}</p>  
        </div>
        <img 
          v-if="attrs['aria-expanded'] === 'true'"
          class="menu-up"
          src="/static/ui/components/menu-up.png"
        />
        <img
          v-else
          class="menu-down"
          src="/static/ui/components/menu-down.png"
        />
      </v-btn>
    </template>
    <v-list class="list" min-width="120">
      <v-list-item
          v-for="(item, index) in coinList"
          :key="index"
          class="listItem"
          @click="selectCoin(item)"
      >
        <div :class="{active: item.code === coin.code}" class="coin">
          <img :src="`/static/ui/utils/coins/${item.code}.svg`" :alt="`/static/ui/assets/img/coin/undefined.png`">
          <p>{{ item.name }}</p>
        </div>  
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>

export default {
  name: 'CoinMenu',
  props: {
    coinList: {
      type: Array,
      require: true,
      default: []
    },
    coin: {
      type: Object,
      require: true,
      default: function() {
        return { code: '', name: ''  }
      }
    },
    title: {
      require: false,
      default: function() { return this.$t('base.coinType') }
    },
  },
  data() {
    return {
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    selectCoin(item) {
      if (item.code === this.coin.code) {
        this.$emit('update:coin', { code: '', name: ''  })
        this.$emit('selectCoin', null)
      } else {
        this.$emit('update:coin', item)
        this.$emit('selectCoin', item)
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.coin-select {
  background: transparent;
  height: 38px;
  min-width: 120px !important;
  padding: 8px 17px 8px 21px;
  justify-content: space-between;
  border: 1px solid #44675F;
  border-radius: 4px;

  .text {
    font-size: 18px;
    height: 18px;
    line-height: 18px;
  }

  .v-btn__content {
    .coin {
      display: flex;
      flex-direction: row;
      align-items: center;

      img {
        width: 24px;
        height: 24px;
        margin-right: 7px;
      }

      p {
        font-size: 16px;
        color: #48937D;
        margin-bottom: 0px;
      }
    }
  }
  
  .menu-up,
  .menu-down {
    max-width: 12px;
    max-height: 8px;
    margin-left: 7px;
  }
}

.list {
  background: #00322E;

  .listItem {
    padding: 0px;
    margin-left: 10px;
    margin-right: 11px;
    min-height: 46px;
    
    .coin {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding-left: 15px;

      img {
        width: 24px;
        height: 24px;
        margin-right: 7px;
      }

      p {
        font-size: 16px;
        color: #48937D;
        margin-bottom: 0px;
      }
    }

    .active {
      p {
        font-weight: bold;
        color: #00FFCA;
      }
    }

    &:hover {
      color: #00322E;
    }

    /deep/ .v-ripple__container {
      background: inherit;
      color: #00322E;
    }
  }

  /deep/ .theme--light.v-list-item:focus:before {
    opacity: 0;
  }
}

@media screen and (max-width: 960px) {
  // .coin-select {
  //   min-width: 80px !important;
  // }
}
</style>