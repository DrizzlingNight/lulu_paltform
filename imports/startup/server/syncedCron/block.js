import {Block} from "../../../api/blockchain/collections";
import {Bscapi} from "../../../api/blockchain/bscapi";
import { settings } from "../../../settings"
import moment from "moment/moment";
import {addIntervalSyncedCron} from "../../../api/syncedCron/server/service";
import logging from "../../../api/logging";

const logger = logging.getLogger(module.id)

let hostId = 0;
function updateHostId(){
    hostId = hostId + 1
    if (hostId >= settings.bscapi.hosts.length)
        hostId = 0
}
async function getBlock(api, block){
    try {
        let res = await api.getBlock(String(block))
        logger.info(`getBlock: ${res.number} ${res.hash}`)
        Block.insert({
            _id: String(res.number),
            number: res.number,
            hash: res.hash,
            blockInfo: res,
            createdAt: moment(res.timestamp).toDate()
        })
    }catch (e) {
        logger.error("getBlock error:")
        logger.error(e)
        updateHostId()
    }
}
async function scanNewBlock(){
    let lastDB = await Block.findOne({}, {sort:{number:-1}})
    let api = new Bscapi(settings.bscapi.hosts[hostId])
    let lastBlock =  await api.getLatestBlock()
    let startBlock = lastDB && (lastDB.number + 1) || (lastBlock.number - 1)
    if (startBlock < lastBlock.number - 5){
        startBlock = lastBlock.number - 5
    }
    for (let i = startBlock;i < lastBlock.number; i++){
        await getBlock(api, i)
    }
}

addIntervalSyncedCron("BlockRoutine", 3, async function() {
    await scanNewBlock()
})
