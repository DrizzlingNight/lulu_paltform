import {marbleMethods} from "../../../../utils/methods";
import {getArticles, makeArticle} from "./services";

marbleMethods({
    /**
     * @api {call} Meteor.call("getArticles",types,callback) 获取背包数据
     * @apiVersion 0.1.0
     * @apiGroup 背包
     * @apiName 获取背包数据
     *
     * @apiParam    {Array}    types        类型
     * @apiParam    {String}   types.type   类型过滤，可以多选，参考ArticalType
     *
     * @apiSuccess {Array} List 背包数据列表
     * @apiSuccess {String} List.articleId 物品对应商品种类id
     * @apiSuccess {Number} List.number 物品数量
     * @apiSuccess {Object} List.info 物品信息
     * @apiSuccess {String} List.info.type 物品类型 goods seed fruit fragment key
     * @apiSuccess {Object} List.info.name 物品名称 name[language]指定语种
     * @apiSuccess {Object} List.info.des 物品描述
     * @apiSuccessExample {json} Success-Response:
     [
         {
            "articleId": 1030001,
            "user": "hotRuFYZc7YZW9cAP",
            "number": 5,
            "info": {
                "_id": 1030001,
                "type": "fragment",
                "converTo": {
                    "info":{
                        "_id":1010001,
                        "type":"seed",
                        "linkedId":"primary_grape",
                        "name":{"zh-TW":"葡萄種子","en-EN":"Grape Seed"},
                        "des":{"zh-TW":"一種葡萄種子，收穫後可以獲得新鮮的葡萄","en-EN":"A grape seed that yields fresh grapes after harvest"}
                        }
                },
                "numConvert": 10,
                "name": {
                    "zh-TW": "葡萄種子碎片",
                    "en-EN": "Grape Seed Fragment"
                },
                "des": {
                    "zh-TW": "收集可換取葡萄種子",
                    "en-EN": "Collect in exchange for grape seeds"
                }
            }
        }
     ]
     */
    getArticles: async function(types){
        if (!Meteor.userId()) {
            throw new Meteor.Error(401);
        }
        let user = Meteor.user()
        return await getArticles(user, types)
    },
    /**
     * @api {call} Meteor.call("makeArticle",articleId,callback) 碎片合成
     * @apiVersion 0.1.0
     * @apiGroup 背包
     * @apiName 碎片合成
     *
     * @apiParam    {String}   articleId   要合成的物品的类型id
     *
     * @apiSuccess {Object} consume         消耗物品信息
     * @apiSuccess {Object} make            生成物品信息
     * @apiSuccess {Object} make.info       物品信息
     * @apiSuccess {Object} make.number     消耗/生成物品数量
     * @apiSuccessExample {json} Success-Response:
     {
            "consume": {
                "info": {
                    "_id": 1030001,
                    "type": "fragment",
                    "converTo": 1010001,
                    "numConvert": 10,
                    "name": {
                        "zh-TW": "葡萄種子碎片",
                        "en-EN": "Grape Seed Fragment"
                    },
                    "des": {
                        "zh-TW": "收集可換取葡萄種子",
                        "en-EN": "Collect in exchange for grape seeds"
                    }
                },
                "number": 10
            },
            "make": {
                "info": {
                    "_id": 1010001,
                    "type": "seed",
                    "name": {
                        "zh-TW": "葡萄種子",
                        "en-EN": "Grape Seed"
                    },
                    "des": {
                        "zh-TW": "一種葡萄種子，收穫後可以獲得新鮮的葡萄",
                        "en-EN": "A grape seed that yields fresh grapes after harvest"
                    }
                },
                "number": 1
            }
        }
     */
    makeArticle: async function(articleId){
        if (!Meteor.userId()) {
            throw new Meteor.Error(401);
        }
        let user = Meteor.userId()
        return await makeArticle(user, Number(articleId))
    }
})
