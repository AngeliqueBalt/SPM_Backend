import { Cascade, Entity, ManyToOne, PrimaryKey, PrimaryKeyProp, Property } from '@mikro-orm/core';
import { TrackedBaseEntity } from './BaseEntity';
import { Quiz } from './Quiz';
import { User } from './User';

@Entity({ tableName: 'quiz_submissions' })
export class QuizSubmission {

    @ManyToOne({ cascade: [Cascade.REMOVE], primary: true })
    quiz!: Quiz;

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
