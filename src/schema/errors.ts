import { Context } from '@apollosoftwarexyz/cinnamon';

export const AppError = {

    /**
     * Any unexpected errors that are not better described by the other error codes.
     * (Use for exceptional circumstances, such as a database connection failure.)
     */
    unexpected:                     { code: 500, error: 'ERR_UNEXPECTED_APP_ERROR' },

    /**
     * The request failed for an unknown reason.
     * (Use for exceptional circumstances, such as a socket closing unexpectedly.)
     * (This might be better described by unexpected in most foreseeable cases, as this
     * error code is intended exclusively for unexpected errors that occur during the
     * request lifecycle.)
     */
    requestFailure:                 { code: 400, error: 'ERR_REQUEST_FAILURE' },

    /**
     * The request body was invalid.
     * (Use when the error is not better described by another error code.)
     */
    invalidRequestBody:             { code: 400, error: 'ERR_INVALID_REQUEST_BODY' },

    /**
     * The user is not authenticated.
     *
     * This error code is used when the user is not authenticated, but the request
     * requires authentication.
     */
    unauthenticated:                { code: 401, error: 'ERR_UNAUTHENTICATED' },

    /**
     * The request was unauthorized.
     *
     * This error code is used when the user is authenticated, but still not
     * authorized to perform the requested action (or regardless of whether the user
     * is authenticated, would not be permitted to perform the requested action).
     */
    unauthorized:                   { code: 403, error: 'ERR_UNAUTHORIZED' },

    /**
     * The request was for an entity that does not exist.
     *
     * Alternatively, some aspect of the request was invalid because it referenced
     * an entity or concept that does not exist.
     *
     * Common examples include referencing a user that does not exist, or a
     * conversation that does not exist.
     */
    missingEntity:                  { code: 404, error: 'ERR_MISSING_ENTITY' },

    /**
     * The request, whilst for an entity or endpoint that does exist, referenced an
     * entity or concept that does not.
     *
     * Common examples include assigning a message to a conversation that does not
     * exist, or an enum value that is invalid.
     */
    unknownEntityReference:         { code: 400, error: 'ERR_UNKNOWN_ENTITY_REFERENCE' },

    /**
     * The request was to create an entity that already exists.
     *
     * Alternatively, some aspect of the request was invalid because it referenced
     * an ambiguous entity or concept.
     *
     * Common examples include attempting to create a user with a username that
     * already exists, or a direct message conversation between two users that
     * already have one.
     */
    conflictingEntity:              { code: 409, error: 'ERR_CONFLICTING_ENTITY' },
};

export async function toAppError(ctx: Context, error: {code: number, error: string}, message?: string) {
    return ctx.error(error.code, error.error, message);
}
