import winston from "winston";
// import "winston-mongodb";
import {settings} from "../../../settings";
import logging from "../index";
import {MongoInternals} from "meteor/mongo";
import ES from "winston-elasticsearch";
import {Client} from "@elastic/elasticsearch";
import {instanceId} from "../../../utils";

// const {client} = MongoInternals.defaultRemoteCollectionDriver().mongo;

// logging.logger.add(new winston.transports["MongoDB"]({
//     db: client,
//     collection: 'logs' ,
//     level:settings.logLevel?settings.logLevel:"info",
//     format: winston.format.combine(
//         winston.format.timestamp(),
//         winston.format.metadata({fillExcept: ["message", "timestamp", "level"]}),
//         winston.format.json()
//     )
// }));

let esCloudId = settings.esCloudId;
if (esCloudId) {
    let indexPrefix = Meteor.absoluteUrl().split("/")[2].split(":")[0];
    const client = new Client({
        cloud: {
            id: esCloudId,
        },
        auth: {
            username: settings.esCloudUsername,
            password: settings.esCloudPassword
        }
    });
    logging.logger.add(new ES({
        level: "info",
        client,
        indexPrefix
    }));
}

import {marbleMethods} from "/imports/utils/methods";
marbleMethods({
    logger(info) {
        info.instanceId = instanceId;
        logging.logger.log(info);
    }
});
