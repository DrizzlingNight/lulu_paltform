import "./publications"
import {BinanceMarketStream, BinanceMarketStreamCheck, BinanceMarketStreamSecond} from "../collections";
import {settings} from "../../../settings";
import {checkMarketStatus, init, sendPong} from "./services"
import {addIntervalSyncedCron} from "../../syncedCron/server/service";

if (settings.runBinanceMarketStreams){
    // init(['btcusdt@trade','ethusdt@trade'])
    init()
    // Meteor.settings.private.routines["websocketPong"] = true
    // addIntervalSyncedCron("websocketPong", 60, async function() {
    //     await sendPong()
    //     await checkMarketStatus()
    // })
}

// BinanceMarketStream.rawCollection().createIndex("s");
// BinanceMarketStream.rawCollection().createIndex("symbol");
BinanceMarketStream.rawCollection().createIndex("T");
BinanceMarketStream.rawCollection().createIndex({s:1, a:1, T:1});
// BinanceMarketStream.rawCollection().createIndex("t");
// BinanceMarketStream.rawCollection().createIndex({s:1,t:1});
BinanceMarketStreamSecond.rawCollection().createIndex("s");
BinanceMarketStreamSecond.rawCollection().createIndex("symbol");
BinanceMarketStreamSecond.rawCollection().createIndex("T");
BinanceMarketStreamCheck.rawCollection().createIndex("symbol");
BinanceMarketStreamCheck.rawCollection().createIndex({symbol:1, deltaTime:1});
BinanceMarketStreamCheck.rawCollection().createIndex({symbol:1, deltaTime:1, "start.T":-1});
