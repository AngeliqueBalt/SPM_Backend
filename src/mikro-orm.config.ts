import 'reflect-metadata';

import Cinnamon from '@apollosoftwarexyz/cinnamon';
import Database from '@apollosoftwarexyz/cinnamon-database';
import IntegrationTestPlugin from './plugins/IntegrationTestPlugin';

export default (async () => {
    const framework = await Cinnamon.initialize({
        silenced: true,
        autostartServices: false,
        async load(framework) {
            framework.use(new IntegrationTestPlugin(framework));
        },
    });

    return {
        ...framework.getModule(Database.prototype).ormConfig,
        migrations: {
            disableForeignKeys: false,
            emit: 'js',
        },
        seeder: {
            pathTs: `${__dirname}/mocks/seeders`
        }
    };
})();
