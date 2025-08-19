<template>
  <v-footer class="footer">
    <div class="footer-content-wrapper">
      <!-- 合作廠商 -->
      <!-- 2022.04.14 合作廠商改到Home底下放 -->
      <!-- <div class="partners-wrapper mb-12">
        <p class="title">{{ $t('footer.partner') }}</p>
        <v-row flex align="center" justify="center">
          <v-col v-for="(item, index) in partnerList" :key="index" cols="12" sm="4" lg="3" align="center" class="mt-4 partners-col">
            <v-btn icon class="partners-btn" @click="partnersButtonOnclick(item)">
              <v-img :src="item.image" width="100%" height="100%" contain />
            </v-btn>
          </v-col>
        </v-row>
      </div> -->
      <div class="footer-content d-flex justify-space-between align-center mb-11">
        <!-- logo -->
        <v-img contain :src="logoImg" class="logo"></v-img>

        <!-- 頁角連結群 -->
        <!-- 先隱藏 -->
        <div v-if="0" class="links-wrapper d-flex">
          <router-link :to="{ name: 'home' }">
            <span class="link">{{ $t('footer.link1') }}</span>
          </router-link>
          <!-- // TODO 補上正確跳轉目標 -->
          <router-link to="/">
            <span class="link">{{ $t('footer.link2') }}</span>
          </router-link>
          <!-- // TODO 補上正確跳轉目標 -->
          <router-link to="/">
            <span class="link">{{ $t('footer.link3') }}</span>
          </router-link>
        </div>

        <!-- 聯繫方式 -->
        <div class="contacts-wrapper d-flex align-center">
          <v-btn v-for="(item, index) in contactList" :key="index" icon class="contact-btn" @click="contactButtonOnclick(item.name)">
            <v-img :src="item.isHover ? item.hoverImage : item.image" width="100%" height="100%" contain @mouseenter="contactOnHover(index)" @mouseleave="contactOnLeave(index)"  />
          </v-btn>
        </div>
      </div>

      <v-divider></v-divider>

      <v-spacer class="divider"></v-spacer>

      <p class="copy-right mb-0">
        Copyright @ 2022. All Rights Reserved By <span class="company-name">{{ companyName }}</span>
      </p>
      <v-spacer></v-spacer>
    </div>
  </v-footer>
</template>

<script>

import { settings } from "/imports/settings";

