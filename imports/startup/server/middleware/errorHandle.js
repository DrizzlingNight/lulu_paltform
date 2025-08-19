// 錯誤處理中間件

import logging from "../../../api/logging";

const logger = logging.getLogger(module.id);

module.exports = async function errorHandle(ctx, next) {
    try {
        await next()
    } catch (error) {
        if (error instanceof Meteor.Error) {
            ctx.status = parseInt(error.error);
            ctx.body = {
                success: false,
                code: error.error,
                message: error.toString()
            }
        } else {
            logger.error(error);
            ctx.status = 500;
            ctx.body = {
                success: false,
                code: -1,
                message: error.toString()
            }
        }
        
    }
}