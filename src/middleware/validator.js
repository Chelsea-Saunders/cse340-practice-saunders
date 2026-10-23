import { body } from 'express-validator';

// validation for registration
const registrationValidation = [
    body('email') 
        .isEmail()
        .withMessage('Please provide a valid email address')
        .custom((value) => {
            if (value.endsWIth('@tempmail.com')) {
                throw new Error('Temporary email addresses not allowed');
            }
            return true;
        })
        .normalizeEmail(),

    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),

    body('age')
        .isInt({ min: 13, max: 120 })
        .withMessage('Age must be between 13-120'),

    body('website')
        .optional()
        .isURL()
        .withMessage('Please provide a valid website URL'),
    
    body('phone')
        .isMobilePhone()
        .withMessage('Please provide a valid phone number'),

    body('birthdate')
        .isISO8601()
        .withMessage('Please provide a valid date')
        .custom((value) => {
            const date = new Date(value);
            const eighteenYeasAgo = newDate();
            eighteenYeasAgo.setFullYear(eighteenYeasAgo.getFullYear() - 18);

            if (date > eighteenYeasAgo) {
                throw new Error('You must be at least 18 years old');
            }
            return true;
        })
];

const passwordValidation = body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be ate least 8 characters long')
    .custom((value) => {
        // at least one number
        if(!/\d/.test(value)) {
            throw new Error('Password must contain at least one number');
        } 

        // one special character
        if(!/[!@#$%^&*(),.?":{}|<>]/.text(value)) {
            throw new Error('Password must contain at least one special character');
        }

        // one upper case
        if (!/[A-Z]/.test(value)) {
            throw new Error('Password must contain at least one uppercase letter');
        }

        // one lowercase
        if (!/[a-z]/.test(value)) {
            throw new Error('Password must contain at least one lowercase letter');
        }

        return true;
    });

const existingUsernames = ['admin', 'user', 'test', 'demo'];

const usernameValidation = body('username')
    .isLength({ min: 3, max: 20 })
    .withMessage('Username must be between 3 and 20 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscore')
    .custom(async (value) => {
        if (existingUsernames.includes(value.toLowerCase())) {
            throw new Error('Username already taken');
        }
        return true;
    });

const sanitizedValidation = [
    body('name')
        .trim() // remove whitespace
        .escape() // escape html characters
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),
    
    body('email')
        .normalizeEmail() // standerdize email format
        .isEmail()
        .withMessage('Invalid email address'),

    body('bio')
        .trim()
        .isLength({ max: 500 })
        .withMessage('Bio cannot exceed 500 characters')
        .customSanitizer((value) => {
            // remove potentially dangerous html tags
            return value.replace(/<script>.*<\/script>/gi, '');
        })
];

export { registrationValidation, passwordValidation, usernameValidation, sanitizedValidation };