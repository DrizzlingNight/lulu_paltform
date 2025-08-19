import {marbleMethods} from "/imports/utils/methods";
import {errorCodes} from "../../../settings/errorCodes";
import {getHotUpdateConf} from "../../hotUpdateConf/services";
import {GetStart} from "../collections";
import {updateTaskProgress} from "../../tasks/server/services";


marbleMethods({
    /**
     * @api {call}  Meteor.call("getGuideRules",callback) 获取新手引导配置
     * @apiVersion  0.1.0
     * @apiGroup    getStarted
     * @apiName     获取新手引导配置
     *
     * @return      {Array}     配置表
     */
    getGuideRules: async function () {
        if (!Meteor.userId()) {
            throw new Meteor.Error(401, errorCodes.LoginRequired);
        }
        return await getHotUpdateConf("guide");
    },
    /**
     * @api {call}  Meteor.call("getGuideStatus",callback) 获取新手引导完成情况
     * @apiVersion  0.1.0
     * @apiGroup    getStarted
     * @apiName     获取新手引导完成情况
     *
     * @return      {Array}     完成idList
     */
    getGuideStatus: async function () {
        if (!Meteor.userId()) {
            throw new Meteor.Error(401, errorCodes.LoginRequired);
        }
        return await GetStart.rawCollection().aggregate([
            {$match: {user: Meteor.userId()}},
            {$group: {_id: "$guideId"}},
            {$sort: {_id: 1}},
        ]).toArray()
    },
    /**
     * @api {call}  Meteor.call("setGuideStatus",callback) 设置用户新手引导状态
     * @apiVersion  0.1.0
     * @apiGroup    getStarted
     * @apiName     获取新手引导配置
     *
     * @apiParam    {Number}    guideId   新手引导编号
     * @return      {Array}     设置结果
     */
    setGuideStatus: async function (guideIds) {
        if (!Meteor.userId()) {
            throw new Meteor.Error(401, errorCodes.LoginRequired);
        }
        let docs = guideIds.map(guideId=>{
            return {
                user: Meteor.userId(),
                guideId,
                done: true,
                createdAt: new Date()
            }
        })
        let res = await GetStart.insertMany(docs)
        // 任务事件
        guideIds.forEach(guideId=>{
            updateTaskProgress(Meteor.user(), 'guide', guideId, 1)
        })
    },
});
