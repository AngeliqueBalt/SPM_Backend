import { ValidationSchema } from '@apollosoftwarexyz/cinnamon-validator';
import { BASE64_IMAGE_REGEX } from '../../utils/validation';

export const UserSetAvatarSchema: ValidationSchema = {
    'avatar': {
        type: 'string',
        required: true,
        matches: BASE64_IMAGE_REGEX
    }
};

export const UserDeleteRequestSchema: ValidationSchema = {
    'password': {
        type: 'string',
        required: true,
        minLength: 8,
        maxLength: 100
    }
};
