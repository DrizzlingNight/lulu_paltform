<template>
  <v-menu offset-y left nudge-bottom="5">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
          elevation="0"
          class="lang-btn"
          min-width="100"
          v-bind="attrs"
          v-on="on"
          :class="{ 'lang-btn-open': attrs['aria-expanded'] === 'true' }"
      >
        <span>{{ $t(`language.${i18n.locale}`) }}</span>
        <v-icon v-if="attrs['aria-expanded'] === 'false'" class="icon icon-down ml-1">mdi-menu-down</v-icon>
        <v-icon v-else class="icon icon-up ml-1">mdi-menu-up</v-icon>
      </v-btn>
    </template>
    <v-list class="list-bg" style="box-shadow: 0px 5px 8px 1px rgba(0, 20, 15, 0.5);margin-top: 7px;border-radius: 8px">
      <v-list-item
          v-for="(item, index) in settings.languages"
          :key="index"
          style="min-height: 46px"
          @click="setLanguage(item)"
      >
        <v-list-item-title class="span" style="color: #95C6B7">{{ $t(`language.${item}`) }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import { settings } from "/imports/settings"
import i18n from '../../../lang';

export default {
  name: "selectLanguage",
  data:()=>({
    settings,
    i18n
  }),
  methods:{
    setLanguage(lang){
      i18n.locale = lang
      localStorage.setItem('locale', lang)
    },
    detectLocalLanguage() {
      const localLocale = localStorage.getItem('locale')

      if (!localLocale) {
        // 取得瀏覽器語言和支持的語言
        const countryCode = navigator.language || navigator.browserLanguage
        const countryCodeFormat = countryCode.split('-')[0]
        const supportCountryCode = this.$i18n.availableLocales.map(item => {
          return item.split('-')[0]
        })

        // console.log(`countryCode：${countryCode}, countryCodeFormat：${countryCodeFormat}, supportCountryCode：${supportCountryCode}`)

        // 檢查瀏覽器語言有無支持
        const supportLanguageIndex = supportCountryCode.findIndex(item => item === countryCodeFormat)

        i18n.locale = supportLanguageIndex === -1 ? 'en-EN' :this.$i18n.availableLocales[supportLanguageIndex] 
      } else {
        i18n.locale = localLocale
      }
    }
  },
  created() {
    this.detectLocalLanguage()
  }
}
</script>

<style scoped lang="scss">

@import '/imports/ui/scss/theme';
@import '/imports/ui/assets/css/utils/variables.scss';

.lang-btn {
  background: transparent !important;
  height: 36px !important;
  width: 94px !important;

  &::before {
    background: transparent !important;
  }

  &.lang-btn-open {
    .v-btn__content {
      span, .icon {
        color: #00FFCA !important;
      }
    }
  }

  .v-btn__content {
    span, .icon {
      color: white;
    }
  }

  &:hover {
    .v-btn__content {
      span, .icon {
        color: #00FFCA !important;
      }
    }
  }
}

.list-bg {
  background: $commonBackgroundColor !important;
}

.span:hover {
  color: #00FFCA !important;
  font-weight: 600
}
</style>
