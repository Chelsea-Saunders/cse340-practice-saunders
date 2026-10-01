// IMPORTS
import { Router } from 'express';
import { addDemoHeaders, trackDemoPage } from '../middleware/demo/headers.js';
import { catalogPage, courseDetailPage, departmentsPage } from './catalog/catalog.js';
import { homePage, aboutPage, demoPage, testErrorPage } from './index.js';
import { facultyListPage, facultyDetailPage } from './faculty/faculty.js';

const router = Router();

// BASIC PAGES
router.get('/', homePage);
router.get('/about', aboutPage);
router.get('/faculty', facultyListPage);

//COURSE CATALOG
router.get('/catalog', catalogPage);
router.get('/catalog/:courseId', courseDetailPage);
router.get('/departments', departmentsPage);

// DEMO PAGE WITH ROUTE MIDDLEWARE
router.get('/demo', trackDemoPage, addDemoHeaders, demoPage);

// FACULTY PAGE
router.get('/faculty/:facultyId', facultyDetailPage);

//TEST ERRORS ROUTE
router.get('/test-error', testErrorPage);

export default router;

//FOR FACULTY-DIRECTORY: 
// Update your src/routes.js file to include the faculty routes:
// Import your faculty controllers
// Add a /faculty route for the faculty list
// Add a /faculty/:facultyId route for individual faculty details