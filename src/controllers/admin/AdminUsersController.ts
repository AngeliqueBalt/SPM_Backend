import { Body, Context, Controller, Method, Middleware, Route } from '@apollosoftwarexyz/cinnamon';
import { OnlyAdmin } from '../../utils/admin';
import { User } from '../../models/User';
import { ValidateBody } from '../../utils/validation';
import { CreateAccountRequestSchema } from '../../schema/requests/authentication';
import { expr, wrap } from '@mikro-orm/core';
import { AppError, toAppError } from '../../schema/errors';
import * as argon2 from 'argon2';
import { studentProgressMonitorHashingOptions } from '../../utils/security';
import AuthenticationController from '../AuthenticationController';

/**
 * admin Users controller.
 */
@Controller('admin', 'users')
export default class AdminUsersController {

    @Middleware(OnlyAdmin)
    @Route(Method.GET, '')
    public async get(ctx: Context) {
        return await ctx.getEntityManager().find(User, {});
    }

    @Middleware(ValidateBody(CreateAccountRequestSchema))
    @Middleware(Body())
    @Middleware(OnlyAdmin)
    @Route(Method.POST, '')
    public async register(ctx: Context) {
        // Destructure request body. It's already been validated, so this is safe to do.
        const {
            user: {
                name,
                email,
                idNumber,
                userType,
            },
            password,
        } = ctx.request.body;

        // Create the user in the database.
        const userRepo = ctx.getEntityManager().getRepository(User);

        if (await userRepo.count({ [expr('lower(email)')]: email.toLowerCase() }) > 0) {
            return toAppError(
                ctx,
                AppError.conflictingEntity,
                'A user with that email already exists.'
            );
        }

        // Create and persist the user.
        const user = new User({
            email,
            name,
            idNumber,
            passwordHash: await argon2.hash(password, studentProgressMonitorHashingOptions),
            userType
        });
        await ctx.getEntityManager().persistAndFlush(user);


        // Now, return the user and session to the client.
        return ctx.success({
            user: wrap(user),
            message: 'The account has been created successfully!'
        });
    }


}
