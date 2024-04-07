import { Context, Controller, Method, Middleware, Route } from '@apollosoftwarexyz/cinnamon';
import { QuizSubmission } from '../models/QuizSubmission';
import { OnlyAuthenticated } from '../middlewares/Authentication';
import { anonymise, bucketise } from '../domain/privacy';
import { Quiz } from '../models/Quiz';
import { AppError, toAppError } from '../schema/errors';


/**
 * Report controller.
 */
@Controller('report')
export default class ReportController {
    // number of scores per bucket
    private static readonly k = 3;

    // get list of scores submitted for quiz based on quiz id
    // and return an array of scores
    @Middleware(OnlyAuthenticated)
    @Route(Method.GET,'quiz/:quizId')
    public async getScores (ctx: Context) {
        const { quizId } = ctx.params;

        if (await ctx.getEntityManager().findOne(Quiz, quizId)) {
            const submissions = await ctx.getEntityManager().find(QuizSubmission, {quiz: quizId});
            if (submissions.length === 0) {
                return ctx.success(null);
            }
            const scoreList = submissions.map((submission: QuizSubmission) => submission.score);
            return { buckets: anonymise(bucketise(scoreList, ReportController.k)) };
        } else {
            return toAppError(ctx, AppError.missingEntity, `A quiz with ID ${quizId} does not exist.`);
        }

    }

}
