import SimpleSchema from "simpl-schema";
import {Collection} from "../../core/database";
import {BaseSchema} from "../../core/schema";

const AdminRecordSchema = new SimpleSchema({
    user: String,
    methods: String,
    params: {
        type: Object,
        blackbox: true,
        optional: true
    },
});
AdminRecordSchema.extend(BaseSchema);

const AdminRecord = new Collection("adminRecord");
AdminRecord.attachSchema(AdminRecordSchema);

export {AdminRecord, AdminRecordSchema}
