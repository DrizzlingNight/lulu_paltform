import {TokenChange} from "../../tokens/collections";
import {buildTokenChangeSelector} from "./buildSelector";

/**用户账变统计**/
const tokenChangeStatistics = async function (params) {
    let selector = buildTokenChangeSelector(params)
    const data = await TokenChange.rawCollection().aggregate([
        {$match: selector},
        {
            $group: {
                _id: '$token',
                total: {$sum: {$add: ['$changed']}}
            }
        }
    ]).toArray()
    let total = {}
    data.forEach(d => {
        total[d._id] = d.total.toString()
    })
    return total
}

export {tokenChangeStatistics}