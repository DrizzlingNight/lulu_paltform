import logging from "../../../api/logging";

const logger = logging.getLogger(module.id);

export class AuthenticationFailed extends Meteor.Error {
    constructor(msg) {
        super("401", msg);
    }
}

export class PermissionDenied extends Meteor.Error {
    constructor(msg) {
        super("403", msg);
    }
}

export class BaseAuthentication {
    async authenticate(request) {
        throw new Meteor.Error();
    }

    authenticate_header(request) {
        return null;
    }
}

export class BasicAuthentication extends BaseAuthentication {

    www_authenticate_realm = "api";

    get_authorization_header(request) {
        let auth = request.headers["authorization"];
        return auth;
    }

    getAuthorizationContent(request) {
        let auth = this.get_authorization_header(request);
        if (!auth) {
            return null;
        }
        auth = auth.split(" ");

        if (!auth || auth[0].toLowerCase() !== 'basic') {
            return null;
        }

        if (auth.length === 1) {
            let msg = 'Invalid basic header. No credentials provided.';
            throw new AuthenticationFailed(msg);
        } else if (auth.length > 2) {
            let msg = 'Invalid basic header. Credentials string should not contain spaces.';
            throw new AuthenticationFailed(msg);
        }
        return auth[1]
    }
    async authenticate(request) {
        /*
        Returns a `User` if a correct username and password have been supplied
        using HTTP Basic authentication.  Otherwise returns `None`.
        */
        let auth = this.getAuthorizationContent(request);
        let username;
        let password;
        try {
            let username_password = new Buffer(auth, 'base64').toString().split(':');
            username = username_password[0];
            password = username_password[1];
        } catch (e) {
            logger.error(e);
            let msg = 'Invalid basic header. Credentials not correctly base64 encoded.';
            throw new AuthenticationFailed(msg);
        }

        return this.authenticate_credentials(username, password)
    }

    authenticate_header(request) {
        return `Basic realm=${this.www_authenticate_realm}`
    }

    authenticate_credentials(username, password) {
        /*
        Authenticate the userId and password against username and password.
        */
        let user = Meteor.users.findOne({ _id: userId });
        let result = Accounts._checkPassword(user, password);
        if (result.error) {
            let msg = 'Invalid username/password.';
            throw new AuthenticationFailed(msg);
        }
        return user;
    }
}