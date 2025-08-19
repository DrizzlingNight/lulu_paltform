import {HotUpdateConfig} from "./collections"
import {setList} from "./setting"
import {Token} from "../tokens/collections"
import {ReferralThreshold} from "../referral/collections"
import _ from "lodash"
import {errorCodes} from "../../settings/errorCodes";

const Decimal128 = MongoInternals.NpmModules.mongodb.module.Decimal128;
import {Decimal} from "meteor/mongo-decimal";
import {transaction} from "../core/database";

const fns = {};
import logging from '../logging'
import {NonFungibleTokenPool, NonFungibleTokenPoolLevel, NonFungibleTokenPoolType} from "../nft/collections";
import moment from "moment";
import {BlindBox, BlindBoxTokenPool} from "../blindBox/collections";
import {Seed} from "../games/market/collections";
import {MiningThreshold} from "../mining/collections";
import {Article} from "../games/article/collections";
import {BountyTaskRule} from "../bountyTasks/collections";
import {TaskFinishRules, TaskRewards, TaskRules} from "../tasks/collections";

const logger = logging.getLogger(module.id);
export const hotUpdateConfig = function (params) {
    if (_.isObject(params) && _.isFunction(params.callback) && _.isString(params.filename)) {
        fns[params.filename] = params.callback
    }
}

const triggleEventCallback = async function () {
    for (let key in fns) {
        _.isFunction(fns[key]) && await fns[key](key)
    }
}

const findFileName = function (str) {
    const fileName = str.split('$')[1]
    const type = str.split('$')[0]
    return {name: "$" + fileName, type: type == "" ? "array" : "object"}
}

const findPrimaryKey = function (str) {
    const key = str.split('$')[2]
    const primary = {}
    if (key) {
        const priKey = key.split(":")
        if (priKey[0]) {
            primary['key'] = priKey[0]
        }
        if (priKey[1]) {
            primary['val'] = priKey[1]
        }
    }
    return primary
}

const isStringArray = function (element) {
    return typeof element == 'string' && element.indexOf("~") > -1
}

const _parseString = function (str) {
    //TODO: 字符串對象pasrse
    try {
        if (str == 'null') {
            return str
        } else if (str.slice(0, 2) === 'D#') {
            return Decimal128.fromString(str.slice(2))
        } else {
            return JSON.parse(str)
        }
    } catch (e) {
        // 檢查是否約定的數組
        if (isStringArray(str)) {
            return str.split('~')
        } else {
            return str
        }
    }
}

const gameUpdate = async function (data) {
    return await Promise.all(data.map(async item => {
        return await Game.rawCollection().findOneAndUpdate({_id: item._id}, {$set: item}, {upsert: true})
    }))
}

const tokenUpdate = async function (data) {
    return await Promise.all(data.map(async item => {
        return await Token.rawCollection().findOneAndUpdate({_id: item._id}, {$set: item}, {upsert: true})
    }))
}

const miningThresholdUpdate = async function (data) {
    let token = Token.findOne({mining: false, miningRate: {$gt: 0}});
    data = await xxPoolsUpdate(token, data)
    let result = false;
    await transaction.run(async (session) => {
        await MiningThreshold.rawCollection().remove({}, {session})
        result = await MiningThreshold.rawCollection().insertMany(data, {session})
    })
    return result
}

