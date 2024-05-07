import { Factory, Faker } from '@mikro-orm/seeder';
import { EntityData, EntityManager } from '@mikro-orm/core';
import { QuizSubmission } from '../../models/QuizSubmission';
import { Quiz } from '../../models/Quiz';

import { Skew, hybridWeightedRandomDouble } from '../utils/random';

export class QuizSubmissionFactory extends Factory<QuizSubmission> {
    model = QuizSubmission;

    private readonly quiz: Quiz;
    private readonly skew?: Skew;

    constructor(em: EntityManager, quiz: Quiz, skew?: Skew) {
        super(em);
        this.quiz = quiz;
        this.skew = skew;
    }

    protected definition(faker: Faker): EntityData<QuizSubmission> {
        let score = Math.round(hybridWeightedRandomDouble() * 10) * 10;

        return {
            quiz: this.quiz,
            class: this.quiz.class,
            submitted: new Date(),
            score,
        };
    }
}
