import * as _ from "lodash"

import {Token, TokenChange, TokenChangeSchema} from "../collections";
import logging from "../../logging";
import {MongoInternals} from "meteor/mongo";
import {get, set} from "../../cache/index"
import {Random} from "meteor/random";

const Decimal128 = MongoInternals.NpmModules.mongodb.module.Decimal128;
const logger = logging.getLogger(module.id);

const getTokenList = async function(offset = 0, limit = 10, name = '') {
    const query = {};
    if (name !== '') {
        query.name = new RegExp(name, 'ig')
    }
    try {
        const results = await Promise.all([
            Token.find(query).count(),
            Token.find(query, { skip: offset, limit: limit }).fetch()
        ])
        return { count: results[0], data: results[1] }
    } catch (error) {
        logger.error(error)
        return error
    }
}

// 以字典形式获取token的order
const getTokenOrder = async function () {
    return await Token.aggregate([{$project: {_id: 1, order: 1}}]);
};
const getToken = function({id=null, active=null, reference=null, mining=null, referral=null, stake=null, fund=null}) {
    /*
    * 返回符合条件的第一个币种，应确保搜索条件唯一
    * */
    let tokens = getTokens();
    let filter = (v) => {
        let idFilter = id != null ? v._id === id : true;
        let activeFilter = active != null ? v.active === active : true;
        let referenceFilter = reference != null ? v.reference === reference : true;
        let miningFilter = mining != null ? v.mining === mining : true;
        let referralFilter = referral != null ? v.referral === referral: true;
        let stakeFilter = stake != null ? v.stake === stake: true;
        let fundFilter = fund != null ? v.fund === fund: true;
        return idFilter && activeFilter && referenceFilter && miningFilter && referralFilter && stakeFilter && fundFilter;
    };
    return _.find(tokens, filter);
};
const getTokens = function() {
    let tokens = get("tokens");
    if (!tokens) {
        tokens = Token.find({active:true}).fetch();
        set("tokens", tokens, 300);
        logger.info(`fetch tokens from db: ${JSON.stringify(tokens)}`);
        return get("tokens");
    }
    return tokens;
};

const tokenChange = async function({ user, type, amount, current, token, userData }, session) {
    let tokenChange = {
        _id: Random.id(),
        user: user._id,
        token: token._id,
        type: type,
        changed: Decimal128.fromString(amount.toString()),
        current: Decimal128.fromString(current.toString()),
        userData
    };
    tokenChange = TokenChangeSchema.clean(tokenChange, { mutate: true, extendAutoValueContext: { isInsert: true } });
    TokenChangeSchema.validate(tokenChange);
    return await TokenChange.rawCollection().insert(tokenChange, { session });
};

export {getTokenList, getTokenOrder, getTokens, tokenChange, getToken}
