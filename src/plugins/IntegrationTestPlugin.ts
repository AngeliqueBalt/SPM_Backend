import Cinnamon, { CinnamonPlugin, Logger, LoggerModule, WebServer } from '@apollosoftwarexyz/cinnamon';
import Database from '@apollosoftwarexyz/cinnamon-database';
import path from 'node:path';
import { parse as parseToml } from 'toml';
import fs from 'node:fs';

import { promisify } from 'node:util';

export default class IntegrationTestPlugin extends CinnamonPlugin {
    private config: any;
    private readonly autostart: boolean;

    constructor(framework: Cinnamon, autostart = false) {
        super(framework, 'xyz.apollosoftware', 'cinnamon.integration-test');
        this.autostart = autostart;
    }

    async onInitialize() {
        this.config = parseToml(await promisify(fs.readFile)('cinnamon.toml', 'utf-8'));


        const ENV_SUFFIX = ['integration-test', 'test'].includes(process.env.NODE_ENV ?? '')
            ? `-${process.env.NODE_ENV!.replaceAll('_', '-')}`
            : '';

        if (ENV_SUFFIX) {
            this.config.framework.http.port = this.config.framework.http.port + 1;
            (this.framework as any).devMode = this.config.framework.core.development_mode;
            (this.framework.getModule(LoggerModule.prototype) as any).showDebugMessages = true;
        }

        if (this.config.framework.database.override && !this.config.framework.database.enabled) {
            if (ENV_SUFFIX) {
                this.config.framework.database.database = `${this.config.framework.database.database}${ENV_SUFFIX}`;
                new LoggerModule(this.framework, this.framework.inDevMode).info(
                    `Database environment override enabled. Database name: ${this.config.framework.database.database}`,
                );
            }

            this.framework.registerModule(new Database(
                this.framework,
                path.resolve(process.cwd(), this.config.framework.structure.models ?? "src/models/")
            ));

            await this.framework.getModule(Database.prototype).initialize(this.config.framework.database);
            if (this.autostart) await this.framework.getModule(Database.prototype).connect();
        }

        return true;
    }

    async onStart(): Promise<void> {
        if (this.autostart) {
            await this.framework.getModule(WebServer.prototype).initialize();
            await this.framework.getModule(WebServer.prototype).start(this.config.framework.http);
        }
    }

}
