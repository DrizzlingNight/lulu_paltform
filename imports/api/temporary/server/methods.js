import {marbleMethods} from "../../../utils/methods";
import {subscription} from "./services";
import SimpleSchema from "simpl-schema";

marbleMethods({
    /** @desc訂閲最新消息 **/
    subscription: async function(email) {
        if(!email.match(SimpleSchema.RegEx.Email)) {
            throw new Meteor.Error(400, 400, 'please input email address')
        }

        return await subscription(email)
    }
})