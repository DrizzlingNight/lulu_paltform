import logging from "/imports/api/logging";
import {Routine} from "../../imports/api/routine/server";
import {Block} from "../../imports/api/blockchain/collections";
import {Bscapi} from "../../imports/api/blockchain/bscapi";
import { settings } from "../../imports/settings"
import moment from "moment/moment";


const logger = logging.getLogger(module.id);

class BlockRoutine extends Routine {
    interval = 3000;
    hostId = 0;
    updateHostId(){
        this.hostId = this.hostId + 1
        if (this.hostId >= settings.bscapi.hosts.length)
            this.hostId = 0
    }
    async getBlock(api, block){
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
            logger.error(err)
            this.updateHostId()
        }
    }
    async scanNewBlock(){
        let lastDB = await Block.findOne({}, {sort:{number:-1}})
        let api = new Bscapi(settings.bscapi.hosts[this.hostId])
        let lastBlock =  await api.getLatestBlock()
        let startBlock = lastDB && (lastDB.number + 1) || (lastBlock.number - 1)
        if (startBlock < lastBlock.number - 5){
            startBlock = lastBlock.number - 5
        }
        for (let i = startBlock;i < lastBlock.number; i++){
            await this.getBlock(api, i)
        }
    }

    async update() {
        try {
            await this.scanNewBlock()
        } catch (e) {
            logger.error(`scan need mint nft tokens error: ${e}`)
        }
    }
}

export default new BlockRoutine();
