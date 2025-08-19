import { Transaction } from "../collections";
import {marbleMethods} from "/imports/utils/methods";
import {filterQuery} from "../../../utils/filterHelper";
import {errorCodes} from "../../../settings/errorCodes";

marbleMethods({
    /** @desc 充提現記錄 **/
    getTransactions: async function (token, type, status, startTime, endTime, offset=0, limit=10) {
        if (!Meteor.userId()) {
            throw new Meteor.Error(401, errorCodes.LoginRequired);
        }
        const selector = {
            user: Meteor.userId()
        }
        if (status && status.indexOf(1) > -1) {
            status.push(4)
        }
        if (status && status.indexOf(3) > -1) {
            status.push(5)
        }

        const filters = filterQuery({ token, type, status, startTime, endTime });
        for (let key in filters) {
            selector[key] = filters[key]
        }
        console.log(selector)
        const listAggr = [
            { $match: selector },
            { $lookup: { from: "tokens", localField: "token", foreignField: "_id", as: "tokenInfo" } },
            { $sort: { createdAt: -1 } },
            { $skip: offset },
            { $limit: limit }
        ]
        const result = await Promise.all([
            Transaction.rawCollection().count(selector),
            Transaction.rawCollection().aggregate(listAggr).toArray()
        ])

        return {
            count: result[0],
            list: result[1]
        }
    }
})