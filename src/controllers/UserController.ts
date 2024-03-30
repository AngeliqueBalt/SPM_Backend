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

    // get current user
    @Middleware(OnlyAuthenticated)
    @Route(Method.GET, '')
    public async getCurrent(ctx: Context) {
        return ctx.user;
    }

    // get all classes
    @Middleware(OnlyAuthenticated)
    @Route(Method.GET, '/classes')
    public async get(ctx: Context) {
        return await ctx.getEntityManager().find(Class, { $or: [{teacher: ctx.user}, {students: ctx.user}]}, {populate:["teacher", "students","activeQuiz" ,"activeQuiz.questions", "activeQuiz.questions.answers"]});
    }

}
