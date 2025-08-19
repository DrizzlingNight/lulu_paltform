<template>
  <v-text-field
    v-model="data.phone"
    :label="$t('topbar.inputPhone')"
    :rules="[phoneRules]"
    color="btnColor"
    class="PhoneInput"
  >
    <v-menu
      slot="prepend-inner"
      offset-y
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn 
          plain
          text
          color="white"
          class="countryCode"
          v-bind="attrs"
          v-on="on"
        >
          <span class="text">{{ data.phoneCode }}</span>
          <img 
            v-if="attrs['aria-expanded'] === 'true'"
            class="menu-up"
            src="/static/ui/components/menu-up.png"
          />
          <img
            v-else
            class="menu-down"
            src="/static/ui/components/menu-down.png"
          />
        </v-btn>
      </template>
      <v-list class="list" min-width="144" max-height="400">
        <v-list-item
            v-for="(item, index) in countryCodes"
            :key="index"
            class="listItem"
            @click="choicePhone(item)"
            style=""
        >
          <span class="code">{{ `${item.code}` }}</span>
          <v-spacer></v-spacer>
          <span class="name">{{ `${item.countryCode}` }}</span>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-text-field>
</template>

<script>
import countryCode from "/imports/settings/countryCode"
import i18n from "../../lang";

export default {
  name: 'PhoneInput',
  props: {
    // 動態綁定父元件的data
    data: {
      type: Object,
      require: true,
      default: function() {
        return { phoneCode: '' }
      }
    },
  },
  data() {
    return {
    }
  },
  created() {
  },
  mounted() {
    this.data.phoneCode = this.countryCodes[0].code
  },
  computed: {
    countryCodes() {
      let codes = JSON.parse(JSON.stringify(countryCode))

      let twIdx = -1
      let usIdx = -1
      let krIdx = -1
      let vnIdx = -1

      for(let i = 0;i < codes.length;++i) {
        const code = codes[i]
        if (code.countryCode === "TW") twIdx = i
        else if (code.countryCode === "US") usIdx = i
        else if (code.countryCode === "KR") krIdx = i
        else if (code.countryCode === "VN") vnIdx = i
      }

      let usCode = codes.splice(usIdx, 1)[0]
      let krCode = codes.splice(krIdx-1, 1)[0]
      let vnCode = codes.splice(vnIdx-2, 1)[0]
      let twCode = codes.splice(twIdx-3, 1)[0]

      const locale = i18n.locale

      // zh-TW
      codes.unshift(vnCode)
      codes.unshift(krCode)
      codes.unshift(usCode)
      codes.unshift(twCode)

      if (locale === "en-EN") {
        codes.splice(1,1)
        codes.unshift(usCode)
      } else if (locale === "kr-KR") {
        codes.splice(2,1)
        codes.unshift(krCode)
      } else if (locale === "vi-VI") {
        codes.splice(3,1)
        codes.unshift(vnCode)
      }

      return codes
    },
  },
  methods: {
    phoneRules(v) {
      if (!v)
        return this.$t('topbar.phoneRequired')
      // if (!(/^((13[0-9])|(17[0-1,6-8])|(15[^4,\\D])|(18[0-9]))\d{8}$/).test(v)) {
      //   return this.$t('topbar.phoneValid')
      // }
      return true
    },
    // 選擇區域碼
    choicePhone(item) {
      this.data.phoneCode = item.code
    },
  }
}
</script>

<style lang="scss" scoped>
.PhoneInput {
  .countryCode {
    background: transparent;
    height: 32px;
    width: 20px;
    padding: 0px;
    margin-right: 20px;

    .text {
      color: #ffffff;
      font-size: 18px;
      height: 18px;
      line-height: 18px;
    }

    .menu-up,
    .menu-down {
      max-width: 12px;
      max-height: 8px;
      margin-left: 7px;
    }
  }
}

// 國際碼顯示文字沒有hover時的style
/deep/ .v-btn--plain:not(.v-btn--active):not(.v-btn--loading):not(:focus):not(:hover) .v-btn__content {
  opacity: 1;
}


.list {
  background: #00322E;
  border-radius: 8px;

  .listItem {
    background: #00322E;
    padding-left: 10px;
    padding-right: 11px;
    min-height: 46px;
    border-bottom: 0.555556px solid #2D4742;

    .code,
    .name {
      color: #ffffff;
      font-size: 17px;
      font-weight: 600;
    }
  }
}
</style>