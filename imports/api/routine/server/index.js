import {settings} from "/imports/settings";
import {lock, renew, unlock} from "/imports/api/lock/server/services";
import logging from "../../logging";
import {getGame} from "../../games/utils";

const logger = logging.getLogger(module.id);

export class Routine {
    interval = 30000; // 每次update間隔時間
    singleton = true; // 是否是同時隻能有一個進程執行
    duration = 0; // 每次執行最短時間，如果邏輯跑完比此時間短，進程會sleep到此時間

    static routines = [];
    static renewThreshold = 50000; // 每50s renew一次lock

    constructor() {
        if (settings["routines"] && settings["routines"][this.constructor.name]) {
            Routine.routines.push(this);
        }
    }

    static start_all() {
        for (let r of Routine.routines) {
            r.start().then(() => {

            }).catch((error) => {
                logger.error(error);
            })
        }
    }

    async sleep(time) {
        return new Promise((resolve) => Meteor.setTimeout(resolve, time));
    }

    async start() {
        if (settings["routines"] && settings["routines"][this.constructor.name]) {
            logger.info(`${this.constructor.name} started.`);
            while (true) {
                try {
                    if(this.singleton) {
                        let l = await lock(this.constructor.name);
                        if (l) {
                            await this._update();
                            await unlock(this.constructor.name);
                        }
                    } else {
                        await this._update();
                    }
                } catch (e) {
                    logger.error(e);
                } finally {
                    await this.sleep(await this.getInterval());
                }
            }
        } else {
            logger.warn(`There is no ${this.constructor.name} in settings.routines. Add ${this.constructor.name} to settings.routines to start it.`);
        }
    }

    async _update() {
        logger.debug(`${this.constructor.name} _update.`);
        let startTime = new Date().getTime();
        try {
            await this.update();
        } catch (e) {
            logger.error(e);
        }
        let elapsedTime = new Date().getTime() - startTime;
        logger.debug(`${this.constructor.name} update lasts for ${elapsedTime}ms`);
        if(elapsedTime < this.duration) {
            logger.debug(`${this.constructor.name} will sleep for ${this.duration - elapsedTime}ms`);
            let timeLeft = this.duration - elapsedTime;
            if (this.singleton) {
                // 因為db用到 expireAfterSeconds 60, 所以需要renew保證lock不會過期
                while (timeLeft > 0) {

                    let timeForSleeping = timeLeft;
                    if (timeForSleeping > Routine.renewThreshold) {
                        timeForSleeping = Routine.renewThreshold;
                        await renew(this.constructor.name); // TODO 忽略此處耗費時間
                        logger.debug(`${this.constructor.name} renew key lock`);
                    }
                    await this.sleep(timeForSleeping);
                    timeLeft -= timeForSleeping;
                }
            } else {
                await this.sleep(timeLeft);
            }
        }
    }

    async update() {
        throw new Error(`Routine ${this.constructor.name} update function is not implemented.`);
    }

    async getInterval() {
        return this.interval;
    }
}

export class GameRoutine extends Routine {
    interval = 500;
    gameId = null;

    async update() {
        let game = getGame(this.gameId, true);
        if(game) {
            await this.gameUpdate();
        }
    }

    async gameUpdate() {
        throw new Error(`Game routine ${this.constructor.name} gameUpdate function is not implemented.`);
    }
}
