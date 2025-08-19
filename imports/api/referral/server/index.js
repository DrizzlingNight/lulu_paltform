import './methods'
import {ProxyBuybackOrder, Referral, ReferralPool, ReferralThreshold} from "../collections";

Referral.rawCollection().createIndex({"token": 1});
Referral.rawCollection().createIndex({"user": 1});
Referral.rawCollection().createIndex({"referral": 1});
Referral.rawCollection().createIndex({"fromUser": 1});

ReferralPool.rawCollection().createIndex({token: 1}, {unique: true});
ReferralThreshold.rawCollection().createIndex({token: 1});

ProxyBuybackOrder.rawCollection().createIndex({"user": 1})
ProxyBuybackOrder.rawCollection().createIndex({"token": 1})
ProxyBuybackOrder.rawCollection().createIndex({"createdAt": 1})
ProxyBuybackOrder.rawCollection().createIndex({"status": 1})
ProxyBuybackOrder.rawCollection().createIndex({"time": 1})
ProxyBuybackOrder.rawCollection().createIndex({"user": 1, "token": 1, "time": 1}, {background: true})