import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import { emailExists, saveUser, getAllUsers } from '../../models/forms/registration.js';

const router = Router();


/**
 * Validation rules for registration
 */

const registrationValidation = [
    body('name')
        .trim()
        .isLength({ min: 2 })
        .withMessage('Name must be at least 2 characters'),
    body('email')
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('Must be a valid email address'),
    body('emailConfirm')
        .trim()
        .custom((value, { req }) => value === req.body.email)
        .withMessage('Email address must match'),
    body('password')
        .isLength({ min: 8 })
        .matches(/[0-9]/)
        .withMessage('Password must contain at least one number')
        .matches(/[!@#$%^&*]/)
        .withMessage('Password must contain at least one special character (/[!@#$%^&*]/)'),
    body('passwordConfirm')
        .custom((value, { req }) => value === req.body.password)
        .withMessage('Passwords must match')
        
];

/**
 * Display registration form page
 */

const showRegistrationForm = (req, res) => {
    res.render('forms/registration/form', {
        title: 'User Registration'
    });
};

const processRegistration = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log('Validation errors:', errors.array().map(e => e.msg));
        res.redirect('/register');
        return;
    }

    const { name, email, password } = req.body;

    try {
        const alreadyRegistered = await emailExists(email);

        if (alreadyRegistered) {
            console.log(`Email ${email} already registered`);
            res.redirect('/register');
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        await saveUser(name, email, hashedPassword);

        console.log(`User: ${email} successfully registered`);
        res.redirect('/register/list');
        // later when we add authentication, we'll change this to require login first
    } catch (error) {
        console.error('Error during registration:', error.stack);
        res.redirect('/register');
    }
};

/**
 * display all registered users
 */

const showAllUsers = async (req, res) => {
    let users = [];

    try {
        users = await getAllUsers();
    } catch (error) {
        console.error(`Error: ${error} occured while trying to retrieve users`);
    }

    res.render('forms/registration/list', {
        title: 'Registered Users', 
        users
    });
};


/** 
 * GET /register - Display the registration from
 */
router.get('/', showRegistrationForm);

/**
 * POST /register - Handle registration form submission with validation
 */
router.post('/', registrationValidation, processRegistration);

/**
 * GET /register/list - display all registered users
 */
router.get('/list', showAllUsers);

export default router;