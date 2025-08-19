let MyPlugin = {}

// Google  Analytics
import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent, setUserId, setUserProperties} from "firebase/analytics";
import { settings } from "/imports/settings";

const firebaseApp = settings.firebaseConfig && initializeApp(settings.firebaseConfig);
const analytics = firebaseApp && getAnalytics(firebaseApp);


MyPlugin.install = function (Vue) {

    Vue.myGlobalMethod = function () {
    }

    Vue.mixin({

        methods: {
            // 设置用户ID
            setUserId(userId) {
                if (analytics)
                    setUserId(analytics, userId);
            },
            // 设置用户属性
            setUserProperties(params) {
                if (analytics)
                    setUserProperties(analytics, params);
            },
            // 记录事件
            logEvent(event, params) {
                if (analytics)
                    logEvent(analytics, event, params)
            },
            // 追踪页面
            trackScreen(screen) {
                if (analytics)
                    logEvent(analytics, 'screen_view', {
                        firebase_screen: screen,
                        firebase_screen_class: screen
                    })
            }
        }
    })

}
export default MyPlugin
