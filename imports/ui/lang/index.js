import Vue from 'vue'
import VueI18n from 'vue-i18n'

import { settings } from '/imports/settings'
import logging from "/imports/api/logging";

// 中文
import zhLocale from './zh-TW/index'
// 英文
import enLocale from './en-EN/index'
// 韓文
import krLocale from './kr-KR/index'
// 越南语
import viLocale from './vi-VI/index'

// 針對ElementUI的i18n切換引入
import elementZhTW from 'element-ui/lib/locale/lang/zh-TW'
import elementEn from 'element-ui/lib/locale/lang/en'

Vue.use(VueI18n);

const logger = logging.getLogger(module.id);

const languages = {
  'zh-TW': {
    ...zhLocale,
    ...elementZhTW
  },
  'en-EN': {
    ...enLocale,
    ...elementEn
  },
  'kr-KR': {
    ...krLocale,
    ...elementEn
  },
  'vi-VI': {
    ...viLocale,
    ...elementEn
  }
};

// function loadLocaleMessages () {
//   const locales = require.context('./', true, /[A-Za-z0-9-_,\s]+\.json$/i)
//   // const locales = require('./zh-tw.json')
//   const messages = {}
//   locales.keys().forEach(key => {
//     const matched = key.match(/([A-Za-z0-9-_]+)\./i)
//     if (matched && matched.length > 1) {
//       const locale = matched[1]
//       messages[locale] = locales(key)
//     }
//   })
//   return messages
// }
// const languages = loadLocaleMessages()
//
export const messages = {};
settings.languages.forEach(v => {
  if(languages[v]) {
    messages[v] = languages[v];
  } else {
    logger.error(`invalid language ${v}, check settings.languages!`);
  }
});

// export function getLanguage() {
//   const chooseLanguage = localStorage.language
//   if (chooseLanguage) return chooseLanguage
//
//   // if has not choose language
//   const language = (navigator.language || navigator.browserLanguage).toLowerCase()
//   const locales = Object.keys(messages)
//   for (const locale of locales) {
//     if (language.indexOf(locale) > -1) {
//       return locale
//     }
//   }
//   return 'en'
// }
const i18n = new VueI18n({
  locale: localStorage.getItem('locale') || 'en-EN',
  messages,
  silentTranslationWarn: true,
});

export default i18n
