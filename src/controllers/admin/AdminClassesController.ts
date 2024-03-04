import { Body, Context, Controller, Method, Middleware, Route } from '@apollosoftwarexyz/cinnamon';
import { OnlyAdmin } from '../../utils/admin';
import { Class } from '../../models/Class';
import { AppError, toAppError } from '../../schema/errors';
import { expr, wrap } from '@mikro-orm/core';
import { User } from '../../models/User';

/**
 * Classes controller.
 */
@Controller('admin', 'classes')
export default class AdminClassesController {

    // Get all classes
    @Middleware(OnlyAdmin)
    @Route(Method.GET, '')
    public async get(ctx: Context) {
        return await ctx.getEntityManager().find(Class, {}, {populate: ["teacher", "students"]});
    }

    // Add new class
    @Middleware(OnlyAdmin)
    @Middleware(Body())
    @Route(Method.POST, '')
    public async addClass (ctx: Context) {
        const {
                name,
                teacher,
                students,
        } = ctx.request.body;

        const classRepo = ctx.getEntityManager().getRepository(Class);
        const userRepo = ctx.getEntityManager().getRepository(User);

        if (await classRepo.count({ [expr('lower(name)')]: name.toLowerCase() }) > 0) {
            return toAppError(
                ctx, AppError.conflictingEntity, 'A class with that name already exists.'
            );
        }

        const clazz = new Class( {
            name,
            teacher,
            students: students.map((student: any) => userRepo.getReference(student))
        });

        await ctx.getEntityManager().persistAndFlush(clazz);

        return ctx.success({
            class: await wrap(clazz).populate(["teacher", "students"]),
            message: 'The class has been created successfully!'
        });
    }

    // Remove a class
    @Middleware(OnlyAdmin)
    @Route(Method.DELETE, '/:id')
    public async removeClass (ctx: Context) {
        const { id } = ctx.params;

        const em = ctx.getEntityManager();

        const clazz = em.getReference(Class, id);
        await em.remove(clazz).flush();

        // Now, return the user and session to the client.
        return ctx.success({
            user: wrap(clazz),
            message: 'The class has been removed successfully!'
        });
    }

    // Edit a class
    @Middleware(OnlyAdmin)
    @Middleware(Body())
    @Route(Method.PATCH, '/:id')
    public async editClass(ctx: Context) {
        const {
                name,
                teacher,
                students,
        } = ctx.request.body;

        const userRepo = ctx.getEntityManager().getRepository(User);

        const { id } = ctx.params;

        const em = ctx.getEntityManager();

        const clazz = await em.findOne(Class, id);

        if (!clazz) {
            return toAppError(
                ctx,
                AppError.conflictingEntity,
                'This class does not exist.'
            );
        }

        clazz.name = name;
        clazz.teacher = teacher;
        clazz.students = students.map((student: any) => userRepo.getReference(student));

        await ctx.getEntityManager().persistAndFlush(clazz);

        // Now, return the user and session to the client.
        return ctx.success({
            class: await wrap(clazz).populate(["teacher", "students"]),
            message: 'The class has been updated successfully!'
        });
    }
}
