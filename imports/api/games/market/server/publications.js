import {Meteor} from "meteor/meteor";
import {GameRound, GameRoundStatus} from "../../collections";
import {GameName, LandSlot} from "../collections";
import {buildTaskInfo, checkUserMarketStatus} from "./services";
import {BountyTask, BountyTaskStatus} from "../../../bountyTasks/collections";


const filterFields = function(slot, user) {
    if (slot.land && slot.land.state.lend) {
        let task = BountyTask.findOne({
            status: BountyTaskStatus.InProgress,
            receiver: user._id,
            'requirements.land._id': slot.land._id
        })
        if (task) {
            slot.taskInfo = buildTaskInfo(task)
        }
    }
}

/**
 * @api {subscribe} Meteor.subscribe('market') 我的游戏记录 土地插槽状态
 * @apiVersion 0.1.0
 * @apiName 订阅我的游戏记录
 * @apiGroup game
 *
 * @apiSuccess      {Array}     List 游戏记录列表 土地插槽状态
 * @apiSuccess      {String}    List.collection gameRounds 游戏记录 landSlots 插槽状态
 */
Meteor.publish('market', async function () {
    let user = Meteor.user()
    check(user, Object);
    await checkUserMarketStatus(user)

    let self = this;
    let roundHandle = GameRound.find({
        "game._id": GameName,
        "userData.slot.user": this.userId,
    }, {
        sort: {
            status:1,
            createdAt:-1
        },
        limit: 8,
        fields: {
            game: 1, userData: 1, seedHash: 1, resultHash: 1, status:1,  block: 1,
            gameId:1, createdAt: 1},
        pollingIntervalMs: 1000
    }).observeChanges({
        added(id, fields){
            self.added('gameRounds', id, fields);
        },
        changed(id, fields){
            self.changed('gameRounds', id, fields);
        },
        removed(id){
            self.removed('gameRounds', id);
        },
    })
    let slotsHandle = LandSlot.find({user: user._id}, {sort: {position: 1},pollingIntervalMs: 1000}).observeChanges({
        added(id, fields){
            filterFields(fields, user);
            self.added('landSlots', id, fields);
        },
        changed(id, fields){
            filterFields(fields, user);
            self.changed('landSlots', id, fields);
        },
        removed(id){
            self.removed('landSlots', id);
        },
    })

    this.ready();

    this.onStop(() => {
        roundHandle.stop();
        slotsHandle.stop();
    });

});

/**
 * @api {subscribe} Meteor.subscribe('othersRound') 其他玩家的游戏记录
 * @apiVersion 0.1.0
 * @apiName 订阅其他玩家的的游戏记录
 * @apiGroup game
 *
 * @apiSuccess {Array} List 游戏记录列表
 * @apiSuccess {Number} List.status 游戏状态
 */
Meteor.publish('othersRound', function () {
    return GameRound.find({
        "game._id": GameName,
        status: GameRoundStatus.Ended,
        "userData.slot.user": {$ne:this.userId},
    }, {
        sort: {
            createdAt:-1
        },
        limit: 8,
        fields: {
            game: 1, userData: 1, seedHash: 1, resultHash: 1, block: 1, status:1,
            gameId:1, createdAt: 1},
        pollingIntervalMs: 10000
    })
});
