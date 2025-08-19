import {Meteor} from "meteor/meteor";
import {Game} from "../collections";

Meteor.publish('games', function () {
    return Game.find({active: true}, { pollingIntervalMs: 500 })
});
