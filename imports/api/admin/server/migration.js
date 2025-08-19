import {BlindBoxTokenPool} from "../../blindBox/collections";
import {NonFungibleTokenItem, NonFungibleTokenPool} from "../../nft/collections";
import {LandSlot} from "../../games/market/collections";

export const migration = async function(){
    let bPool = BlindBoxTokenPool.find({}).fetch()
    let nPool = NonFungibleTokenPool.find({}).fetch()
    let items = NonFungibleTokenItem.find({}).fetch()
    /** 更新nft土地信息 **/
    let bpoolMap = {}
    bPool.forEach(i=>{
        bpoolMap[i.info.idPrefix] = i
    })
    let npoolMap = {}
    nPool.forEach(i=>{
        npoolMap[i.info.idPrefix] = i
    })
    await Promise.all(items.map(async item=>{
        return await NonFungibleTokenItem.findOneAndUpdate({_id: item._id},
            {$set:{
                "info.nftPool": npoolMap[item.info.nftPool.info.idPrefix],//bpoolMap[item.info.nftPool.info.idPrefix],
                "info.totalNftPool": npoolMap[item.info.nftPool.info.idPrefix]
            }})
    }))
    /** 更新slot中保存的nft土地信息 **/
    let slots = await LandSlot.find({land:{$exists: true}}).fetch()
    await Promise.all(slots.map(async item=>{
        return await LandSlot.findOneAndUpdate({_id: item._id},
            {$set:{
                    "land.info.nftPool": bpoolMap[item.land.info.nftPool.info.idPrefix],
                    "land.info.totalNftPool": npoolMap[item.land.info.nftPool.info.idPrefix]
                }})
    }))

}
