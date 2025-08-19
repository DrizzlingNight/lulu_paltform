<template>
  <div class="History">
    <div class="back" @click="$router.push({name: 'assets'})">
      <img :src="`/static/ui/assets/img/back-yellow.png`" />
      <p class="text">{{ $t('my.history.back') }}</p>
    </div>
    <div class="title">
      <p>{{ $t('my.history.title') }}</p>
    </div>
    <div class="tab">
      <v-tabs
        v-model="tab"
        background-color="rgba(7, 24, 22, 1)"
        color="#00FFCA"
        @change="onTabChange"
      >
        <v-tab>{{ $t('my.history.creditRecord') }}</v-tab>
        <v-tab>{{ $t('my.history.withdrawRecord') }}</v-tab>
      </v-tabs>
      <!-- 手機板 條件篩選 -->
      <v-menu
        slot="prepend-inner"
        offset-y
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn 
            plain
            text
            width="20"
            color="#00FFCA"
            class="filter-button d-block d-md-none"
            v-bind="attrs"
            v-on="on"
          >
            <p>{{ $t('base.conditionFilter') }}</p>
          </v-btn>
        </template>
        <div class="filter-menu">
          <!-- 幣種篩選 -->
          <p>{{ $t('base.coinType') }}</p>
          <div class="coin-menu">
            <div
              v-for="(item, index) in coinList"
              :key="index"
              class="listItem"
              @click.stop="selectCoinMobile(item)"
            >
              <div :class="{active: item.code === coin.code}" class="coin">
                <img :src="`/static/ui/utils/coins/${item.code}.svg`" :alt="`/static/ui/assets/img/coin/undefined.png`">
                <p>{{ item.name }}</p>
              </div>  
            </div>
          </div>
          <!-- 狀態篩選 -->
          <p>{{ $t('base.status') }}</p>
          <div class="status-menu">
            <div
              v-for="(item, index) in statusList"
              :key="index"
              class="listItem"
              @click.stop="selectStatusMobile(item)"
            >
              <div :class="{active: item.status === status}" class="status">
                <p>{{ item.text }}</p>
              </div> 
            </div>
          </div>
        </div>
      </v-menu>
    </div>
    <div v-if="tab === 0" class="creditTable">
      <div class="head">
        <div class="coin">
          <CoinMenu :coinList="coinList" :coin.sync="coin" :title="$t('my.history.all')" @selectCoin="selectCoin" />
        </div>
        <p class="text-left d-none d-md-block">{{ $t('my.history.creditAmount') }}</p>
        <p class="text-left d-none d-md-block">{{ $t('my.history.creditTime') }}</p>
        <div class="status">
          <StatusMenu :status.sync="status" @selectStatus="selectStatus" />
        </div>
      </div>
      <div v-if="creditList[0]" class="body">
        <div
          v-for="(item, index) in creditList"
          :key="index"
          :class="(index + 1) % 2 === 0 ? 'light' : 'dark'"
          class="flex-column flex-md-row"
        >
          <div class="coin d-flex align-center">
            <p class="text-left d-block d-md-none">{{ $t('base.coinType') }}</p>
            <v-spacer class="d-block d-md-none"></v-spacer>
            <img :src="`/static/ui/utils/coins/${item.coin.code}.svg`" :alt="`/static/ui/assets/img/coin/undefined.png`">
            <p>{{ item.coin.name }}</p>  
          </div>
          <div class="amount d-flex align-center">
            <p class="text-left d-block d-md-none">{{ $t('my.history.creditAmount') }}</p>
            <v-spacer class="d-block d-md-none"></v-spacer>
            <p>{{ item.amount }}</p>
          </div>
          <div class="time d-flex align-center">
            <p class="text-left d-block d-md-none">{{ $t('my.history.creditTime') }}</p>
            <v-spacer class="d-block d-md-none"></v-spacer>
            <p>{{ item.time }}</p>
          </div>
          <div class="status d-flex align-center">
            <p class="text-left d-block d-md-none">{{ $t('base.status') }}</p>
            <v-spacer class="d-block d-md-none"></v-spacer>
            <p :class="statusMap[item.status].class">{{ statusMap[item.status].text }}</p>
          </div>
        </div>
      </div>
      <!-- 缺省頁 -->
      <DefaultPage v-else />
    </div>
    <div v-else class="withdrawTable">
      <div class="head">
        <div class="coin">
          <CoinMenu :coinList="coinList" :coin.sync="coin" :title="$t('my.history.all')" @selectCoin="selectCoin" />
        </div>
        <p class="text-left d-none d-md-block">{{ $t('my.history.withdrawAmount') }}</p>
        <p class="text-left d-none d-md-block">{{ $t('my.history.withdrawTime') }}</p>
        <p class="text-left d-none d-md-block">{{ $t('my.history.withdrawAddress') }}</p>
        <div class="status">
          <StatusMenu :status.sync="status" @selectStatus="selectStatus" />
        </div>
      </div>
      <div v-if="withdrawList[0]" class="body">
        <div
          v-for="(item, index) in withdrawList"
          :key="index"
          :class="(index + 1) % 2 === 0 ? 'light' : 'dark'"
          class="flex-column flex-md-row"
        >
          <div class="coin d-flex align-center">
            <p class="text-left d-block d-md-none">{{ $t('base.coinType') }}</p>
            <v-spacer class="d-block d-md-none"></v-spacer>
            <img :src="`/static/ui/utils/coins/${item.coin.code}.svg`" :alt="`/static/ui/assets/img/coin/undefined.png`">
            <p>{{ item.coin.name }}</p>  
          </div>
          <div class="amount d-flex align-center">
            <p class="text-left d-block d-md-none">{{ $t('my.history.withdrawAmount') }}</p>
            <v-spacer class="d-block d-md-none"></v-spacer>
            <p>{{ item.amount }}</p>
          </div>
          <div class="time d-flex align-center">
            <p class="text-left d-block d-md-none">{{ $t('my.history.withdrawTime') }}</p>
            <v-spacer class="d-block d-md-none"></v-spacer>
            <p>{{ item.time }}</p>
          </div>
          <div class="address d-flex align-center">
            <p class="text-left d-block d-md-none">{{ $t('my.history.withdrawAddress') }}</p>
            <v-spacer class="d-block d-md-none"></v-spacer>
            <p>{{ item.address }}</p>
          </div>
          <div class="status d-flex align-center">
            <p class="text-left d-block d-md-none">{{ $t('base.status') }}</p>
            <v-spacer class="d-block d-md-none"></v-spacer>
            <p :class="statusMap[item.status].class">{{ statusMap[item.status].text }}</p>
          </div>
        </div>
      </div>
      <!-- 缺省頁 -->
      <DefaultPage v-else />
    </div>
    <div class="pagination text-center">
      <v-pagination
        v-if="length > 1"
        total-visible="7"
        v-model="page"
        :length="length"
        color="#F7CD0A"
        @input="onPageChange"
      ></v-pagination>
    </div>
  </div>
