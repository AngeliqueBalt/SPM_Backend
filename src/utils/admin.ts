import { Context, Next } from '@apollosoftwarexyz/cinnamon';
import { AppError, toAppError } from '../schema/errors';
import { OnlyAuthenticated } from '../middlewares/Authentication';
import { UserType } from '../models/User';

export const OnlyAdmin = async (ctx: Context, next: Next) =>
    OnlyAuthenticated(ctx, () => {
        // After the user has been authenticated, check that the user is an admin.
        // If they are, proceed with the request.
        if (ctx.user!.userType === UserType.admin) {
            return next();
        }

        // Otherwise, return an error and do not call next().
        return toAppError(ctx, AppError.unauthorized, "You do not have permission to call this route.");
    });
