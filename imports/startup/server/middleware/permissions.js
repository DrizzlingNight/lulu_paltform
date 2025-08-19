import {BasePermission} from "../../both/permissions";

export class IsAuthenticated extends BasePermission {
    async hasPermission(ctx, view) {
        console.log(`ctx user ${ctx.user}`);
        return ctx.user;
    }
}