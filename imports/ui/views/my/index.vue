<template>
  <div class="my">
    <div class="sidebar d-md-block d-none">
      <v-list
          class="list"
      >
        <v-list-item
            v-for="(item, index) in page"
            :key="index"
            :class="{active: $route.name === item.name}"
            class="list-item"
            @click="clickItem(item, index)"
        >
          <img :src="$route.name === item.name ? item.activeImg : item.img" class="icon">
          <v-list-item-title class="listTitle">
            {{ $t(`my.sidebar.${item.text}`) }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </div>
    <div class="page" style="width: 100%;">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>

import { settings } from '/imports/settings'

export default {
  name: 'my',
  data() {
    return {
      
      active: 3,
    }
  },
  computed: {
    page() {
      return [
        {
          img: "/static/ui/my/assets.png", activeImg: "/static/ui/my/assets-active.png", text: "assets", name: 'assets',
        },
        {
          img: "/static/ui/my/land.png", activeImg: "/static/ui/my/land-active.png", text: "land", name: 'land',
        },
        {
          img: "/static/ui/my/task.png", activeImg: "/static/ui/my/task-active.png", text: "task", name: 'task',
        },
        {
          img: "/static/ui/my/storehouse.png", activeImg: "/static/ui/my/storehouse-active.png", text: "storehouse", name: 'storehouse',
        },
        {
          img: "/static/ui/my/account.png", activeImg: "/static/ui/my/account-active.png", text: "account", name: 'balanceRecord',
        },
        {
          img: "/static/ui/my/infor.png", activeImg: "/static/ui/my/infor-active.png", text: "infor", name: 'accountInfo',
        },
        {
          img: "/static/ui/my/setting.png", activeImg: "/static/ui/my/setting-active.png", text: "setting", name: 'accountSetting',
        },
      ].filter( data => { return this.isShow(data.name)})
    }
  },
  created() {
    // console.log('route', this.$route)
    if (!Meteor.userId()) this.$router.back()
  },
  methods: {
    clickItem(item, index) {
      if (item.name) {
        this.$router.push({name: item.name})
        this.active = index
      } else {
        this.toasterComingSoon()
      }
    },
    isShow(module) {
      return settings.display.my[module]
    }
  },
}
</script>

<style lang="scss" scoped>

@import '/imports/ui/scss/theme';

.my {
  display: flex;
  flex-direction: row;
  background: $commonBackground3;

  .sidebar {
    width: 280px;
    border: 1px solid #2D4742;
    border-top: none;
    border-left: none;
    border-bottom: none;

    .list {
      background: transparent;
      margin-top: 20px;

      .list-item {
        min-height: 60px;
        color: $commonContentColorGray;
        padding-left: 42px;


        .icon {
          // width: 24px;
          // height: 24px;
          margin-right: 34px
        }

        .listTitle {
          font-size: 16px;
          height: 20px;
          line-height: 20px;
        }
      }

      .active {
        background: $commonBackground2;
        color: $mainLightColor;
        border-left: 3px solid $mainLightColor;

        .icon {
          margin-left: -4px // 用來對齊
        }
      }
    }
  }
}

</style>