import {Block} from "../collections";

Meteor.publish('block', function () {
    return Block.find({}, {limit:20,sort: {_id: -1}, pollingIntervalMs: 1000});
});
