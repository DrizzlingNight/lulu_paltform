import {Transaction} from "../collections";

Meteor.publish('transactions', function (type, tokenId) {
    check(type, Match.Maybe(Number));
    check(tokenId, Match.Maybe(String));

    let selector = {user:Meteor.userId()};
    if (type) {
        selector.type = type;
    }
    if (tokenId) {
        selector.token = tokenId;
    }
    return Transaction.find(selector, {limit:15,sort: {time: -1}});
});