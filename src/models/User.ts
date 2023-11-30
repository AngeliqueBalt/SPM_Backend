import { Entity, Property } from '@mikro-orm/core';
import { TrackedBaseEntity } from './BaseEntity';

@Entity({ tableName: 'users' })
export class User extends TrackedBaseEntity {

    @Property({ length: 255, unique: true })
    email!: string;

    @Property({ unique: true })
    username!: string;

    @Property({ type: 'text', nullable: true })
    displayName?: string;

    @Property({ persist: false })
    get smartName() {
        return this.displayName ?? `@${this.username}`;
    }

    @Property({ columnType: 'text', nullable: true })
    avatar?: string;

    @Property({ length: 256, hidden: true })
    password!: string;

    @Property()
    isAdmin: boolean = false;

    @Property()
    isTeacher: boolean = false;

    constructor(fields: {
        email: string;
        username: string;
        displayName?: string;
        gender?: string;
        avatar?: string;
        passwordHash: string;
    }) {
        super();

        this.email = fields.email;
        this.username = fields.username;
        this.password = fields.passwordHash;

        if (fields.displayName) this.displayName = fields.displayName;
        if (fields.avatar) this.avatar = fields.avatar;
    }
}
