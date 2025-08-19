import {BountyTask, BountyTaskOptHistory, BountyTaskRule} from "../collections";
import "./methods"

BountyTaskRule.rawCollection().createIndex({type: 1}, {background: true});

BountyTask.rawCollection().createIndex({publisher: 1}, {background: true});
BountyTask.rawCollection().createIndex({receiver: 1}, {background: true});
BountyTask.rawCollection().createIndex({type: 1}, {background: true});
BountyTask.rawCollection().createIndex({status: 1}, {background: true});

BountyTaskOptHistory.rawCollection().createIndex({task: 1}, {background: true});
BountyTaskOptHistory.rawCollection().createIndex({user: 1}, {background: true});
BountyTaskOptHistory.rawCollection().createIndex({type: 1}, {background: true});