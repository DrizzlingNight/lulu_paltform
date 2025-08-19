import {settings} from "../../settings";
import {InkpayApi} from './inkpay';
import {InkpayLog} from "./inkpay/collections";

const db = Meteor.users.rawDatabase();
const collectionExists = db.listCollections({ name: 'inkpayLog' }).hasNext().await();
if (!collectionExists) {
    InkpayLog._createCappedCollection(40960000, 100000)
}
InkpayLog.rawCollection().createIndex({method: 1, path: 1, params: 1})
const api = new InkpayApi(settings.inkpay.url, settings.inkpay.key, settings.inkpay.secret, settings.inkpay.withdrawKey, settings.inkpay.withdrawSecret, settings.inkpay.sigType);
export default api;