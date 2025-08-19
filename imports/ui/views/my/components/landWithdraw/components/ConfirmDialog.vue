<template>
  <div>
    <v-dialog v-model="show" persistent :width="width">
      <v-card class="ConfirmDialog">
        <v-card-title class="">
          <p class="text">{{ title }}</p>
          <v-spacer></v-spacer>
          <img
            :src="'/static/ui/assets/img/cross-white.png'"
            @click="closeConfirmDialog"
          />
        </v-card-title>

        <v-card-text>
          <div class="alert-image">
            <img src="/static/ui/my/withdraw-alert.png" />
          </div>
          <div class="title">
            <p>{{ $t('my.landWithdraw.withdrawConfirm') }}</p>            
          </div>
          <div class="description">
            <p>{{ $t('my.landWithdraw.withdrawConfirmDescription') }}</p>  
          </div>
          <div class="nft-name">
            <p>
              {{ `${$t('my.landWithdraw.NFTName')}: ` }}
              <span>{{ NFTData.id }}</span>
            </p>
            <v-spacer />
            <div class="nft-image">
              <v-img
                contain
                :src="`/static/ui/components/card/${NFTData.type}-${NFTData.level.toLowerCase()}.png`"
                class="card-image"
              />
            </div> 
          </div>
          <div class="contract-address">
            <p class="text">{{ `${$t('my.landWithdraw.contractAddress')}:` }}</p>
            <div class="content">
              <p>{{ withdrawData && withdrawData.contract.contractAddress }}</p>
              <v-spacer />
              <v-btn
                  class="copy-button"
                  text
                  color="#F7CD0A"
                  v-clipboard:copy="withdrawData && withdrawData.contract.contractAddress"
                  v-clipboard:success="onCopy"
                  v-clipboard:error="onError">
                <v-img
                    max-width="20"
                    max-height="20"
                    src="/static/ui/recharge/copy.png"
                ></v-img>
              </v-btn>
            </div>
          </div>
          <div class="token-id">
            <p class="text">{{ `${$t('my.landWithdraw.tokenId')}:` }}</p>
            <div class="content">
              <p>{{ withdrawData.tokenId }}</p>
              <v-spacer />
              <v-btn
                  class="copy-button"
                  text
                  color="#F7CD0A"
                  v-clipboard:copy="withdrawData.tokenId"
                  v-clipboard:success="onCopy"
                  v-clipboard:error="onError">
                <v-img
                    max-width="20"
                    max-height="20"
                    src="/static/ui/recharge/copy.png"
                ></v-img>
              </v-btn>
            </div>
          </div>
          <div class="network">
            <p class="chain">{{ chain }}</p>
            <P class="chain-full-name">{{ withdrawData.contract.blockchain }}</P>
          </div>
          <div class="balance">
            <p class="text">{{ $t('my.landWithdraw.balance') }}</p>
            <v-spacer />
            <p class="number">{{ `${coin && coin.amount} ${coin && coin.name}` }}</p>  
          </div>
          <div class="fee">
            <p class="text">{{ $t('my.landWithdraw.fee') }}</p>
            <v-spacer />
            <p class="number">{{ `${withdrawData && withdrawData.contract.withdrawalFee} ${withdrawData && withdrawData.contract.feeToken}` }}</p>
          </div>
          <div class="wallet-address">
            <p class="text">{{ `${$t('my.landWithdraw.walletAddress')}:` }}</p>
            <div class="content">
              <p>{{ walletAddress }}</p>
              <v-spacer />
              <v-btn
                  class="copy-button"
                  text
                  color="#F7CD0A"
                  v-clipboard:copy="walletAddress"
                  v-clipboard:success="onCopy"
                  v-clipboard:error="onError">
                <v-img
                    max-width="20"
                    max-height="20"
                    src="/static/ui/recharge/copy.png"
                ></v-img>
              </v-btn>
            </div>
          </div>
        </v-card-text>

        <v-card-actions>
          <v-btn
            :disabled="isConfirmBtnDisabled"
            :loading="loading"
            color="primary"
            @click="confirmWithdraw"
          >
            {{ $t('base.confirm') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { Token } from '/imports/api/tokens/collections'
import { UserBalance } from '/imports/api/account/collections'
import { money_filter } from '/imports/utils/money'

export default {
  name: "ConfirmDialog",
  props: {
    NFTData: {
      type: Object,
      default() { return {} },
    },
    withdrawData: {
      type: Object,
      default() { return {} },
    },
    show: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default() { return '' },
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
      default: "600px",
    },
    chain: {
      type: String,
      default: 'BSC',
    },
    walletAddress: {
      type: String,
      default: '',
    },
  },
  components: {
  },
  data() {
    return {
      chainMap: {
        'BSC': '"Binance Smart Chain'
      },
      contract: null,
    }
  },
  computed: {
    coin() {
      let coin = null
      if (this.withdrawData.contract) {
        coin = this.coinList.find(item => item.name === this.withdrawData.contract.feeToken)
      }
      return coin
    },
    isConfirmBtnDisabled() {
      if (!this.withdrawData.contract || !this.coin) return true
      if (Number(this.coin.amount) < Number(this.withdrawData.contract.withdrawalFee)) {
        return true
      } else {
        return false
      }
    },
  },
  created() {
    // this.getContract()
  },
  mounted() {
  },
  methods: {
    closeConfirmDialog() {
      this.contractAddress = ''
      this.tokenId = ''
      this.$emit('closeDialog')
    },
    onCopy() {
      this.toasterSuccess(this.$t("tip.copySuccess"))
    },
    onError() {
      this.$toast.error(this.$t("tip.copySuccess"))
    },
    getContract() {
      Meteor.call('nftContracts', (err, res) => {
        if (res[0]) {
          console.log('get nftContracts res', res)
          this.contract = res.find(item => item._id._str ? item._id._str === this.NFTData.nftId : item._id === this.NFTData.nftId)
        } else {
          console.log('get nftContracts err', err)
          this.contract = null
        }
      })
    },
    confirmWithdraw() {
      this.$emit('confirm', this.NFTData.tokenId, this.walletAddress)
    },
  },
  meteor: {
    userInfo() {
      console.log('user', Meteor.user())
      return Meteor.user()
    },
    token() {
      let token = Token.find({}).fetch()
      this.$store.commit("user/SET_TOKEN", token);
      return token
    },
    balance() {
      let balance = UserBalance.find({}).fetch()
      this.$store.commit("user/SET_BALANCE", balance);
      return balance
    },
    coinList() {
      const list = [...this.token]
      list.forEach(coin => {
        const result = this.balance.find(item => item.token === coin._id)
        if (result) {
          coin.amount = money_filter(result.amount, 4)
        } else {
          coin.amount = money_filter(0, 4)
        }
      })
      return list
    },
  }
};
</script>

<style lang="scss" scoped>
// /deep/ .v-dialog:not(.v-dialog--fullscreen) {
//     max-height: 95%;
//     position: absolute;
//     bottom: -3%;
// }

.ConfirmDialog {
  background: linear-gradient(136deg, #06261f 0%, #08322d 100%);
  border-radius: 8px;
  border: 1px solid #00ffca;
  box-shadow: 0px 5px 8px 1px rgba(0, 37, 19, 0.5);

  .v-card__title {
    display: flex;
    justify-content: flex-end;
    padding: 26px 37px 18px 42px;

    .text {
      color: #ffffff;
      font-size: 24px;
      font-weight: bold;
      margin-left: 250px;
      margin-bottom: 0px;
    }

    img {
      cursor: pointer;
    }
  }

  .v-card__text {
    padding: 0px 37px 0px 42px;

    p {
      margin-bottom: 0px;
    }

    .alert-image {
      display: flex;
      align-items: flex-start;
      justify-content: center;
  
      img {
        width: 110px;
        height: 110px;
      }
    }

    .title {
      display: flex;
      justify-content: center;
      margin-top: 41px;
  
      p {
        color: #FFFFFF;
        font-size: 32px;
        font-weight: 600;
      }
    }

    .description {
      display: flex;
      justify-content: center;
      margin-top: 7px;
      margin-bottom: 50px;
  
      p {
        color: #FFFFFF;
        font-size: 18px;
      }
    }

    .nft-name {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-bottom: 16px;
  
      p {
        color: #95C6B7;
        font-size: 18px;
        
        span {
          color: #FFFFFF;
          font-size: 18px;
        }
      }

      .nft-image {
        background: rgba(7, 24, 22, 0.5);
        border-radius: 8px;
        width: 40px;
        height: 40px;
        padding: 2px;       
  
        .card-image {
          width: 35px;
          height: 35px;
        }
      }
    }

    .contract-address,
    .token-id,
    .wallet-address {
      display: flex;
      flex-direction: column;
      margin-bottom: 20px;

      .text {
        color: #95C6B7;
        font-size: 18px;
      }

      .content {
        display: flex;
        flex-direction: row;

        p {
          color: #ffffff;
          font-size: 18px;
        }

        .copy-button {
          background: transparent !important;
          max-width: 20px;
          max-height: 20px;
          min-width: 20px;
        }
      }
    }

    .network {
      display: flex;
      flex-direction: row;
      width: 100%;
      height: 60px;
      background: #00221A;
      border-radius: 8px;
      padding: 22px;
      margin-bottom: 34px;

      .chain {
        color: #ffffff;
        font-size: 16px;
      }

      .chain-full-name {
        color: #95C6B7;
        font-size: 18px;
        margin-left: 15px;
      }
    }

    .balance {
      display: flex;
      flex-direction: row;
      margin-bottom: 10px;

      .text {
        color: #95C6B7;
        font-size: 14px;
      }

      .number {
        color: #ffffff;
        font-size: 14px;
      }
    }

    .fee {
      display: flex;
      flex-direction: row;
      margin-bottom: 26px;

      .text {
        color: #95C6B7;
        font-size: 14px;
      }

      .number {
        color: #F7CD0A;
        font-size: 14px;
      }
    }
    
    .wallet-address {
      margin-bottom: 40px;
    }
  }

  .v-card__actions {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 40px;

    .v-btn {
      width: 380px;
      height: 46px;

      /deep/ .v-btn__content {
        font-size: 16px;
      }
    }
  }
}

@media screen and (max-width: 960px) {
  /deep/ .v-dialog:not(.v-dialog--fullscreen) {
    max-width: 95%;
    max-height: 93%;
    position: absolute;
    bottom: 0%;
  }

  .ConfirmDialog {
    .v-card__title {
      padding: 16px 17px 18px 22px;
    }

    .v-card__text {
      padding: 0px 10px 0px 10px;

      p {
        margin-bottom: 0px;
      }

      .alert-image {
        img {
          width: 55px;
          height: 55px;
        }
      }

      .title {
        margin-top: 21px;
    
        p {
          font-size: 16px;
        }
      }

      .description {
        margin-top: 7px;
        margin-bottom: 30px;
    
        p {
          font-size: 12px;
        }
      }

      .nft-name {
        margin-bottom: 16px;
    
        p {
          font-size: 12px;
          
          span {
            font-size: 12px;
          }
        }

        .nft-image {
          background: rgba(7, 24, 22, 0.5);
          border-radius: 8px;
          width: 28px;
          height: 28px;
          padding: 2px;       
    
          .card-image {
            width: 24px;
            height: 24px;
          }
        }
      }

      .contract-address,
      .token-id,
      .wallet-address {
        margin-bottom: 16px;

        .text {
          font-size: 12px;
        }

        .content {
          align-items: center;

          p {
            font-size: 12px;
          }
        }
      }

      .network {
        width: 100%;
        height: 31px;
        padding: 9px 13px 9px 13px;
        margin-bottom: 14px;

        .chain {
          font-size: 10px;
        }

        .chain-full-name {
          font-size: 10px;
          margin-left: 5px;
        }
      }

      .balance {
        margin-bottom: 5px;

        .text {
          font-size: 10px;
        }

        .number {
          font-size: 10px;
        }
      }

      .fee {
        margin-bottom: 20px;

        .text {
          font-size: 10px;
        }

        .number {
          font-size: 10px;
        }
      }
      
      .wallet-address {
        margin-bottom: 20px;
      }
    }

    .v-card__actions {
      padding-bottom: 20px;

      .v-btn {
        width: 264px;
        height: 35px;

        /deep/ .v-btn__content {
          font-size: 12px;
        }
      }
    }
  }
}
</style>
