import {marbleMethods} from "../../../../utils/methods";
import {sendCode} from "./services";
import { get} from "../../../cache";
import {errorCodes} from "../../../../settings/errorCodes";
import {SmsRecord, SmsSendStatus, SmsTemplateType} from "../colletctions";
import {settings} from "../../../../settings";
import moment from "moment";
import SimpleSchema from "simpl-schema";

marbleMethods({
    sendCode: async function(username, codeType, iddCode='') {
        if (!username.match(SimpleSchema.RegEx.Email) && !username.match(SimpleSchema.RegEx.Phone)) {
            throw new Meteor.Error(400, 400, 'email or phone error')
        }

        let cacheKey = username + '_' + codeType
        let cache = get(cacheKey)
        let count = await SmsRecord.rawCollection().find(
            {
                username: username,
                status: SmsSendStatus.Success,
                createdAt: {$gte: new Date(moment(new Date().getTime()).format('YYYY-MM-DD')), $lt: new Date(moment(new Date().getTime() + 24 * 3600 * 1000).format('YYYY-MM-DD'))}
            }).count()
        if (cache) {
            throw new Meteor.Error(500, errorCodes.RepeatOpt)
        }

        if (count >= settings.sms.countLimit) {
            throw new Meteor.Error(500, errorCodes.ThrottleLimit)
        }
        // const user = Meteor.users.findOne({username: username})
        const user = Meteor.users.findOne({
            $or: [
                {username: username},
                {mobile: username},
                {"emails": {$elemMatch: {"address": username}}}
            ]})
        if ([SmsTemplateType.Reg, SmsTemplateType.Bind].indexOf(parseInt(codeType)) > -1) {
            if (user) {
                throw new Meteor.Error(500, errorCodes.AccountExists)
            }
        } else {
            if (!user) {
                throw new Meteor.Error(500, errorCodes.InvalidUser)
            }
        }

        const resp = await sendCode(username, codeType, iddCode)
        if (!resp) {
            throw new Meteor.Error(500, errorCodes.FailedOpt)
        }
    }
})