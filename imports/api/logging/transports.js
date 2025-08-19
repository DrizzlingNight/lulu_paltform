const Transport = require('winston-transport');
const util = require('util');
//
// Inherit from `winston-transport` so you can take advantage
// of the base functionality and `.exceptions.handle()`.
//
export class WebTransport extends Transport {
    constructor(opts) {
        super(opts);

        //
        // Consume any custom options here. e.g.:
        // - Connection information for databases
        // - Authentication information for APIs (e.g. loggly, papertrail,
        //   logentries, etc.).
        //
    }

    log(info, callback) {
        setImmediate(() => {
            this.emit('logged', info);
        });

        // Perform the writing to the remote service
        Meteor.call("logger", info, (err, res) => {
            if(err) {
                console.error(err);
            } else {
            }
            callback();
        });
    }
}