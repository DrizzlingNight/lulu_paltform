import {Enum} from "../../utils/enum";

const EventEmitter = require('events');

EventEmitter.prototype.emitAsync = async function(eventName, ...args) {
    await Promise.all(this.listeners(eventName).map(async f => await f(...args)));
};

export const dispatcher = new EventEmitter();



export const Events = new Enum({
    JoinRoomBefore: 'JoinRoomBefore',
    LeaveRoomBefore: 'LeaveRoomBefore',
    lucky13LeaveRoomBefore: 'lucky13LeaveRoomBefore',
});