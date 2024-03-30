import { Body, Context, Controller, Method, Middleware, Route } from '@apollosoftwarexyz/cinnamon';
import { OnlyAuthenticated } from '../middlewares/Authentication';
import { Class } from '../models/Class';
import { User } from '../models/User';
import UserController from './UserController';
import { Quiz } from '../models/Quiz';
import { wrap } from '@mikro-orm/core';
import { AppError, toAppError } from '../schema/errors';

/**
 * Classes controller.
 */
@Controller('class', ':classId')
export default class Classes {

    @Middleware(OnlyAuthenticated)
    @Route(Method.GET, '/quizzes')
    public async getQuizzes (ctx: Context) {
        const { classId } = ctx.params;
        return await ctx.getEntityManager().find(Quiz, {class: classId}, {populate: ["questions", "questions.answers"]});
    }

    // Get active quiz
    @Middleware(OnlyAuthenticated)
    @Route(Method.GET, '/activeQuiz')
    public async getActiveQuiz(ctx: Context) {
        const { classId } = ctx.params;
        return (await ctx.getEntityManager().findOne(Class, {id: classId}, {populate: ["activeQuiz", "activeQuiz.questions", "activeQuiz.questions.answers"]}))?.activeQuiz;
    }

    // Activate quiz
    @Middleware(OnlyAuthenticated)
    @Middleware(Body())
    @Route(Method.PUT, '/activeQuiz')
    public async setActiveQuiz(ctx: Context) {
        // TODO: put current quiz id as active quiz id in the current class
        const {
            activeQuiz,
        } = ctx.request.body

        const { classId } = ctx.params;

        const clazz = await ctx.getEntityManager().findOne(Class, { id: classId });

        if (!clazz) {
            return toAppError(
                ctx,
                AppError.unknownEntityReference,
                'This class does not exist.'
            );
        }

        clazz.activeQuiz = activeQuiz;

        await ctx.getEntityManager().flush();
        await ctx.getEntityManager().populate(clazz, ["teacher", "students","activeQuiz" ,"activeQuiz.questions", "activeQuiz.questions.answers"])

        return ctx.success({
            clazz: clazz,
            message: 'The quiz was successfully set to active'
        });

    }

}
