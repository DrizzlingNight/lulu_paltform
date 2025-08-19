import {Subscription} from "../collections";
import {errorCodes} from "../../../settings/errorCodes";

const checkSubscription = function(email) {
    const data = Subscription.find({email: email}).count()
    return !!data;
}

const subscription = async function (email) {
    if (checkSubscription(email)) {
        throw new Meteor.Error(500, errorCodes.SubscriptionExists)
    }
    return Subscription.rawCollection().insert({
        email: email,
        createdAt: new Date()
    })
}

export {subscription}