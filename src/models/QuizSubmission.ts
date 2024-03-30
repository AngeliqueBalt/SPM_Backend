import { Cascade, Entity, ManyToOne, Property } from '@mikro-orm/core';
import { TrackedBaseEntity } from './BaseEntity';
import { Quiz } from './Quiz';
import { User } from './User';

@Entity({tableName: 'quiz_submissions'})
export class QuizSubmission extends TrackedBaseEntity {

    @ManyToOne({ cascade: [Cascade.REMOVE] })
    quiz!: Quiz;

    @ManyToOne({ cascade: [Cascade.REMOVE] })
    student!: User;

    @Property({type: 'integer'})
    totalCorrect!: number;

    @Property({type: 'integer'})
    totalQuestions!: number;

    constructor(fields: {
        quiz: Quiz;
        student: User;
        totalCorrect: number;
        totalQuestions: number;
    }) {
        super();
        this.quiz = fields.quiz;
        this.student = fields.student;
        this.totalCorrect = fields.totalCorrect;
        this.totalQuestions = fields.totalQuestions;
    }
}
