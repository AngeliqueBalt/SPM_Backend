import { TrackedBaseEntity } from './BaseEntity';
import { Cascade, Collection, Entity, ManyToOne, OneToMany, Property } from '@mikro-orm/core';
import { Question } from './Question';
import { Class } from './Class';

@Entity({ tableName: 'quizzes' })
export class Quiz extends TrackedBaseEntity {

    @ManyToOne({ cascade: [Cascade.PERSIST, Cascade.REMOVE] })
    class!: Class;

    @Property({ type: 'text' })
    name!: string;

    @OneToMany(() => Question, question => question.quiz)
    questions = new Collection<Question>(this);

    constructor(fields: {
        class: Class;
        name: string;
        questions?: Collection<Question>;
    }) {
        super();
        this.class = fields.class;
        this.name = fields.name;
        if (fields.questions) this.questions = fields.questions;
    }

}
