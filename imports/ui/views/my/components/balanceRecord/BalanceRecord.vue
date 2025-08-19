<template>
  <div class="BalanceRecord">
    <div class="title d-flex flex-row flex-md-column align-center align-md-start justify-center">
      <div>
        <p>{{ $t('my.balanceRecord.title') }}</p>
        <div class="tips-title mt-1 mt-sm-2">{{$t('my.balanceRecord.tipsTitle')}}</div>
      </div>
      <v-spacer></v-spacer>
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
          <!-- 類型篩選 -->
          <p>{{ $t('my.balanceRecord.type') }}</p>
          <div class="type-menu">
            <div
              v-for="(item, index) in typeList"
              :key="index"
              class="listItem"
              @click.stop="selectTypeMobile(item)"
            >
              <div :class="{active: type.includes(item.type)}" class="type">
                <p>{{ item.text }}</p>
              </div> 
            </div>
          </div>
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
          <!-- 日期篩選 -->
          <p>{{ $t('my.balanceRecord.time') }}</p>
          <DateMenu :dates.sync="dates" @selectDate="selectDate" :minDate="minDate" />
        </div>
      </v-menu>
    </div>
     <div class="menu">
      <TypeMenu :typeList="typeList" :typeMap="typeMap" :type.sync="type" @selectType="selectType" />
      <CoinMenu :coinList="coinList" :coin.sync="coin" @selectCoin="selectCoin" />
      <DateMenu :dates.sync="dates" @selectDate="selectDate" :minDate="minDate" />
    </div>
    <div class="table">
      <div class="head d-none d-md-flex">
        <p class="text-left">{{ $t('my.balanceRecord.time') }}</p>
        <p class="text-left">{{ $t('my.balanceRecord.id') }}</p>
        <p class="text-left">{{ $t('my.balanceRecord.type') }}</p>
        <p class="text-left">{{ $t('my.balanceRecord.detail') }}</p>
        <p class="text-left">{{ $t('my.balanceRecord.balance') }}</p>
      </div>
      <div v-if="balanceRecordList[0]" class="body">
        <div
          v-for="(item, index) in balanceRecordList"
          :key="index"
          :class="(index + 1) % 2 === 0 ? 'light' : 'dark'"
          class="flex-column flex-md-row align-center"
          style="height:100%;"
        >
          <div class="time d-flex align-center">
            <p class="text-left d-block d-md-none">{{ $t('my.balanceRecord.time') }}</p>
            <v-spacer class="d-block d-md-none"></v-spacer>
            <p>{{ item.time }}</p>
          </div>
          <div class="id d-flex align-center">
            <p class="text-left d-block d-md-none">{{ $t('my.balanceRecord.id') }}</p>
            <v-spacer class="d-block d-md-none"></v-spacer>
            <p>{{ item.id }}</p>
          </div>
          <div class="type d-flex align-center">
            <p class="text-left d-block d-md-none">{{ $t('my.balanceRecord.type') }}</p>
            <v-spacer class="d-block d-md-none"></v-spacer>
            <p>{{ typeMap[item.type] && typeMap[item.type].text }}</p>
          </div>
          <div class="detail d-flex align-center">
            <p class="text-left d-block d-md-none">{{ $t('my.balanceRecord.detail') }}</p>
            <v-spacer class="d-block d-md-none"></v-spacer>
            <p :class="item.detailClass">{{ item.detail }}</p>
          </div>
          <div class="balance d-flex align-center">
            <p class="text-left d-block d-md-none">{{ $t('my.balanceRecord.balance') }}</p>
            <v-spacer class="d-block d-md-none"></v-spacer>
            <img :src="`/static/ui/utils/coins/${item.coin.code}.svg`">
            <p>{{ item.balance }}</p>
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
import TypeMenu from './components/typeMenu/TypeMenu'
import CoinMenu from './components/coinMenu/CoinMenu'
import DateMenu from './components/dateMenu/DateMenu'
import DefaultPage from './../utils/defaultPage/DefaultPage'
import { Token } from "/imports/api/tokens/collections";
import { UserBalance } from "/imports/api/account/collections";
import { dateFormat } from '/imports/utils/dateFormat'
import { money_filter } from '/imports/utils/money'
import { removeItem } from '/imports/utils/customMethod'
import { TokenChangeType } from '/imports/api/tokens/collections'


