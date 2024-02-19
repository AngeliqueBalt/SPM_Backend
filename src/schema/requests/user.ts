import { ValidationSchema } from '@apollosoftwarexyz/cinnamon-validator';

export const UserDeleteRequestSchema: ValidationSchema = {
    'password': {
        type: 'string',
        required: true,
        minLength: 8,
        maxLength: 100
    }
};
