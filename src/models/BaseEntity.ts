import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

/**
 * Defines a set of base properties that are common to the majority of
 * entities.
 */
@Entity({ abstract: true })
export class BaseEntity {

    @PrimaryKey({
        type: 'uuid',
        columnType: 'uuid',
        defaultRaw: `gen_random_uuid()`,
    })
    id!: string;

}

/**
 * Similar to `BaseEntity`, however this class also tracks certain
 * events that occur to the entity (such as when it was created, or
 * when it was last updated).
 */
@Entity({ abstract: true })
export abstract class TrackedBaseEntity extends BaseEntity {

    @Property()
    createdAt: Date = new Date();

    @Property({ onUpdate: () => new Date() })
    updatedAt: Date = new Date();

}
