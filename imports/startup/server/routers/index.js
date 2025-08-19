/**
 * 轉發業務邏輯路由
 */
const Router = require('koa-router')
const nft = require('./nft');
const tasks = require('./tasks');
const router = new Router();

// 轉發分組路由
router.use('/api', nft.routes(), nft.allowedMethods());
router.use('/api', tasks.routes(), tasks.allowedMethods());

module.exports = router;