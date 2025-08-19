import assert from "assert";

export const randomNum = function (length=6) {
    let num = ''
    for(let i = 0; i < length; i++) {
        num += Math.floor(Math.random() * 10)
    }
    return num
}

/**
 * @param {string} str
 * @returns {number[]}
 */
export function stringToByte(str) {
    var bytes = [];
    var len, c;
    len = str.length;
    for(var i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if(c >= 0x010000 && c <= 0x10FFFF) {
            bytes.push(((c >> 18) & 0x07) | 0xF0);
            bytes.push(((c >> 12) & 0x3F) | 0x80);
            bytes.push(((c >> 6) & 0x3F) | 0x80);
            bytes.push((c & 0x3F) | 0x80);
        } else if(c >= 0x000800 && c <= 0x00FFFF) {
            bytes.push(((c >> 12) & 0x0F) | 0xE0);
            bytes.push(((c >> 6) & 0x3F) | 0x80);
            bytes.push((c & 0x3F) | 0x80);
        } else if(c >= 0x000080 && c <= 0x0007FF) {
            bytes.push(((c >> 6) & 0x1F) | 0xC0);
            bytes.push((c & 0x3F) | 0x80);
        } else {
            bytes.push(c & 0xFF);
        }
    }
    return bytes;
}

/**
 * @param {number[]} bytes
 * @returns {string}
 */
export function bytes2hexstr(bytes) {
    const hexByteMap = '0123456789ABCDEF';

    let str = '';
    bytes.forEach(ch=>{
        str += hexByteMap.charAt(ch >> 4);
        str += hexByteMap.charAt(ch & 0x0f);
    });

    return str;
}

/**
 * @desc 类似python的字符串格式化
 * @example formatString('{a} is {a}', {a: 'xx'})
 */
export const formatString = function(content, args) {
    let result = content;
    let normalVal;
    for (let key of Object.keys(args)) {
        assert.ok(key.constructor !== Number);
        if (args[key] instanceof Object) {
            normalVal = JSON.stringify(args[key]);  // 正常显示的字符串
        } else {
            normalVal = args[key];
        }
        result = result.replace(new RegExp("{" + key + "}", "g"), normalVal);
    }
    return result
};

/** @desc 數字補0 **/
export const prefixInteger = function (num, length) {
    return (Array(length).join('0') + num).slice(-length);
}