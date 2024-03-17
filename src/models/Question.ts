import { TrackedBaseEntity } from './BaseEntity';
import { Cascade, Collection, Entity, ManyToOne, OneToMany, Property } from '@mikro-orm/core';
import { Answer } from './Answer';
import { Quiz } from './Quiz';

@Entity({ tableName: 'questions' })
export class Question extends TrackedBaseEntity {

    @ManyToOne({ cascade: [Cascade.PERSIST, Cascade.REMOVE] })
    quiz!: Quiz;

    @Property({ type: 'text'})
    question!: string;

    @OneToMany(() => Answer, answer => answer.question)
    answers = new Collection<Answer>(this);

    constructor(fields: {
        quiz: Quiz;
        question: string;
        answers?: Collection<Answer>;
    }) {
        super();
        this.quiz  = fields.quiz;
        this.question = fields.question;
        if (fields.answers) this.answers = fields.answers;
    }
}
