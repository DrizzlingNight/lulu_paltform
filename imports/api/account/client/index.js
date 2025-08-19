Meteor.loginWithPassword = (selector, password, callback) => {
    Accounts.callLoginMethod({
        methodArguments: [{
            loginType: 'lulu',
            user: selector,
            pwd: Accounts._hashPassword(password)
        }],
        userCallback: callback
    });
};
