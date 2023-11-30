import Cinnamon, { CinnamonPlugin, CinnamonWebServerModulePlugin, WebServer } from '@apollosoftwarexyz/cinnamon';

export default class WebServerSettingsPlugin extends CinnamonPlugin implements CinnamonWebServerModulePlugin {

    constructor(framework: Cinnamon) {
        super(framework, 'xyz.apollosoftware', 'cinnamon.webserver-settings');
    }

    async onInitialize() {
        return true;
    }

    async beforeRegisterControllers(): Promise<void> {
        // Pass-thru the proxy setting to the underlying web server.
        if (this.framework.config.get('proxy')) {
            this.framework.getModule<WebServer>(WebServer.prototype).server.proxy = true;
        }
    }

}