export default {
  name: 'BalanceRecord',
  components: {
    DefaultPage,
    TypeMenu,
    CoinMenu,
    DateMenu,
  },
  data() {
    return {
      balanceRecordList: [],
      coin: { code:'', name: '' },
      type: [],
      dates: [],
      tab: 0,
      page: 1,
      pageSize: 10,
      length: 1,
    }
  },
  computed: {
    day14before() {
      return new Date((new Date()).getTime() - 14 * 24 * 60 * 60 * 1000)
    },
    minDate() {
      const date14dayBefore = dateFormat(this.day14before, 'yyyy-MM-dd')
      return date14dayBefore
    }
  },
  created() {
    this.getBalanceRecordList(null, null, this.day14before)
    // console.log('typeMap', this.typeMap)
  },
  methods: {
    onPageChange() {
      const token = this.coin.code ? this.coin.code : null
      const type = this.type[0] ? [...this.type] : null
      const startTime = this.dates[0] ? this.dates[0] : this.day14before
      const endTime = this.dates[1] ? this.dates[1] : null
      const offset = (this.page - 1) * this.pageSize

      this.getBalanceRecordList(token, type, startTime, endTime, offset)
    },
    selectType() {
      const token = this.coin.code ? this.coin.code : null
      const type = typeof this.type[0] === 'undefined' ? null :  [...this.type]
      const startTime = this.dates[0] ? this.dates[0] : this.day14before
      const endTime = this.dates[1] ? this.dates[1] : null

      this.page = 1
      this.length = 1

      this.getBalanceRecordList(token, type, startTime, endTime)
    },
    selectTypeMobile(item) {
      let typeList = [...this.type]

      if (typeList.includes(item.type)) {
        typeList = removeItem(typeList, item.type)
      } else {
        typeList.push(item.type)
      }

      this.type = typeList
      this.selectType()
    },
    selectCoin(item) {
      const token = item ? item.code : null
      const type = this.type[0] ? [...this.type] : null
      const startTime = this.dates[0] ? this.dates[0] : this.day14before
      const endTime = this.dates[1] ? this.dates[1] : null

      this.page = 1
      this.length = 1

      this.getBalanceRecordList(token, type, startTime, endTime)
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
    selectDate() {
      const token = this.coin.code ? this.coin.code : null
      const type = typeof this.type[0] === 'undefined' ? null :  [...this.type]
      const startTime = this.dates[0] ? this.dates[0] : this.day14before
      const endTime = this.dates[1] ? this.dates[1] : null

      // console.log(startTime, endTime)

      this.page = 1
      this.length = 1

      this.getBalanceRecordList(token, type, startTime, endTime)
    },
    getBalanceRecordList(token = null, type = null, startTime = null, endTime = null, offset = 0, limit = this.pageSize) {
      Meteor.call('balanceHistory', token, type, startTime, endTime, offset, limit, (err, res) =>{
        if (err) {
            console.error('balanceHistory err', err)
            this.toasterErr(Number(err.reason) || err.reason)
          } else {
            console.log('balanceHistory res', res)
            const list = [...res.data]
            list.forEach(item => {
              item.coin = {
                code: item.tokenInfo[0] ? item.tokenInfo[0].code : null,
                name: item.tokenInfo[0] ? item.tokenInfo[0].name : item.token,
              }
              item.id = item._id._str || item._id
              item.time = dateFormat(item.createdAt, 'yyyy-MM-dd hh:mm:ss')
              item.detail = money_filter(item.changed)
              item.balance = money_filter(item.current)
              item.detailClass = item.changed < 0 ? 'minus' : 'plus'
            })

            if (res.count === 0) {
              this.length = 1
              this.page = 1
            } else {
              this.length = Math.ceil(res.count / this.pageSize)
            }

            this.balanceRecordList = [...list]
          }
      })
    }
  },
  meteor: {
    typeList() {
      const list = []
      const keys = Object.keys(TokenChangeType.vk)
      keys.forEach(key => {
        let text = TokenChangeType.vk[key]
        text = text.replace(text[0], text[0].toLowerCase())
        list.push(
          {
            type: Number(key),
            text: this.$t(`my.balanceRecord.${text}`),
          }
        )
      })

      return list
    },
    typeMap() {
      const map = {}
      const keys = Object.keys(TokenChangeType.vk)
      keys.forEach(key => {
        let text = TokenChangeType.vk[key]
        text = text.replace(text[0], text[0].toLowerCase())
        map[Number(key)] = {
          text: this.$t(`my.balanceRecord.${text}`)
        } 
      })
  
      return map
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

.BalanceRecord {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: $commonBackground3;
  padding-top: 40px;
  padding-left: 80px;
  padding-bottom: 100px;

    .tips-title {
      color:#498779;
      font-size: 16px;
      line-height: 22px;
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

    .menu {
      width: 624px;
      height: 70px;
      background: $lightBackground50;
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-bottom: 37px;
      padding-left: 11px;
      border-radius: 8px;
      box-shadow: 0px 5px 8px 1px rgba(0, 20, 15, 0.5);

      /deep/ .type-select {
        margin-right: 15px;
      }

      /deep/ .coin-select {
        margin-right: 23px;
        .v-btn__content {
          .coin {
            p {
              color: #ffffff;
            }
          }
        }
      }
    }

    .table {
      width: 62.5vw;
      box-shadow: 0px 5px 8px 1px rgba(0, 20, 15, 0.5);

      .head {
        background: $lightBackground50;
        display: flex;
        gap: 12px;
        flex-direction: row;
        justify-content: space-between;
        padding: 24px 22px 24px 24px;
        border-radius: 8px 8px 0px 0px;

        p {
          width: 200px;
          // font-size: 16px;
          color: #ffffff;
          margin-bottom: 0px;
        }

      }

      .body {
        background: $commonBackground;
        border: 1px solid #00322E;
        border-top: 0px;
        border-radius: 8px;
        padding-bottom: 5px;

        .light,
        .dark {
          display: flex;
          flex-direction: row;
          gap: 12px;
          justify-content: space-between;
          padding: 16px 22px 16px 26px;

          .time,
          .id,
          .type,
          .detail,
          .balance {
            width: 200px;
            height: 100%;
          }

          .id {
            word-break: break-all;
           }

          p {
            // font-size: 16px;
            color: #ffffff;
            margin-bottom: 0px;
          }

          .detail {
            .plus {
              color: #13AA6D;
            }

            .minus {
              color: #CF2C46;
            }
          }

          .balance {
            display: flex;
            flex-direction: row;

            img {
              width: 24px;
              height: 24px;
              margin-right: 7px;
            }
          }

        }

        .dark {
          background: $commonBackground3;
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
  .BalanceRecord {
    width: 100vw;
    padding-top: 30px;
    padding-left: 10px;
    padding-right: 10px;
    padding-bottom: 100px;

    .title {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: flex-end;

      .filter-button {
        height: 14px !important;

        p {
          font-size: 11px;
          color: #00FFCA;
        }
      }
    }


    .tips-title {
      color:#498779;
      font-size: 12px;
      line-height: 17px;
    }

    .menu {
      display: none;
      width: 100%;
      padding: 0px;
      height: 100px;
      flex-wrap: wrap;
    }

    .table {
      width: 100%;

      .body {
        border: $commonBorder;

        .light,.dark {
          padding: 24px;

          .time,
          .id,
          .type,
          .detail,
          .balance {
            width: 100%;

            p {
              margin-bottom: 0px;
            }
          }
        }
      }
    }

    .pagination {
      width: 100vw;
    }
  }

  .filter-menu {
    background: $commonBackground;
    min-width: 285px;
    box-shadow: 0px 5px 8px 1px rgba(0, 20, 15, 0.5);
    border-radius: 8px;
    padding: 12px;

    p {
      color: #ffffff;
      font-size: 11px;
      margin-bottom: 8px;
    }

    .type-menu,
    .coin-menu {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      
      .type,
      .coin {
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
          color: $mainLightColor;
        }
      }
    }
    
    .type-menu,
    .coin-menu {
      border-bottom: 1px solid #2D4742;
      padding-bottom: 10px;
      margin-bottom: 8px;
    }
  }
}

</style>
