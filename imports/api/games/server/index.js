import "./methods";
import "./publications";
import {Game, GameRound} from "../collections";

Game.rawCollection().createIndex("active")
Game.rawCollection().createIndex("name")

GameRound.rawCollection().createIndex({createdAt: 1}, {background: true})
GameRound.rawCollection().createIndex({"game._id": 1, status: 1, "userData.slot.user":1}, {background: true})
GameRound.rawCollection().createIndex({"game._id": 1, "userData.state":1, "userData.refreshTime": 1}, {background: true})
GameRound.rawCollection().createIndex({"_id": 1, "userData.state":1, "userData.slot.user":1}, {background: true})
GameRound.rawCollection().createIndex({"_id": 1, "userData.state":1}, {background: true})
