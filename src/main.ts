import Cinnamon from '@apollosoftwarexyz/cinnamon';
import { ApolloProtocol } from '@apollosoftwarexyz/cinnamon-plugin-asl-protocol';
import WebServerSettingsPlugin from './plugins/WebServerSettingsPlugin';

(async () => {
    await Cinnamon.initialize({
        async load(framework) {
            // Apollo Protocol for API responses.
            framework.use(new ApolloProtocol(framework));

            // Web Server Settings plugin.
            framework.use(new WebServerSettingsPlugin(framework));
        }
    });
})();
