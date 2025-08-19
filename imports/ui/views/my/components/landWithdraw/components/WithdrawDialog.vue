<template>
  <div>
    <v-dialog v-model="show" persistent :width="width">
      <v-card class="WithdrawDialog">
        <v-card-title class="">
          <p class="text">{{ title }}</p>
          <v-spacer></v-spacer>
          <img
            :src="'/static/ui/assets/img/cross-white.png'"
            @click="closeWithdrawDialog"
          />
        </v-card-title>

        <v-card-text>
          <div class="land">
            <div class="image">
              <v-img
                contain
                :src="`/static/ui/components/card/${NFTData.type}-${NFTData.level.toLowerCase()}.png`"
                class="card-image"
              />
            </div>
            <div class="detail">
              <p class="id">{{ `ID: ${NFTData.id}` }}</p>
              <p class="owner">{{ `${$t('my.landWithdraw.owner')}: ${userInfo.username}` }}</p>
              <div class="quality">
                <p>{{ `${$t('my.landWithdraw.quality')}:` }}</p>
                <img
                  :src="`/static/ui/components/card/${NFTData.level.toLowerCase()}.png`"
                  class="level-icon"
                />
              </div>
              <p class="withdrawer">{{ `${$t('my.landWithdraw.withdrawer')}: ${userInfo.username}` }}</p>
            </div>
          </div>
          <div class="network">
            <p class="title">{{ $t('my.landWithdraw.network') }}</p>
            <div class="detail">
              <p class="chain">{{ chain }}</p>
              <P class="chain-full-name">{{ $t(`my.landWithdraw.${chain.toLowerCase()}`) }}</P>
            </div>
          </div>
          <div class="address">
            <div class="title">
              <p>{{ $t('my.landWithdraw.address') }}</p>
              <v-btn class="add-button" @click="openSelectWalletDialog">{{ `${$t('my.landWithdraw.add')}+` }}</v-btn> 
            </div>
            <div class="input">
              <input 
                v-model="address"
                :placeholder="$t('my.landWithdraw.address_placeholder')"
                type="text"
              >
            </div>
          </div>
        </v-card-text>

        <v-card-actions>
          <v-btn
            :disabled="isWithdrawButtonDisabled"
            :loading="loading"
            color="primary"
            @click="withdrawOnClick"
          >
            {{ $t('my.landWithdraw.withdraw') }}
          </v-btn>
        </v-card-actions>
      </v-card>
      <SelectWalletDialog
        :show="isSelectWalletDialogShow"
        :chain="chain"
        @closeDialog="closeSelectWalletDialog"
        @updateAddress="updateAddress"
      />
      <ConfirmDialog
        v-if="isConfirmDialogShow"
        :NFTData="NFTData"
        :withdrawData="withdrawData"
        :show="isConfirmDialogShow"
        :chain="chain"
        :walletAddress="address"
        @closeDialog="closeConfirmDialog"
        @confirm="confirmWithdraw"
      />
    </v-dialog>
  </div>
</template>

<script>
import SelectWalletDialog from './SelectWalletDialog.vue'
import ConfirmDialog from './ConfirmDialog.vue'

export default {
  name: "WithdrawDialog",
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
      default() { return this.$t('my.landWithdraw.withdraw') },
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
      default: "500px",
    },
  },
  components: {
    SelectWalletDialog,
    ConfirmDialog,
  },
  data() {
    return {
      isSelectWalletDialogShow: false,
      isConfirmDialogShow: false,
      address: '',
      chain: 'BSC',
    }
  },
   computed: {
    isWithdrawButtonDisabled() {
      return !this.address
    }
  },
  created() {},
  mounted() {},
  methods: {
    closeWithdrawDialog() {
      this.address = ''
      this.$emit('closeDialog')
    },
    openSelectWalletDialog() {
      this.isSelectWalletDialogShow = true
    },
    closeSelectWalletDialog() {
      this.isSelectWalletDialogShow = false
    },
    closeConfirmDialog() {
      this.address = ''
      this.isConfirmDialogShow = false
    },
    updateAddress(address) {
      if (address) {
        this.address = address
        this.closeSelectWalletDialog()
      }
    },
    withdrawOnClick() {
      this.isConfirmDialogShow = true
      this.$emit('closeDialog')
    },
    confirmWithdraw(tokenId, walletAddress) {
      this.closeConfirmDialog()
      this.$emit('confirm', tokenId, walletAddress)
    }
  },
  meteor: {
    userInfo() {
      // console.log('user', Meteor.user())
      return Meteor.user()
    }
  }
};
</script>

