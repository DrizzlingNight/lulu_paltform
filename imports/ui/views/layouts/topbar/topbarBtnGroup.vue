<template>
  <div
    class="d-flex justify-space-between total"
    style="margin-left: 50px; margin-right: 50px; height: 100%"
  >
    <v-btn-toggle
      v-model="text"
      tile
      class="d-flex justify-space-between white--text"
      group
    >
      <div
        v-for="(menu, idx) in topBarMenus"
        :key="menu.title"
        @click="clickMenu(menu, idx)"
        style="height: 80px; margin-right: 60px; cursor: pointer;"
        class="d-flex flex-column justify-center align-center div relative"
      >
        <v-btn
          :ripple="false"
          elevation="0"
          x-small
          height="100%"
          style="
            background: transparent !important;
            color: #95c6b7;
            height: 20px;
          "
          class="pa-0 ma-0"
          :class="menu.isHot ? 'btn-hot mr-2' : ''"
        >
          <span :class="btnText === idx ? 'text' : ''">{{
            $t(menu.title)
          }}</span>
          <v-icon v-if="menu.icon" small>{{ menu.icon }}</v-icon>
        </v-btn>
        <v-img
          v-if="btnText === idx && showWaterDrop"
          class="mx-auto"
          style="position: absolute; bottom: 0px"
          max-width="12"
          max-height="10"
          contain
          src="/static/ui/topbar/waterDroplets.png"
        ></v-img>
      </div>

      <!-- 下拉選單 -->
      <v-menu
        v-if="dropDownMenus.length > 0"
        offset-y
        nudge-bottom="5px"
        left
        nudge-left="12"
        open-on-hover
        close-delay="200"
        contentClass="dropdown-max-height"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            :ripple="false"
            v-bind="attrs"
            v-on="on"
            text
            height="100%"
            class="pa-0 ma-0 dropdown-btn"
          >
            <v-icon color="#95c6b7">mdi-dots-horizontal</v-icon>
          </v-btn>
        </template>
        <v-list
          class="list-bg"
          v-for="(menu, idx) in dropDownMenus"
          :key="menu.title"
        >
          <!-- 文檔 -->
          <v-list-item @click="clickMenu(menu, idx)" target="_blank">
            <v-list-item-title style="color: #95c6b7">{{
              $t(menu.title)
            }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-btn-toggle>
  </div>
</template>

<script>
import i18n from "../../../lang";
import { settings } from "/imports/settings";

export default {
  name: "topbarBtnGroup",
  data: () => ({
    text: -1,
    btnText: -1,
    i18n,
  }),
  created() {
    let path = this.$route.path;
    for (let i = 0; i < this.topBarMenus.length; ++i) {
      const menu = this.topBarMenus[i];
      if (path.indexOf(menu.routeName) !== -1) {
        this.btnText = i;
        break;
      }
    }
  },
  computed: {
    topBarMenus() {
      return settings.topBar.menus;
    },
    dropDownMenus() {
      return settings.topBar.dropDownMenus;
    },
    showWaterDrop() {
      return settings.topBar.showWaterDrop;
    },
  },
  watch: {
    $route(val) {
      const path = val.path;
      for (let i = 0; i < this.topBarMenus.length; ++i) {
        const menu = this.topBarMenus[i];
        if (path.indexOf(menu.routeName) !== -1) {
          this.btnText = i;
          break;
        }
      }
    },
  },
  methods: {
    goScroll() {
      let height = document.body.clientHeight;
      window.scroll({ top: height, left: 0, behavior: "smooth" });
    },
    clickMenu(menu, idx) {
      this.btnText = idx;
      if (menu.routeName && menu.routeName === "goScroll") {
        this.goScroll();
        this.btnText = 0;
      } else if (menu.routeName) {
        this.$router.push({ name: menu.routeName });
      } else if (menu.href) {
        window.open(menu.href[i18n.locale]);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "/imports/ui/scss/theme";

.list-bg {
  background: $commonBackgroundColor !important;
  padding: 0px !important;
}

.div, .dropdown-btn {
  &:hover {
    .v-btn__content {
      span, i {
        color: $mainLightColor !important;
      }
    }
  }
}

.btn-hot {
  /deep/ .v-btn__content {
    position: relative;

    &::after {
      content: "";
      display: block;
      position: absolute;
      top: -8px;
      right: -22px;
      width: 24px;
      height: 16px;
      background-image: url("/static/ui/topbar/hot.png");
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
    }
  }
}

.text {
  color: $mainLightColor !important;
  font-weight: 600;
}

/deep/ .v-btn::before {
  opacity: 0 !important;
}

>>> .theme--light.v-btn--active:before,
.theme--light.v-btn--active:hover:before {
  opacity: 1;
}

@media (max-width: 1800px) {
  .div {
    margin-right: 24px !important;
  }

  .total {
    margin-left: 20px !important;
    margin-right: 20px !important;
  }
}
</style>

<style lang="scss">
.dropdown-max-height {
  max-height: 300px !important;
}
</style>
