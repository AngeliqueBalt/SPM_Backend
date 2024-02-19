import { TrackedBaseEntity } from './BaseEntity';
import { Collection, Entity, ManyToOne, OneToMany, Property } from '@mikro-orm/core';
import { Question } from './Question';
import { Class } from './Class';

@Entity({ tableName: 'quizzes' })
export class Quiz extends TrackedBaseEntity {

    @ManyToOne()
    class!: Class;

    @Property({ type: 'text' })
    name!: string;

    @OneToMany(() => Question, question => question.quiz)
    questions = new Collection<Question>(this);

}
