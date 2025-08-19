<template>
  <div>
    <!-- PC版 -->
    <v-menu offset-y class="d-none d-lg-block">
      <template v-slot:activator="{ on, attrs }">
        <!-- PC 大按鈕下拉選單 -->
        <v-btn
            elevation="0"
            class="pa-0 d-lg-flex justify-center justify-lg-space-between d-none already-login-wrapper"
            v-bind="attrs"
            v-on="on"
        >
          <v-img max-height="30" max-width="30" src="/static/ui/topbar/shape.png" class="mx-lg-3"></v-img>
          <div class="text-truncate d-none d-lg-block" style="max-width: 97px;height: 20px;line-height: 20px;font-size: 16px;">
            {{ user ? user.username : '--' }}
          </div>
          <div
              v-if="attrs['aria-expanded'] === 'false'"
              class="div my-auto d-none d-lg-block"
              style="margin-left: 17px;margin-right: 14px"
          ></div>
          <div v-else class="div2 my-auto d-none d-lg-block" style="margin-left: 17px;margin-right: 14px"></div>
        </v-btn>
      </template>
      <!-- PC版目錄選單 -->
      <v-list class="list-bg"
              style="box-shadow: 0px 5px 8px 1px rgba(0, 20, 15, 0.5);margin-top: 7px;border-radius: 8px">
        <v-list-item
            v-for="(item, index) in choicePage"
            :key="index"
            @click="clickItem(item, index)"
            class="listItem"
            style="padding-left: 11px;color: #95C6B7;min-height: 46px"
        >
          <v-img style="margin-right: 13px" contain max-width="28px" max-height="28px" :src="item.text === currentPage ? item.imgActive : item.img"></v-img>
          <v-list-item-title style="font-size: 16px;height: 20px;line-height: 20px" class="listTitle" :class="{ active: item.text === currentPage }">
            {{ $t(`topbar.${item.text}`) }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <!-- 手機版 -->
    <v-menu offset-y class="d-block d-lg-none">
      <template v-slot:activator="{ on, attrs }">
        <!-- 手機板 小按鈕下拉選單 -->
        <v-btn
            elevation="0"
            text
            class="px-4 d-flex justify-center d-lg-none dropdown-mobile"
            min-height="100%"
            v-bind="attrs"
            v-on="on"
        >
          <v-img max-width="20" height="auto" contain src="/static/ui/topbar/user.svg"></v-img>
        </v-btn>
      </template>
      <!-- 手機板目錄選單 -->
      <v-list
          class="list-bg"
          style="box-shadow: 0px 5px 8px 1px rgba(0, 20, 15, 0.5);margin-top: 7px;border-radius: 8px"
      >
        <v-list-item
            v-for="(item, index) in choicePage"
            :key="index" @click="clickItem(item, index)"
            class="listItem"
            style="padding-left: 11px;color: #95C6B7;min-height: 46px"
        >
          <v-img style="margin-right: 13px" width="28px" height="28px" :src="item.img"></v-img>
          <v-list-item-title style="font-size: 16px;height: 20px;line-height: 20px" class="listTitle">
            {{ $t(`topbar.${item.text}`) }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <log-out :logOut="logOut" @close="logOut = false"></log-out>
  </div>

</template>

<script>
import LogOut from "./logOut";
import {
  mapGetters
} from "vuex";

export default {
  name: "alreadyLogin",
  components: {
    LogOut
  },
  data: () => ({
    logOut: false,
    currentPage: '',
    choicePage: [{
      img: "/static/ui/topbar/assets.png",
      imgActive: "/static/ui/topbar/assets-active.png",
      text: "assets",
      path: '/my/assets',
    }, {
      img: "/static/ui/topbar/land.png",
      imgActive: "/static/ui/topbar/land-active.png",
      text: "land",
      path: '/my/land',
    }, {
      img: "/static/ui/topbar/task.png",
      imgActive: "/static/ui/topbar/task-active.png",
      text: "task",
      path: '/my/task',
    }, {
      img: "/static/ui/topbar/storehouse.png",
      imgActive: "/static/ui/topbar/storehouse-active.png",
      text: "storehouse",
      path: '/my/storehouse',
    }, {
      img: "/static/ui/topbar/account.png",
      imgActive: "/static/ui/topbar/account-active.png",
      text: "account",
      path: '/my/balanceRecord',
    },
    {
      img: "/static/ui/topbar/infor.png",
      imgActive: "/static/ui/topbar/infor-active.png",
      text: "infor",
      path: '/my/accountInfo',
    },
    {
      img: "/static/ui/topbar/setting.png",
      imgActive: "/static/ui/topbar/setting-active.png",
      text: "setting",
      path: '/my/accountSetting',
    },
    {
      img: "/static/ui/topbar/quit.png",
      imgActive: "/static/ui/topbar/quit-active.png",
      text: "quit"
    }
    ]
  }),
  computed: {
    ...mapGetters(["user"]),
  },
  created() {
    const currentRouteName = this.$route.name

    switch(currentRouteName) {
      case 'assets':
        this.currentPage = 'assets'
        break;
      case 'land':
        this.currentPage = 'land'
        break;
      case 'task':
        this.currentPage = 'task'
        break;
      case 'storehouse':
        this.currentPage = 'storehouse'
        break;
      case 'balanceRecord':
        this.currentPage = 'account'
        break;
      case 'accountInfo':
        this.currentPage = 'infor'
        break;
      case 'accountSetting':
        this.currentPage = 'setting'
        break;
      default:
        this.currentPage = ''
    }
  },
  methods: {
    clickItem(item, index) {
      if (index === (this.choicePage.length - 1)) {
        this.logOut = true
      } else if (item.path) {
        this.currentPage = item.text
        this.$router.push(item.path)
      }
    }
  }
}
</script>

<style scoped lang="scss">

@import '/imports/ui/scss/theme';

.already-login-wrapper {
  background: $lightBackground !important;
  height: 46px !important;
  max-width: 193px; 
  min-width: 46px;
  border-radius: 8px
}

.list-bg {
  background: $commonBackgroundColor !important;
}

.div {
  width: 0;
  height: 0;
  border-right: 4px solid transparent;
  border-left: 4px solid transparent;
  border-top: 5px solid #D8D8D8;
}

.div2 {
  width: 0;
  height: 0;
  border-right: 4px solid transparent;
  border-left: 4px solid transparent;
  border-bottom: 5px solid #00FFCA;
}

.listTitle {
  font-weight: 600;
  
  &.active {
    color: #00FFCA !important;
  }
}

.dropdown-mobile {
  min-width: 80px !important;
}

@media screen and (max-width: 600px) {
  .dropdown-mobile {
    min-width: 64px !important;
  }
}
</style>