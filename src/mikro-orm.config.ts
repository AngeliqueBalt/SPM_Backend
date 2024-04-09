import 'reflect-metadata';

import Cinnamon from '@apollosoftwarexyz/cinnamon';
import Database from '@apollosoftwarexyz/cinnamon-database';

export default (async () => {
    const framework = await Cinnamon.initialize({
        silenced: true,
        autostartServices: false,
    });

    const config = {
        ...(framework.getModule<Database>(Database.prototype).ormConfig),
        migrations: {
            disableForeignKeys: false,
            emit: 'js',
        },
        seeder: {
            pathTs: `${__dirname}/mocks/seeders`
        }
    };

    if (!config) process.exit(1);
    else return config;
})();
