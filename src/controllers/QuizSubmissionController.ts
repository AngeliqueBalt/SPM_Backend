import { Body, Context, Controller, Method, Middleware, Route } from '@apollosoftwarexyz/cinnamon';
import { OnlyAuthenticated } from '../middlewares/Authentication';
import { wrap } from '@mikro-orm/core';
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
    public async newSubmission (ctx: Context) {
        const { quizId } = ctx.params;
        const { score } = ctx.request.body;

        const submission = await ctx.getEntityManager().upsert(QuizSubmission, {
            submitted: new Date(),
            quiz: quizId,
            student: ctx.user!,
            score,
        });

        return ctx.success({
            submission: await wrap(submission).populate(["student", "quiz"]),
            message: 'The quiz submission was create successfully!'
        });
    }

    // Get submission for current user
    @Route(Method.GET, '')
    public async getSubmissions (ctx: Context) {
        // const { quizId } = ctx.params;
        return ctx.getEntityManager().find(QuizSubmission, {}, {populate: ["score", "student", "quiz"]})
    }


}
