import { Entity, OneToOne, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { User } from './User';

import { randomBytes as secureRandomBytes } from 'crypto';
import { TrackedBaseEntity } from './BaseEntity';

@Entity({ tableName: 'sessions' })
export class Session extends TrackedBaseEntity {

    /**
     * A standard token for the REST-ful API.
     */
    @Unique()
    @PrimaryKey({ columnType: 'varchar(684)' })
    requestToken: string = secureRandomBytes(512).toString('base64');

    /**
     * The user that the session belongs to.
     */
    @OneToOne({ onDelete: 'cascade' })
    user!: User;

    /**
     * The device user agent that started the session.
     */
    @Property({ type: 'text', nullable: true })
    deviceUserAgent?: string;

    /**
     * The IP address that started the session.
     */
    @Property({ length: 36, nullable: true })
    ipAddress?: string;


    constructor(fields: {
        user: User,
        deviceUserAgent?: string,
        ipAddress?: string,
    }) {
        super();

        this.user = fields.user;
        if (fields.deviceUserAgent) this.deviceUserAgent = fields.deviceUserAgent;
        if (fields.ipAddress) this.ipAddress = fields.ipAddress;
    }
}
