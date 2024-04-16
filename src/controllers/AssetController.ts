import { Context, Controller, LoadIf, Method, Route } from '@apollosoftwarexyz/cinnamon';
import { Asset } from '../models/Asset';
import { AppError, toAppError } from '../schema/errors';

/**
 * Asset controller.
 *
 * This controller contains the logic necessary to retrieve assets from the
 * database.
 */

@Controller('asset', 'v1')
@LoadIf(() => false)
export default class AssetController {

    @Route(Method.GET, '/:type/:id')
    public async getAsset(ctx: Context) {
        const { type, id } = ctx.params;

        const asset = await ctx.getEntityManager().findOne(Asset, {
            id,
            type
        });

        if (!asset) {
            return toAppError(
                ctx,
                AppError.missingEntity,
                'The requested asset could not be found.'
            );
        }

        ctx.response.set('Cache-Control', 'public, max-age=15552000');
        return ctx.successRaw(asset.payload, asset.mimeType);
    }

}
