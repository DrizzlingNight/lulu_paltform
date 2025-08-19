import {BinanceMarketStream, BinanceMarketStreamSecond} from "../collections";
import {Meteor} from "meteor/meteor";

Meteor.publish('marketStream', function () {
    return BinanceMarketStream.find({}, {limit:20,sort: {T: -1}, pollingIntervalMs: 1000});
});
/**
 * @api {subscribe} Meteor.subscribe('marketStreamSecond',delta) 行情记录
 * @apiVersion 0.1.0
 * @apiName 订阅行情记录
 * @apiGroup market
 *
 *
 * @apiParam    {Number}     delta    结算方式 1 3 5 10 30 分钟 每个数据分别间隔 1 3 5 10 30 秒
 */
Meteor.publish('marketStreamSecond', function (delta) {
    return BinanceMarketStreamSecond.find({delta}, {limit:360,sort: {T: -1}, pollingIntervalMs: 1000});
});
