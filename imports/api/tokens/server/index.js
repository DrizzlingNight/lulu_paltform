import {StatisticsTokenChangeId, Token, TokenChange, TokenChangeStatistics, WelfarePool} from "../collections";
import "./publications";
import "./methods";

TokenChange.rawCollection().createIndex("type");
TokenChange.rawCollection().createIndex({"user": 1, "createdAt": -1});
TokenChange.rawCollection().createIndex("createdAt");
TokenChange.rawCollection().createIndex({"type": 1, "createdAt": -1}, {background: true});
TokenChange.rawCollection().createIndex({"type": 1, "changed": 1}, {background: true});

WelfarePool.rawCollection().createIndex({token: 1}, {background: true});

Token.createIndex("_id");
Token.createIndex({"name": 1}, {background: true});
Token.createIndex({"code": 1}, {background: true});

TokenChangeStatistics.rawCollection().createIndex('user')
TokenChangeStatistics.rawCollection().createIndex('token')
TokenChangeStatistics.rawCollection().createIndex('referral')
TokenChangeStatistics.rawCollection().createIndex('type')
TokenChangeStatistics.rawCollection().createIndex('createdAt')
TokenChangeStatistics.rawCollection().createIndex("time")
TokenChangeStatistics.rawCollection().createIndex({parents:1, time: 1, }, {background: true})
TokenChangeStatistics.rawCollection().createIndex({user: 1, token: 1, type:1, tokenChangeType:1, time:1}, {background: true, unique: true})
TokenChangeStatistics.rawCollection().createIndex({
    "user": 1,
    'token': 1,
    'type': 1,
    "createdAt": -1
}, {background: true})

StatisticsTokenChangeId.rawCollection().createIndex('type')
