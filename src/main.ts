import Cinnamon, { WebServer } from '@apollosoftwarexyz/cinnamon';
import { ApolloProtocol } from '@apollosoftwarexyz/cinnamon-plugin-asl-protocol';
import WebServerSettingsPlugin from './plugins/WebServerSettingsPlugin';

import IntegrationTestPlugin from './plugins/IntegrationTestPlugin';

(async () => {
    const framework = await Cinnamon.initialize({
        autostartServices: false,
        async load(framework) {
            // Apollo Protocol for API responses.
            framework.use(new ApolloProtocol(framework));

            // Web Server Settings plugin.
            framework.use(new WebServerSettingsPlugin(framework));

            // Integration test environment plugin.
            framework.use(new IntegrationTestPlugin(framework, true));
        },
    });
})();
