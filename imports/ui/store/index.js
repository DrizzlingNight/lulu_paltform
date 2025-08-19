import Vue from "vue";
import Vuex from "vuex";
import getters from "./getters";

import ui from "./modules/ui";
import user from "./modules/user";
import box from "./modules/box";
import pledge from "./modules/pledge";
import walletConnect from './modules/walletConnect'

// const requireContext = require('require-context')
// const path = require('path')

Vue.use(Vuex);

// const modulesFiles = require.context('./modules', true, /\.js$/)
// const modulesFiles = [ui]
//
// const modules = modulesFiles.keys().reduce((modules, modulePath) => {
//     const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
//     const value = modulesFiles(modulePath)
//     modules[moduleName] = value.default
//     return modules
// }, {})

// const context = requireContext(path.join(__dirname, './routes'), false, /\.js$/)
// const modules = context.keys().reduce((rt, k) => {
//     rt = rt.concat(context(k))
//     return rt
// }, [])

const store = new Vuex.Store({
  modules: {
    ui,
    user,
    box,
    pledge,
    walletConnect
  },
  getters,
});

export default store;
