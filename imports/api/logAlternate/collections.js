import SimpleSchema from "simpl-schema";
import { Collection } from "../core/database";

const loggerDBSchema = new SimpleSchema({
    _id: String,
    mark: String,
    text: String,
    createdAt: Date
});

const LoggerDB = new Collection("loggerDBs");

LoggerDB.attachSchema(loggerDBSchema);

export { LoggerDB };