import SimpleSchema from 'simpl-schema';
import { Collection } from "../core/database";
/**
 * 黑名單配置 可以配置ip或者用戶id
 */
const BlackSettingSchema = new SimpleSchema({
    ip: {
        type: String
    },
    user: {
        type: String
    },
    username: {
        type: String
    },
    createor: {
        type: String
    },
    desc: {
        type: String
    },
    createdAt: {
        type: Date,
        defaultValue: new Date()
    }
});
const BlackSetting = new Collection("blackSetting");
BlackSetting.attachSchema(BlackSettingSchema);
module.exports = { BlackSettingSchema, BlackSetting }