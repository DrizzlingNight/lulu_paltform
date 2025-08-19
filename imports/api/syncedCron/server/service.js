import {lock, unlock} from "../../lock/server/services";


export const addIntervalSyncedCron = function (name, interval, job, singleton=false){
    if (Meteor.settings.private.routines && Meteor.settings.private.routines[name])
        SyncedCron.add({
            name,
            schedule: function(parser) {
                // parser is a later.parse object
                return parser.recur().every(interval).second()
            },
            job: async function() {
                if (singleton) {
                    let l = await lock(name);
                    if (l) {
                        await job();
                        await unlock(name);
                    }
                } else {
                    await job();
                }
            }
        });
}
export const removeIntervalSyncedCron = function (name){
    SyncedCron.remove(name)
}

export const addTimeoutSyncedCron = function (name, interval, job){
    if (Meteor.settings.private.routines && Meteor.settings.private.routines[name])
        SyncedCron.add({
            name,
            schedule: function(parser) {
                // parser is a later.parse object
                return parser.recur().every(interval).second()
            },
            job
        });
}
