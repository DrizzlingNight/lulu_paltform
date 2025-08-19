import SimpleSchema from "simpl-schema";
import { Decimal } from "meteor/mongo-decimal";
import { Collection } from "../core/database";
import { BaseSchema } from "../core/schema";

const SubscriptionSchema = new SimpleSchema({
    email: String,
    createdAt: Date
});
const Subscription = new Collection("subscription");
Subscription.attachSchema(SubscriptionSchema);

export { Subscription }