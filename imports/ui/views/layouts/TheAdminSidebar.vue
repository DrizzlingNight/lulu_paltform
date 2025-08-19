<template>
  <div style="height: 100%;">
    <div class="sidebar">
      <div class="avatar-item" @click="infoClick">
        <img class="icon" src="/static/ui/admin/profile_photo.png" />
        <div class="name">{{ user ? user.username : '' }}</div>
      </div>
      <div class="sidebar-wrap">
        <div v-for="(m,idx) in menus" :key="m.title">
          <div v-if="isShowMenu(m.title)">
            <admin-sidebar-item :title="m.title" needDropDown="true" @click="showIndex(idx)" :icon="m.icon">
            </admin-sidebar-item>
            <div v-for="subMenu in m.subMenus" :key="subMenu">
              <admin-sidebar-item v-if="(showingIndexes.indexOf(idx) != -1) && isShowMenu(subMenu)" :title="subMenu"
                @click="clickSubMenu(idx, subMenu)"></admin-sidebar-item>
            </div>
          </div>
        </div>
        <div style="flex:1"></div>
        <admin-sidebar-item :title="$t('admin.backToLuluMarket')" icon="/static/ui/admin/back-to-home.png" needDropDown="false"
          @click="backToHome"></admin-sidebar-item>

      </div>
    </div>
  </div>
</template>
<script>
  import {
    mapGetters
  } from 'vuex'

  import {
    Permissions
  } from '/imports/api/account/services'

  import AdminSidebarItem from './components/AdminSidebarItem.vue'

  export default {

    name: 'admin-sidebar',
    components: {
      AdminSidebarItem,
    },
    props: {
      isHide: {
        type: Boolean,
        default: false,
      },
      role: String,
    },
    data() {
      return {
        showModal: false, //確認退出登錄的彈窗提示，默認不顯示false
        showingIndexes: [],

        menus: [{
          title: this.$t('admin.userManage'),
          icon: '/static/ui/admin/usersmanagement.png',
          subMenus: [this.$t('admin.userManage'), this.$t('admin.areaData')]
        }, {
          title: this.$t('admin.agentManage'),
          icon: '/static/ui/admin/usersmanagement.png',
          subMenus: [this.$t('admin.agentManage'), '回购审批'],
        },
        {
          title: this.$t('admin.balanceChangeManage'),
          icon: '/static/ui/admin/usersmanagement.png',
          subMenus: [this.$t('admin.balanceHistory'), 
                     this.$t('admin.transactionHistoryTitle'), 
                     this.$t('admin.miningHistory'), 
                     this.$t('admin.balanceSystemChange'), 
                     this.$t('admin.balanceCultivateChange')],
        },
        {
          title: this.$t('admin.articleManage'),
          icon: '/static/ui/admin/usersmanagement.png',
          subMenus: [this.$t('admin.articleList'), this.$t('admin.articleHistory')]
        },
        {
          title: this.$t('admin.nftManage'),
          icon: '/static/ui/admin/usersmanagement.png',
          subMenus: [this.$t('admin.nftList'), this.$t('admin.landTransferHistory')],
        },
        {
          title: this.$t('admin.gameHistory'),
          icon: '/static/ui/admin/usersmanagement.png',
          subMenus: [this.$t('admin.gameHistory')]
        },
        {
          title: this.$t('admin.orderHistory'),
          icon: '/static/ui/admin/usersmanagement.png',
          subMenus: [this.$t('admin.orderHistory')]
        },
        {
          title: this.$t('admin.systemManage'),
          icon: '/static/ui/admin/usersmanagement.png',
          subMenus: [this.$t('admin.hotUpdateData'), this.$t('admin.gameManage')]
        },
        ]
      }
    },
    computed: {
      ...mapGetters(['user', 'games', 'isShowStake', 'isShowReferral']),
    },
    created() {
    },
    watch: {
      user: function () {
        if (!this.user) {
          this.$router.push(
            '/home'
          )
        }
      }
    },
    methods: {
      isShowMenu(menu) {
        if (menu === this.$t('admin.userManage')) {
          return this.role === Permissions.SuperAdmin || this.role === Permissions.Admin || this.role === Permissions.Service
        } else if (menu === this.$t('admin.agentManage')) {
          return this.role != Permissions.Service
        } else if (menu === this.$t('admin.systemManage')) {
          return this.role == Permissions.Developer
        } else if (menu === this.$t('admin.balanceChangeManage') || menu === this.$t('admin.articleManage') || menu === this.$t('admin.orderHistory')) {
          return this.role == Permissions.SuperAdmin || this.role === Permissions.Admin || this.role === Permissions.Proxy || this.role === Permissions.Service
        } else if (menu === this.$t('admin.nftManage') ||
                   menu === this.$t('admin.articleHistory') ||
                   menu === this.$t('admin.landTransferHistory')) {
          return this.role === Permissions.SuperAdmin || this.role === Permissions.Admin || this.role === Permissions.Service
        } else if (menu === this.$t('admin.miningHistory')) {
          return this.role != Permissions.Service
        } else if (menu === this.$t('admin.balanceSystemChange') ||
                   menu === this.$t('admin.balanceCultivateChange')) {
          return this.role === Permissions.SuperAdmin || this.role === Permissions.Admin
        } else if (menu === this.$t('admin.areaData') || menu === this.$t('admin.gameHistory')) {
          return this.role === Permissions.SuperAdmin
        } else if (menu === '回购审批') {
          return this.role === Permissions.SuperAdmin || this.role === Permissions.Proxy
        }
        return true // 默认展示，如需权限控制则添加判断
      },
      showIndex(idx) {
        const index = this.showingIndexes.indexOf(idx)
        if (index != -1) {
          this.showingIndexes.splice(index, 1)
        } else {
          this.showingIndexes.push(idx)
        }
      },
      clickSubMenu(idx, menu) {
        if (menu === this.$t('admin.agentManage')) {
          this.$router.push('/admin/agent')
        } else if (menu === this.$t('admin.userManage')) {
          this.$router.push('/admin/user')
        } else if (menu === this.$t('admin.hotUpdateData')) {
          this.$router.push('/admin/hotupdate')
        } else if (menu === this.$t('admin.balanceHistory')) {
          this.$router.push('/admin/balance')
        } else if (menu === this.$t('admin.transactionHistoryTitle')) {
          this.$router.push('/admin/transaction')
        } else if (menu === this.$t('admin.nftList')) {
          this.$router.push('/admin/nft')
        } else if (menu === this.$t('admin.gameManage')) {
          this.$router.push('/admin/gameManagement')
        } else if (menu === this.$t('admin.miningHistory')) {
          this.$router.push('/admin/miningRecord')
        } else if (menu === this.$t('admin.articleList')) { 
          this.$router.push('/admin/article')
        } else if (menu === this.$t('admin.landTransferHistory')) {
          this.$router.push('/admin/nftHistory')
        } else if (menu === this.$t('admin.articleHistory')) {
          this.$router.push('/admin/articleHistory')
        } else if (menu === this.$t('admin.balanceSystemChange')) {
          this.$router.push('/admin/balanceSystemChange')
        } else if (menu === this.$t('admin.balanceCultivateChange')) {
          this.$router.push('/admin/balanceCultivateChange')
        } else if (menu === this.$t('admin.areaData')) {
          this.$router.push('/admin/areaData')
        } else if (menu === this.$t('admin.gameHistory')) {
          this.$router.push('/admin/gameHistory')
        } else if (menu === this.$t('admin.orderHistory')) {
          this.$router.push('/admin/orderHistory')
        } else if (menu === '回购审批') {
          this.$router.push('/admin/buyBackAudit')
        }
      },
      infoClick() {
        this.$router.push('/admin')
      },
      backToHome() {
        this.$router.replace('/home')
      },
      handleLogout() {
        // this.showModal = false Meteor.logout() this.$router.push('/home')
      },
    },
    meteor: {

    },
  }
