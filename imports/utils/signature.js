const crypto = require('crypto');

const signMd5 = function (content) {
    let md5 = crypto.createHash('md5')
    return md5.update(content).digest('hex')
}

const buildParams = function (params) {
    Object.keys(params).forEach(key => params[key] === undefined ? delete params[key] : '');
    return Object.keys(params).sort().map((k) => {
        return k + '=' + encodeURIComponent(params[k]).replace(/%20/g, '+');
    }).join('&');
}

const generateSignature = function (method, path, params, nonce, key, secret, type) {
    let sort_params = buildParams(params)
    let signature = ''
    let content = ''
    switch (type) {
        default:
            content = [method, path, nonce, secret, sort_params].join('|');
            signature = signMd5(content)
    }
    return signature
}

const verifySignature = function (method, path, params, nonce, key, secret, sign, type) {
    let signature = generateSignature(method, path, params, nonce, key, secret, type)
    return sign === signature
}

export {generateSignature, verifySignature}