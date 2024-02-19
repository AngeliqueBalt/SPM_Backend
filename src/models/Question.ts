import { TrackedBaseEntity } from './BaseEntity';
import { Collection, Entity, ManyToOne, OneToMany, Property } from '@mikro-orm/core';
import { Answer } from './Answer';
import { Quiz } from './Quiz';

@Entity({ tableName: 'questions' })
export class Question extends TrackedBaseEntity {

    @ManyToOne()
    quiz!: Quiz;

    @Property({ type: 'text'})
    question!: string;

    @OneToMany(() => Answer, answer => answer.question)
    answer = new Collection<Answer>(this);

}
