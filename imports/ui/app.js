import Vue from "vue"
import VueMeteorTracker from 'vue-meteor-tracker'; // import the integration package!
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './lang'
import vuetify from './plugins/vuetify'
import Toast from "vue-toastification";
import toaster from "./plugins/toaster";
import analytics from "./plugins/analytics";
import './assets/css/app.scss'
import "vue-toastification/dist/index.css"
const options = {
    // You can set your default options here
    timeout: 3000,
};

import ElementUI from "element-ui";
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI, { size: 'medium', 
i18n: (key, value) => i18n.t(key, value) // 在註冊Element時設置i18n的處理方法
})


import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)

Vue.use(VueMeteorTracker);                         // Add the plugin to Vue!
Vue.use(Toast, options);
Vue.use(toaster)
Vue.use(analytics)
VueClipboard.config.autoSetContainer = true // add this line


function createApp() {
    return {
        app: new Vue({
            el: '#app',
            router,
            store,
            i18n,
            vuetify,
            analytics,
            render: h => h(App),
        }).$mount('#app'),
    }
}

export default createApp
