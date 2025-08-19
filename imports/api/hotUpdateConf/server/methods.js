import {marbleMethods} from "/imports/utils/methods";
import {getHotUpdateConf} from "../services";


marbleMethods({
    /**
     * @desc 获取悬浮球配置
     * @example Meteor.call('getFloatingBalls', callback})
     * @return {Array} 配置表
     */
    getFloatingBalls: async function() {
        return await getHotUpdateConf("floatingBalls");
    },

    /**
     * @api {call}  Meteor.call("getHotUpdateConf",type,callback) 获取热更配置
     * @apiVersion  0.1.0
     * @apiGroup    hotUpdateConf
     * @apiName     获取热更配置
     *
     * @apiParam    {String}    type     配置类型
     * @return {Array} 配置表
     */
    getHotUpdateConf: async function(type) {
        // return await getHotUpdateConf(type);
    },
});
