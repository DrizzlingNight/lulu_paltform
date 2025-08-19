import {Meteor} from "meteor/meteor";
import {FundPool} from "../collections";

Meteor.publish('fundPool', function () {
    return  FundPool.find({}, { pollingIntervalMs: 500 })
});