export default {
  name: "Footer",
  data() {
    return {
      contactList: [
        {
          name: 'instagram',
          image: '/static/ui/footer/icon_instagram.svg',
          hoverImage: '/static/ui/footer/icon_instagram_hover.svg',
          link: 'https://www.instagram.com/lulumarketgame/',
          isHover: false,
        },
        {
          name: 'medium',
          image: '/static/ui/footer/icon_medium.svg',
          hoverImage: '/static/ui/footer/icon_medium_hover.svg',
          link: 'https://medium.com/@LULUMarket',
          isHover: false,
        },
        {
          name: 'telegram',
          image: '/static/ui/footer/icon_telegram.svg',
          hoverImage: '/static/ui/footer/icon_telegram_hover.svg',
          link: 'https://t.me/lulumarkets',
          linkTW: 'https://t.me/lulumarket_cn',
          isHover: false,
        },
        {
          name: 'discord',
          image: '/static/ui/footer/icon_discord.svg',
          hoverImage: '/static/ui/footer/icon_discord_hover.svg',
          link: 'https://discord.com/invite/ndWf4Nya9B',
          isHover: false,
        },
        {
          name: 'facebook',
          image: '/static/ui/footer/icon_facebook.svg',
          hoverImage: '/static/ui/footer/icon_facebook_hover.svg',
          link: 'https://www.facebook.com/lulumarketsNFT/',
          linkVI: 'https://www.facebook.com/groups/lulumarketvietnamm',
          isHover: false,
        },
        {
          name: 'twitter',
          image: '/static/ui/footer/icon_twitter.svg',
          hoverImage: '/static/ui/footer/icon_twitter_hover.svg',
          link: 'https://twitter.com/LULU_Markets',
          isHover: false,
        }
      ],
      partnerList: [
        {
          name: 'binance',
          image: '/static/ui/footer/partner/logo_binance.png',
          link: 'https://www.binance.com/en'
        },
        {
          name: 'coinMarketCap',
          image: '/static/ui/footer/partner/logo_coinMarketCap.png',
          link: 'https://coinmarketcap.com/'
        },
        {
          name: 'beex',
          image: '/static/ui/footer/partner/logo_beex.png',
          link: ''
        },
        {
          name: 'luluGame',
          image: '/static/ui/footer/partner/logo_luluGame.png',
          link: 'https://www.lulugames.io/index.html#'
        },
        {
          name: 'binanceNFT',
          image: '/static/ui/footer/partner/logo_binanceNFT.png',
          link: 'https://www.binance.com/en/nft/home'
        },
        {
          name: 'NFTKings',
          image: '/static/ui/footer/partner/logo_NFTKings.png',
          link: 'https://nfkings.com/en/'
        },
        {
          name: 'marsBlockChain',
          image: '/static/ui/footer/partner/logo_marsBlockChain.png',
          link: 'https://www.huoxing24.com/'
        },
        {
          name: 'beepal',
          image: '/static/ui/footer/partner/logo_beepal.png',
          link: 'https://baax.uk/quotes'
        },
        {
          name: 'hillstoneFinance',
          image: '/static/ui/footer/partner/logo_hillstoneFinance.png',
          link: 'https://hillstone.finance/'
        },
        {
          name: 'mathWallet',
          image: '/static/ui/footer/partner/logo_mathWallet.png',
          link: 'https://mathwallet.org/en-us/'
        },
        {
          name: 'chinaTimes',
          image: '/static/ui/footer/partner/logo_chinaTimes.png',
          link: 'https://www.chinatimes.com/?chdtv'
        },
        {
          name: 'beefiGame',
          image: '/static/ui/footer/partner/logo_beefiGame.png',
          link: 'http://beefi.lulu.market'
        }
      ]
    }
  },
  computed: {
    companyName() {
      return (settings.name || '').toUpperCase()
    },
    logoImg() {
      return '/static/ui/footer/'+ settings.theme +'.png'
    }
  },
  methods: {
    contactButtonOnclick(target) {
      const contract = this.contactList.find(item => item.name === target)
      
      // TG另外處理
      if (target === 'telegram') {
        if (this.$i18n.locale === 'zh-TW') {
          window.open(contract.linkTW)
          return
        } else {
          window.open(contract.link)
          return
        }
      } else if (target === 'facebook') {
        if (this.$i18n.locale === 'vi-VI') {
          window.open(contract.linkVI)
          return
        } else {
          window.open(contract.link)
          return
        }
      }

      if (contract.link) {
        window.open(contract.link)
        return
      }

      this.toasterComingSoon()
    },
    partnersButtonOnclick(target) {
      if (target.link) {
        window.open(target.link)
        return
      }
    },
    contactOnHover(index) {
      this.contactList[index].isHover = true
    },
    contactOnLeave(index) {
      this.contactList[index].isHover = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import './../../../assets/css/utils/variables.scss';
@import '/imports/ui/scss/theme';

.footer {
  width: 100vw;
  background: $commonBackground2 !important;
  padding: 0px 0x;

  .footer-content-wrapper {
    position: relative;
    max-width: 1200px;
    width: 100%;
    margin: auto;
    padding-top: 116px;
    padding-bottom: 24px;
    max-width: 1200px;
    margin: 0 auto;

    .partners-wrapper {
      .title {
        color: #ffffff;
        font-size: 24px !important;
        font-weight: bold;
        text-align: center;
      }

      .partners-col {
        min-width: 286px;
      }
    }

    .logo {
      max-width: 228px;
      height: 116px;
    }

    .contacts-wrapper {
      gap: 32px;

      .contact-btn {
        width: 56px;
        height: 56px;

        /deep/ .v-btn__content {
          width: 100%;
          height: 100%;
        }
      }
    }

    .divider {
      border: 1px solid #2D4742;
      margin-bottom: 72px;
    }

    // 版權聲明
    .copy-right {
      font-size: 24px;
      color: #ffffff;
      text-align: center;

      .company-name {
        font-size: 24px;
        font-weight: 700;
        background: linear-gradient(142.1deg, #007254 -41.15%, #16C9A2 94.16%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
    }
  }
}

@media screen and (max-width: 1264px) {
  .footer {
    padding: 0px 32px;

    .footer-content-wrapper {
      padding-top: 40px;
      padding-bottom: 32px;

      .logo {
        max-width: 160px;
        height: auto;
      }

      .contacts-wrapper {
        gap: 20px;

        .contact-btn {
          width: 48px;
          height: 48px;
        }
      }

      .divider {
        margin-bottom: 24px;
      }

      .copy-right {
        font-size: 16px;

        .company-name {
          font-size: 16px;
        }
      }
    }
  }
}

@media screen and (max-width: 960px) {
  .footer {
    padding: 0px 24px;  

    .footer-content-wrapper {
      padding-top: 40px;
      padding-bottom: 32px;

      .logo {
        max-width: 100px;
        height: auto;
      }

      .contacts-wrapper {
        gap: 16px;

        .contact-btn {
          width: 32px;
          height: 32px;
        }
      }

      .divider {
        margin-bottom: 24px;
      }

      .copy-right {
        font-size: 14px;

        .company-name {
          font-size: 14px;
        }
      }
    }
  }
}

@media screen and (max-width: 600px) {
  .footer {
    padding: 0px 16px;

    .footer-content-wrapper {
      padding-top: 20px;
      padding-bottom: 16px;

      .logo {
        max-width: 76px;
        height: 40px;
      }

      .contacts-wrapper {
        gap: 12px;

        .contact-btn {
          width: 20px;
          height: 20px;
        }
      }

      .divider {
        margin-bottom: 24px;
      }

      .copy-right {
        font-size: 12px;

        .company-name {
          font-size: 12px;
        }
      }
    }
  }
}

</style>