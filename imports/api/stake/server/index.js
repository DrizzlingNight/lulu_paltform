import { StakeUserPool, StakeUserBonusPool, StakePool  } from "../collections";

import "./methods";

StakePool.rawCollection().createIndex({'token': 1}, { backgroud: true, unique: true})
StakeUserPool.rawCollection().createIndex({'user': 1, 'token' : 1}, { backgroud: true, unique: true})
StakeUserBonusPool.rawCollection().createIndex({'user': 1, 'token' : 1}, { backgroud: true, unique: true})
