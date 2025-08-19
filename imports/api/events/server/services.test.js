import { getUserActiveHourRecord, getUserOnlineCount } from "./services"
import { Events, EventType } from "./../collections"
import moment from "moment"
import assert from "assert";
describe.skip("test events", async function() {
    const mockTimeStrat = 1560122404000 // 2019/6/10 7:20:4
    const mockTimeStratB = 1560122408000 // 2019/6/10 7:20:4
    const mockTimeStratC = 1560130080000 // 2019/6/10 7:20:4
    const mockTimeStratD = 1560158888000 // 2019/6/10 7:20:4

    before(async() => {
        await Events.deleteMany()
        const user = {
            a: 'DE6uyqDtkaE2yY8FW_aa',
            b: 'DE6uyqDtkaE2yY8FW_bb',
            c: 'DE6uyqDtkaE2yY8FW_cc',
            d: 'DE6uyqDtkaE2yY8FW_dd',
        };
        await mockUserA(user.a, mockTimeStrat)
        await mockUserB(user.b, mockTimeStratB)

        // user C 隻有早上9點28登陸一次 9點58退出
        await mockUserC(user.c, mockTimeStratC)

        // user D 隻有早上17點28登陸一次 17點58退出
        await mockUserC(user.d, mockTimeStratD)
    })

    after(async() => {
        // await Events.deleteMany()
    })

    it("test get 2019/6/10 7:00:00 - 8:00 online count should resturn count 2", async() => {
        // console.log(moment(1560124800000).toDate())
        const result = await getUserActiveHourRecord({ startTs: 1560121200000, endTs: 1560124800000 })
        console.log(result)
            // assert.ok(result.count === 2)
    })
    it("test get 2019/6/10 9:00:00 - 10:00 online count should resturn count 3", async() => {
        // console.log(moment(1560132000000).toDate())
        const result = await getUserActiveHourRecord({ startTs: 1560128400000, endTs: 1560132000000 })
        console.log(result)
            // assert.ok(result.count === 3)
    })

    it("test get 2019/6/10 10:00:00 - 11:00 online count should resturn count 2", async() => {
        // console.log(moment(1560132000000).toDate())
        const result = await getUserActiveHourRecord({ startTs: 1560132000000, endTs: 1560135600000 })
        console.log(result)
            // assert.ok(result.count === 2)
    })

    it("test get 2019/6/10 13:00:00 - 14:00 online count should resturn []", async() => {
        // console.log(moment(1560146400000).toDate())
        const result = await getUserActiveHourRecord({ startTs: 1560142800000, endTs: 1560146400000 })
        console.log(result)
            // assert.ok(result.count == 0)
    })
    it("test get 2019/6/10 14:00:00 - 15:00 online count should resturn []", async() => {
        // console.log(moment(1560150000000).toDate())
        const result = await getUserActiveHourRecord({ startTs: 1560146400000, endTs: 1560150000000 })
        console.log(result)
            // assert.ok(result.count == 0)
    })
    it("test get 2019/6/10 15:00:00 - 16:00 online count should resturn count equal 2", async() => {
        // console.log(moment(1560153600000).toDate())
        const result = await getUserActiveHourRecord({ startTs: 1560150000000, endTs: 1560153600000 })
        console.log(result)
            // assert.ok(result.count === 2)
    })
    it("test get 2019/6/10 16:00:00 - 17:00 online count should resturn count equal 2", async() => {
        // console.log(moment(1560157200000).toDate())
        const result = await getUserActiveHourRecord({ startTs: 1560153600000, endTs: 1560157200000 })
        console.log(result)
            // assert.ok(result.count === 2)
    })
    it("test get 2019/6/10 17:00:00 - 18:00 online count should resturn count equal 3", async() => {
        // console.log(moment(1560160800000).toDate())
        const result = await getUserActiveHourRecord({ startTs: 1560157200000, endTs: 1560160800000 })
        console.log(result)
            // assert.ok(result.count === 3)
    })

    it("test get 2019/6/10 18:00:00 - 19:00 online count should resturn []", async() => {
        // console.log(moment(1560164400000).toDate())
        const result = await getUserActiveHourRecord({ startTs: 1560160800000, endTs: 1560164400000 })
        console.log(result)
            // assert.ok(result.count == 0)
    })
    it("test get 2019/6/10 19:00:00 - 20:00 online count should resturn []", async() => {
        // console.log(moment(1560168000000).toDate())
        const result = await getUserActiveHourRecord({ startTs: 1560164400000, endTs: 1560168000000 })
        console.log(result)
            // assert.ok(result.count == 0)
    })

    // 測試天
    it("test get 2019/6/10 00:00:00 - 23:59:59 online count should resturn  count equal 4", async() => {
        // console.log(moment(1560168000000).toDate())
        const result = await getUserActiveHourRecord({ startTs: 1560096000000, endTs: 1560135600000 })
        console.log(result)
        assert.ok(result.count === 4)
    })

    it("test getUserOnlineCount for hour should resturn  count equal 2", async() => {
        const result = await getUserOnlineCount({ startTs: 1560124800000, endTs: 1560160800000 })
        console.log("ddddd")
        console.log(result)
        assert.ok(result.data['1560121200000'].count == 2)
    })
    it("test getUserOnlineCount for hour  should resturn  count equal 0", async() => {
        const result = await getUserOnlineCount({ startTs: 1560117600000, endTs: 1560124800000 })

        assert.ok(result.data['1560117600000'].count == 0)
    })
    it("test getUserOnlineCount for day  should resturn  count equal 4", async() => {
        const result = await getUserOnlineCount({ startTs: 1560096000000, endTs: 1560182400000, type: "day" })

        assert.ok(result.data['1560096000000'].count == 4)
    })
    it("test getUserOnlineCount for day  should resturn  count equal 4dddddddddd", async() => {
        const result = await getUserOnlineCount({ startTs: 1560787200000, endTs: 1560873599999, type: "hour" })
        console.log(result)
            // assert.ok(result.data['1560096000000'].count == 4)
    })
})