</script>

<style scoped lang="scss">
  @import '/imports/ui/scss/mixin';
  @import "/imports/ui/scss/theme";


  $itemW: 260px;
  $bg-color: rgba(28, 30, 55, 1);
  $text-color: #ffffff;
  $title-color: #ffc455;
  $color: rgba(28, 30, 55, 1);

  .sidebar {
    background: $bg-color;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 260px;
    overflow-y: scroll;
    overflow-x: hidden;
    user-select: none;

    .avatar-item {
      height: 92px;
      line-height: 92px;
      margin-top: 4px;
      margin-bottom: 2px;
      display: flex;
      align-items: center;
      flex-shrink: 0;

      .icon {
        width: 48px;
        height: 48px;
        margin-left: 25px;
        margin-right: 16px;
      }

      .name {
        flex: 1;
        white-space: nowrap;
        color: $text-color;
        font-size: 20px;
        /*font-family: SFUIText-Regular;*/
        font-weight: 400;
      }
    }

    .sidebar-wrap {
      flex: 1;
      // background: $sidebar-wrap-bg;
      background: $bg-color;
      display: flex;
      flex-direction: column;
      // justify-content: space-between;
    }
  }

  .router-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 48px;

    &:hover {
      background-color: $sidebar-router-hover;
    }

    .icon {
      margin-left: 15px;
      width: 32px;
      height: 32px;
    }

    .text {
      margin-left: 15px;
      color: $title-color;
    }

    .more {
      width: 15px;
      margin-right: 20px
    }

  }
</style>
