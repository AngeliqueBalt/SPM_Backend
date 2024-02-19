import { TrackedBaseEntity } from './BaseEntity';
import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { Question } from './Question';

@Entity({ tableName: 'answers' })
export class Answer extends TrackedBaseEntity {

    @ManyToOne()
    question!: Question;

    @Property({ type: 'text' })
    answer!: string;

    @Property()
    isCorrect!: boolean;

}
