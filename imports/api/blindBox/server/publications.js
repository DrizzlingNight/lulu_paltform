import { Meteor } from "meteor/meteor";
import {BlindBox, BlindBoxTokenPool} from "../collections";
import { NonFungibleTokenPool } from "../../nft/collections";

/**
 * @api {subscribe} Meteor.subscribe('blindBox') 盲盒活动列表
 * @apiVersion 0.1.0
 * @apiName 订阅盲盒活动
 * @apiGroup BlindBox
 *
 * @apiSuccess {Array} List 开启的盲盒结果列表
 * @apiSuccess {Number} List.id 活动id
 * @apiSuccess {String} List.name 活动名称
 * @apiSuccess {String} List.nft 活动对应奖品nft
 * @apiSuccess {Boolean} List.active 活动是否开启
 * @apiSuccess {String} List.token 盲盒的消费币种
 * @apiSuccess {Number} List.order 排序
 * @apiSuccess {Date} List.startTime 开始时间
 * @apiSuccess {Decimal} List.openFee 开盲盒的费用
 */
Meteor.publish("blindBox", function () {
  return BlindBox.find({ active: true }, { pollingIntervalMs: 500 });
});

/**
 * @api {subscribe} Meteor.subscribe('nftPool') nft类型列表
 * @apiVersion 0.1.0
 * @apiName 订阅nft类型
 * @apiGroup BlindBox
 *
 * @apiSuccess {Array} List nft类型列表
 * @apiSuccess {Number} List.id nft类型id
 * @apiSuccess {String} List.name nft类型名称 目前是land，表示是土地类nft
 * @apiSuccess {Boolean} List.active nft类型是否开启
 * @apiSuccess {Number} List.total nft这种类型的总数量
 * @apiSuccess {Number} List.nDefined nft这种类型的剩余未发放数量
 * @apiSuccess {NonFungibleTokenPoolInfoSchema} List.info nft类型信息内容
 * @apiSuccess {String} List.info.name 类型名称
 * @apiSuccess {Number} List.info.type 类型{Forest: 1, Riverbank: 2, Plain: 3, Mountain: 4, Island: 5, Desert: 6}
 * @apiSuccess {Number} List.info.level 等级{SSS: 1,SS: 2,S: 3,A: 4,B: 5}
 * @apiSuccess {Object} List.info.harvest 收成星级 1是半颗星
 * @apiSuccess {Number} List.info.harvest.foison 大丰收
 * @apiSuccess {Number} List.info.harvest.normal 丰收
 * @apiSuccess {Number} List.info.harvest.poor 歉收
 * @apiSuccess {Number} List.info.hashrate 算力
 * @apiSuccess {Number} List.info.probability 概率 %
 */
Meteor.publish("nftPool", function () {
  return NonFungibleTokenPool.find(
    { active: true },
    { pollingIntervalMs: 500 }
  );
});

/**
 * @api {subscribe} Meteor.subscribe('bboxTokenPool') 盲盒内的nft类型和数量
 * @apiVersion 0.1.0
 * @apiName 订阅nft类型
 * @apiGroup BlindBox
 *
 * @apiSuccess {Array} List 盲盒内nft类型列表
 * @apiSuccess {Number} List.bboxId 盲盒id
 * @apiSuccess {String} List.nftPoolId 盲盒内的这种类型对应的nft类型id
 * @apiSuccess {Boolean} List.active 盲盒内这种nft类型是否开启
 * @apiSuccess {NonFungibleTokenPoolInfoSchema} List.info nft类型信息内容
 * @apiSuccess {Number} List.total 盲盒内这种nft类型的总数量
 * @apiSuccess {Number} List.nDefined 盲盒内这种nft类型的剩余未发放数量
 */
Meteor.publish("bboxTokenPool", function (bboxId) {
  if (bboxId)
    return BlindBoxTokenPool.find(
        { active: true, bboxId },
        { pollingIntervalMs: 500 }
    );
  return BlindBoxTokenPool.find(
      { active: true },
      { pollingIntervalMs: 500 }
  );
});
