import winston from "winston";
import {settings} from "/imports/settings";
import {instanceId} from "../../utils";

const logger = winston.createLogger({
    level: Meteor.isDevelopment ? 'debug' : 'info',
    format: winston.format.json(),
    transports: []
});

const customFormat = winston.format((info) => {
    info.level = info.level.toUpperCase();
    if (Meteor.isServer) {
        if(info.stack) {
            info.message += "\n" + info.stack
        } else {
            info.message += `\t(${info.loggerName})`
        }
    } else {
        if (Meteor.isDevelopment) {
            if(info.stack) {
                info.message += "\n" + info.stack
            } else {
                info.message += `\t(${info.loggerName})`
            }
        } else {

        }
    }

    return info;
});

const consoleFormat = winston.format.printf((info) => {
    // if (Meteor.isServer) {
    //     return `${info.level}: ${info.message}`;
    // } else {
    //     if (Meteor.isDevelopment) {
    //         return `${info.level}: ${info.message}`;
    //     } else {
    //         return `${info.level}: ${info.message}`;
    //     }
    // }
    return `${info.level}: ${info.message}`;
});

logger.add(new winston.transports.Console({
    format: winston.format.combine(
        customFormat(),
        // winston.format.cli({all: true}),
        consoleFormat,
    ),
    stderrLevels: ['error'],
    consoleWarnLevels: ['warn', 'debug']
}));

// for cli and npm levels
// error: LeveledLogMethod;
// warn: LeveledLogMethod;
// help: LeveledLogMethod;
// data: LeveledLogMethod;
// info: LeveledLogMethod;
// debug: LeveledLogMethod;
// prompt: LeveledLogMethod;
// http: LeveledLogMethod;
// verbose: LeveledLogMethod;
// input: LeveledLogMethod;
// silly: LeveledLogMethod;
//
// for syslog levels only
// emerg: LeveledLogMethod;
// alert: LeveledLogMethod;
// crit: LeveledLogMethod;
// warning: LeveledLogMethod;
// notice: LeveledLogMethod;

const version = settings.version;
const host = Meteor.absoluteUrl();
const _log = console.log;
const _error = console.error;
const consoleLog = function(logger) {
    return (message, ...optionalParams) => {
        message = String(message);
        if (optionalParams.length > 0) {
            for(let i = 0; i < optionalParams.length; i++) {
                message += " " + String(optionalParams[i]);
            }
        }
        let loggerName = "console.log";
        logger.info(message, {loggerName, version, instanceId, host});
    };
};
const consoleWarn = function(logger) {
    return (message, ...optionalParams) => {
        message = String(message);
        if (optionalParams.length > 0) {
            for(let i = 0; i < optionalParams.length; i++) {
                message += " " + String(optionalParams[i]);
            }
        }
        let loggerName = "console.warn";
        logger.warn(message, {loggerName, version, instanceId, host});
    };
};
const consoleError = function(logger) {
    return (message, ...optionalParams) => {
        message = String(message);
        if (optionalParams.length > 0) {
            for(let i = 0; i < optionalParams.length; i++) {
                message += " " + String(optionalParams[i]);
            }
        }
        let loggerName = "console.error";
        logger.error(message, {loggerName, version, instanceId, host});
    };
};
// console.log = consoleLog(logger);
// console.error = consoleError(logger);
// console.warn = consoleWarn(logger);

const getLogger = function(loggerName) {
    return logger.child({loggerName, version, instanceId, host});
};

export default {logger, getLogger}