const referralPoolsUpdate = async function (data) {
    let token = Token.findOne({referral: false, referralRate: {$gt: 0}});
    data = await xxPoolsUpdate(token, data);
    let result = false;
    await transaction.run(async (session) => {
        await ReferralThreshold.rawCollection().remove({}, {session})
        result = await ReferralThreshold.rawCollection().insertMany(data, {session})
    })
    return result
}
const xxPoolsUpdate = async function (token, data) {
    return data.map(item => {
        return {
            total: Decimal128.fromString(Decimal(item.total).toString()),
            token: item.token || token._id,
            rate: Decimal128.fromString(Decimal(item.rate).toString()) //item.rate
        }
    })
}
const landNftId = "61c04f78cd117d10572c88cf"
const nonFungibleTokenPoolUpdate = async function (data) {
    let setInfo = data.map(function (item) {
        let total = 0
        let cumulativeDistribution = [
            {
                max: Number(total = Decimal(item.harvest_p).times(1000)),
                res: {
                    name: "harvest",
                    max: Decimal(1).add(item.harvest_bonus).add(item.harvest_ran),
                    min: Decimal(1).add(item.harvest_bonus).add(Decimal(item.harvest_ran).neg())
                }
            },
            {
                max: Number(total = total.add(Decimal(item.bumper_harvest_p).times(1000))),
                res: {
                    name: "bumper_harvest",
                    max: Decimal(1).add(item.bumper_harvest_bonus).add(item.harvest_ran),
                    min: Decimal(1).add(item.bumper_harvest_bonus).add(Decimal(item.harvest_ran).neg())
                }
            },
            {
                max: Number(total = total.add(Decimal(item.poor_harvest_p).times(1000))),
                res: {
                    name: "poor_harvest",
                    max: Decimal(1).add(item.poor_harvest_bonus).add(item.harvest_ran),
                    min: Decimal(1).add(item.poor_harvest_bonus).add(Decimal(item.harvest_ran).neg())
                }
            },
            {
                max: Number(total.add(Decimal(item.very_poor_harvest_p).times(1000))),
                res: {
                    name: "very_poor_harvest",
                    max: Decimal(1).add(item.very_poor_harvest_bonus).add(item.harvest_ran),
                    min: Decimal(1).add(item.very_poor_harvest_bonus).add(Decimal(item.harvest_ran).neg())
                }
            }
        ]
        return {
            _id: item._id,
            nftId: landNftId,
            active: true,
            total: item.total,
            nDefined: item.total,
            currentId: 1.0,
            minId: 1.0,
            maxId: item.total,
            info: {
                ...item,
                name: item.grade,
                level: NonFungibleTokenPoolLevel[item.grade],
                type: NonFungibleTokenPoolType[item.type[0].toUpperCase() + item.type.slice(1)],
                hashrate: item.power,
                harvest: {
                    foison: item.bumper_harvest_star,
                    normal: item.harvest_star,
                    poor: item.poor_harvest_star,
                    very_poor: item.very_poor_harvest_star
                },
                idPrefix: item.id_prefix,
                probability: item.probability,
                effect: {
                    total: 1000,
                    cumulativeDistribution
                },
                mine_cap: item.mine_cap
            },
            name: "Land"
        }
    })
    let map = {}
    await Promise.all(setInfo.map(async item => {
            map[item._id] = item
            let res = await NonFungibleTokenPool.findOneAndUpdate({_id: item._id}, {$set: {info: item.info}})
            if (res.ok !== 1 || !res.value)
                res = await NonFungibleTokenPool.rawCollection().insertOne(item)
            return res.value
        })
    )

    let blindBoxTokenPoolList = BlindBoxTokenPool.find({}).fetch()
    await Promise.all(blindBoxTokenPoolList.map(async item => {
            await BlindBoxTokenPool.findOneAndUpdate({_id: item._id}, {$set: {info: map[item.nftPoolId].info}})
        })
    )
}

