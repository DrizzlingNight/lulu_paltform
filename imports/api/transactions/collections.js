import SimpleSchema from 'simpl-schema';
import { BaseSchema } from "../core/schema";
import { Enum } from "../../utils/enum";

const TransactionStatus = new Enum({
    Init: 0,
    Pending: 1,
    Done: 2,
    Failed: 3,
    AwaitReview: 4, //等待審核
    Refuse: 5 //拒絕退出
});

const TransactionType = new Enum({
    Deposit: 1,
    Withdraw: 2,
});

const TransactionSchema = new SimpleSchema({
    user: {
        type: String,
        optional: true
    },
    memo: {
        type: String,
        optional: true
    },
    amount: { // Decimal
        type: Object,
        blackbox: true
    },
    token: String,
    serviceType: {
        type: String,
        optional: true
    },
    status: {
        type: SimpleSchema.Integer,
        allowedValues: Object.values(TransactionStatus)
    },
    type: {
        type: SimpleSchema.Integer,
        allowedValues: Object.values(TransactionType)
    },
    requestId: {
        type: String,
        optional: true
    },
    txId: {
        type: String,
        optional: true
    },
    requestData: {
        type: Object,
        blackbox: true,
        optional: true
    },
    responseData: {
        type: Object,
        blackbox: true,
        optional: true
    },
    response: {
        type: Object,
        blackbox: true,
        optional: true
    },
    requestWork: {
        type: String,
        optional: true
    },
});

TransactionSchema.extend(BaseSchema);
const Transaction = new Mongo.Collection("transactions");
Transaction.attachSchema(TransactionSchema);

const SendAndReceivedSchema = new SimpleSchema({
    sender: {
        type: Object,
        blackbox: true
    },
    receiver: {
        type: Object,
        blackbox: true
    },
    amount: { // Decimal
        type: Object,
        blackbox: true
    },
    token: String,
});

SendAndReceivedSchema.extend(BaseSchema);

const SendAndReceived = new Mongo.Collection("sendAndReceived");

SendAndReceived.attachSchema(SendAndReceivedSchema);

export { Transaction, TransactionStatus, TransactionType, TransactionSchema, SendAndReceived, SendAndReceivedSchema }
