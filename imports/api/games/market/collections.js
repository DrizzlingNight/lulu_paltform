import SimpleSchema from "simpl-schema";
import {BaseSchema} from "../../core/schema";
import {Collection} from "../../core/database";
import {Decimal} from "meteor/mongo-decimal";
import {Enum} from "../../../utils/enum";

const GameName = "market"

const UserSettings = new SimpleSchema({
    settleType: Number,
    pendingTime: Number,
    auto: Boolean,
})

const LandSlotSchema = new SimpleSchema({
    _id: String,
    user: String,
    position: Number,   // 插槽的位置
    roundId: {
        type:String,
        optional:true
    },    // 插槽当前对应的round
    land: {
        type:Object,
        optional: true
    },     // 土地
});
LandSlotSchema.extend(BaseSchema);

const LandSlot = new Collection("landSlots");
LandSlot.attachSchema(LandSlotSchema);

const SeedSchema = new SimpleSchema({
    _id: String,
    name: String,
    token: String,
    price: Decimal,
    effect: Object,
    pendingTime: Number,
    active: Boolean
})
const Seed = new Collection("seeds");
Seed.attachSchema(SeedSchema);

const CultivationState = new Enum({
    Start: 0, //开始生长
    Waiting: 1, //等待收获
    Done: 2, //收获
    Growing: 3, //正在生长
});

const SettleType = new Enum({
    random: 0, //随机
    BTCUSDT: 1, //比特风
    ETHUSDT: 2, //以太雨
});

const SettleDirection = new Enum({
    up: 1, //看涨
    down: -1, //看跌
});

export {
    LandSlot,
    GameName,
    Seed,
    CultivationState,
    SettleType,
    SettleDirection,
    UserSettings
}