const blindBoxTokenPoolUpdate = async function (data) {
    let blindBoxTokenPoolList = []
    let blindBoxList = data.map(item => {
        let poolList = item.NFTS.map((t, i) => {
            return {
                _id: `${item._id}_${i}`,
                nftId: landNftId,
                total: t[1],
                nDefined: 0,
                nDefined_tmp: t[1],
                bboxId: item._id,
                active: true,
                nftPoolId: t[0]
            }
        })
        blindBoxTokenPoolList.push(...poolList)
        return Object.assign(item, {
            name: "land",
            nft: landNftId,
            startTime: moment(item.startTime).toDate()
        })
    })
    for (let i = 0; i < blindBoxTokenPoolList.length; i++) {
        let pool = await NonFungibleTokenPool.rawCollection().findOne({_id: blindBoxTokenPoolList[i].nftPoolId})
        if (pool)
            blindBoxTokenPoolList[i].info = pool.info
    }
    await BlindBox.remove({})
    await BlindBox.insertMany(blindBoxList)
    return await Promise.all(blindBoxTokenPoolList.map(async item => {
            let res = await BlindBoxTokenPool.findOneAndUpdate({_id: item._id}, {$set: {info: item.info}})
            if (res.ok !== 1 || !res.value)
                res = await BlindBoxTokenPool.rawCollection().insertOne(item)
            return res.value
        })
    )
}

const seedUpdate = async function (data) {
    data = data.map(item => ({
        ...item,
        price: Decimal(item.price)
    }))
    await Seed.remove({})
    await Seed.insertMany(data)
}

const itemsUpdate = async function (data) {
    data = data.map(item => {
        let res = {
            _id: item.id,
            type: item.type,
            linkedId: item.linkedId,
            converTo: item.converTo,
            numConvert: item.numConvert,
            unit: item.unit
        }
        for (let i in item) {
            let keys = i.split("_")
            if (keys.length !== 2)
                continue
            if (!res[keys[0]])
                res[keys[0]] = {}
            res[keys[0]][keys[1]] = item[i]
        }
        return res
    })
    await Article.remove({})
    await Article.insertMany(data)
}

const BountyTaskUpdate = async function (data) {
    let rules = {inProgressCount: 4, timeLimit: [], mode: []}
    let leaseLevel = []
    let workLevel = []
    data.map(item => {
        if (rules.timeLimit.indexOf(item.time) < 0) {
            rules.timeLimit.push(item.time)
        }
        let rewards = []
        if (item.bonus_LUCK) {
            rewards.push({
                'type': 'token',
                'token': 'LUCK',
                'amount': item.bonus_LUCK
            })
        }
        if (item.bonus_USDT) {
            rewards.push({
                'type': 'token',
                'token': 'LUSD',
                'amount': item.bonus_USDT
            })
        }

        let level = {
            'seedsCount': item.request_seed,
            'time': item.time,
            'rewards': rewards
        }
        if (item.mode === 1) {
            leaseLevel.push(level)
        }
        if (item.mode === 2) {
            workLevel.push(level)
        }
    })
    rules.mode.push({
        type: 'lease',
        level: leaseLevel
    })
    rules.mode.push({
        type: 'work',
        level: workLevel
    })
    await BountyTaskRule.findOneAndUpdate({_id: 'leaseLand'},
        {$set: {rules: rules}})
}

/**任务规则**/
const TaskRulesUpdate = async function (data) {
    data = data.map(item => ({
        ...item,
        _id: '' + item._id,
        finish_rules: item.finish_rules ? '' + item.finish_rules : '',
        rewards: item.rewards ? '' + item.rewards : '',
        pre_task_id: '' + item.pre_task_id
    }))
    await TaskRules.remove({})
    await TaskRules.insertMany(data)
}

/**任务完成规则**/
const TaskFinishRulesUpdate = async function (data) {
    data = data.map(item => ({
        ...item,
        _id: '' + item._id,
        content_type: item.content_type ? item.content_type : '',
        amount: Decimal(item.amount ? item.amount : '0')
    }))
    await TaskFinishRules.remove({})
    await TaskFinishRules.insertMany(data)
}

/**任务奖励**/
const TaskRewardsUpdate = async function (data) {
    data = data.map(item => ({
        ...item,
        _id: '' + item._id,
        amount: Decimal(item.amount ? item.amount : '0')
    }))
    await TaskRewards.remove({})
    await TaskRewards.insertMany(data)
}

