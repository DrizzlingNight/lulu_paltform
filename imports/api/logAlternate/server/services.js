import {LoggerDB} from "../collections"
import moment from "moment";

const logDB = async function(mark, text) {
    await LoggerDB.insertOne({
        mark: mark,
        text: text,
        createdAt: moment().toDate(),
    });
};

export {logDB}