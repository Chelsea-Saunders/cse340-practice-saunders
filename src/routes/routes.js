// IMPORTS
import { Router } from 'express';
import { addDemoHeaders, trackDemoPage } from '../middleware/demo/headers.js';
import { catalogPage, courseDetailPage, departmentsPage } from '../controllers/catalog/catalog.js';
import { homePage, aboutPage, demoPage, testErrorPage } from '../controllers/index.js';
import { facultyListPage, facultyDetailPage } from '../controllers/faculty/faculty.js';

const router = Router();

// Routing middleware (before route definitions)
// main styles
router.use((req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/main.css">', 100);
    next();
});

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