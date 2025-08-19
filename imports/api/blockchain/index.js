import {errorCodes} from "/imports/settings/errorCodes";

export class blockchainApi {
    async createAddress(token) {
        throw new Meteor.Error(errorCodes.NotImplement);
    }

    async getTransactions(token, type, address, max_id, limit, begin_time) {
        throw new Meteor.Error(errorCodes.NotImplement);
    }

    async getTransaction(id) {
        throw new Meteor.Error(errorCodes.NotImplement);
    }

    async withdrawRequest(token, amount, address, request_id, memo, fee, gaslimit, gasprice) {
        throw new Meteor.Error(errorCodes.NotImplement);
    }
}