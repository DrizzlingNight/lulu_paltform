import {coinList, computeDistributionV2, deltaList} from "../../../api/binanceMarketStreams/server/services";
import {addIntervalSyncedCron} from "../../../api/syncedCron/server/service";


for (let i in deltaList){
    for (let j in coinList){
        addIntervalSyncedCron(`ComputeDistributionRoutine${deltaList[i]}_${coinList[j]}`, 1, async function() {
            await computeDistributionV2(deltaList[i], coinList[j])
        }, true)
    }
}
