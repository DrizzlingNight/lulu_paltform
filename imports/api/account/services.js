const Permissions = {
    Admin: "admin",
    SuperAdmin: "superAdmin",
    Developer: "developer",
    Proxy: "proxy",
    Sender: "sender",
    Service: 'service'
};

const isAdmin = function (userId) {
    return Roles.userIsInRole(userId, Permissions.Admin);
};
const isService = function (userId) {
    return Roles.userIsInRole(userId, Permissions.Service);
};

const isSuperAdmin = function (userId) {
    return Roles.userIsInRole(userId, Permissions.SuperAdmin);
};

const isDeveloper = function (userId) {
    return Roles.userIsInRole(userId, Permissions.Developer);
};

const isProxy = function (userId) {
    return Roles.userIsInRole(userId, Permissions.Proxy);
};

const isSender = function (userId) {
    return Roles.userIsInRole(userId, Permissions.Sender);
};

const isSuperUserAdmin = function () {
    return isSuperAdmin(Meteor.userId());
};

const isCurrentUserAdmin = function () {
    return isAdmin(Meteor.userId()) || isSuperAdmin(Meteor.userId());
};

/** @desc 判断允许用户访问/admin页面 */
const canUserViewAdmin = function () {
    return isAdmin(Meteor.userId()) || isSuperAdmin(Meteor.userId()) || isProxy(Meteor.userId())
        || isSender(Meteor.userId()) || isService(Meteor.userId());
};


const isCurrentDeveloper = function () {
    return isDeveloper(Meteor.userId());
};

const isCurrentProxy = function () {
    return isProxy(Meteor.userId());
};

const isCurrentSender = function () {
    return isSender(Meteor.userId());
};

const isCurrentService = function () {
    return isService(Meteor.userId());
}

export {
    Permissions,
    isSuperAdmin,
    isAdmin,
    isCurrentUserAdmin,
    isSuperUserAdmin,
    isCurrentDeveloper,
    isCurrentSender,
    canUserViewAdmin,
    isCurrentProxy,
    isProxy,
    isService,
    isCurrentService
};