/** @desc 通用的热更 */
const genericUpdate = async function (data, name) {
    let coll = {};
    if (coll[name] !== undefined) {
        return await Promise.all(data.map(async item => {
            return coll[name].rawCollection().findOneAndUpdate({_id: item._id}, {$set: item}, {upsert: true})
        }))
    } else {
        return `info: ${name} cannot match case `;
    }
};

const updateMongodb = async function (name, result) {
    await HotUpdateConfig.rawCollection().findOneAndUpdate({type: name}, {
        $set: {
            metadata: result,
            type: name,
            createdAt: new Date()
        }
    }, {upsert: true});
    let resp;
    switch (name) {
        case "game":
            setList(`Update game collection`)
            resp = await gameUpdate(result)
            setList(`End game collection`)
            break;
        case "token":
            setList(`Update token collection`)
            resp = await tokenUpdate(result)
            setList(`End token collection`)
            break;
        case "miningThreshold":
            resp = await miningThresholdUpdate(result)
            break;
        case "referralThreshold":
            resp = await referralPoolsUpdate(result)
            break;
        case "land":
            resp = await nonFungibleTokenPoolUpdate(result)
            break;
        case "blindbox":
            resp = await blindBoxTokenPoolUpdate(result)
            break;
        case "seed":
            resp = await seedUpdate(result)
            break;
        case "items":
            resp = await itemsUpdate(result)
            break;
        case "orderConfig":
            resp = await BountyTaskUpdate(result)
            break;
        case "task_rules":
            resp = await TaskRulesUpdate(result)
            break
        case "task_finish_rules":
            resp = await TaskFinishRulesUpdate(result)
            break
        case "task_rewards":
            resp = await TaskRewardsUpdate(result)
            break
        default:
            resp = await genericUpdate(result, name);
            break;
    }
    return resp
}

const mapText = async function (text = []) {
    return await Promise.all(text.map(async item => {
        return parseStringToJson(item)
    }))
}

// staring 轉成json
export const parseStringToJson = async function (item) {
    const obj = {}
    for (let key in item) {
        // 檢查是否是關聯有子表
        if (/\$/.test(item[key])) {
            const primaryKey = findPrimaryKey(item[key]);
            const file = findFileName(item[key]);
            if (file && file.name) {
                const name = file.name.replace(/\$$/g, '')
                const fileName = name + '.csv';
                const results = await HotUpdateConfig.rawCollection().findOne({
                    type: "file",
                    "metadata.name": fileName,
                });
                if (results && results.metadata && results.metadata.text) {
                    const ownerKey = primaryKey.val ? primaryKey.val : item[primaryKey.key];
                    const child = results.metadata.text.filter(el => {
                        return el[primaryKey.key] == ownerKey
                    })
                    const _mapText = await mapText(child)
                    if (file.type == 'array') {
                        obj[key] = _mapText
                    } else {
                        obj[key] = _mapText[0]
                    }
                } else {
                    throw new Meteor.Error(500, errorCodes.MissingFile)
                }
            }
        } else {
            obj[key] = _parseString(item[key])
        }
    }
    return obj
}

// 獲取原始數據
export const getOriginData = async function () {
    const files = await HotUpdateConfig.rawCollection().find({
        type: "file",
        "metadata.name": /^[^\$].*/gi,
        "metadata.status": true,
    }).toArray();
    return await Promise.all(files.map(async file => {
        if (file.metadata && file.metadata.text) {
            const data = await mapText(file.metadata.text);
            const result = await updateMongodb(file.metadata.name.replace(".csv", ''), data)
            await HotUpdateConfig.rawCollection().findOneAndUpdate({
                type: "file",
                "metadata.name": file.metadata.name
            }, {$set: {"metadata.status": false}})
            return result
        }
    }))
}

// 開始熱更
export const hotUploadStart = async function () {
    try {
        const result = await getOriginData()
        await triggleEventCallback()
        return {"success": true, data: result}
    } catch (e) {
        return {"success": false, data: e}
    }

}

