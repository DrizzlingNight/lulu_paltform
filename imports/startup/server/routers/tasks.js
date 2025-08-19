import {appTaskRecord, requestVerify} from "../../../api/apps/server/service";
import {errorCodes} from "../../../settings/errorCodes";

const Router = require('koa-router')
const router = new Router();

/** finished tasks **/
router.get('/tasks/', async (ctx, next) => {
    const params = ctx.query
    const headers = ctx.headers
    let verify = requestVerify(params.app, params, headers['x-api-nonce'], headers['x-api-key'], headers['x-api-signature'], 'tasks')
    if (!verify) {
        ctx.body = {
            code: errorCodes.PermissionError,
            message: "",
            success: false,
            data: null
        }
    } else {
        let records = await appTaskRecord(params.app, params.gameId, parseInt(params.minId), params.limit)
        ctx.body = {
            code: "0",
            success: true,
            message: "",
            data: records
        }
    }
    await next();
})


module.exports = router