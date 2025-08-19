import SimpleSchema from "simpl-schema";
import { BaseSchema } from "../core/schema";
import {Collection} from "../core/database";

const BlockSchema = new SimpleSchema({
    _id: String,
    number: Number,
    hash: String,
    blockInfo: {
        type: Object,
        blackbox: true
    },
    createdAt: Date,
});
BlockSchema.extend(BaseSchema);

const Block = new Collection("blocks");
Block.attachSchema(BlockSchema);

export {
    Block,
    BlockSchema,
}