</template>

<script>
import CoinMenu from './components/CoinMenu'
import StatusMenu from './components/StatusMenu'
import DefaultPage from './../utils/defaultPage/DefaultPage'
import { Token } from "/imports/api/tokens/collections";
import { UserBalance } from "/imports/api/account/collections";
import { dateFormat } from '/imports/utils/dateFormat'
import { money_filter } from '/imports/utils/money'


export default {
  name: 'History',
  components: {
    CoinMenu,
    StatusMenu,
    DefaultPage,
  },
  data() {
    return {
      creditList:[],
      withdrawList: [],
      // coinList: [],
      coin: { code:'', name: '' },
      status: '',
      statusMap: {
        1: {
          text: this.$t('base.inprogress'),
          class: 'inprogress',
        },
        2: {
          text: this.$t('base.success'),
          class: 'success',
        },
        3: {
          text: this.$t('base.failed'),
          class: 'failed',
        },
        4: {
          text: this.$t('base.inprogress'),
          class: 'inprogress',
        },
        5: {
          text: this.$t('base.failed'),
          class: 'failed',
        },
      },
      statusList: [
        {
          status: 2,
          text: this.$t('base.success'),
        },
        {
          status: 1,
          text: this.$t('base.inprogress'),
        },
        {
          status: 3,
          text: this.$t('base.failed'),
        },
      ],
      tab: 0,
      page: 1,
      pageSize: 10,
      length: 1,
      // 未串AP之前的測試用資料
      testData: [
        {
          coin: {
            name: 'LULU',
            code: 'LULU'
          },
          amount: 234234234098.9009,
          time: '2021-12-01 13:44:45',
          address: 'ska32nwenrklw3rhkanfahfjksdfnasndf',
          status: 2,
        },
        {
          coin: {
            name: 'LUCK',
            code: 'LUCK'
          },
          amount: 234234234098.9009,
          time: '2021-12-01 13:44:45',
          address: 'ska32nwenrklw3rhkanfahfjksdfnasndf',
          status: 2,
        },
        {
          coin: {
            name: 'LUSD',
            code: 'LUSD'
          },
          amount: 234234234098.9009,
          time: '2021-12-01 13:44:45',
          address: 'ska32nwenrklw3rhkanfahfjksdfnasndf',
          status: 1,
        },
        {
          coin: {
            name: 'LUCK',
            code: 'LUCK_Green'
          },
          amount: 234234234098.9009,
          time: '2021-12-01 13:44:45',
          address: 'ska32nwenrklw3rhkanfahfjksdfnasndf',
          status: 2,
        },
        {
          coin: {
            name: 'LUSD',
            code: 'LUSD_T'
          },
          amount: 234234234098.9009,
          time: '2021-12-01 13:44:45',
          address: 'ska32nwenrklw3rhkanfahfjksdfnasndf',
          status: 3,
        },
      ],
      testCoinList: [
        {
          name: 'LULU',
          code: 'LULU'
        },
        {
          name: 'LUCK',
          code: 'LUCK'
        },
        {
          name: 'LUSD',
          code: 'LUSD'
        },
        {
          name: 'LUCK',
          code: 'LUCK_Green'
        },
        {
          name: 'LUSD',
          code: 'LUSD_T'
        },
      ],
    }
  },
  created() {
    this.getTransactionsList()
  },
  mounted() {
  },
  methods: {
    onTabChange(tab) {
      // console.log(tab)
      this.coin = { code:'', name: '' }
      this.status = ''

      const type = tab === 0 ? 1 : 2
      this.getTransactionsList(null, type)
    },
    onPageChange() {
      const type = this.tab === 0 ? 1 : 2 
      const token = this.coin.code ? this.coin.code : null
      const status = this.status ? [this.status] : null
      const offset = (this.page - 1) * this.pageSize

      this.getTransactionsList(token, type, status, null, null, offset)
    },
    selectCoin(item) {
      const type = this.tab === 0 ? 1 : 2 
      const token = item ? item.code : null
      const status = this.status ? [this.status] : null

      this.page = 1 
      this.length = 1

      this.getTransactionsList(token, type, status)
    },
    selectCoinMobile(item) {
      if (item.code === this.coin.code) {
        this.coin = { code: '', name: ''  }
        this.selectCoin(null)
      } else {
        this.coin = item
        this.selectCoin(item)
      }
    },
    selectStatus(item) {
      const type = this.tab === 0 ? 1 : 2 
      const token = this.coin.code ? this.coin.code : null
      const status = item ? [item] : null

      this.page = 1 
      this.length = 1

      this.getTransactionsList(token, type, status)
    },
    selectStatusMobile(item) {
      if (item.status === this.status) {
        this.status = ''
        this.selectStatus(null)
      } else {
        this.status = item.status
        this.selectCoin(item.status)
      }
    },
    getTransactionsList(token = null, type = 1, status = null, startTime = null, endTime = null, offset = 0, limit = this.pageSize) {
      Meteor.call('getTransactions', token, type, status, startTime, endTime, offset, limit, (err, res) =>{
        if (err) {
            console.error('getTransactions err', err)
            this.toasterErr(Number(err.reason) || err.reason)
          } else {
            console.log('getTransactions res', res)
            const list = [...res.list]
            list.forEach(item => {
              item.coin = {
                code: item.tokenInfo[0] ? item.tokenInfo[0].code : null,
                name: item.tokenInfo[0] ? item.tokenInfo[0].name : item.token,
              }
              item.time = dateFormat(item.createdAt, 'yyyy-MM-dd hh:mm:ss')
              item.amount = money_filter(item.amount)
              item.address = item.responseData ? item.responseData.address : ''
            })

            if (res.count === 0) {
              this.length = 1
              this.page = 1
            } else {
              this.length = Math.ceil(res.count / this.pageSize)
            }

            if (type === 1) {
              this.creditList = [...list]
              // this.creditList = [...this.testData]
            } else {
              this.withdrawList = [...list]
              // this.withdrawList = [...this.testData]
            }
          }
      })
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
          coin.amount = result.amount
        } else {
          coin.amount = 0
        }
      })
      return list
    }
  }
}
</script>

