import SimpleSchema from 'simpl-schema';
import { Decimal } from 'meteor/mongo-decimal';
import { BaseSchema } from "../core/schema";
import { Collection } from "../core/database";
import { Enum } from "/imports/utils/enum";
import {AllowAny} from "../../startup/both/permissions";

//合约信息(已弃用)
const ContractSchema = new SimpleSchema({
    account: String,
    priKey: String,
    abi: {
        type: AllowAny,
        blackbox: true
    },
    commonInfo: {
        type: Object,
        blackbox: true
    },
    contractAddress: String,
    gasPrice: Number,
    gasLimit: Number
});

const NonFungibleTokenSchema = new SimpleSchema({
    // 基本信息
    name: String,
    code: String,
    blockchain: String,  // 链名
    chainId: String,
    rpcUrls: {
        type: Array,
        defaultValue: []
    },
    "rpcUrls.$": {
        type: String
    },
    symbol: String,
    token: String, // 如果有此字段，则以用户此字段地址作为nft的充值地址
    order: Number,  // 排序

    // 充值提現
    deposit: { //是否可以充值
        type: Boolean,
        defaultValue: true,
    },
    withdraw: { //是否可以提現
        type: Boolean,
        defaultValue: false,
    },
    feeToken: String, // 提现手续费收的币种
    depositToken: String, // 充值币种
    withdrawalFee: {
        type: Decimal,
        blackbox: true
    },
    // contractInfo: {
    //     type: ContractSchema,
    //     optional: true,
    //     defaultValue: {}
    // },
    // host: String
    contractAddress: String,
    defaultAddress: String, //默认mint地址
    active: {
        type: Boolean,
        defaultValue: true,
    },
    internal: {
        type: Boolean,
        defaultValue: true
    },
    tokenUri: String
});

const NonFungibleTokenChangeType = new Enum({
    Init: 0,            // 创建
    Mint: 1,            // 铸造
    Deposit: 2,         // 充值
    Withdraw: 3,        // 提现
    WithdrawCancel: 4,  // 提款失敗返還
    TransferOut: 5,     // 转出
    TransferIn: 6,      // 转入
    Stake: 7,          // 质押
    Redeem: 8,          // 赎回
    SysCreate: 9        // 创建
});

const NonFungibleTokenChangeSchema = new SimpleSchema({
    user: String,
    type: {
        type: SimpleSchema.Integer,
        allowedValues: Object.values(NonFungibleTokenChangeType)
    },
    nonFungibleTokenItem: String,
    userData: {
        type: Object,
        blackbox: true,
        optional: true
    },
    createdAt: Date
});
NonFungibleTokenChangeSchema.extend(BaseSchema);

const NonFungibleTokenChange = new Collection("nonFungibleTokenChanges");
NonFungibleTokenChange.attachSchema(NonFungibleTokenChangeSchema);


const NonFungibleToken = new Collection("nonFungibleToken");
NonFungibleToken.attachSchema(NonFungibleTokenSchema);

const NonFungibleTokenItemStateSchema = new SimpleSchema({
    internal: Boolean, // 是否在平台内（用户是否提现）
    owner: String, // 链上持有地址（如果未上链则为空）
    mint: Boolean, // 是否已经铸造
    stake: Boolean, // 是否已经质押
    idOnChain: String, // 链上对应的id
    lend: Boolean,  //借出
});

const NonFungibleTokenItemSchema = new SimpleSchema({
    // 基本信息
    user: String,
    nftId: String,
    info: {
        type: Object,
        blackbox: true,
        optional: true
    },
    state: {
        type: NonFungibleTokenItemStateSchema,
        optional: true,
        defaultValue: {}
    },
    disable: Boolean,// 是否不可用
    createdAt: Date
});
const NonFungibleTokenItem = new Collection("nonFungibleTokenItem");
NonFungibleTokenItem.attachSchema(NonFungibleTokenItemSchema);

const NonFungibleTokenPoolName = new Enum({
    'Land': 1,
});

const NonFungibleTokenPoolLevel = new Enum({
    SSS: 1,
    SS: 2,
    S: 3,
    A: 4,
    B: 5,
});

const NonFungibleTokenPoolType = new Enum({
    Forest: 1, //森林
    Riverbank: 2, //河域,
    Plain: 3,   //平原
    Mountain: 4,    //山地
    Island: 5,  //小島
    Desert: 6   //沙漠
});

const NonFungibleTokenPoolInfoSchema = new SimpleSchema({
    name: String, //名稱
    type: { //類型
        type: Number,
        optional: true,
        allowedValues: Object.values(NonFungibleTokenPoolType)
    },
    level: {    //等級
        type: Number,
        optional: true,
        allowedValues: Object.values(NonFungibleTokenPoolLevel)
    },
    harvest: {  //收成星級
        type: Object,
        optional: true
    },
    harvestPower: {  //收成算力
        type: Object,
        optional: true
    },
    probability: Number,    //概率
    hashrate: Number,   //算力
    idPrefix: String    //id前綴
});

const NonFungibleTokenPoolSchema = new SimpleSchema({
    // 基本信息
    nftId: String,
    name: String,   //对应nft类型 Land等,生成上链id用到 类型对照参照 NonFungibleTokenPoolName
    active: Boolean,
    info: {
        type: NonFungibleTokenPoolInfoSchema,
        blackbox: true,
        optional: true
    },
    total: Number,
    nDefined: Number,
    minId: {
        type: Number,
        optional: true
    },
    maxId: {
        type: Number,
        optional: true
    },
    currentId: {
        type: Number,
        optional: true
    },
});
const NonFungibleTokenPool = new Collection("nonFungibleTokenPool");
NonFungibleTokenPool.attachSchema(NonFungibleTokenPoolSchema);

const NonFungibleTokenTransactionStatus = new Enum({
    Init: 0,
    Pending: 1,
    Done: 2,
    Failed: 3
});

const NonFungibleTokenTransactionType = new Enum({
    Mint: 1,
    Transfer: 2,
    Deposit: 3
});

const NonFungibleTokenTransactionSchema = new SimpleSchema({
    user: String,
    nftItem: String,
    nftId: String,
    type: {
        type: SimpleSchema.Integer,
        allowedValues: Object.values(NonFungibleTokenTransactionType)
    },
    requestId: {
        type: String,
        optional: true
    },
    sourceAddress: {
        type: String,
        optional: true
    },
    params: {
        type: Object,
        blackbox: true,
        optional: true
    },
    txHash: {
        type: String,
        optional: true
    },
    transferInternal: Boolean,
    status: {
        type: SimpleSchema.Integer,
        allowedValues: Object.values(NonFungibleTokenTransactionStatus)
    },
    response: {
        type: Object,
        blackbox: true,
        optional: true
    },
    onChainData: {
        type: Object,
        blackbox: true,
        optional: true
    },
    createdAt: Date,
    updatedAt: Date
});
const NonFungibleTokenTransaction = new Collection("nonFungibleTokenTransaction");
NonFungibleTokenTransaction.attachSchema(NonFungibleTokenTransactionSchema);

export { NonFungibleToken, NonFungibleTokenChange, NonFungibleTokenChangeType, NonFungibleTokenItem,
    NonFungibleTokenPoolLevel, NonFungibleTokenPool, NonFungibleTokenTransaction, NonFungibleTokenTransactionType,
    NonFungibleTokenTransactionStatus, NonFungibleTokenPoolType, NonFungibleTokenPoolName };