async function mockUserA(userId, mockTimeStrat) {
    // 1,用早上7點15登陸一直到中午12點15登出 
    // 7:20:4 ——>login
    // 12:20:4 ——>logout 
    const time = moment(mockTimeStrat);
    await mockData(time, EventType.UserLogin, userId)
    await mockData(time.add(5,'hour'), EventType.UserLogout, userId);
    // 然後 中午3點15又登陸 下午5點12登出
    // 15:20:4 ——>login
    // 17:20:4 ——>logout
    await mockData(time.add(3,'hour'), EventType.UserLogin, userId)
    await mockData(time.add(2,'hour'), EventType.UserLogout, userId)
}
async function mockUserC(userId, mockTimeStrat) {
    const time = moment(mockTimeStrat);
    await mockData(time, EventType.UserLogin, userId)
    await mockData(time.add(30,'m'), EventType.UserLogout, userId);
}
async function mockUserB(userId, mockTimeStrat) {
    //     以上情況 每15min刷新一次
    //     7:20:4 ——>ogin
    //     7:35:4 ——>logout
    //     7:35:4 ——>login
    //     7:50:4 ——>logout
    //     7:50:4 ——>login
    //    ….
    //    …
    //  12:20:4 ——>logout
    const timeB = moment(mockTimeStrat);
    const timeEnd = moment(mockTimeStrat).add(5,'hour')
        // login
    await mockData(timeB, EventType.UserLogin, userId)
    while (timeB.valueOf() < timeEnd.valueOf()) {
        timeB.add(15,'minute')
        await mockData(timeB, EventType.UserLogout, userId)
        await mockData(timeB, EventType.UserLogin, userId)
    }

    await mockData(timeEnd, EventType.UserLogout, userId)
        // 然後 中午3點15又登陸 下午5點12登出
        // 15:20:4 ——>login
        // 17:20:4 ——>logout
    await mockData(timeEnd.add(3,'hour'), EventType.UserLogin, userId)
    await mockData(timeEnd.add(2,'hour'), EventType.UserLogout, userId)
}

async function mockData(time, type, userId) {
    const events = {
        info: {
            "userId": userId,
            "ipAddr": "127.0.0.1",
            "connectionId": "QS32F5xZD4DeBwCzB",
            userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36",
        },
        user: userId,
    };
    events.eventType = type
    events.createdAt = time.toDate()
    events.info.loginTime = time.toDate()
    await Events.insertOne(events)
}