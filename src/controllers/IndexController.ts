import { Context, Controller, Method, Middleware, Route } from '@apollosoftwarexyz/cinnamon';
import { MaybeAuthenticated } from '../middlewares/Authentication';

@Controller()
export default class IndexController {

    /**
     * Greets the user.
     * If they are authenticated, they will be greeted by name.
     */
    @Middleware(MaybeAuthenticated)
    @Route(Method.GET, '/')
    public async index(ctx: Context) {
        return `${ctx.framework.config.get('greeting') ?? 'Hello'}, ${ctx.user?.name?? 'Guest'}!`;
    }

}
