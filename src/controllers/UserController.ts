import { Body, Context, Controller, Method, Middleware, Route } from '@apollosoftwarexyz/cinnamon';
import * as argon2 from 'argon2';

import { OnlyAuthenticated } from '../middlewares/Authentication';
import { ValidateBody } from '../utils/validation';
import { UserDeleteRequestSchema } from '../schema/requests/user';
import { AppError, toAppError } from '../schema/errors';
import { Class } from '../models/Class';
import { EntityManager } from '@mikro-orm/core';

/**
 * User controller.
 *
 * This controller contains the logic necessary to manage users (e.g., update
 * profile information, destroy account, etc.)
 */
@Controller('user')
export default class UserController {

    @Middleware(OnlyAuthenticated)
    @Route(Method.GET, '')
    public async getCurrent(ctx: Context) {
        return ctx.user;
    }
}
