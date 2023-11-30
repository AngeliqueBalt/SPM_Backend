import { Context, Next } from '@apollosoftwarexyz/cinnamon';
import { ValidationSchema, Validator } from '@apollosoftwarexyz/cinnamon-validator';
import { AppError, toAppError } from '../schema/errors';

const uuidRegEx =
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;

export const USERNAME_REGEX =
    /^[a-zA-Z0-9_.]+$/;

export const EMAIL_REGEX =
    // eslint-disable-next-line no-control-regex
    /^(?:[a-z\d!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z\d!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z\d](?:[a-z\d-]*[a-z\d])?\.)+[a-z\d](?:[a-z\d-]*[a-z\d])?|\[(?:(?:(2(5[0-5]|[0-4]\d)|1\d\d|[1-9]?\d))\.){3}(?:(2(5[0-5]|[0-4]\d)|1\d\d|[1-9]?\d)|[a-z\d-]*[a-z\d]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)])$/;

export const BASE64_IMAGE_REGEX =
    /^data:image\/[a-z]+;base64,/;

/**
 * Checks if the specified value is a UUID.
 * @param value The value to check.
 * @returns True if the value is a valid UUID, otherwise false.
 */
export function isValidUUID(value: string): boolean {
    return uuidRegEx.test(value);
}

export const ValidateBody = (schema: ValidationSchema) => {
    // Initialize the validator.
    // We initialize this validator here so that we can reuse it for every request
    // that uses this middleware. (This is more efficient than creating a new
    // validator for every request.)
    const validator = new Validator(schema);

    // Return a curried middleware function.
    // This middleware function will validate the request body against the
    // specified schema with the validator initialized above.
    return async (ctx: Context, next: Next) => {
        // Attempt to validate the request body.
        const [result, payload] = validator.validate(ctx.request.body);
        // Return the parsed payload via ctx.request.body (will be undefined if
        // validation fails).
        ctx.request.body = payload;

        // If validation fails, throw an error and do not call next().
        if (!result.success) {
            return toAppError(ctx, AppError.invalidRequestBody, result.message);
        }

        // If the validation was successful, call next() to permit the request to
        // continue.
        return next();
    };
};