<style lang="scss" scoped>
.WithdrawDialog {
  background: linear-gradient(136deg, #06261f 0%, #08322d 100%);
  border-radius: 8px;
  border: 1px solid #00ffca;
  box-shadow: 0px 5px 8px 1px rgba(0, 37, 19, 0.5);

  .v-card__title {
    // border-bottom: 1px solid #2d4742;
    padding: 26px 37px 18px 42px;

    .text {
      color: #ffffff;
      font-size: 24px;
      font-weight: bold;
      margin-left: 180px;
      margin-bottom: 0px;
    }

    img {
      cursor: pointer;
    }
  }

  .v-card__text {
    padding: 40px 37px 0px 42px;

    .land {
      display: flex;
      flex-direction: row;
      margin-bottom: 54px;

      .image {
        background: rgba(7, 24, 22, 0.5);
        border-radius: 8px;
        margin-right: 28px;
        padding: 10px;

        .card-image {
          width: 128px;
          height: 128px;
        }
      }      

      .detail {
        p {
          color: #95C6B7;
        }

        .id {
          color: #ffffff;
          font-size: 24px;
          font-weight: bold;
        }

        .owner {
          font-size: 14px;
          word-break: break-all;
        }
        

        .quality {
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          
          p {
            font-size: 18px;
          }

          .level-icon {
            width: 40px;
            height: 30px;
          }
        }

        .withdrawer {
          font-size: 18px;
          word-break: break-all;
        }
      }
    }

    .network {
      margin-bottom: 50px;

      .title {
        color: #95C6B7;
        font-size: 16px;
        margin-bottom: 7px;
      }

      .detail {
        display: flex;
        flex-direction: row;
        width: 100%;
        height: 60px;
        background: #00221A;
        border-radius: 8px;
        padding: 22px;

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
    }

    .address {
      margin-bottom: 50px;

      .title {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-start;

        p {
          color: #95C6B7;
          font-size: 16px;
        }

        .add-button {
          width: 84px;
          height: 34px;
          background: linear-gradient(311.75deg, #0BA360 5.07%, #3CBA92 100%);
          border-radius: 8px;

          /deep/ .v-btn__content {
            font-size: 16px;
          }
        }
      }

      .input {

        background: rgba(7, 24, 22, 0.5);
        width: 100%;
        height: 44px;
        border: 1px solid #2D4742;
        border-radius: 6px;

        input {
          width: 100%;
          height: 44px;
          color: #498779;
          font-size: 18px;
          padding: 11px 22px;

          &::placeholder {
            color: #498779;
            font-size: 18px;
            opacity: 1;
          }
        }
      }
    }
  }

  .v-card__actions {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 55px;

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
  .WithdrawDialog {
    .v-card__title {
      padding: 16px 17px 18px 22px;
  
      .text {
        font-size: 16px;
        margin-left: 42%;
      }
    }

    .v-card__text {
      padding: 28px 18px 0px 18px;

      .land {
        margin-bottom: 31px;
  
        .image {
          width: 73px;
          height: 73px;
          margin-right: 14px;
          padding: 5px;
  
          .card-image {
            width: 64px;
            height: 64px;
          }
        }

        .detail {
          p {
            margin-bottom: 0px;
          }

          .id {
            font-size: 14px;
          }

          .owner {
            font-size: 10px;
          }
          

          .quality {
            margin-bottom: 10px;
    
            p {
              font-size: 10px;
            }

            .level-icon {
              width: 20px;
              height: 15px;
            }
          }

          .withdrawer {
            font-size: 10px;
          }
        }
      }

      .network {
        margin-bottom: 20px;

        .title {
          font-size: 12px;
          margin-bottom: 7px;
        }

        .detail {
          width: 100%;
          height: 31px;
          padding: 9px 13px 9px 13px;

          .chain {
            font-size: 10px;
          }

          .chain-full-name {
            font-size: 10px;
            margin-left: 5px;
          }
        }
      }

      .address {
        margin-bottom: 40px;

        .title {
          p {
            font-size: 12px;
          }

          .add-button {
            width: 60px;
            height: 24px;
            border-radius: 4px;

            /deep/ .v-btn__content {
              font-size: 14px;
            }
          }
        }

        .input {
          width: 100%;
          height: 30px;

          input {
            width: 100%;
            height: 30px;
            font-size: 10px;
            padding: 9x 11px;

            &::placeholder {
              font-size: 10px;
            }
          }
        }
      }
    }

    .v-card__actions {
      padding-bottom: 46px;

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
