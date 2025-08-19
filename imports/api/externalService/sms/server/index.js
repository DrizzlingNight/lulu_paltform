import './methods'
import {SmsTemplate} from "../colletctions";

SmsTemplate.rawCollection().createIndex({type: 1}, {background: true});
SmsTemplate.rawCollection().createIndex({way: 1}, {background: true});
SmsTemplate.rawCollection().createIndex({lang: 1}, {background: true});