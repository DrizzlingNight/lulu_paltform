import SimpleSchema from "simpl-schema";
import {BaseSchema} from "../core/schema";

const BinanceMarketStreamSchema = new SimpleSchema({
});
BinanceMarketStreamSchema.extend(BaseSchema);

const BinanceMarketStream = new Mongo.Collection("binanceMarketStream");
BinanceMarketStream.attachSchema(BinanceMarketStreamSchema);


const BinanceMarketStreamSecondSchema = new SimpleSchema({
    delta: Number, // 行情之间间隔时间
})
BinanceMarketStreamSecondSchema.extend(BinanceMarketStreamSchema);

const BinanceMarketStreamSecond = new Mongo.Collection("binanceMarketStreamSecond");
BinanceMarketStreamSecond.attachSchema(BinanceMarketStreamSecondSchema);


const BinanceMarketStreamCheck = new Mongo.Collection("binanceMarketStreamCheck");
const MarketDistribution = new Mongo.Collection("marketDistribution");

export { BinanceMarketStream, BinanceMarketStreamSecond, BinanceMarketStreamCheck, MarketDistribution }
