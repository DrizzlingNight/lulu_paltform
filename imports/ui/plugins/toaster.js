let MyPlugin = {}
MyPlugin.install = function (Vue) {
    // 1. add global method or property
    Vue.myGlobalMethod = function () {
        // some logic ...
    }

    // 2. add a global asset
    // Vue.directive('my-directive', {
    //     bind (el, binding, vnode, oldVnode) {
    //         // some logic ...
    //     }
    //     ...
    // })

    // 3. inject some component options
    Vue.mixin({
        // created: function () {
        //     // some logic ...
        // }
        // ...
        methods: {
            // 未完成功能提示
            toasterComingSoon() {
                this.$toast.warning(this.$t(`comingSoon`))
            },
            // 成功提示
            toasterSuccess(text) {
                this.$toast.success(text)
            },
            // 警示提示
            toasterWarning(text) {
                this.$toast.warning(text)
            },
            // 錯誤提示 (參數帶入錯誤碼)
            toasterErr(code) {
                let key = `errorCode.${code}`
                let text = this.$t(key)

                // if (text.localeCompare(key) !== 0)
                this.$toast.error(text)
                //         else
                //             this.$toast.error(this.$t(`systemErr`) + `(${code})`)
            }
        }
    })

    // 4. add an instance method
    // Vue.prototype.$myMethod = function (methodOptions) {
    //     // some logic ...
    // }
}
export default MyPlugin
