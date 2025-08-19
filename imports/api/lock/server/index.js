import {Lock} from "../collections";

Lock.rawCollection().createIndex({ updated: 1 }, {expireAfterSeconds: 60});