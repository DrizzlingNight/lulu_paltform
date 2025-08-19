import {Counter} from "./collections";
import {MongoInternals} from "meteor/mongo";


export const getSequenceValue = async function(sequenceName, session){
    let sequenceDocument = await Counter.findOneAndUpdate(
        {_id: sequenceName},
        {$inc:{sequence_value:1}},
        { session, returnOriginal: false});
    return sequenceDocument.value.sequence_value;
}

export const ObjectID = MongoInternals.NpmModules.mongodb.module.ObjectID
