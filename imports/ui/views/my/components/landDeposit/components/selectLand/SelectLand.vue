<template>
  <div class="select-land-wrapper">
    <!-- 土地標題 -->
    <p class="select-land-description mb-3">{{ $t('my.landDeposit.selectLand.description') }}</p>
    <!-- 土地包皮 (幣安) -->
    <div v-if="lands[0] && contractName === 'binance'" class="lands-wrapper mb-7">
      <!-- 單張土地卡片容器 -->
      <BinanceLandCard v-for="land in lands" :key="land.tokenId" :info="land" @cardOnclick="cardOnclick" />
    </div>
    <!-- 土地包皮 (LULU) -->
    <div v-else-if="lands[0] && contractName === 'lulu'" class="lands-wrapper m-auto mb-7">
      <!-- 單張土地卡片容器 -->
      <div class="d-flex align-center justify-center" v-for="land in lands" :key="land.tokenId">
        <div @click="cardOnclick(land.state.idOnChain2Int)" class="lulu-card-wrapper">
          <LuluLandCard :level="land.info.nftPool.info.grade" :type="typeTransform(land.info.nftPool.info.type)" style="cursor: pointer;" />
        </div>
      </div>
    </div>
    <!-- 缺省頁 -->
    <DefaultPage v-else :status="2" class="mb-7" />
    <!-- 頁數表 -->
