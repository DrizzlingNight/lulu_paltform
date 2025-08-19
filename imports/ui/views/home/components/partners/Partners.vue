<template>
  <div class="partners d-flex justify-center">
    <!-- 合作廠商 -->
    <div class="partners-wrapper d-flex flex-column align-center justify-center">
      <p class="title">{{ $t('footer.partner') }}</p>
      <div class="code-audit-row" @click="codeAuditOnClick">
        <p class="code-audit-text">{{ `${$t('footer.codeAudit')}：` }}</p>
        <img :src="codeAuditImage" class="code-audit-img" />
      </div>
      <v-row class="partners-row d-flex align-center">
        <v-col v-for="(item, index) in partnerList" :key="index" cols="6" sm="4" lg="3" class="partners-col">
          <v-btn icon class="partners-btn" @click="partnersButtonOnclick(item)">
            <v-img :src="item.image" contain class="partner-img" />
          </v-btn>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      codeAuditImage: '/static/ui/home/partners/logo_freshcoins.svg',
      codeAuditLink: 'https://www.freshcoins.io/audit ',
      partnerList: [
        {
          name: 'binance',
          image: '/static/ui/home/partners/logo_binance.svg',
          link: 'https://www.binance.com/en'
        },
        {
          name: 'coinMarketCap',
          image: '/static/ui/home/partners/logo_coinMarketCap.svg',
          link: 'https://coinmarketcap.com/'
        },
        {
          name: 'beex',
          image: '/static/ui/home/partners/logo_beex.svg',
          link: ''
        },
        {
          name: 'luluGame',
          image: '/static/ui/home/partners/logo_luluGame.svg',
          link: 'https://www.lulugames.io/index.html#'
        },
        {
          name: 'binanceNFT',
          image: '/static/ui/home/partners/logo_binanceNFT.svg',
          link: 'https://www.binance.com/en/nft/home'
        },
        {
          name: 'NFTKings',
          image: '/static/ui/home/partners/logo_NFTKings.svg',
          link: 'https://nfkings.com/en/'
        },
        {
          name: 'marsBlockChain',
          image: '/static/ui/home/partners/logo_marsBlockChain.svg',
          link: 'https://www.huoxing24.com/'
        },
        {
          name: 'beepal',
          image: '/static/ui/home/partners/logo_beepal.svg',
          link: 'https://baax.uk/quotes'
        },
        {
          name: 'beeStyle',
          image: '/static/ui/home/partners/logo_beeStyle.svg',
          link: 'https://www.beestyle.io/'
        },
        {
          name: 'tokenPocket',
          image: '/static/ui/home/partners/logo_tokenPocket.svg',
          link: 'https://www.tokenpocket.pro/'
        },
        {
          name: 'mathWallet',
          image: '/static/ui/home/partners/logo_mathWallet.svg',
          link: 'https://mathwallet.org/en-us/'
        },
        {
          name: 'chinaTimes',
          image: '/static/ui/home/partners/logo_chinaTimes.svg',
          link: 'https://www.chinatimes.com/?chdtv'
        },
        {
          name: 'beefiGame',
          image: '/static/ui/home/partners/logo_beefiGame.svg',
          link: 'http://beefi.lulu.market'
        },
        {
          name: 'hillstoneFinance',
          image: '/static/ui/home/partners/logo_hillstoneFinance.svg',
          link: 'https://hillstone.finance/'
        },
        {
          name: 'HKSTP',
          image: '/static/ui/home/partners/logo_HKSTP.svg',
          link: 'https://www.hkstp.org/zh-hk/'
        },
        {
          name: 'blockChainUnion',
          image: '/static/ui/home/partners/logo_blockChainUnion.svg',
          link: 'https://blockchainunion.vn/'
        },
      ]
    }
  },
  methods: {
    codeAuditOnClick() {
      window.open(this.codeAuditLink)
    },
    partnersButtonOnclick(target) {
      if (target.link) {
        window.open(target.link)
        return
      }
    }
  }
}
</script>

<style lang="scss">
.partners {
  background: #00221A;
  width: 100%;
  // min-height: 728px;
  padding: 0px 72px 20px 72px;

  .partners-wrapper {
    padding-top: 136px;
    max-width: 1200px;

    .title {
      color: #ffffff;
      font-size: 32px !important;
      font-weight: 600;
      text-align: center;
      margin-bottom: 0px;
    }

    .code-audit-row {
      background: rgba(73, 135, 121, 0.08);
      height: 64.94px;
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      margin-top: 74px;

      .code-audit-text {
        color: #498779;
        font-size: 24px;
        margin: 0px;
        margin-right: 8px;
      }

      .code-audit-img {
        width: 185.76px;
        height: 56.94px;
      }

      &:hover {
        background: #498779;

        .code-audit-text {
          color: #FFFFFF;
        }
      }
    }

    .partners-row {
      margin-top: 64px;
      justify-content: space-between !important;
    
      .partners-col {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        max-width: 260px;
        min-width: 260px;
        max-height: 68px;
        min-height: 68px;
        padding: 0px;
        margin-bottom: 24px;

        .partners-btn {
          .partner-img {
            max-width: calc(100% - 32px);
            width: 100%;
            // height: 100px;
  
          }
  
          &:hover {
            .partner-img {
              // opacity: .4;
            }
          }
        }

        &:hover {
          background: #498779;
        }
      }
    }
  }
}

@media screen and (max-width: 1264px) {
  .partners {
    padding: 0px 72px 20px 72px;

    .partners-wrapper {
      padding-top: 100px;

      .title {
        font-size: 32px !important;
      }

      .partners-row {
        margin-top: 90px;
      
        .partners-col {
          // margin-bottom: 80px;

          .partner-img {
            width: 100%;
            // height: 80px;
          }
        }
      }
    }
  }
}

@media screen and (max-width: 960px) {
  .partners {
    padding: 0px 32px 20px 32px;

    .partners-wrapper {
      padding-top: 40px;

      .title {
        font-size: 24px !important;
      }

      .code-audit-row {
        margin-top: 42px;
      }

      .partners-row {
        margin-top: 68px;
      
        .partners-col {
          // max-width: 88px;
          min-width: 88px;
          max-height: 32px;
          min-height: 32px;
          // margin-bottom: 60px;

          .partner-img {
            width: 100%;
            // height: 60px;
          }
        }
      }
    }
  }
}

@media screen and (max-width: 600px) {
  .partners {
    padding: 0px 16px 40px 16px;

    .partners-wrapper {
      padding-top: 24px;

      .title {
        font-size: 18px !important;
      }

      .code-audit-row {
        height: 27px; 
        margin-top: 14px;

        .code-audit-text {
          font-size: 14px;
        }

        .code-audit-img {
          width: 78px;
          height: 23px;
        }
      }

      .partners-row { 
        margin-top: 40px;
      
        .partners-col {
          // max-width: 88px;
          min-width: 88px;
          max-height: 32px;
          min-height: 32px;
          margin-bottom: 8px;

          .partner-img {
            width: 100%;
            height: 24px;
          }
        }
      }
    }
  }
}
</style>