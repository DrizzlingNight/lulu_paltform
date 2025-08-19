Meteor.publish(null, function () {
    if (Meteor.userId()) {
        return Meteor.users.find({_id: Meteor.userId()}, {
            fields: {
                tokens: 1,
                registerType: 1,
                emails: 1,
                mobile: 1,
                tradePassword: 1,
                iddCode: 1,
                referralStatistical: 1,
                userSettings: 1,
                status: 1,
                contacts: 1
            },
            pollingIntervalMs: 500
        });
    } else {
        this.ready();
    }
});

Meteor.publish(null, function () {
    if (this.userId) {
        return Meteor.roleAssignment.find({'user._id': this.userId});
    } else {
        this.ready()
    }
})
