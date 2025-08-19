<template>
  <div class="admin">
    <the-admin-sidebar :role="role" />
    <div class="main">
      <div class="main-content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
  import TheAdminSidebar from './TheAdminSidebar'
  import {
    Permissions
  } from '/imports/api/account/services'

  export default {
    name: 'admin-layout',
    components: {
      TheAdminSidebar,
    },
    created() {
      if (!Meteor.userId()) {
        this.$router.replace('/home')
      }
      this.checkRoles()
    },
    data() {
      return {
        role: '',
      }
    },
    methods: {
      checkRoles() {
        Meteor.call('getUserRoles', (err, res) => {
          const role = res[0]
          if (role != null) {
            let canGoToAdmin = false
            let roleId = role.role._id
            this.role = roleId
            if (role.user._id === Meteor.userId() &&
              (roleId === Permissions.SuperAdmin ||
                roleId === Permissions.Admin ||
                roleId === Permissions.Proxy ||
                roleId === Permissions.Developer ||
                roleId === Permissions.Sender ||
                roleId === Permissions.Service
              )) {
              canGoToAdmin = true
            }
            if (!canGoToAdmin) {
              this.$router.replace('/home')
            }
          } else {
            this.$router.replace('/home')
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '/imports/ui/scss/mixin';
  @import "/imports/ui/scss/theme";

  .admin {
    position: relative;
    width: 100%;
    height: 100%;
    background: #f5f5f5;
  }

  $topbar-height: 48px;

  .main {
    left: 260px;
  }

  .main-content {
    position: fixed;
    top: $topbar-height;
    left: 260px;
    bottom: 0;
    right: 0;
    flex: 1;
    overflow: scroll;
    // padding-top: 43px;
    padding-top: 20px;
    padding-left: 54px;
    padding-right: 54px;
    overflow: auto;

    @include phone {
      padding: 10px 35px;
    }
  }
</style>
