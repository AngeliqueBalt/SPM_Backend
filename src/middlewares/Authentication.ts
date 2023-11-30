import { Context, Next } from '@apollosoftwarexyz/cinnamon';
import { Session } from '../models/Session';
import { AppError, toAppError } from '../schema/errors';

/**
 * Middleware that will attempt to authenticate the user based on the
 * Authorization header.
 *
 * If the user is authenticated, ctx.session and ctx.user will be populated.
 * Otherwise, the request will continue without authentication and ctx.session
 * and ctx.user will be undefined.
 *
 * @see OnlyAuthenticated
 *
 * @param ctx The request/response context.
 * @param next The next middleware in the chain.
 */
export async function MaybeAuthenticated(
    ctx: Context,
    next: Next
): Promise<any> {
    const token = ctx.headers['authorization'];
    await _processAuthentication(ctx, token);
    return next();
}

/**
 * Middleware that will require the user to be authenticated.
 *
 * If the user is not authenticated, an error will be returned.
 * Otherwise, if the user is authenticated, ctx.session and ctx.user will be
 * populated, similarly to {@link MaybeAuthenticated}.
 *
 * @see MaybeAuthenticated
 *
 * @param ctx The request/response context.
 * @param next The next middleware in the chain.
 */
export async function OnlyAuthenticated(
    ctx: Context,
    next: Next
): Promise<any> {
    const token = ctx.headers['authorization'];

    if (await _processAuthentication(ctx, token)) {
        return next();
    }

    return toAppError(
        ctx,
        AppError.unauthenticated,
        'You must be authenticated to perform this action.'
    );
}

async function _processAuthentication(ctx: Context, requestToken?: string): Promise<boolean> {
    // Strip the 'bearer' prefix from the token if it exists.
    if (requestToken && requestToken.toLowerCase().startsWith('bearer ')) {
        requestToken = requestToken.substring(7);
    }

    if (!requestToken) return false;

    // Attempt to obtain the session from the database.
    const session = await ctx.getEntityManager().findOne(
        Session,
        { requestToken },
        {
            populate: ['user']
        }
    );

    // If no session was found, return false to indicate unauthenticated.
    if (!session) return false;

    // Otherwise, populate the context parameters and return true to indicate
    // authenticated.
    ctx.session = session;
    ctx.user = session.user;
    return true;
}
