 <template>
  <div class="Land">
    <div :class="`limit-land-${$i18n.locale}`" class="limit-land">
      <v-btn
        class="button"
        color="primary"
        @click="detailOnclick()"
      >
        {{ $t('my.land.lookDetail') }}
      </v-btn>
    </div>
    <div class="title d-flex flex-row">
      <p class="my-land-wrapper d-flex flex-column">
        <span class="my-land mb-2">{{ $t('my.land.myLand') }}</span>
        <span class="my-land-description">{{ $t('my.land.myLandDescription') }}</span>
      </p>
      <p class="action-wrapper d-flex flex-column flex-md-row" style="height:70px;">
        <span @click="$router.push({name: 'landDeposit'})" class="action">{{ $t('my.land.landDeposit') }}</span>
        <!-- 2022.04.27 土地轉出先打開 -->
        <span @click="$router.push({name: 'landWithdraw'})" class="action">{{ $t('my.land.landWithdraw') }}</span>
        <span @click="$router.push({name: 'buyHistory'})" class="action">{{ $t('my.land.landHistory') }}</span>
      </p>
    </div>
    <div class="table">
      <div v-if="landList[0]" class="card-list-frame d-flex justify-start">
        <div class="consten-frame__inline d-flex flex-wrap justify-start">
          <div
            v-for="(item, index) in landList"
            :key="index"
            class="mystery-card mb-10 mx-2 d-flex"
          >
            <mystery-card
              :id="item.state.idOnChain"
              :level="levelTransform(item.level)"
              :type="typeTransform(item.type)"
              class="card-frame-box"
            />
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
import MysteryCard from "/imports/ui/components/mysteryCard/MysteryCard.vue";
import { NonFungibleTokenPoolLevel, NonFungibleTokenPoolType } from "/imports/api/nft/collections"

export default {
  name: 'Land',
  components: {
    DefaultPage,
    MysteryCard
  },
  data() {
    return {
      landList:[],
      page: 1,
      // pageSize: 6,
      cardWidth: 278, // 土地卡片寬度
      length: 1,
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
    pageSize() {
      if (window.innerWidth <= 600) {
        return 6
      } else if (window.innerWidth <= 960) {
        const size = Math.floor(window.innerWidth / this.cardWidth)
        return size * 2
      } else {
        const size = Math.floor(window.innerWidth * 0.625 / this.cardWidth)
        return size * 2
      }
    }
  },
  created() {
    this.getLandList()
    // console.log('window.innerWidth', window.innerWidth)
  },
  mounted() {

  },
  methods: {
    onPageChange() {
      const offset = (this.page - 1) * this.pageSize

      this.getLandList(offset)
    },
    getLandList(offset = 0, limit = this.pageSize) {
      const params = {
        offset: offset,
        limit: limit,
      }
      Meteor.call('nftItems', params, (err, res) =>{
        if (err) {
            console.error('nftItems err', err)
            this.toasterErr(Number(err.reason) || err.reason)
          } else {
            console.log('nftItems res', res)
            const list = [...res.list]
            list.forEach(item => {
              item.id = item.info.nftPool.nftId
              item.level = item.info.nftPool.info.level
              item.type = item.info.nftPool.info.type
            })

            if (res.count === 0) {
              this.length = 1
              this.page = 1
            } else {
              this.length = Math.ceil(res.count / this.pageSize)
            }

            this.landList = [...list]
          }
      })
    },
    typeTransform: (num) => {
      return NonFungibleTokenPoolType.getName(num).toLowerCase()
    },
    levelTransform: (num) => {
      return NonFungibleTokenPoolLevel.getName(num);
    },

    detailOnclick() {
      // 跳轉到幣安
      window.open('https://www.binance.com/en/nft/event/Lulumarket')
    }
  },
  meteor: {

  }
}
</script>

<style lang="scss" scoped>

@import '/imports/ui/scss/theme';

.Land {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: $commonBackground3;
  padding-top: 0px;
  padding-left: 80px;
  padding-bottom: 100px;

  .limit-land {
    position: relative;
    width: 62.5vw;
    height: 15.6vw;
    background: url('/static/ui/my/limit-land.png') no-repeat center;
    background-size: 62.5vw auto;
    margin-top: 28px;
    margin-bottom: 73px;

    .v-btn {
      position: absolute;
      left: 2vw;
      bottom: 2vw;
      width: 167px;
      border-radius: 70px;
    }

  }

  .limit-land-en-EN {
    background: url('/static/ui/my/limit-land-en.png') no-repeat center;
    background-size: 62.5vw auto;
  }

  .title {
    width: 62.5vw;
    height: 100px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 22px;

    p {
      margin-bottom: 0px;
    }

    .my-land {
      font-size: 24px;
      font-weight: bold;
      color: #ffffff;
    }

    .my-land-description {
      font-size: 16px;
      color: #498779;
    }

    .action-wrapper {
      gap: 40px;
      align-items: flex-end;

      .action {
        font-weight: 600;
        cursor: pointer;
        color: #95C6B7;
  
        &:hover {
          color: #00FFCA;
        }
      }
    }

  }

  .table {
    width: 62.5vw;

    // #mystery-card {
    //   width: 14vw;
    //   height: 29.47vw;
    //   position: relative;
    //   // padding: 0 8px 0 8px;
    // }

    .head {
      background: #00322E;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding: 24px 194px 22px 24px;
      border-radius: 8px 8px 0px 0px;

      p {
        width: 300px;
        font-size: 16px;
        color: #ffffff;
        margin-bottom: 0px;
      }
    }

    /deep/ .default-page {
      border: 1px solid #00322E;
      border-radius: 8px 8px 8px 8px;
      margin-bottom: 30px;
    }
  }

  .mystery-card {
    justify-content: start;
  }

  .pagination {
    width: 62.5vw;
    // display: flex;
    // align-items: center;
    // justify-content: center;
    // margin-top: 50px;

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
  .Land {
    width: 100vw;
    align-items: center;
    padding-top: 30px;
    padding-left: 10px;
    padding-right: 10px;
    padding-bottom: 100px;
    
    .limit-land {
      width: 100%;
      height: 20vw;
      background-size: cover;

      .v-btn {
        min-width: 120px;
        width: 120px;
        height: 32px;

        /deep/ .v-btn__content {
          font-size: 14px;
        }
      }
    }


    .title {
      width: 100%;
      height: 80px;
      padding: 0px 20px;

      .my-land {
        font-size: 24px;
      }

      .my-land-description {
        font-size: 14px;
      }

      .action-wrapper {
        justify-content: space-between;
        gap: 0px;
        .action {
          font-size: 14px;
          padding-top: 0px;
          // padding-bottom: 32px;
        }
      }

    }

    .table {
      width: 90vw;
    }

    .pagination {
      width: 90%;
    }

    .mystery-card {
      justify-content: start;
    }
  }
}

@media screen and (max-width: 600px) {
  .Land {
    
    .limit-land {
      .v-btn {
        min-width: 64px;
        width: 64px;
        height: 24px;
        left: auto;
        right: 20px;

        /deep/ .v-btn__content {
          font-size: 12px;
        }
      }
    }

    .mystery-card {
      flex-grow: 1;
      justify-content: center;
    }
  }
}

</style>
