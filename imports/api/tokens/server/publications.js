import {Meteor} from "meteor/meteor";
import {Token} from "../collections";
import {UserBalance} from "../../account/collections";

Meteor.publish('tokens', function () {
    return Token.find({active: true}, { pollingIntervalMs: 500 })
});

Meteor.publish('balance', function () {
    return  UserBalance.find({user: this.userId}, { pollingIntervalMs: 500 })
});