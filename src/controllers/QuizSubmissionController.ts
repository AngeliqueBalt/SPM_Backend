import { Body, Context, Controller, Method, Middleware, Route } from '@apollosoftwarexyz/cinnamon';
import { OnlyAuthenticated } from '../middlewares/Authentication';
import { serialize } from '@mikro-orm/core';
import { QuizSubmission } from '../models/QuizSubmission';

/**
 * Submission controller.
 */
@Controller('class', ':classId', 'quiz', ':quizId', 'submission')
export default class QuizSubmissionController {
    // New quiz submission
    @Middleware(OnlyAuthenticated)
    @Middleware(Body())
    @Route(Method.POST, '')
    public async newSubmission(ctx: Context) {
        const { quizId } = ctx.params;
        const { score } = ctx.request.body;

        const submission = await ctx.getEntityManager().upsert(QuizSubmission, {
            submitted: new Date(),
            quiz: quizId,
            student: ctx.user!,
            score,
        });

        return ctx.success({
            submission: serialize(await ctx.getEntityManager().populate(submission, ['quiz.class']), { forceObject: false }),
            message: 'The quiz submission was create successfully!'
        });
    }

}
