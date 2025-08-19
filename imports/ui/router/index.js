import Vue from 'vue'
import Router from 'vue-router'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
NProgress.configure({ showSpinner: false }) // NProgress Configuration

import routes from './modules/index.js'

import logging from "../../api/logging";
const logger = logging.getLogger(module.id);

import { getAnalytics, logEvent} from "firebase/analytics";


Vue.use(Router)

const createRouter = () =>
    new Router({
        mode: 'history',
        scrollBehavior(to, from, savedPosition) {
            if (savedPosition) {
                return savedPosition
            } else {
                return { y: 0 }
            }
        },
        routes,
    })

const router = createRouter()

export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
}

/**
 * 判斷是否是路由白名單
 * @param {String} path 路由的path——eg:'/home'
 */
const isWhiteRouter = path => {
    return routes.some(o => path.includes(o.path))
}

router.beforeEach((to, from, next) => {
    if (from.path.includes('/game')) {
        // 遊戲界麵跳轉到其他界麵時，直接用瀏覽器頁麵跳轉，不采用h5跳轉，防止遊戲引擎資源未回收問題
        window.location = window.location.origin + to.path
        return
    }
    NProgress.start()
    next()

    if (to.name && (to.name.length || 0) > 0){
        const analytics = getAnalytics()
        logEvent(analytics, 'screen_view', {
            firebase_screen: to.name,
            firebase_screen_class: to.name
        })
    }
})

router.afterEach(to => {
    NProgress.done() // finish progress bar
})
//重复点击同一路由
const VueRouterPush = Router.prototype.push
Router.prototype.push = function push (to) {
    return VueRouterPush.call(this, to).catch(err => err)
}
export default router
