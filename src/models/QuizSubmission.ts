import { Cascade, Entity, ManyToOne, PrimaryKeyProp, Property } from '@mikro-orm/core';
import { Quiz } from './Quiz';
import { User } from './User';
import { Class } from './Class';

@Entity({ tableName: 'quiz_submissions' })
export class QuizSubmission {

    @ManyToOne({ cascade: [Cascade.REMOVE], primary: true })
    quiz!: Quiz;

    @Property({ persist: false, getter: true })
    get class(): Class { return this.quiz.class; }

    @ManyToOne({ cascade: [Cascade.REMOVE], primary: true })
    student!: User;

    @Property()
    submitted: Date = new Date();

    @Property({ type: 'integer' })
    score!: number;

    [PrimaryKeyProp]?: ['quiz', 'student'];

    constructor(fields: {
        quiz: Quiz;
        student: User;
        score: number;
    }) {
        this.quiz = fields.quiz;
        this.student = fields.student;
        this.score = fields.score;
    }
}
