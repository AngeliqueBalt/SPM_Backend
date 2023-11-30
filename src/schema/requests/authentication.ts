import { ValidationSchema } from '@apollosoftwarexyz/cinnamon-validator';
import { EMAIL_REGEX, USERNAME_REGEX } from '../../utils/validation';

export const LoginRequestSchema: ValidationSchema = {
    // (username or email)
    'username': {
        type: 'string',
        required: true,
        minLength: 3,
        maxLength: 255
    },
    'password': {
        type: 'string',
        required: true,
        minLength: 8,
        maxLength: 100
    },
};

export const CreateAccountRequestSchema: ValidationSchema = {
    'user': {
        'email': {
            type: 'string',
            required: true,
            minLength: 6,
            maxLength: 255,
            matches: EMAIL_REGEX
        },
        'username': {
            type: 'string',
            required: true,
            minLength: 3,
            maxLength: 32,
            matches: USERNAME_REGEX
        },
    },
    'password': {
        type: 'string',
        required: true,
        minLength: 8,
        maxLength: 100
    },
};
