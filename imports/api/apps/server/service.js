import {Apps, AppSecret, AppTaskRecord} from "../collections";
import {errorCodes} from "../../../settings/errorCodes";
import {verifySignature} from "../../../utils/signature";
import {getSequenceValue} from "../../core/server";
import {Random} from "meteor/random";

const _getSecret = function (appId, pubKey) {
    return AppSecret.findOne({
        app: appId,
        pubKey: pubKey,
        active: true
    })
}

const _createRecordId = async function (session) {
    return await getSequenceValue("appTaskRecordId", session)
}

// 验证请求参数
const requestVerify = function (appId, params, nonce, key, sign, api) {
    const app = Apps.findOne({_id: appId})
    let secret = _getSecret(appId, key)
    if (!app || app[api] || !secret) {
        throw new Meteor.Error(404, errorCodes.ObjNotFound)
    }
    let signApi = app.apis[api]
    return verifySignature(signApi.method, signApi.uri, params, nonce, key, secret.secret, sign, secret.type)
}

// app任务回调
const appTaskNotify = async function (user, taskRule, session) {
    let appIds = taskRule.notify_apps.split('&')
    if (appIds.length > 0) {
        for (let appId of appIds) {
            let app = Apps.findOne({_id: appId}, {session})
            if (app && user.apps && user.apps[app._id]) {
                await AppTaskRecord.insertOne({
                    _id: Random.id(),
                    recordId: await _createRecordId(session),
                    app: app._id,
                    clickId: user.apps[app._id],
                    gameId: '10001',
                    identifier: taskRule._id,
                    createdAt: new Date()
                }, {session})
            }
        }
    }
}

// 获取任务完成记录
const appTaskRecord = async function (app, gameId, minId, limit = 100) {
    return AppTaskRecord.find(
        {app: app, gameId: gameId, recordId: {$gt: minId}},
        {sort: {recordId: 1}, limit: limit}
    ).fetch()
}
export {requestVerify, appTaskNotify, appTaskRecord}