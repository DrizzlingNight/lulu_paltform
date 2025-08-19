import router from './routers'

const koaBody = require('koa-body');
const koa = require('koa')
const errorHandle = require("./middleware/errorHandle")
const app = new koa()

import proxy from "koa-proxy";
import {settings} from "../../settings";

app.use(errorHandle)
app.use(koaBody({
    jsonLimit: '5mb',
    formLimit: '1mb',
    multipart: true,
    formidable:{
        hash:'md5',
        maxFileSize:1024*1024 // 文件限製1mb
    }
}));

app.use(router.routes()).use(router.allowedMethods());

let indexGameProxy = proxy({
    host: settings.gameCDNHost,
    match: /^\/game\/.*\/index\.game/gi,
    map: function(path) { return `${settings.gameCDNPrefix}${path}`; },
    overrideResponseHeaders: {"Cache-Control": "max-age=0, no-cache, no-store, must-revalidate"},
    debug: Meteor.isDevelopment
});
let gameAssetsProxy = proxy({
    host: settings.gameCDNHost,
    match: /^\/game\/.+\..+/gi,
    map: function(path) { return `${settings.gameCDNPrefix}${path}`; },
    overrideResponseHeaders: {"Cache-Control": "public, max-age=31536000"},
    debug: Meteor.isDevelopment
});
let bannerAssetsProxy = proxy({
    host: settings.gameCDNHost,
    match: /^\/banner\/.+\..+/gi,
    map: function(path) { return `${settings.gameCDNPrefix}${path}`; },
    overrideResponseHeaders: {"Cache-Control": "public, max-age=31536000"},
    debug: Meteor.isDevelopment
});
let whitepaperAssetsProxy = proxy({
    host: settings.gameCDNHost,
    match: /^\/whitepaper\/.+\..+/gi,
    map: function(path) { return `${settings.gameCDNPrefix}${path}`; },
    overrideResponseHeaders: {"Cache-Control": "public, max-age=31536000"},
    debug: Meteor.isDevelopment
});


app.use(indexGameProxy)
    .use(gameAssetsProxy)
    .use(bannerAssetsProxy)
    .use(whitepaperAssetsProxy)

WebApp.connectHandlers.use(async (req, res, next) => {
    // 如果非api的路由那麼走前端vue-router
    if (/^\/api\/.*/gi.test(req.url)) {
        app.callback()(req, res)
    } else if(/^\/game\/.+\..+/gi.test(req.url)){  // 遊戲資源（帶 . 的文件名地址）proxy到遊戲cdn，遊戲頁麵正常解析
        app.callback()(req, res)
    } else if(/^\/banner\/.+\..+/gi.test(req.url)){  // banner資源（帶 . 的文件名地址）proxy到遊戲cdn
        app.callback()(req, res)
    } else if(/^\/whitepaper\/.+\..+/gi.test(req.url)){  // whitepaper資源（帶 . 的文件名地址）proxy到遊戲cdn
        app.callback()(req, res)
    } else {
        next()
    }
});
