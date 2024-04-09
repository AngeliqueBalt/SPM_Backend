import { Quiz } from '../../models/Quiz';
import { Factory, Faker } from '@mikro-orm/seeder';
import { Class } from '../../models/Class';
import { EntityData, EntityManager } from '@mikro-orm/core';

export class QuizFactory extends Factory<Quiz> {
    model = Quiz;

    private readonly clazz: Class;

    constructor(em: EntityManager, clazz: Class) {
        super(em);
        this.clazz = clazz;
    }

    protected definition(faker: Faker): EntityData<Quiz> {
        return {
            name: `${faker.helpers.unique(faker.color.human)} Quiz`,
            class: this.clazz,
            questions: this.makeQuestions(10),
        };
    }

    private makeQuestions(count: number) {
        const question = {
            question: 'Which of these is correct?',
            answers: [
                { answer: 'correct', isCorrect: true },
                { answer: 'incorrect', isCorrect: false },
                { answer: 'incorrect', isCorrect: false },
                { answer: 'incorrect', isCorrect: false },
            ]
        };

        let questions = [];
        for (let i = 0; i < count; i++) {
            questions.push(question);
        }

        return questions;
    }
}
