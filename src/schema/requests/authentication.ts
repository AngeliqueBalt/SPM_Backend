import { ValidationSchema } from '@apollosoftwarexyz/cinnamon-validator';
import { EMAIL_REGEX, ID_NUMBER_REGEX, USERNAME_REGEX } from '../../utils/validation';
import { UserType } from '../../models/User';

export const LoginRequestSchema: ValidationSchema = {
    // (username or email)
    'email': {
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
        'name': {
            type: 'string',
            required: true,
            minLength: 1,
            maxLength: 255,
        },
        'email': {
            type: 'string',
            required: true,
            minLength: 6,
            maxLength: 255,
            matches: EMAIL_REGEX
        },
        'idNumber': {
            type: 'string',
            required: false,
            maxLength: 16,
            matches: ID_NUMBER_REGEX
        },
        'userType': {
            type: 'string',
            required: true,
            equals: Object.values(UserType)
        }
    },
    'password': {
        type: 'string',
        required: true,
        minLength: 8,
        maxLength: 100
    }
};
