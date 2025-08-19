import {AuthenticationFailed, BasicAuthentication} from "./auth"

export const tokenAuthorization = async function(ctx,next) {
    const _auth = new BasicAuthentication();
    let auth = _auth.getAuthorizationContent(ctx.request);
    ctx.request.token = auth
    let user = Meteor.users.findOne(
        {"services.resume.loginTokens.hashedToken": auth});
    if(!user){
        throw  new AuthenticationFailed('Invalid token, Please log in again.')
    }
    let token = user.services.resume.loginTokens.find(token =>
        token.hashedToken === auth
    );
    const tokenExpires = Accounts._tokenExpiration(token.when);
    if (new Date() >= tokenExpires){
        throw  new AuthenticationFailed('Invalid token, Please log in again.')
    }
    await next()
}