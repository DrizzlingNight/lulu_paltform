import "./methods";
import {Apps, AppSecret, AppTaskRecord} from "../collections";

Apps.rawCollection().createIndex("active")
Apps.rawCollection().createIndex("name")

AppSecret.rawCollection().createIndex("app")
AppSecret.rawCollection().createIndex("active")

AppTaskRecord.rawCollection().createIndex({'recordId': 1}, {backgroud: true, unique: true})
AppTaskRecord.rawCollection().createIndex("identifier")
AppTaskRecord.rawCollection().createIndex("clickId")
AppTaskRecord.rawCollection().createIndex("app")
AppTaskRecord.rawCollection().createIndex({clickId: 1, app: 1, identifier: 1}, {unique: true, background: true})