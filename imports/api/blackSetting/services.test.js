import { addBlack, getBlackList, removeBlack } from "./services"
import { BlackSetting } from "./collections"
import assert from "assert"
describe.skip("test ip black service", async() => {
    const user = "DE6uyqDtkaE2yY8FW"
    const ip = '127.0.0.1'
    const _list = []

    before(async() => {
        await BlackSetting.deleteMany()
    })
    after(async() => {
        await BlackSetting.deleteMany()
    })
    it.skip('test add ip black', async() => {
        const result = await addBlack({ createor: user, ip })

        assert.ok(result.ip == ip)
    })

    it.skip('test add username black', async() => {
        const result = await addBlack({ createor: user, username: "test1" })

        assert.ok(result.ip == ip)
    })

    it.skip('test get ip black list', async() => {
        const result = await getBlackList()
        assert.ok(result.count == 1)
        _list.push(...result.data)
        assert.ok(Array.isArray(result.data))
    })

    it.skip('test remove ip black', async() => {
        const result = await removeBlack({ iplist: ["127.0.0.1"] })
        assert.ok(result)
    })

    it.skip('test remove username black', async() => {
        const result = await removeBlack({ username: ["test1"] })
        assert.ok(result)
    })
})