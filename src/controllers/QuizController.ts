import { Body, Context, Controller, Method, Middleware, Route } from '@apollosoftwarexyz/cinnamon';
import { OnlyAuthenticated } from '../middlewares/Authentication';
import { Quiz } from '../models/Quiz';
import { expr, Collection, wrap } from '@mikro-orm/core';
import { AppError, toAppError } from '../schema/errors';
import { Class } from '../models/Class';
import { Question } from '../models/Question';
import { Answer } from '../models/Answer';

/**
 * Quiz controller.
 */
@Controller('class', ':classId', 'quiz')
export default class QuizController {

    // Add new quiz
    @Middleware(OnlyAuthenticated)
    @Middleware(Body())
    @Route(Method.POST, '')
    public async addQuiz(ctx: Context) {
        const { classId } = ctx.params;
        const {
            name,
            questions,
        } = ctx.request.body as {
            name: string;
            questions: Record<string, any>[];
        };

        console.log(ctx.request.body);

        const quizRepo = ctx.getEntityManager().getRepository(Quiz);

        if (await quizRepo.count({ [expr('lower(name)')]: name.toLowerCase() }) > 0) {
            return toAppError(
                ctx, AppError.conflictingEntity, 'A quiz with that name already exists.'
            );
        }

        const quiz = new Quiz({
            'class': ctx.getEntityManager().getReference(Class, classId),
            name,
        });

        quiz.questions = new Collection<Question>(
            quiz,
            questions.map(rawQuestion => {
                const question = new Question({
                    quiz,
                    question: rawQuestion['question'] as string,
                });

                const rawAnswers = rawQuestion['answers'] as Record<string, any>[];
                question.answers = new Collection<Answer>(
                    question,
                    rawAnswers.map((rawAnswer) => new Answer({
                        question,
                        answer: rawAnswer['answer'],
                        isCorrect: rawAnswer['isCorrect'],
                    }))
                );

                return question;
            })
        );

        await ctx.getEntityManager().persistAndFlush(quiz);

        return ctx.success({
            quiz: await wrap(quiz).populate(['questions', 'questions.answers']),
            message: 'The quiz has been created successfully!'
        });
    }

}
