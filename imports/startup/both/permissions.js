export class BasePermission {
    async hasPermission(ctx, view) {

    }

    async hasObjectPermission(ctx, view, obj) {

    }
}

export class AllowAny extends BasePermission {
    async hasPermission(ctx, view) {
        return true;
    }
}