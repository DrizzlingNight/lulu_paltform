const Router = require('koa-router')
const {buildTokenInfo} = require("../../../api/nft/server/service");
const router = new Router();

/** tokenUrl **/
router.get('/token/:tokenId', async(ctx, next) => {
    const tokenId = ctx.params.tokenId
    ctx.body = await buildTokenInfo(tokenId)
    await next();
})

module.exports = router