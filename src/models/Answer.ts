import { TrackedBaseEntity } from './BaseEntity';
import { Cascade, Entity, ManyToOne, Property } from '@mikro-orm/core';
import { Question } from './Question';

@Entity({ tableName: 'answers' })
export class Answer extends TrackedBaseEntity {

    @ManyToOne({ cascade: [Cascade.PERSIST, Cascade.REMOVE] })
    question!: Question;

    @Property({ type: 'text' })
    answer!: string;

    @Property()
    isCorrect!: boolean;

    constructor(fields: {
        question: Question;
        answer: string;
        isCorrect: boolean;
    }) {
        super();
        this.question = fields.question;
        this.answer = fields.answer;
        this.isCorrect = fields.isCorrect;
    }
}
