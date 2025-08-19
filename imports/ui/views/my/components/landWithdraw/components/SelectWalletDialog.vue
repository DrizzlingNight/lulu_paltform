<template>
  <div>
    <v-dialog v-model="show" persistent :width="width">
      <v-card class="SelectWalletDialog">
        <v-card-title class="">
          <p class="text">{{ title }}</p>
          <v-spacer></v-spacer>
          <img
            :src="'/static/ui/assets/img/cross-white.png'"
            @click="$emit('closeDialog')"
          />
        </v-card-title>

        <v-card-text>
          <v-btn
            v-for="(item, index) in walletOptions" :key="index"
            color="primary"
            class="button"
            @click="selectWallet(item)"
          >
            {{ $t(`my.landWithdraw.${item}`) }}
            <v-spacer />
            <img :src="`/static/ui/my/${item}.png`" />
          </v-btn>
        </v-card-text>

        <v-card-actions>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import metaMask from "/imports/api/walletConnect/metaMask";

export default {
  name: "SelectWalletDialog",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default() { return this.$t('my.landWithdraw.selectWallet') } ,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    width: {
      type: String,
      default: "466px",
    },
    walletOptions: {
      type: Array,
      default() { return ['metamask']}
    },
    chain: {
      type: String,
      default: 'BSC',
    },
  },
  data() {
    return {
    };
  },
  created() {},
  mounted() {},
  methods: {
    selectWallet(item) {
      if (item === 'metamask') {
        this.connectWithMetamask(this.chain)
      }
    },
    async connectWithMetamask(chain) {
      await metaMask.getWalletInfo(chain).then(res => {
        console.log('getWalletInfo res', res)
        const info = res
        this.$emit('updateAddress', info)
        this.toasterSuccess(this.$t("tip.addSuccess"))
      }).catch(err => {
        console.log('getWalletInfo err', err)
        this.$toast.error(this.$t("tip.addFailed"))
      })
    }
  },
};
</script>

<style lang="scss" scoped>
.SelectWalletDialog {
  background: linear-gradient(136deg, #06261f 0%, #08322d 100%);
  border-radius: 8px;
  border: 1px solid #00ffca;
  box-shadow: 0px 5px 8px 1px rgba(0, 37, 19, 0.5);

  .v-card__title {
    border-bottom: 1px solid #2d4742;
    padding: 26px 37px 18px 42px;

    .text {
      color: #ffffff;
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 0px;
    }

    img {
      cursor: pointer;
    }
  }

  .v-card__text {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 47px;
    padding: 0px 0px 0px 0x;

    .button {
      width: 280px;
      height: 60px;

      /deep/ .v-btn__content {
        font-size: 18px;
      }

      img {
        width: 40px;
        height: 40px;
      }
    }
  }

  .v-card__actions {

  }
}

@media screen and (max-width: 960px) {
  .SelectWalletDialog {

    .v-card__title {
      padding: 17px 13px 14px 21px;

      .text {
        font-size: 16px;
      }

      img {
        width: 22px;
        height: 22px;
      }
    }
  }

  .v-card__text {
    margin-top: 9px;

    .button {
      width: 232px;
      height: 49px;

      /deep/ .v-btn__content {
        font-size: 18px;
      }

      img {
        width: 32px;
        height: 32px;
      }
    }
  }
}
</style>
