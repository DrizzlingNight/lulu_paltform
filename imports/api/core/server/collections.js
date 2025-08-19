import SimpleSchema from "simpl-schema";
import {Collection} from "../database";

const CounterSchema = new SimpleSchema({
    _id: String,
    sequence_value: Number,
})
export const Counter = new Collection("counters");
Counter.attachSchema(CounterSchema)