// 前台上傳csv文件數據到後台
export const uploadFileData = async function (params) {
    const metadata = {
        text: params.data,
        name: params.name,
        status: true
    };
    return await HotUpdateConfig.rawCollection()
        .findOneAndUpdate({
            type: "file",
            "metadata.name": params.name
        }, {
            $set: {
                type: "file",
                metadata,
                createdAt: new Date()
            }
        }, {upsert: true});

}

export const deleteDb = async function () {
    if (Meteor.isDevelopment) {
        await Promise.all([
            Game.rawCollection().remove({}),
            Token.rawCollection().remove({}),
        ])
    }
    return true
}

export const getReleaseConfig = async function () {
    const where = {
        type: "releaseconf"
    }
    const result = await HotUpdateConfig.rawCollection().findOne(where)
    if (result) {
        return {
            activities: result.metadata && result.metadata[0] && result.metadata[0].activities ? Decimal(result.metadata[0].activities) : Decimal(0),
            privateraise: result.metadata && result.metadata[0] && result.metadata[0].privateraise ? Decimal(result.metadata[0].privateraise) : Decimal(0)
        }
    }
    return {
        activities: Decimal(0),
        privateraise: Decimal(0),
    }
}

export const getRankConfig = async function (session) {
    const where = {
        type: "config"
    }
    const result = await HotUpdateConfig.rawCollection().findOne(where, {session})
    if (result) {
        return {
            buybackcashflowdivrate: result.metadata && result.metadata[0] && result.metadata[0].buybackcashflowdivrate ? result.metadata[0].buybackcashflowdivrate : 0,
            buybackpooldailydivrate: result.metadata && result.metadata[0] && result.metadata[0].buybackpooldailydivrate ? result.metadata[0].buybackpooldailydivrate : 0,
            rankcashflowdivrate: result.metadata && result.metadata[0] && result.metadata[0].rankcashflowdivrate ? result.metadata[0].rankcashflowdivrate : 0,
            token: result.metadata && result.metadata[0] && result.metadata[0].rankdivtokenid ? result.metadata[0].rankdivtokenid : [],
        }
    }
    return {
        rankcashflowdivrate: 0,
        token: []
    }
}

export const updateReleaseConf = async function ({activities, privateraise}) {
    const where = {
        type: "releaseconf"
    };
    const metadata = [{
        activities, privateraise
    }];
    const updated = {
        $set: {
            metadata,
            "type": "releaseconf"
        }
    };
    return await HotUpdateConfig.rawCollection().findOneAndUpdate(where, updated, {upsert: true})
}

export const getHotUpdateConf = async function (type, session) {
    const where = {
        type: type
    }
    const result = await HotUpdateConfig.rawCollection().findOne(where, {session})
    return result ? result.metadata : []
}

export const clientGetAnnouncement = async function () {
    const where = {
        type: "notice"
    };
    const result = HotUpdateConfig.findOne(where);
    if (result) {
        const content = result.metadata ? result.metadata[0] : null;
        if (content
            && content.endtime
            && new Date(content.endtime).getTime() > Date.now()
            && (content.texten != '' || content.textcn != '' || content.textkr != '')
        ) {
            return content
        }
    }
    return null
}

export const getVipConfig = function () {
    const where = {
        type: "vipconfig"
    };
    const result = HotUpdateConfig.findOne(where);
    if (result) {
        return result.metadata ? result.metadata : [];
    }
    return []
}

export const getFruitOddsConfig = function () {
    const where = {
        type: 'fruit_odds'
    };
    const result = HotUpdateConfig.findOne(where);
    if (result && result.metadata) {
        return result.metadata;
    }
    return [];
}

export const getFruitPConfig = function () {
    const where = {
        type: 'fruit_p'
    };
    const result = HotUpdateConfig.findOne(where);
    if (result && result.metadata) {
        return result.metadata;
    }
    return [];
}
