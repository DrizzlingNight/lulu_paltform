import SimpleSchema from "simpl-schema";
import { Collection } from "../core/database";

const LockSchema = new SimpleSchema({
    _id: String,
    acquirer:String,
    updated: Date,
});

const Lock = new Collection("locks");

Lock.attachSchema(LockSchema);

export { Lock };