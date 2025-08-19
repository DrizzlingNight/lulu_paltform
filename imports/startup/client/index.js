import './api_register'
import createApp from '/imports/ui/app'
import { settings } from "../../settings";
import logging from "/imports/api/logging";
import 'setimmediate';

const logger = logging.getLogger(module.id);

if (!settings.localTest) {
    console.log = function () {}
}

Meteor.startup(() => {
    logger.info(`VERSION ${settings.version?settings.version.appVersion:''}`);
    createApp();
});
