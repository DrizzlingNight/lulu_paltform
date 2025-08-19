import {lock, unlock, renew} from "./services"

describe.only('lock api test', async() => {
    it('test lock', async() => {
        const result = await lock('test');
        const result2 = await lock('test');
        const result3 = await renew("test1");
        console.log(result, result2, result3);
    });
    it('test unlock', async() => {
        const result = await unlock('test');
    })
});