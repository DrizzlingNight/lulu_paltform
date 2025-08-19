import {marbleMethods} from "../../../utils/methods";
import {getReferralCount, getReferralList} from "./services";
import {errorCodes} from "../../../settings/errorCodes";

marbleMethods({
    /** @desc获取当前登录用户的邀请数据 **/
    getReferralCount: async function() {
        if (!Meteor.userId()) {
            throw new Meteor.Error(401, errorCodes.LoginRequired);
        }

        return await getReferralCount(Meteor.userId())
    },

    testAgent: async function() {
        return await getReferralList({searchParam: 'NHqD9zSxZRG277Wij', limit:1, offset:0})
    }
})