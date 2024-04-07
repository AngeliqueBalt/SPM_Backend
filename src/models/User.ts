import { Cascade, Collection, Entity, Enum, ManyToMany, ManyToOne, OneToMany, Property } from '@mikro-orm/core';
import { TrackedBaseEntity } from './BaseEntity';
import { Class } from './Class';

export enum UserType {
    admin = "admin",
    teacher = "teacher",
    student = "student",
}

@Entity({ tableName: 'users' })
export class User extends TrackedBaseEntity {

    @Property({ type: 'text' })
    name!: string;

    @Property({ length: 255, unique: true })
    email!: string;

    @Property({ length: 16, columnType: "varchar" })
    idNumber?: string;

    @Property({ length: 256, hidden: true })
    password!: string;

    @Enum(() => UserType)
    userType!: UserType;

    @OneToMany(() => Class, clazz => clazz.teacher)
    teachingClasses = new Collection<Class>(this);

    constructor(fields: {
        email: string;
        name: string;
        idNumber?: string;
        passwordHash: string;
        userType: UserType;
    }) {
        super();

        this.name = fields.name;
        this.email = fields.email;
        this.password = fields.passwordHash;
        this.userType = fields.userType;

        if (fields.idNumber) this.idNumber = fields.idNumber;
    }
}
