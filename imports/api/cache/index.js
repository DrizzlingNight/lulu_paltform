import * as _ from "lodash";

let caches = {};
let timeouts = {};

const get = function(key) {
    let timeout = timeouts[key];
    if (timeout != null) {
        if (timeout <= new Date().getTime()) {
            delete caches[key];
            delete timeouts[key];
        }
    }
    return _.cloneDeep(caches[key]);
};

/**
 *
 * @param key
 * @param value
 * @param timeout 0 - never cache, null - always cache, else cache in seconds
 */
const set = function(key, value, timeout=null) {
    caches[key] = value;
    timeouts[key] = timeout && new Date().getTime() + timeout * 1000;
};

const clear = function() {
    caches = {};
    timeouts = {};
};

export {get, set, clear}

