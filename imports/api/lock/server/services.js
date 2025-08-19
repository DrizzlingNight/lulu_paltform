import {Lock} from "../collections"
import {transaction} from "../../core/database";
import { instanceId } from "../../../utils"
import {NonFungibleTokenPool} from "../../nft/collections";
import moment from "moment/moment";
// const _freeLockTime = async function (key,timeOut=2000,session) {
//     // 獲取鎖 加個時間
//     const where = {
//         type:key,
//         acquirer:instanceId
//     };
//     await Lock.rawCollection().findOneAndUpdate(where,
//         {
//             $set:{
//                 expTime:Date.now()+timeOut
//             },
//         },{session})
// }
//
// export const getLockSource = async function (key,timeOut=2000) {
//         let _lock = false;
//         const where = {
//             type:key,
//         };
//     try{
//         await transaction.runWithoutRetry(async function (session) {
//                     const lock = await Lock.rawCollection().findAndModify(
//                         where,
//                         [key],
//                         {
//                             $inc: {
//                                 num: 1
//                             }
//                         },
//                         {
//                             session,
//                             upsert:true,
//                             writeConcern: { w: "majority", wtimeout: 5000 }
//                         }
//                     );
//                     if(!lock.value) {
//                         // 防止死鎖
//                         await Lock.rawCollection().findOneAndUpdate({ type:key},{
//                             $set:{
//                                 expTime:Date.now()+timeOut,
//                                 acquirer:instanceId
//                             }},{session});
//                         _lock  = true;
//                     }else{
//                         _lock = await renewLock(lock.value,key,timeOut,session)
//                     }
//         });
//     }catch(e){
//         _lock = false
//     }
//     return _lock
// }
// const renewLock = async  function (lock,key,timeOut,session) {
//     const expTime = lock.expTime||0;
//     // console.log("renewLock",key,(Date.now()-expTime)>=0)
//     if((Date.now()-expTime)>=0){// 過期重入
//         // console.log("過期重入",key)
//         try{
//             await Lock.rawCollection().findOneAndUpdate({_id:lock._id},{
//                 $set:{
//                     type:key,
//                     num: 2,
//                     acquirer:instanceId,
//                     expTime:Date.now()+timeOut
//                 }},{session})
//         }catch (e){
//         }
//         return true
//     }
//     return false
// }
// // 更新鎖資源的時間
// export const extendSourceTimeout = async function (key) {
//         await _freeLockTime(key);
// }
//
// export const freeLockSource = async function(key,session) {
//         const where = {
//             type:key,
//             acquirer:instanceId
//         };
//         await Lock.rawCollection().remove(where,{session})
// }

const lock = async function(key) {
    try {
        let l = await Lock.insertOne({
            _id: key,
            acquirer: instanceId,
            updated: new Date()
        });
        return l.result;
    } catch (e) {
        return null;
    }
};

const unlock = async function(key) {
    let r = await Lock.deleteOne({_id: key, acquirer: instanceId});
    return r['deletedCount']
};

const renew = async function(key) {
    let l = await Lock.findOneAndUpdate({
        _id: key,
        acquirer: instanceId
    }, {
        $set: {updated: new Date()}
    }, {
        returnOriginal: false
    });
    return l.value;
};

const clearLock = async function() {
    let ls = await Lock.find({updated: {$lte:moment().subtract(5, "minute").toDate()}}).fetch()
    if (ls.length){
        await Promise.all(ls.map(async item => {
                await Lock.deleteOne({_id: item._id})
            })
        )
    }
}

export {lock, unlock, renew, clearLock}
