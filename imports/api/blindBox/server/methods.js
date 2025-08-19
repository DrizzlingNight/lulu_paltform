import {marbleMethods} from "/imports/utils/methods";
import {check} from "meteor/check";

import {errorCodes} from "../../../settings/errorCodes";
import {openBlindBox} from "./service";
import {BlindBoxRecord} from "../collections";

marbleMethods({

    /**
     * @api {call} Meteor.call("openBlindBox",bbId,number,callback) 开启盲盒
     * @apiVersion 0.1.0
     * @apiName 开启盲盒
     * @apiGroup BlindBox
     * @apiParam {number} bbId 盲盒（blindBox）id.
     * @apiParam {number} number 盲盒数量.
     *
     * @apiSuccess {Array} List 开启的盲盒结果列表
     * @apiSuccessExample {json} Success-Response:
     { "content": "This is an example content" }
     */
    openBlindBox(bbId, number) {
        check(number, String);

        if (!Meteor.userId()) {
            throw new Meteor.Error(401, errorCodes.LoginRequired);
        }
        return openBlindBox(Meteor.user(), bbId, number)
    },

    blindBoxRecord(where) {
        if (!Meteor.userId()) {
            throw new Meteor.Error(401, errorCodes.LoginRequired);
        }

        const list = BlindBoxRecord.find({
            user: Meteor.userId()
        }, {sort: {createdAt: -1}, skip: where.offset, limit: where.limit}).fetch()
        const count = BlindBoxRecord.find({user: Meteor.userId()}).count()
        return {list: list, count: count}
    },
});
