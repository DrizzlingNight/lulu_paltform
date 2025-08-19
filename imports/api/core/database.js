import { MongoInternals } from 'meteor/mongo';
import { Decimal } from "meteor/mongo-decimal";
import logging from "../logging";

const DOC = 'docs';
const COUNT = 'count';
const logger = logging.getLogger(module.id);
const delay = async function (time) {
    return new Promise(resolve =>{
        setTimeout(()=>{
            resolve()
        },time||100)
    })
}
// Runs the txnFunc and retries if TransientTransactionError encountered
const runTransactionWithRetry = async function(func, session) {
    let retries = 0;
    while (true) {
        try {
            await runTransAndCommit(func, session); // performs transaction
            break;
        } catch (error) {
            // If transient error, retry the whole transaction
            logger.error(error)
            if (error.hasOwnProperty("errorLabels") && error.errorLabels.includes("TransientTransactionError")) {
                if (retries >= 10) {
                    logger.error(`retry transaction more than ${retries} times`);
                    throw error;
                } else {
                    logger.warn(`TransientTransactionError, retrying transaction ... ${retries}`);
                    logger.error(func.toString().substring(0,1000));
                    retries = retries + 1;
                }
            } else {
                throw error;
            }
        }
        await delay(100)
    }
};

// 異步處理的不做重試處理
const runTransactionWithOutRetry = async function (func, session) {
    await runTransAndCommit(func, session);
}
// Retries commit if UnknownTransactionCommitResult encountered
const commitWithRetry = async function(session) {
    let retries = 0;
    while (true) {
        try {
            await session.commitTransaction(); // Uses write concern set at transaction start.
            // logger.log("Transaction committed.");
            break;
        } catch (error) {
            // Can retry commit
            if (error.hasOwnProperty("errorLabels") && error.errorLabels.includes("UnknownTransactionCommitResult")) {
                if (retries >= 100) {
                    logger.error(`retry commit operation more than ${retries} times`);
                    throw error;
                } else {
                    logger.warn("UnknownTransactionCommitResult, retrying commit operation ...");
                    retries = retries + 1;
                }
            } else {
                logger.error("Error during commit ...");
                throw error;
            }
        }
    }
};

const runTransAndCommit = async function(func, session) {
    await session.startTransaction();

    try {
        await func(session);
    } catch (e) {
        // logger.error("Caught exception during transaction, aborting.");
        // logger.error(e);
        await session.abortTransaction();
        throw e;
    }

    await commitWithRetry(session);
};

const run = async function(func) {
    const { client } = MongoInternals.defaultRemoteCollectionDriver().mongo;
    let session = await client.startSession({
        readConcern: { level: 'snapshot' },
        writeConcern: { w: 'majority' },
        readPreference: { mode: "primary" }
    });

    try {
        await runTransactionWithRetry(func, session);
    } catch (e) {
        throw e;
    } finally {
        await session.endSession();
    }
};

const runWithoutRetry = async function (func) {
    const { client } = MongoInternals.defaultRemoteCollectionDriver().mongo;
    let session = await client.startSession({
        readConcern: { level: 'snapshot' },
        writeConcern: { w: 'majority' },
        readPreference: { mode: "primary" }
    });

    try {
        await runTransactionWithOutRetry(func, session);
    } catch (e) {
        throw e;
    } finally {
        await session.endSession();
    }
}

const transaction = { run,runWithoutRetry };




/***********
 * db: rawDatabase
 * name: collectionName str
 * opt: {} option
 * **********/
const rawCreateCollection = function (db, name, opt) {
    const createCollection = Meteor.wrapAsync(db.createCollection, db); // wrap into futures/fibers

// now create a capped collection called bob:
    try {
        createCollection(name, opt);
    } catch(error) {
        logger.error(error)
    }
}

class Collection extends Mongo.Collection {
    constructor(name, options) {
        super(name, options);
    };
}

