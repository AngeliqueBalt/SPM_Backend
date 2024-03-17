import { Context, Controller, Method, Middleware, Route } from '@apollosoftwarexyz/cinnamon';
import { OnlyAuthenticated } from '../middlewares/Authentication';
import { Class } from '../models/Class';
import { User } from '../models/User';
import UserController from './UserController';

/**
 * Classes controller.
 */
@Controller('user','classes')
export default class Classes {
    @Middleware(OnlyAuthenticated)
    @Route(Method.GET, '')
    public async get(ctx: Context) {
        return await ctx.getEntityManager().find(Class, { $or: [{teacher: ctx.user}, {students: ctx.user}]}, {populate:["teacher", "students"]});
    }

    // @Route(Method.GET, '')
    // public async getClass (ctx: Context) {
    //     const { id } = ctx.params;
    //     return await ctx.getEntityManager().findOne(Class, id);
    // }
}
