//IF:AUTHENTICATION
import { Body, Context, Controller, Method, Middleware, Route } from '@apollosoftwarexyz/cinnamon';

import * as argon2 from 'argon2';
import { studentProgressMonitorHashingOptions } from '../../utils/security';

import { OnlyAuthenticated } from '../../middlewares/Authentication';

import { ValidateBody } from '../../utils/validation';
import { CreateAccountRequestSchema, LoginRequestSchema } from '../../schema/requests/authentication';

import { User } from '../../models/User';
import { Session } from '../../models/Session';
import { expr, wrap } from '@mikro-orm/core';

import { AppError, toAppError } from '../../schema/errors';

/**
 * Public-facing user authentication controller.
 *
 * This contains the logic necessary to create and (de-)authenticate users.
 */
@Controller('api', '_auth')
export default class AuthenticationController {

    /**
     * Log an existing user in.
     *
     * This endpoint accepts a username (or email) and password, and returns a
     * session token that can be used to authenticate future requests.
     *
     * The username field is automatically checked against both the username and
     * email fields in the database, so users can log in with either.
     */
    @Middleware(ValidateBody(LoginRequestSchema))
    @Middleware(Body())
    @Route(Method.POST, 'login')
    public async login(ctx: Context) {
        // Destructure request body. It's already been validated, so this is safe to do.
        const { username, password, pushToken } = ctx.request.body;

        // Attempt to find the user in the database.
        const user = await ctx.getEntityManager().findOne(User, {
            $or: [
                { [expr('lower(username)')]: username },
                { [expr('lower(email)')]: username }
            ]
        });

        // If no user was found, return an error.
        if (!user) {
            return toAppError(
                ctx,
                AppError.unauthenticated,
                'Invalid username or password.'
            );
        }

        // Verify the password.
        try {
            if (!await argon2.verify(user.password, password, studentProgressMonitorHashingOptions)) {
                return toAppError(
                    ctx,
                    AppError.unauthenticated,
                    'Invalid username or password.'
                );
            }
        } catch (ex) {
            return toAppError(
                ctx,
                AppError.unexpected,
                'An unexpected problem occurred whilst checking your password. If the issue persists, please get in touch.'
            );
        }

        // Finally, all checks were valid so create a new session and return it.
        const session = await AuthenticationController.startSession(ctx, {
            user,
        });

        return ctx.success({
            user: wrap(user),
            requestToken: session.requestToken,
            message: 'You have been logged in successfully!'
        });
    }

    /**
     * Create a new user account.
     *
     * Users who are new to the application can create an account using this
     * endpoint. The request body must contain the user's email and username.
     * The password is also required, and is hashed immediately before being
     * stored in the database using Argon2.
     *
     * The user is automatically logged in after their account is created and a
     * session token is returned.
     */
    @Middleware(ValidateBody(CreateAccountRequestSchema))
    @Middleware(Body())
    @Route(Method.POST, 'register')
    public async register(ctx: Context) {
        // Destructure request body. It's already been validated, so this is safe to do.
        const {
            user: {
                email,
                username,
            },
            password,
            pushToken
        } = ctx.request.body;

        // Create the user in the database.
        const userRepo = ctx.getEntityManager().getRepository(User);

        if ((await userRepo.count({ $or: [ { [expr('lower(username)')]: username.toLowerCase() }, { [expr('lower(email)')]: email.toLowerCase() } ] })) > 0) {
            return toAppError(
                ctx,
                AppError.conflictingEntity,
                'A user with that username or email already exists.'
            );
        }

        // Create and persist the user.
        const user = new User({
            username,
            email,
            passwordHash: await argon2.hash(password, studentProgressMonitorHashingOptions),
        });
        await ctx.getEntityManager().persistAndFlush(user);

        const session = await AuthenticationController.startSession(ctx, {
            user,
        });

        // Now, return the user and session to the client.
        return ctx.success({
            user: wrap(user),
            requestToken: session.requestToken,
            message: 'Your account has been created successfully!'
        });
    }

    /**
     * Log the user out.
     *
     * Destroys an active session, logging the user out.
     */
    @Middleware(OnlyAuthenticated)
    @Route(Method.POST, '/logout')
    public async logout(ctx: Context) {
        await ctx.getEntityManager().removeAndFlush(ctx.session!);
        return ctx.success({ message: 'You have been logged out successfully.' });
    }

    private static async startSession(ctx: Context, sessionParams: {
        user: User;
    }): Promise<Session> {
        const ipAddress = (ctx.headers['cf-connecting-ip'] as string) ?? ctx.ip;

        // Create (but do not persist yet) a session object for the user.
        const session = new Session({
            user: sessionParams.user,
            ipAddress,
        });

        // Delete any existing sessions for the user.
        await ctx.getEntityManager().nativeDelete(Session, { user: sessionParams.user });

        // Persist the session and return it.
        await ctx.getEntityManager().persistAndFlush(session);
        return session;
    }

}
