import SimpleSchema from "simpl-schema";
import { Collection } from "../core/database";
const hotUpdateConfigSchema = new SimpleSchema({
    metadata: Object,
    type: String, // 類型
    createdAt:Date
});
const HotUpdateConfig = new Collection("hotUpdateConfig");
HotUpdateConfig.attachSchema(hotUpdateConfigSchema);

module.exports = {
    HotUpdateConfig
}