import { Context, Controller, LoadIf, Method, Route } from '@apollosoftwarexyz/cinnamon';
import { IntegrationTestDatabaseSeeder } from '../mocks/seeders/integration-test-database.seeder';
import { SchemaGenerator } from '@mikro-orm/postgresql';
import Database from '@apollosoftwarexyz/cinnamon-database';

@Controller('debug', 'integration-test')
@LoadIf(() => process.env.NODE_ENV === 'integration-test')
export default class IntegrationTestsController {

    @Route(Method.GET, '/ping')
    public async ping() {
        return 'ready';
    }

    @Route(Method.GET, '/reset')
    public async reset(ctx: Context) {
        await new SchemaGenerator(ctx.getEntityManager()).refreshDatabase();
        await ctx.framework.getModule(Database.prototype).underlyingOrm!.getMigrator().down({
            to: 0,
        });
        await ctx.framework.getModule(Database.prototype).underlyingOrm!.getMigrator().up();
        const em = ctx.getEntityManager();
        await new IntegrationTestDatabaseSeeder().run(em);
        await em.flush();
        return 'ready';
    }

}
