import moment from "moment/moment";
import {Decimal} from 'meteor/mongo-decimal';
import {Random} from 'meteor/random'

import {TokenChangeType} from "../../tokens/collections";
import {addMintCount, removeBalance} from "../../account/server/service";
import {transaction} from "../../core/database";
import {errorCodes} from "../../../settings/errorCodes";
import {randomNft} from "../../nft/server/service";
import {BlindBox, BlindBoxRecord, BlindBoxTokenPool} from "../collections";
import {getToken} from "../../tokens/server/services";
import {sendNotify} from "../../externalService/telegram/server/services";
import {updateTaskProgress} from "../../tasks/server/services";

export const openBlindBox = async function (user, bbId, number){
    let now = moment();
    let bbox = await BlindBox.findOne({
        _id: bbId, active: true,
        startTime: { $lte: now.toDate() }})
    if (!bbox)
        throw new Meteor.Error(404, errorCodes.ObjNotFound);
    let res = null
    await transaction.run(async(session) => {
        let nDefinedCount = await BlindBoxTokenPool.aggregate([
                {$match: {bboxId: bbId}},
                {$group: {_id: null, count: {$sum: "$nDefined"}}}
            ], {session}
        )
        let count = 0
        if (nDefinedCount.length > 0) {
            count = nDefinedCount[0].count
        }
        if (count < number) {
            throw new Meteor.Error(500, errorCodes.NotEnoughBlindBox)
        }

        let amount = Decimal(bbox.openFee).times(number)
        let token = getToken({id: bbox.token})
        let recordId = Random.id()
        await removeBalance({
            user,
            amount,
            token,
            type: TokenChangeType.OpenBlindBox, userData: {recordId}}, session);
        res = await randomNft(user, bbox.nft, bbox._id, number, session)

        await BlindBoxRecord.insertOne(
            {_id: recordId, user:user._id, BlindBox: bbId, userData: {res},createdAt: new Date()}, {session})
        await addMintCount(user, number, amount, session)

        // 任务事件
        await updateTaskProgress(user, 'mint', '', number, session)
    });
    sendNotify({
        username: user.username,
        count: number,
        time: new Date()
    }, 'openBlindBox')
    return res;
}

export const updateBlindBox = async function(){
    let box = await BlindBox.find({startTime: {$lte: new Date()}}).fetch()
    for (let i in box){
        await transaction.run(async session=>{
            let blindTokenPools = await BlindBoxTokenPool.find({bboxId: box[i]._id, nDefined_tmp: {$gt: 0}},
                {session}).fetch();
            for(let j in blindTokenPools){
                let {_id, nDefined_tmp} = blindTokenPools[j]
                await BlindBoxTokenPool.findOneAndUpdate({_id:_id, nDefined_tmp: nDefined_tmp},
                    {$set:{
                            nDefined_tmp: 0,
                            nDefined: nDefined_tmp
                        }}, {session})
            }
        })
    }
}
