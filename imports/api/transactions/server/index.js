import './publications';
import './methods';
import { Transaction } from "../collections";

Transaction.rawCollection().createIndex(["token", "requestId", "txId"], { unique: true }, () => {});
Transaction.rawCollection().createIndex("status");
Transaction.rawCollection().createIndex("type");

Transaction.rawCollection().createIndex({type:1,"responseData.id":-1},{background:true});
Transaction.rawCollection().createIndex({type:1,"responseData.id":-1,"responseData.status":-1},{background:true});
Transaction.rawCollection().createIndex({type:1,"createdAt":-1},{background:true});
