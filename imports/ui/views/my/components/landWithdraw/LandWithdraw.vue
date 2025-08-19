<template>
  <div class="land-withdraw">
    <div class="back" @click="$router.push({name: 'land'})">
      <img :src="`/static/ui/assets/img/back-yellow.png`" />
      <p class="text">{{ $t('my.buyHistory.back') }}</p>
    </div>
    <div class="title d-flex">
      <p class="d-flex flex-column">
        <span class="land-withdraw-title">{{ $t('my.landWithdraw.title') }}</span>
        <span class="land-withdraw-description">{{ $t('my.landWithdraw.description') }}</span>
      </p>
    </div>
    <div class="table">
      <div v-if="landList[0]" class="card-list-frame d-flex justify-center">
        <div class="consten-frame__inline d-flex flex-wrap justify-start">
          <div
            v-for="(item, index) in landList"
            :key="index"
            class="mystery-card mb-10 mx-2 d-flex"
            @click="landOnClick(item)"
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
    <!-- 轉出彈窗 -->
    <WithdrawDialog
      v-if="NFTData"
      :show="isWithdrawDialogShow"
      :NFTData="NFTData"
      :withdrawData="withdrawData"
      @closeDialog="closeDialog"
      @confirm="withdrawLand"
    />
  </div>
</template>

<script>
import WithdrawDialog from './components/WithdrawDialog.vue'
import DefaultPage from './../utils/defaultPage/DefaultPage.vue'
import MysteryCard from "/imports/ui/components/mysteryCard/MysteryCard.vue";
import { NonFungibleTokenPoolLevel, NonFungibleTokenPoolType } from "/imports/api/nft/collections"

export default {
  name: 'LandWithdraw',
  components: {
    WithdrawDialog,
    DefaultPage,
    MysteryCard
  },
  data() {
    return {
      isWithdrawDialogShow: false,
      landList:[],
      NFTData: null,
      withdrawData: null,
      page: 1,
      // pageSize: 6,
      cardWidth: 278, // 土地卡片寬度
      length: 1,
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
    closeDialog() {
      this.isWithdrawDialogShow = false
    },
    onPageChange() {
      const offset = (this.page - 1) * this.pageSize

      this.getLandList(offset)
    },
    getLandList(offset = 0, limit = this.pageSize) {
      const params = {
        offset: offset,
        limit: limit,
        withdraw: true,
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
      return NonFungibleTokenPoolLevel.getName(num)
    },
    landOnClick(item) {
      console.log('landOnClick item', item)
      const data = {...item}
      data.id = item.state.idOnChain
      data.level = this.levelTransform(item.level)
      data.type = this.typeTransform(item.type)
      data.tokenId = item._id

      this.getWithdrawData(data.tokenId)

      this.NFTData = {...data}
      this.isWithdrawDialogShow = true
    },
    async getWithdrawData(id) {
      Meteor.call('getWithdrawNftItem', id, (err, res) => {
        if (err) {
          console.log('getWithdrawNftItem err', err)
          this.toasterErr(Number(err.reason) || err.reason)
          this.withdrawData = null
        } else {
          console.log('getWithdrawNftItem', res)
          this.withdrawData = res
        }
      })
    },
    async withdrawLand(tokenId, walletAddress) {
      console.log(`nftWithdraw tokenId:${tokenId}, walletAddress:${walletAddress}`)
      Meteor.call('nftWithdraw', tokenId, walletAddress, (err, res) => {
        if (err) {
          console.log('nftWithdraw err', err)
          this.toasterErr(Number(err.reason) || err.reason)
        } else {
          console.log('nftWithdraw res', res)
          this.toasterSuccess(this.$t("tip.withdrawSuccess"))
          this.getLandList()
        }
      })
    },
  },
  meteor: {
  }
}
</script>

<style lang="scss" scoped>

@import '/imports/ui/scss/theme';

.land-withdraw {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: $commonBackground;
  padding-top: 37px;
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
    width: 62.5vw;
    height: 100px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 25px;
    margin-bottom: 19px;
  
    p {
      margin-bottom: 0px;
    }

    .land-withdraw-title {
      font-size: 24px;
      font-weight: bold;
      color: #ffffff;
      margin-bottom: 9px;
    }

    .land-withdraw-description {
      font-size: 14px;
      color: #95C6B7;
    }
  }

  .table {
    width: 62.5vw;
    padding-top: 22px;
    padding-left: 10px;
    // #mystery-card {
    //   width: 19.27vw;
    //   height: 29.47vw;
    //   position: relative;
    //   padding: 0 8px 0 8px;
    // }

    border: 1px solid #00322E;
    box-sizing: border-box;
    box-shadow: 0px 5px 8px 1px rgba(0, 20, 15, 0.5);
    border-radius: 8px;


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
    margin-top: 43px;
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
  .land-withdraw {
    width: 100vw;
    align-items: center;
    padding-top: 30px;
    padding-left: 10px;
    padding-right: 10px;
    padding-bottom: 100px;
    
    .back {
      width: 100%;
      display: flex;
      align-items: flex-start;
      margin-left: 0px;
    }

    .title {
      width: 100%;
      height: 80px;
      padding: 0px 20px;

      .land-withdraw-title {
        font-size: 24px;
      }

      .land-withdraw-description {
        font-size: 14px;
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
  .land-withdraw {
    .mystery-card {
      flex-grow: 1;
      justify-content: center;
    }
  }
}

</style>

