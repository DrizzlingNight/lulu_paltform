<template>
  <div class="topbar-btn-group-mobile">

    <v-menu offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          text
          height="100%"
          min-width="80"
          class="hamburger-btn pa-0"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon class="hamburger-icon">mdi-menu</v-icon>
          <!-- <v-img contain src="/static/ui/topbar/hamburger.svg" class="hamburger-img"></v-img> -->
        </v-btn>
      </template>
      <!-- // TODO 蓋不掉，先寫 inline -->
      <v-list class="dropdown-wrapper mt-2 d-flex flex-column">
        <v-list-item
          v-for="(menu, idx) in menus"
          :key="menu.title"
          @click="clickMenu(menu, idx)"
          class="link-wrapper"
        >
          <!-- <div v-if="$route.name === link.linkName" class="water-drop"></div> -->
          <!-- <v-img v-if="$route.name === link.linkName" width="12" height="10" contain src="/static/ui/topbar/waterDroplets.png" class="water-drop"></v-img> -->
          <!-- // TODO 蓋不掉，先寫 inline -->
          <v-list-item-title
            class="pl-1"
            :class="selectedIndex === idx ? 'active-link-text' : ''"
            style="color: #95C6B7; font-size: 14px; overflow: visible;"
          >
            <span :class="{ 'btn-hot': menu.isHot }">
              {{ $t(menu.title) }}
            </span>
            <!-- 遊戲icon -->
            <v-icon v-if="menu.icon" style="color: #95C6B7;" class="pb-2" small>{{menu.icon}}</v-icon>
          </v-list-item-title>
          <!-- 水滴 -->
          <v-img
            v-if="selectedIndex === idx"
            class="water-drop"
            max-width="10"
            max-height="12"
            contain
            src="/static/ui/topbar/waterDroplets_mobile.png"
          ></v-img>
        </v-list-item>

        <!-- 語言選擇器 -->
        <v-list-item class="select-language-wrapper">
          <v-menu
            nudge-right="20"
            nudge-bottom="16"
            top
            offset-x
            v-model="isLanguageOpen"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                v-on="on"
                max-width="88"
                height="32"
                depressed
                class="select-language-btn"
              >
                {{ $t(`language.${i18n.locale}`) }}
                <v-icon x-small class="language-drop-icon" :class="{ 'active': isLanguageOpen }">mdi-menu-right</v-icon>
              </v-btn>
            </template>

            <v-list elevation="0" class="language-list-wrapper">
              <v-list-item
                v-for="(item, index) in languages"
                :key="index"
                @click="setLanguage(item)"
              >
                <v-list-item-title class="language-text" :class="{ 'active-language': item === i18n.locale }">
                  {{ $t(`language.${item}`) }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import { settings } from '/imports/settings'
import i18n from './../../../lang'

export default {
  name: 'TopbarBtnGroupMobile',
  data() {
    return {
      isLanguageOpen: false,
      settings,
      i18n,
      selectedIndex: 0,
      selectedRouteName: 'home',
    }
  },
  computed: {
    menus() {
      return settings.topBar.menus.concat(settings.topBar.dropDownMenus)
    },
    languages() {
      return settings.languages
    }
  },
  methods: {
    goScroll() {
      let height = document.body.clientHeight;
      window.scroll({top: height, left: 0, behavior: 'smooth'});
    },
    clickMenu(menu, idx) {
      if (menu.routeName && menu.routeName === "goScroll") {
        this.goScroll()
      } else if (menu.routeName) {
        if (this.selectedRouteName === menu.routeName) {
          return
        }
        this.selectedIndex = idx
        this.selectedRouteName = menu.routeName
        this.$router.push({name: menu.routeName})
      } else if (menu.href) {
        window.open(menu.href[i18n.locale])
      }
    },

    setLanguage(lang){
      i18n.locale = lang
      localStorage.setItem('locale', lang)
    }
  }
  
}
</script>

<style lang="scss" scoped>

@import '/imports/ui/scss/theme';
@import '/imports/ui/assets/css/utils/variables.scss';

.dropdown-wrapper {
  background: $commonBackground2 !important;
  border-radius: 8px !important;
  overflow: hidden;
  width: 112px;
}

.btn-hot {
  position: relative;
  overflow: visible;

  &::after {
    content: '';
    display: block;
    position: absolute;
    top: -4px;
    right: -12px;
    width: 12px;
    height: 9px;
    background-image: url('/static/ui/topbar/hot.png');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }
}

.topbar-btn-group-mobile {
  height: 100%;

  .hamburger-btn {
    height: 100%;

    .v-btn__content {
      span, i {
        color: $text !important;
      }
    }

    &:hover {
      .v-btn__content {
        span, i {
          color: $text_info !important;
        }
      }
    }

    &:focus {
      .v-btn__content {
        span, i {
          color: $text_active !important;
        }
      }
    }
  }

}

.link-wrapper {
  position: relative;

  .water-drop {
    position: absolute;
    transform: translate(0%, -50%);
    left: 4px;
    top: 50%;
  }
}

.active-link-text {
  color: $mainLightColor !important;
}

.select-language-wrapper {
  align-self: center;
}

.select-language-btn {
  background: transparent !important;
  border: 1px solid $darkFontColor;

  /deep/ .v-btn__content {
    font-size: 14px;
    color: $commonContentColorGray;
  }
}

/deep/ .v-menu__content {
  display: none;
  box-shadow: none !important;

}

.language-drop-icon {
  &.active {
    transform: rotate(180deg) !important;
  }
}

.language-list-wrapper {
  background: $commonBackground2 !important;

  &:parent {
    box-shadow: none;
  }
}

.language-text {
  color: $commonContentColorGray;

  &.active-language {
    color: $mainLightColor;
  }
}
</style>