if (Meteor.isServer) {

    const Decimal128 = MongoInternals.NpmModules.mongodb.module.Decimal128;
    const ObjectID = MongoInternals.NpmModules.mongodb.module.ObjectID;
    Collection.prototype.$ObjectID = ObjectID
    Collection.prototype.$find = async function(query, options, callback) {
        this.toMongo(query);
        let res = await this.rawCollection().find(query, options, callback).toArray();
        this.fromMongo(res);
        return res;
    };

    Collection.prototype.$findOne = async function(query, options, callback) {
        this.toMongo(query);
        let res = await this.rawCollection().findOne(query, options, callback);
        this.fromMongo(res);
        return res;
    };

    Collection.prototype.updateOne = async function(filter, update, options, callback) {
        this.toMongo(filter);
        let res = await this.rawCollection().updateOne(filter, update, options, callback);
        // this.fromMongo(res);
        return res;
    };
    Collection.prototype.deleteOne = async function(filter, options, callback) {
        this.toMongo(filter);
        let res = await this.rawCollection().deleteOne(filter, options, callback);
        // this.fromMongo(res);
        return res;
    };
    Collection.prototype.updateMany = async function(filter, update, options, callback) {
        this.toMongo(filter);
        this.toMongo(update);
        let res = await this.rawCollection().updateMany(filter, update, options, callback);
        // this.fromMongo(res);
        return res;
    };

    Collection.prototype.insertOne = async function(docs, options, callback) {
        this.toMongo(docs);
        let res = await this.rawCollection().insertOne(docs, options, callback);
        // logger.log(res);
        this.fromMongo(res.ops);
        return res;
    };

    Collection.prototype.insertMany = async function(doc, options, callback) {
        this.toMongo(doc);
        let res = await this.rawCollection().insertMany(doc, options, callback);
        this.fromMongo(res.ops);
        return res;
    };

    Collection.prototype.findOneAndUpdate = async function(filter, update, options, callback) {
        this.toMongo(filter);
        this.toMongo(update);
        let res = await this.rawCollection().findOneAndUpdate(filter, update, options, callback);
        this.fromMongo(res.value);
        return res;
    };

    Collection.prototype.aggregate = async function(pipeline, options, callback) {
        this.toMongo(pipeline);
        let res = await this.rawCollection().aggregate(pipeline, options, callback).toArray();
        this.fromMongo(res);
        return res;
    };

    Collection.prototype.deleteMany = async function(filter, options, callback) {
        this.toMongo(filter);
        let res = await this.rawCollection().deleteMany(filter, options, callback);
        // this.fromMongo(res);
        return res;
    };

    Collection.prototype.bulkWrite = async function(operations, options, callback) {
        this.toMongo(operations);
        let res = await this.rawCollection().bulkWrite(operations, options, callback);
        // this.fromMongo(res);
        return res;
    };

    Collection.prototype.$findAndCount = async function(query, options) {
        this.toMongo(query);
        let pipeline = this._queryToPipeline(query, options)
        let res = await this.rawCollection().aggregate(pipeline).toArray();
        this.fromMongo(res);
        return res[0] ? res[0] : { [COUNT]: 0, [DOC]: [] };
    };

    Collection.prototype.toMongo = function(obj) {
        if (obj) {
            let keys = Object.keys(obj);
            for (let k of keys) {
                let v = obj[k];
                if (v instanceof Decimal) {
                    obj[k] = Decimal128.fromString(v.toString());
                } else if (v instanceof Mongo.ObjectID) {
                    obj[k] = new ObjectID(v.toHexString());
                } else if (v instanceof Object) {
                    this.toMongo(v);
                }
            }
        }

    };

    Collection.prototype.fromMongo = function(obj) {
        if (obj) {
            let keys = Object.keys(obj);
            for (let k of keys) {
                let v = obj[k];
                if (v instanceof Decimal128) {
                    obj[k] = Decimal(v.toString());
                } else if (v instanceof Decimal) {
                } else if (v instanceof ObjectID) {
                    obj[k] = new Mongo.ObjectID(v.toHexString());
                } else if (v instanceof Object) {
                    this.fromMongo(v);
                }
            }
        }

    };

    Collection.prototype._queryToPipeline = function(query, options) {
        let pipeline = [];
        pipeline.push({$match: query});
        if (options.sort) {
            pipeline.push({$sort: options.sort});
        }
        if (options.fields) {
            pipeline.push({$project: options.fields});
        }
        pipeline.push({$group: { "_id": null, [DOC]: { "$push": "$$ROOT" }, [COUNT]: { "$sum": 1 } } });
        let position = options.skip || 0;
        let n = options.limit || 20;
        pipeline.push({ "$project": { "_id": 0, [COUNT]: 1, [DOC]: { "$slice": [ "$" + DOC, position, n ] } } });
        return pipeline
    };
}


export { transaction, Collection, rawCreateCollection };
