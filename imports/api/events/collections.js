import SimpleSchema from 'simpl-schema';
import { Collection } from "../core/database";
import { Enum } from "../../utils/enum";

const EventsSchema = new SimpleSchema({
    user: {
        type: String
    },
    eventType: { type: String }, //  事件類型
    info: {
        type: Object,
        blackbox: true
    }, // 消息結構
    createdAt: { type: Date }
});
const Events = new Collection("events");
Events.attachSchema(EventsSchema);

const EventType = new Enum({
    UserLogin: "UserLogin",
    UserLogout: "UserLogout",
    UserIdle: "UserIdle",
    UserActive: "UserActive",
    UserRegister: "UserRegister",
    UserWithdraw: "UserWithdraw"
});

module.exports = { EventsSchema, Events, EventType }