<style lang="scss" scoped>

@import '/imports/ui/scss/theme';

.History {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: $commonBackground3;
  padding-top: 56px;
  padding-left: 80px;
  padding-bottom: 100px;
  

    .back {
      cursor: pointer;
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-left: -40px;

      img {
        width: 18px;
        height: 18px;
      }

      .text {
        // font-size: 16px;
        color: #F7CD0A;
        margin-left: 10px;
        margin-bottom: 0px;
      }
    }

    .title {
      margin-top: 25px;
      margin-bottom: 27px;

      p {
        font-size: 24px;
        font-weight: bold;
        color: #ffffff;
        margin-bottom: 0px;
      }
    }

    .tab {
      margin-bottom: 37px;

      .v-tabs {
        .v-tab {
          // font-size: 16px;
          color: #95C6B7;
        }

        .v-tab--active {
          color: #00FFCA;
        }
      }
    }

    .creditTable,
    .withdrawTable {
      width: 62.5vw;
      box-shadow: 0px 5px 8px 1px rgba(0, 20, 15, 0.5);

      .head {
        background: #00322E;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 24px 22px 22px 24px;
        border-radius: 8px 8px 0px 0px;
        
        p {
          width: 200px;
          // font-size: 16px;
          color: #ffffff;
          margin-bottom: 0px;
        }

        .coin {
           width: 150px;
        }

        .status {
          width: 100px;
          margin-right: 13px;
        }
      }

      .body {
        background: #061d1b;
        border: 1px solid #00322E;
        border-top: 0px;
        border-radius: 8px;
        padding-bottom: 5px;

        .light,
        .dark {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          padding: 17px 22px 8px 26px;

          .coin,
          .amount,
          .time,
          .address,
          .status {
            width: 200px;
          }

          .coin {
            width: 150px;
          }

          .status {
            width: 100px;
          }

          .address {
            word-break: break-all;
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

          .status {
            .inprogress {
              color: #F7CD0A;
            }

            .success {
              background-color: inherit !important;
              color: #13AA6D;
            }

            .failed {
              color: #CF2C46;
            }
          }
        }

        .dark {
          background: $commonBackground3
        }
      }
    }

    .pagination {
      width: 62.5vw;
      // display: flex;
      // align-items: center;
      // justify-content: center;
      margin-top: 50px;
      
      // /deep/ .v-pagination__item {
      //   width: 40px;
      //   height: 40px;
      //   // font-size: 24px;
      // }

      // /deep/ .v-pagination__navigation {
      //   width: 40px;
      //   height: 40px;
      // }
    }
}

@media screen and (max-width: 960px) {
  .History {
    width: 100vw;
    padding-top: 30px;
    padding-left: 10px;
    padding-right: 10px;
    padding-bottom: 100px;
    
    .back {
      margin-left: 0px;
    }

    .tab {
      display: flex;
      flex-direction: row;
      align-items: flex-end;
    }

    .creditTable,
    .withdrawTable {
      width: 100%;

      .head {
        display: none;
      }

      .body {
        border: 1px solid #00322E;

        .light,
        .dark {
          padding: 24px;

          .coin,
          .amount,
          .time,
          .address,
          .status  {
            width: 100%;
            margin-bottom: 10px;

            p {
              margin-bottom: 0px;
            }
          }
        }
      }

      /deep/ .default-page {
        border: 1px solid #00322E;
        border-radius: 8px 8px 8px 8px;
      }
    }

    .pagination {
      width: 100vw;
    }
  }

  .filter-menu {
    background: #00322E;
    min-width: 285px;
    box-shadow: 0px 5px 8px 1px rgba(0, 20, 15, 0.5);
    border-radius: 8px;
    padding: 12px;

    p {
      color: #ffffff;
      font-size: 11px;
      margin-bottom: 8px;
    }

    .coin-menu,
    .status-menu {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;

      .coin,
      .status {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-right: 13px;

        img {
          width: 20px;
          height: 20px;
          margin-right: 7px;
        }

        p {
          font-size: 11px;
          line-height: 20px;
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
    }

    .coin-menu {
      border-bottom: 1px solid #2D4742;
      padding-bottom: 10px;
      margin-bottom: 8px;
    }
  }
}

</style>
