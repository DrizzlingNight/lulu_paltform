import "./publications"
import {Block} from "../collections";

try {
    Block._createCappedCollection(4096000,100)
} catch (e) {
}
Block.rawCollection().createIndex("number", {background: true})
Block.rawCollection().createIndex("createdAt", {background: true})
