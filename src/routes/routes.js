// IMPORTS
import { Router } from 'express';
import { addDemoHeaders, trackDemoPage } from '../middleware/demo/headers.js';
import { catalogPage, courseDetailPage, departmentsPage } from '../controllers/catalog/catalog.js';
import { homePage, aboutPage, demoPage, testErrorPage } from '../controllers/index.js';
import { facultyListPage, facultyDetailPage } from '../controllers/faculty/faculty.js';
import contactRoutes from '../controllers/forms/contact.js';
import registrationRoutes from '../controllers/forms/registration.js';
import loginRoutes from '../controllers/forms/login.js';
import { processLogout, showDashboard } from '../controllers/forms/login.js';
import { requireLogin } from '../middleware/auth.js';
import { registrationValidation } from '../middleware/validator.js';
import { registerUser } from '../controllers/validator/auth.js';

const router = Router();

// Routing middleware (before route definitions)
// main styles
router.use((req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/main.css">', 100);
    next();
});

// LOGIN SPECIFIC STYLES
router.use('/login', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/login.css">');
    next();
});
//LOGIN ROUTES (FORM AND SUBMISSION)
router.use('/login', loginRoutes);

// Authentication-related routes at root level
router.get('/logout', processLogout);
router.get('/dashboard', requireLogin, showDashboard);

//catalog styles
router.use('/catalog', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/catalog.css">');
    next();
});

// faculty styles
router.use('/faculty', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/faculty.css">');
    next();
});

//Add contact-specific styles to all contact routes
router.use('/contact', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/contact.css">');
    next();
});

// Registration-specific styles to all registration routes
router.use('/register', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/registration.css">');
    next();
});

router.use('/contact', contactRoutes);

// Registration routes
router.use('/register', registrationRoutes);

// POST /register
router.post('/register', registrationValidation, registerUser);
// router.post('/login', loginUser);
// router.post('/logout', logoutUser);


// BASIC PAGES
router.get('/', homePage);
router.get('/about', aboutPage);
router.get('/faculty', facultyListPage);
router.get('/faculty/:slug', facultyDetailPage);

//COURSE CATALOG
router.get('/catalog', catalogPage);
router.get('/catalog/:slugId', courseDetailPage);
router.get('/departments', departmentsPage);

// DEMO PAGE WITH ROUTE MIDDLEWARE
router.get('/demo', trackDemoPage, addDemoHeaders, demoPage);

//TEST ERRORS ROUTE
router.get('/test-error', testErrorPage);

export default router;