/**公共时间筛选**/
const _timeSelector = function (selector, startTime, endTime, timeName) {
    if (!startTime) {
        selector[timeName] = {$lte: new Date(endTime)}
    } else if (!endTime) {
        selector[timeName] = {$gte: new Date(startTime)}
    } else {
        selector['$and'] = [{createdAt: {$gte: new Date(startTime)}}, {createdAt: {$lte: new Date(endTime)}}]
    }
    return selector
}

/**用户筛选**/
const buildUserSelector = function (params) {
    let selector = {}
    if (params.user) {
        selector['$or'] = [{username: params.user}, {mobile: params.user}, {"emails": {$elemMatch: {"address": params.user}}}]
    }
    if (params.countryCodes) {
        let orArr = selector['$or'] || []
        for (let i = 0; i < params.countryCodes.length; ++i) {
            let code = params.countryCodes[i]
            orArr.push({'status.countryCode': code})
        }
        selector['$or'] = orArr
    }
    if (params.startTime || params.endTime) {
        selector = _timeSelector(selector, params.startTime, params.endTime, 'createdAt')
    }
    return selector
}

/**账变筛选**/
const buildTokenChangeSelector = function (params) {
    let selector = {}
    if (params.userId) {
        selector['user'] = params.userId
    }
    if (params.tokenId) {
        selector['token'] = params.tokenId
    }
    if (params.type) {
        selector['type'] = {$in: params.type}
    }
    if (params.startTime || params.endTime) {
        selector = _timeSelector(selector, params.startTime, params.endTime, 'createdAt')
    }
    return selector
}

export {buildUserSelector, buildTokenChangeSelector}