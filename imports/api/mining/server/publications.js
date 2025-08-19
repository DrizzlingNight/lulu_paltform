import {Meteor} from "meteor/meteor";
import {MiningPool} from "../collections";

Meteor.publish('miningPool', function () {
    return  MiningPool.find({}, { pollingIntervalMs: 500 })
});