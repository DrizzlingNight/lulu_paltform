<template>
  <div class="Assets">
    <div class="title">
      <p class="my-assets">{{ $t('my.assets.myAssets') }}</p>
      <p class="history" @click="$router.push({name: 'history'})">{{ $t('my.assets.history') }}</p>
    </div>
    <div class="table">
      <div class="head">
        <p class="text-left coin">{{ $t('my.assets.coin') }}</p>
        <p class="amount">{{ $t('my.assets.amount') }}</p>
        <p class="text-left operation">{{ $t('my.assets.operation') }}</p>
      </div>
      <div class="body">
        <div
            v-for="(item, index) in coinList"
            :key="index"
            :class="(index + 1) % 2 === 0 ? 'light' : 'dark'"
        >
          <div class="coin">
            <img :src="`/static/ui/utils/coins/${item.code}.svg`" :alt="`/static/ui/assets/img/coin/undefined.png`">
            <p>{{ item.name }}</p>
          </div>
          <div class="amount">
            <p>{{ item.amount }}</p>
          </div>
          <div class="operation d-none d-md-flex">
            <p @click="toasterComingSoon()">{{ $t('my.assets.addressManage') }}</p>
            <p v-if="isCredit(item)" @click="goCredit(item)">{{ $t('my.assets.credit') }}</p>
            <p v-if="isWithdraw(item)" @click="goWithdraw(item)">{{ $t('my.assets.withdraw') }}</p>
          </div>
          <div class="operation-mobile d-flex d-md-none">
            <v-menu
              slot="prepend-inner"
              offset-y
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn 
                  plain
                  text
                  width="20"
                  color="white"
                  class="button"
                  v-bind="attrs"
                  v-on="on"
                >
                  <img :src="`/static/ui/my/operation-mobile.png`" >
                </v-btn>
              </template>
              <v-list class="list" min-width="52">
                <v-list-item class="listItem py-2"> 
                  <p @click="toasterComingSoon()">{{ $t('my.assets.addressManage') }}</p>
                </v-list-item>
                <v-list-item class="listItem py-2"> 
                  <p v-if="isCredit(item)" @click="goCredit(item)">{{ $t('my.assets.credit') }}</p>
                </v-list-item>
                <v-list-item class="listItem py-2"> 
                  <p v-if="isWithdraw(item)" @click="goWithdraw(item)">{{ $t('my.assets.withdraw') }}</p>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {Token} from "/imports/api/tokens/collections";
import {UserBalance} from "/imports/api/account/collections";
import { money_filter } from '/imports/utils/money'

export default {
  name: 'Assets',
  data() {
    return {
      // coinList:[],
      testData: [
        {
          coin: {
            name: 'LULU',
            code: 'LULU'
          },
          amount: 69.9991
        },
        {
          coin: {
            name: 'LUCK',
            code: 'LUCK'
          },
          amount: 59.8886
        },
        {
          coin: {
            name: 'LUSD',
            code: 'LUSD'
          },
          amount: 77.6666
        },
        {
          coin: {
            name: 'LUCK',
            code: 'LUCK_Green'
          },
          amount: 55.7777
        },
        {
          coin: {
            name: 'LUSD',
            code: 'LUSD_T'
          },
          amount: 48.8888
        },
      ]
    }
  },
  computed: {
    isCredit() {
      return (item) => {
        if (item.deposit) {
          return true
        } else return false
      }
    },
    isWithdraw() {
      return (item) => {
        if (item.withdraw) {
          return true
        } else return false
      }
    }
  },
  created() {
    // this.coinList = [...this.testData]
    // this.coinList = [...this.token]
  },
  methods: {
    goCredit(item) {
      this.$store.commit("ui/SET_IS_SHOW_MONEY_DIALOG", true);
      this.$store.commit("ui/SET_IS_SHOW_RECHARGE_DIALOG", true);
      this.$store.commit("ui/SET_CODE_TYPE", item.name);
    },
    goWithdraw(item) {
      this.$store.commit("ui/SET_IS_SHOW_MONEY_DIALOG", true);
      this.$store.commit("ui/SET_IS_SHOW_RECHARGE_DIALOG", false);
      this.$store.commit("ui/SET_CODE_TYPE", item.name);
    }
  },
  meteor: {
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
}
</script>

<style lang="scss" scoped>

@import '/imports/ui/scss/theme';

.Assets {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: $commonBackground3;
  padding-top: 56px;
  padding-left: 80px;


  .title {
    width: 62.5vw;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 22px;

    p {
      margin-bottom: 0px;
    }

    .my-assets {
      font-size: 24px;
      font-weight: bold;
      color: #ffffff;
    }

    .history {
      cursor: pointer;
      // font-size: 16px;
      color: #95C6B7;

      &:hover {
        color: $mainLightColor;
      }
    }
  }

  .table {
    width: 62.5vw;
    box-shadow: 0px 5px 8px 1px rgba(0, 20, 15, 0.5);

    .head {
      background: $lightBackground;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding: 24px 26px 22px 24px;
      border-radius: 8px 8px 0px 0px;

      p {
        width: 300px;
        // font-size: 16px;
        color: #ffffff;
        margin-bottom: 0px;
      }

      .coin {
        padding-left: 5px;
      }

      .amount {
        text-align: left;
      }
    }

    .body {
      background: $bodyBackgroundColor;
      border: 1px solid $commonBackground2;
      border-top: 0px;
      border-radius: 8px;
      padding-bottom: 5px;

      .light,
      .dark {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding: 17px 26px 8px 26px;

        .coin,
        .amount,
        .operation {
          width: 300px;
        }

        p {
          // font-size: 16px;
          color: #ffffff;
          margin-bottom: 0px;
        }

        .coin {
          display: flex;
          flex-direction: row;
          align-items: center;

          img {
            width: 24px;
            height: 24px;
            margin-right: 7px;
          }
        }

        .operation {
          display: flex;
          flex-direction: row;
          justify-content: space-between;

          p {
            cursor: pointer;
            color: $commonContentColorGray;

            &:hover {
              color: $mainLightColor;
            }
          }
        }
      }

      .dark {
        background: $commonBackground3
      }
    }
  }

}

@media screen and (max-width: 960px) {
  .Assets {
    width: 100vw;
    height: auto;
    min-height: 70vh;
    padding-top: 30px;
    padding-left: 10px;
    padding-right: 10px;
    padding-bottom: 100px;
    

    .title {
      width: 100%;
    }

    .table {
      width: 100%;

      .head {
        padding-left: 38px;
        padding-right: 50px;

        p {
          width: auto;
        }

        .amount {
          width: 30%;
          justify-content: center;
          text-align: center;
        }
      }

      .body {
        .light,
        .dark {
          align-items: center;
          padding-left: 38px;
          padding-right: 50px;
          flex-wrap: wrap;

          .coin,
          .amount,
          .operation-mobile {
            width: 30%;
          }

          .amount {
            width: 30%;

            p {
              text-align: center;
            } 
          }

          .operation-mobile {
            display: flex;
            justify-content: flex-end;

            .button {
              min-width: 20px !important;
              height: 5px !important;
              padding: 0px;
            }
          }


        }
      }
    }

    .pagination {
      width: 100vw;
    }
  }

  .list {
    background: #071816;

    .listItem {
      min-height: 18px !important;
      justify-content: center;
      align-items: center;
      margin: 0px 0px;

      p {
        color: #95C6B7;
        margin-bottom: 0px;
      }

      &:hover {
        color: #00FFCA;
      }

      /deep/ .v-ripple__container {
        background: inherit;
        color: #95C6B7;
      }
    }
  }
}

</style>
