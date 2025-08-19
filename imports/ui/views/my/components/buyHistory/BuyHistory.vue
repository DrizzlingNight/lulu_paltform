<template>
  <div class="BuyHistory">
    <div class="back" @click="$router.push({name: 'land'})">
      <img :src="`/static/ui/assets/img/back-yellow.png`" />
      <p class="text">{{ $t('my.buyHistory.back') }}</p>
    </div>
    <div class="title">
      <p>{{ $t('my.buyHistory.title') }}</p>
    </div>
    <div class="table">
      <div class="head d-none d-md-flex">
        <p class="text-left">{{ $t('my.buyHistory.time') }}</p>
        <p class="text-left price">{{ $t('my.buyHistory.price') }}</p>
        <p class="number">{{ $t('my.buyHistory.number') }}</p>
        <p class="method">{{ $t('my.buyHistory.method') }}</p>
      </div>
      <div v-if="buyHistoryList[0]" class="body">
        <div
          v-for="(item, index) in buyHistoryList"
          :key="index"
          :class="(index + 1) % 2 === 0 ? 'light' : 'dark'"
          class="flex-column flex-md-row"
        >
          <div class="time d-flex align-center">
            <p class="text-left d-block d-md-none">{{ $t('my.buyHistory.time') }}</p>
            <v-spacer class="d-block d-md-none"></v-spacer>
            <p>{{ item.time }}</p>
          </div>
          <div class="price d-flex align-center">
            <p class="text-left d-block d-md-none">{{ $t('my.buyHistory.price') }}</p>
            <v-spacer class="d-block d-md-none"></v-spacer>
            <div v-if="item.price && item.type === 0" class="content">
              <img :src="`/static/ui/utils/coins/${item.price.coin}.svg`" :alt="`/static/ui/assets/img/coin/undefined.png`">
              <p>{{ item.price.price }}</p>
            </div>
            <div v-else class="content">
              <p> — </p>
            </div>
          </div>
          <div class="number d-flex align-center">
            <p class="text-left d-block d-md-none">{{ $t('my.buyHistory.number') }}</p>
            <v-spacer class="d-block d-md-none"></v-spacer>
            <p>{{ item.number }}</p>
          </div>
          <div class="method d-flex align-center">
            <p class="text-left d-block d-md-none">{{ $t('my.buyHistory.method') }}</p>
            <v-spacer class="d-block d-md-none"></v-spacer>
            <p>{{ $t(`${getTypeString(item.type)}`) }}</p>
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
import DefaultPage from './../utils/defaultPage/DefaultPage'
import { dateFormat } from '/imports/utils/dateFormat'
import { money_filter } from '/imports/utils/money'
import { NonFungibleTokenChangeType } from '/imports/api/nft/collections'

export default {
  name: 'BuyHistory',
  components: {
    DefaultPage,
  },
  data() {
    return {
      buyHistoryList:[],
      methodMap: {
        0: {
          text: this.$t('my.buyHistory.blindBox'),
        },
        1: {
          text: this.$t('my.buyHistory.mint'),
        },
      },
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
          price: 100,
          amount: 100,
          time: '2021-12-01 13:44:45',
          number: '00000001',
          method: 0,
        },
        {
          coin: {
            name: 'LUCK',
            code: 'LUCK'
          },
          price: 100,
          amount: 100,
          time: '2021-12-01 13:44:45',
          number: '00000001',
          method: 1,
        },
        {
          coin: {
            name: 'LUSD',
            code: 'LUSD'
          },
          price: 100,
          amount: 100,
          time: '2021-12-01 13:44:45',
          number: '00000001',
          method: 0,
        },
        {
          coin: {
            name: 'LUCK',
            code: 'LUCK_Green'
          },
          price: 100,
          amount: 100,
          time: '2021-12-01 13:44:45',
          number: '00000001',
          method: 1,
        },
        {
          coin: {
            name: 'LUSD',
            code: 'LUSD_T'
          },
          price: 100,
          amount: 100,
          time: '2021-12-01 13:44:45',
          number: '00000001',
          method: 0,
        },
      ],
    }
  },
  computed: {
  },
  created() {
    this.getBuyHistoryList()
    // console.log('boxNftPool',this.boxNftPool)
    // Meteor.call('openBlindBox', '61c04f78cd117d10572c88cf', "5", (err, res) => {console.log('openBlindBox', err, res)})
    // this.buyHistoryList = [...this.testData]
  },
  methods: {
    getTypeString(type){
      let res = NonFungibleTokenChangeType.getName(type)
      res = res.replace(res[0], res[0].toLowerCase())
      return `my.buyHistory.${res}`
    },
    onPageChange() {
      const offset = (this.page - 1) * this.pageSize

      this.getBuyHistoryList(offset)
    },
    getBuyHistoryList(offset = 0, limit = this.pageSize) {
      const params = {
        offset: offset,
        limit: limit,
      }
      Meteor.call('nftChangeRecord', params, (err, res) =>{
        if (err) {
            console.error('nftChangeRecord err', err)
            this.toasterErr(Number(err.reason) || err.reason)
          } else {
            console.log('nftChangeRecord res', res)
            const list = [...res.list]
            list.forEach(item => {
              item.time = dateFormat(item.createdAt, 'yyyy-MM-dd hh:mm:ss')
              item.price = item.userData.price ? { price: money_filter(item.userData.price), coin: item.userData.token} : null
              item.number = item.userData.idOnChain ? item.userData.idOnChain : '--'
              item.method = item.type
            })

            if (res.count === 0) {
              this.length = 1
              this.page = 1
            } else {
              this.length = Math.ceil(res.count / this.pageSize)
            }

            this.buyHistoryList = [...list]
          }
      })
    }
  },
  meteor: {
  }
}
</script>

<style lang="scss" scoped>

@import '/imports/ui/scss/theme';

.BuyHistory {
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

    .table {
      width: 62.5vw;
      box-shadow: 0px 5px 8px 1px rgba(0, 20, 15, 0.5);

      .head {
        background: $lightBackground50;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding: 24px 22px 22px 24px;
        border-radius: 8px 8px 0px 0px;

        p {
          width: 200px;
          // font-size: 16px;
          color: #ffffff;
          margin-bottom: 0px;
        }

        .price {
          width: 100px;
        }

        .number {
          text-align: left;
        }

        .method {
          text-align: left;
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
          padding: 17px 22px 0px 26px;

          .time,
          .price,
          .number,
          .method {
            width: 200px;
          }

          p {
            // font-size: 16px;
            color: #ffffff;
          }

          .number {
            word-break: break-all;
          }

          .price {
            width: 100px;
            .content {
              display: flex;
              flex-direction: row;

              img {
                width: 24px;
                height: 24px;
                margin-right: 7px;
              }
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
  .BuyHistory {
    width: 100vw;
    padding-top: 30px;
    padding-left: 10px;
    padding-right: 10px;
    padding-bottom: 100px;

    .back {
      margin-left: 0px;
    }

    .table {
      width: 100%;

      .body {
        border: 1px solid #00322E;

        .light,
        .dark {
          padding: 24px;

          .time,
          .price,
          .number,
          .method {
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
}
</style>
