<template>
  <div class="side-contacts-wrapper">
    <!-- contact 按鈕們 -->
    <v-img  v-for="(item, index) in contactList" :key="index" :src="item.image" contain :class="isOpen? `active ${item.name}` : `${item.name}`" class="contact" @click="contactOnclick(item.name)" />
    <div @click="toggleOpen()" class="side-contacts-btn d-flex align-center" :class="{ 'active': isOpen }">
      <!-- 箭頭 -->
      <div class="arrows d-flex justify-space-between">
        <v-icon large class="icon">mdi-chevron-left</v-icon>
        <v-icon large class="icon">mdi-chevron-left</v-icon>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SideContacts',
  data: () => ({
    isOpen: false,
    contactList: [
      {
        name: 'instagram',
        image: '/static/ui/footer/icon_instagram.png',
        link: 'https://www.instagram.com/lulumarketgame/'
      },
      {
        name: 'medium',
        image: '/static/ui/footer/icon_medium.png',
        link: 'https://medium.com/@LULUMarket'
      },
      {
        name: 'telegram',
        image: '/static/ui/footer/icon_telegram.png',
        link: 'https://t.me/lulumarkets',
        linkTW: 'https://t.me/lulumarket_cn'
      },
      {
        name: 'discord',
        image: '/static/ui/footer/icon_discord.png',
        link: 'https://discord.com/invite/ndWf4Nya9B'
      },
      {
        name: 'facebook',
        image: '/static/ui/footer/icon_facebook.png',
        link: 'https://www.facebook.com/lulumarketsNFT/',
        linkVI: 'https://www.facebook.com/groups/lulumarketvietnamm',
      },
      {
        name: 'twitter',
        image: '/static/ui/footer/icon_twitter.png',
        link: 'https://twitter.com/LULU_Markets'
      }
    ],
  }),
  methods: {
    toggleOpen() {
      this.isOpen = !this.isOpen
    },
    // 社群按鈕被點按
    contactOnclick(target) {

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
    }
  }
}
</script>

<style lang="scss" scoped>

.side-contacts-wrapper {
  position: fixed;
  top: 50vh;
  right: 0px;
  transform: translate(50%, -50%) rotate(0deg);
  width: 100px;
  height: 100px;
  z-index: 100;

  .side-contacts-btn {
    position: relative;
    z-index: 5;
    width: 100%;
    height: 100%;
    background: linear-gradient(142.1deg, #007254 -41.15%, #16C9A2 94.16%);
    border-radius: 50%;
    cursor: pointer;

    .arrows {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      transition: all .3s;

      .icon {
        color: #ffffff;
      }
    }

    &.active .arrows {
      transform: rotate(180deg);
      transition: all .3s;
    }
  }

  // 聯絡按鈕
  .contact {
    position: absolute;
    z-index: 1;
    width: 60px;
    height: 60px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    cursor: pointer;
    transition: all .3s;

    &.active {
      left: -80px;
      transform: translate(0%, 0%);

      &.instagram {
        top: -80%;
      }
      &.medium {
        top: -10%;
      }
      &.telegram {
        top: 60%;
      }
      &.discord {
        top: 130%;
      }
      &.facebook {
        top: 200%;
      }
      &.twitter {
        top: 270%;
      }
    }
  }
}

@media screen and (max-width: 1264px) {
  .side-contacts-wrapper {
    width: 88px;
    height: 88px;

    // 聯絡按鈕
    .contact {
      width: 52px;
      height: 52px;

      &.active {
        left: -80px;
      }
    }
  }
}

@media screen and (max-width: 960px) {
  .side-contacts-wrapper {
    width: 76px;
    height: 76px;

    // 聯絡按鈕
    .contact {
      width: 44px;
      height: 44px;

      &.active {
        left: -60px;
      }
    }
  }
}

</style>