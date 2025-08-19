import { errorCodes } from "../../../settings/errorCodes";
import { TokenChange } from "../collections";
import {getTokenOrder} from "./services";
import {marbleMethods} from "/imports/utils/methods";
import {filterQuery} from "/imports/utils/filterHelper";

marbleMethods({
    /** @desc賬變記錄 **/
    balanceHistory: async function(token, type, startTime, endTime, offset = 0, limit = 10) {
        if (!Meteor.userId()) {
            throw new Meteor.Error(401, errorCodes.LoginRequired);
        }

        let selector = {
            user: Meteor.userId(),
        };

        const filters = filterQuery({ token, type, startTime, endTime });
        for (let key in filters) {
            selector[key] = filters[key]
        }

        let count = await TokenChange.aggregate([
            { $match: selector },
            { $count: "count" }
        ]);
        count = count[0] ? count[0].count : 0;

        let data = await TokenChange.aggregate([
            { $match: selector },
            { $sort: { createdAt: -1 } },
            { $skip: offset },
            { $limit: limit },
            { $lookup: { from: "tokens", localField: "token", foreignField: "_id", as: "tokenInfo" } }
        ]);

        return { token, type, startTime, endTime, offset, limit, data, count }
    },

    balanceChanged: async function(token, type, startTime, endTime, offset, limit) {
        if (!Meteor.userId()) {
            throw new Meteor.Error(401, errorCodes.LoginRequired);
        }

        let selector = {
            user: Meteor.userId(),
        };
        const filters = filterQuery({ token, type, startTime, endTime });
        for (let key in filters) {
            selector[key] = filters[key]
        }

        let pipeline = [
            { $match: selector },
        ];
        if (offset) {
            pipeline = [...pipeline, { $skip: offset }]
        }
        if (limit) {
            pipeline = [...pipeline, { $limit: limit }]
        }

        let data = await TokenChange.aggregate([
            ...pipeline,
            { $group: { _id: { token: "$token", type: "$type" }, changed: { $sum: "$changed" }, token: { $first: "$token" } } },
            { $lookup: { from: "tokens", localField: "token", foreignField: "_id", as: "tokenInfo" } }
        ]);
        return { token, type, startTime, endTime, offset, limit, data }
    },

    getTokenOrder: async function() {
        return await getTokenOrder();
    }
});
