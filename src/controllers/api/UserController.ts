//IF:AUTHENTICATION
import { Body, Context, Controller, Method, Middleware, Route } from '@apollosoftwarexyz/cinnamon';
import * as argon2 from 'argon2';

import { OnlyAuthenticated } from '../../middlewares/Authentication';
import { ValidateBody } from '../../utils/validation';
import { UserDeleteRequestSchema, UserSetAvatarSchema } from '../../schema/requests/user';
import { AppError, toAppError } from '../../schema/errors';
import { Asset, decodeBase64Asset } from '../../models/Asset';

/**
 * User controller.
 *
 * This controller contains the logic necessary to manage users (e.g., update
 * profile information, destroy account, etc.)
 */
@Controller('api', 'user')
export default class UserController {

    /**
     * Update the user's profile picture (avatar).
     *
     * This endpoint accepts a base64-encoded image payload, which is then
     * decoded and stored in the database.
     */
    @Middleware(ValidateBody(UserSetAvatarSchema))
    @Middleware(Body({
        options: {
            limit: '16mb'
        }
    }))
    @Middleware(OnlyAuthenticated)
    @Route(Method.POST, '/avatar')
    public async setAvatar(ctx: Context) {
        const em = ctx.getEntityManager();

        const { avatar } = ctx.request.body;

        // Attempt to decode the base64 image payload.
        let data;
        try {
            data = await decodeBase64Asset(ctx, avatar);
        } catch (ex) {
            return toAppError(
                ctx,
                AppError.invalidRequestBody,
                'The provided image is invalid.'
            );
        }

        // Create a new asset for the user's profile picture.
        const asset = new Asset({
            mimeType: data.mimeType,
            payload: data.imageData,
            owner: ctx.user!
        });

        // Persist the asset to the database, and update the asset's name to
        // include the ID and extension, then persist again.
        await em.persistAndFlush(asset);
        asset.name = `${asset.id}.${data.extension}`;
        await em.persistAndFlush(asset);

        // Update the user's profile picture.
        ctx.user!.avatar = `/api/asset/v1/${asset.type}/${asset.id}`;
        await em.persistAndFlush(ctx.user!);

        // Delete any old profile pictures, now that the new one has been set.
        await em.nativeDelete(Asset, {
            id: { $ne: asset.id },
        });

        return ctx.success({
            message: 'Your profile picture has been updated.'
        });
    }

    /**
     * Delete the user's account.
     *
     * This endpoint requires the user to provide their password, to prevent
     * accidental deletion. The account is then deleted.
     *
     * The user is implicitly logged out because the sessions and any other
     * user-owned assets are cascade-deleted.
     */
    @Middleware(ValidateBody(UserDeleteRequestSchema))
    @Middleware(Body())
    @Middleware(OnlyAuthenticated)
    @Route(Method.DELETE, '/delete')
    public async delete(ctx: Context) {

        const { password } = ctx.request.body;

        // Validate the password.
        if (!await argon2.verify(ctx.user!.password, password)) {
            return toAppError(
                ctx,
                AppError.unauthorized,
                'You did not provide the correct password.'
            );
        }

        // Delete the user.
        await ctx.getEntityManager().removeAndFlush(ctx.user!);
        return ctx.success({
            message: 'You have been logged out and your account has been deleted.'
        });

    }


}
