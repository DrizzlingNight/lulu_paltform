import {sendNotify} from "./services";


import {marbleMethods} from "/imports/utils/methods";
marbleMethods({
    testTele: async function(msgObj, msgType) {

        return await sendNotify(msgObj, msgType);
    }
});