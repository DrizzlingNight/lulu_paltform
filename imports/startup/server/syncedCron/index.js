import "./blindBox"
import "./block"
import "./computeDistribution"
import "./generateMarketDistribution"
import "./inkpay"
import "./market"
import "./nft"
import "./stake"
import "./removeOldMarketPrice"
import "./checkMarketStatus"
import "./bountyTask"
import "./mining"
import "./statistics"
import {addIntervalSyncedCron} from "../../../api/syncedCron/server/service";

import {clearLock} from "../../../api/lock/server/services";
addIntervalSyncedCron("ClearLock", 60, async function() {
    await clearLock()
}, false)
