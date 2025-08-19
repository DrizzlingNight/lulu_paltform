import "./methods";
import "./publications";
import {LandSlot, Seed} from "../collections";
import {Counter} from "../../../core/server/collections";

LandSlot.rawCollection().createIndex("user")
LandSlot.rawCollection().createIndex({"_id": 1, "user": 1, "roundId": 1}, {background: true})
LandSlot.rawCollection().createIndex({"_id": 1, "roundId": 1}, {background: true})
LandSlot.rawCollection().createIndex({"position": 1, "user": 1}, {background: true, unique: true})
Seed.rawCollection().createIndex("active", {background: true})
Seed.rawCollection().createIndex({"_id": 1, "active": 1}, {background: true})

Counter.insertOne({_id:"gameId", sequence_value:100000}).catch(e=>{})