<!--    <div class="pagination text-center">-->
<!--      <v-pagination-->
<!--        v-if="lands.length"-->
<!--        v-model="page"-->
<!--        :length="pageLength"-->
<!--        color="#F7CD0A"-->
<!--      ></v-pagination>-->
<!--    </div>-->

    <!-- 確認彈窗 -->
    <v-dialog v-model="isConfirmDialogOpen" :width="500">
      <v-card class="confirm-dialog-card d-flex flex-column">
        <v-card-title class="title d-flex flex-column">
          <p class="title-text mb-0">{{ $t('my.landDeposit.selectLand.confirmTransfer') }}</p>
          <v-spacer></v-spacer>
          <img
            :src="'/static/ui/assets/img/cross-white.png'"
            @click="isConfirmDialogOpen = false"
            class="close-btn"
            style="cursor: pointer;"
          />
        </v-card-title>
        <v-divider style="border: 1px solid #2D4742;"></v-divider>

        <v-card-text class="body d-flex justify-center align-center pa-0">
          <p class="body-text">{{ $t('my.landDeposit.selectLand.confirmTransferText', [selectedTokenId]) }}</p>
        </v-card-text>

        <v-card-actions class="action d-flex justify-center">
          <v-btn
            @click="submitOnclick()"
            color="primary"
            class="confirm-btn"
          >
            {{ $t("base.confirm") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <loading :loading="isLoading"></loading>
  </div>
</template>

<script>
import DefaultPage from './components/DefaultPage.vue'
import BinanceLandCard from './components/binanceLandCard/BinanceLandCard.vue'
import LuluLandCard from './../../../../../../components/mysteryCard/MysteryCard.vue'
import Loading from '/imports/ui/components/Loading'

import { NonFungibleTokenPoolType } from "/imports/api/nft/collections"

export default {
  name: 'SelectLand',
  components: {
    Loading,
    DefaultPage,
    // MysteryCard
    BinanceLandCard,
    LuluLandCard
  },
  props: {
    shouldGetLands: {
      type: Boolean,
      default: false
    },
    contractName: {
      type: String,
      default: ''
    },
    contractAddress: {
      type: String,
      default: ''
    },
    walletAddress: {
      type: String,
      default: ''
    },
    dialogShouldClose: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    // 監聽父層傳入請求拉取土地的flag
    shouldGetLands() {
      this.getLands()
    },

    // 監聽父層傳入請求關閉彈窗的flag
    dialogShouldClose() {
      this.isConfirmDialogOpen = false
    }
  },
  data: () => ({
    isLoading: false,
    lands: [],
    selectedTokenId: null,
    isConfirmDialogOpen: false,
  }),
  created() {
    // 剛被觸發打開時拿土地
    this.getLands()
  },
  methods: {

    // 取得土地列表資料
    getLands() {
      const contractAddress = this.contractAddress // 測試用: '0x1ddb2c0897daf18632662e71fdd2dbdc0eb3a9ed'
      // const contractAddress = '0x1ddb2c0897daf18632662e71fdd2dbdc0eb3a9ed'
      const walletAddress = this.walletAddress // 測試用: '0xe0a9e5b59701a776575fdd6257c3f89ae362629a'
      // const walletAddress = '0x75c553512539cbff6611866e2bb5e8a7a68da604'
      this.isLoading = true
      Meteor.call('getNftBalance', contractAddress, walletAddress, (err, res) => {
        if (res) {
          console.log(res)
          this.lands = [...res.list]
          this.isLoading = false
        } else {
          console.log(err)
          this.isLoading = false
        }
      })
    },

    // 轉換 LULU NFT DATA 的種類資料 ( number -> string )
    typeTransform: (num) => {
      const type = Object.keys(NonFungibleTokenPoolType).find(key => NonFungibleTokenPoolType[key] === num)
      if (type) {
        return type.toLowerCase()
      }
    },

    // 卡片被點了
    cardOnclick(tokenId) {
      this.isConfirmDialogOpen = true
      this.selectedTokenId = tokenId
    },

    // 確認
    submitOnclick() {
      this.$emit('transferNft', this.selectedTokenId)
    }
  }
}
</script>

<style lang="scss" scoped>
.select-land-wrapper {
  width: 100%;

  .select-land-description {
    font-size: 16px;
  }

  .lands-wrapper {
    width: 100%;
    border: 1px solid #00322E;
    border-radius: 8px;
    padding: 16px 16px;
    overflow: hidden;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }

  }
  .confirm-dialog-card {
    position: relative;
    color: #ffffff !important;
    background: linear-gradient(136.3deg, #06261F 2.34%, #08322D 98.54%) !important;
    border: 1px solid #00FFCA;
    border-radius: 8px;
    max-width: 500px;
    height: 320px;

    .title {
      padding: 20px 40px;

      .title-text {
        font-size: 24px !important;
      }
    }

    .body {
      flex-grow: 1;

      .body-text {
        font-size: 18px;
        color: #ffffff;
      }
    }

    .action {
      padding: 0px 48px;
      padding-bottom: 32px;

      .confirm-btn {
        max-width: 360px;
        width: 100%;

        .v-btn__content {
          font-size: 18px !important;
        }

      }
    }

    .close-btn {
      position: absolute;
      top: 20px;
      right: 20px;
    }
  }

@media screen and (max-width: 1904px) {
  .select-land-wrapper {
  width: 100%;

  .select-land-description {
    font-size: 16px;
  }

  .lands-wrapper {
    width: 100%;
    border: 1px solid #00322E;
    border-radius: 8px;
    padding: 16px 16px;
    overflow: hidden;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  }
  .confirm-dialog-card {
    position: relative;
    color: #ffffff !important;
    background: linear-gradient(136.3deg, #06261F 2.34%, #08322D 98.54%) !important;
    border: 1px solid #00FFCA;
    border-radius: 8px;
    max-width: 500px;
    height: 320px;

    .title {
      padding: 20px 40px;

      .title-text {
        font-size: 24px !important;
      }
    }

    .body {
      flex-grow: 1;

      .body-text {
        font-size: 18px;
        color: #ffffff;
      }
    }

    .action {
      padding: 0px 48px;
      padding-bottom: 32px;

      .confirm-btn {
        max-width: 360px;
        width: 100%;

        .v-btn__content {
          font-size: 18px !important;
        }

      }
    }

    .close-btn {
      position: absolute;
      top: 20px;
      right: 20px;
    }
  }
}

@media screen and (max-width: 1264px) {
  .select-land-wrapper {
  width: 100%;

  .select-land-description {
    font-size: 16px;
  }

  .lands-wrapper {
    width: 100%;
    border: 1px solid #00322E;
    border-radius: 8px;
    padding: 16px 16px;
    overflow: hidden;
    display: grid;
    grid-template-columns: repeat(1fr, 2);
    gap: 20px;
  }

  }
  .confirm-dialog-card {
    position: relative;
    color: #ffffff !important;
    background: linear-gradient(136.3deg, #06261F 2.34%, #08322D 98.54%) !important;
    border: 1px solid #00FFCA;
    border-radius: 8px;
    max-width: 500px;
    height: 320px;

    .title {
      padding: 20px 40px;

      .title-text {
        font-size: 24px !important;
      }
    }

    .body {
      flex-grow: 1;

      .body-text {
        font-size: 18px;
        color: #ffffff;
      }
    }

    .action {
      padding: 0px 48px;
      padding-bottom: 32px;

      .confirm-btn {
        max-width: 360px;
        width: 100%;

        .v-btn__content {
          font-size: 18px !important;
        }

      }
    }

    .close-btn {
      position: absolute;
      top: 20px;
      right: 20px;
    }
  }
}

@media screen and (max-width: 960px) {
  .select-land-wrapper {
  width: 100%;

  .select-land-description {
    font-size: 16px;
  }

  .lands-wrapper {
    width: 100%;
    border: 1px solid #00322E;
    border-radius: 8px;
    padding: 16px 16px;
    overflow: hidden;
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
  }

  }
  .confirm-dialog-card {
    position: relative;
    color: #ffffff !important;
    background: linear-gradient(136.3deg, #06261F 2.34%, #08322D 98.54%) !important;
    border: 1px solid #00FFCA;
    border-radius: 8px;
    max-width: 500px;
    height: 320px;

    .title {
      padding: 20px 40px;

      .title-text {
        font-size: 24px !important;
      }
    }

    .body {
      flex-grow: 1;

      .body-text {
        font-size: 18px;
        color: #ffffff;
      }
    }

    .action {
      padding: 0px 48px;
      padding-bottom: 32px;

      .confirm-btn {
        max-width: 360px;
        width: 100%;

        .v-btn__content {
          font-size: 18px !important;
        }

      }
    }

    .close-btn {
      position: absolute;
      top: 20px;
      right: 20px;
    }
  }
}
</style>
