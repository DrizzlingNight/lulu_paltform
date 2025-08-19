import SimpleSchema from "simpl-schema";
import { Collection } from "../core/database";
const GetStartSchema = new SimpleSchema({
    user: String,
    guideId: String,
    done: Boolean,
    createdAt: Date
});
const GetStart = new Collection("getStart");
GetStart.attachSchema(GetStartSchema);

module.exports = {
    GetStart
}
