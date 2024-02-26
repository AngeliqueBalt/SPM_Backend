import { Context, Controller, Method, Middleware, Route } from '@apollosoftwarexyz/cinnamon';
import { OnlyAdmin } from '../../utils/admin';

/**
 * Classes controller.
 */
@Controller('admin', 'classes')
export default class AdminClassesController {
    // TODO: VIEW LIST OF ALL CLASSES
    // @Middleware(OnlyAdmin)
    // @Route(Method.GET, '')
    // public async get(ctx: Context) {
    //     return await ctx.getEntityManager().find(Class, {});
    // }

    // TODO: ADD A CLASS

    // TODO: REMOVE A CLASS
    // @Middleware(OnlyAdmin)
    // @Route(Method.DELETE, '\:id')
    // public async remove (ctx: Context) {
    // }

    // TODO: EDIT A CLASS
    // @Middleware(OnlyAdmin)
    // @Route(Method.PATCH, '\:id')
    // public async edit(ctx: Context) {
    // }


}
