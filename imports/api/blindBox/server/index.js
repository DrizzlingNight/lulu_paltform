import {BlindBox, BlindBoxTokenPool,} from "../collections";
import "./publications";
import "./methods";

BlindBox.rawCollection().createIndex({_id:1, active:1,settleTime:1}, {background: true})
BlindBoxTokenPool.rawCollection().createIndex({active: 1, bboxId: 1}, {background: true})
