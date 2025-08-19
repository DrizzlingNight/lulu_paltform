import {Token} from "../../tokens/collections";
import {Decimal} from "meteor/mongo-decimal";
import {Referral, ReferralThreshold} from "../collections";
import {transaction} from "../../core/database";

export const initReferralData = async function() {
    let token = Token.findOne({referral: true});
    if(token) {
        let index = 0;
        let max = Decimal("1000000000");
        let rate = Decimal("0.1");
        let data = [];
        while (true) {
            let d = {total: max.times(index).times(Decimal("0.05")), rate: rate.div(Decimal(2).pow(index)), token: "ETH_USDM"};
            console.log(index, d.total.toString(), d.rate.toString());
            if(d.total.gte(max)) {
                d.rate = Decimal(0);
                data.push(d);
                break;
            }
            data.push(d);
            index = index + 1;
        }
        console.log(data);
        await ReferralThreshold.insertOne({}, null);
        await Referral.insertOne({}, null);
        await Referral.deleteMany({}, null);
        await transaction.run(async session => {
            await ReferralThreshold.deleteMany({}, {session});
            await ReferralThreshold.insertMany(data, {session});
        });
    } else {
        console.error(`No referral token`);
    }
};