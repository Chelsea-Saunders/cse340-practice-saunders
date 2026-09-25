// IMPORTS
import { Router } from 'express';
import { addDemoHeaders, trackDemoPage } from '../middleware/demo/headers.js';
import { catalogPage, courseDetailPage } from './catalog/catalog.js';
import { homePage, aboutPage, demoPage, testErrorPage } from './index.js';

const router = Router();

// BASIC PAGES
router.get('/', homePage);
router.get('/about', aboutPage);

//COURSE CATALOG
router.get('/catalog', catalogPage);
router.get('/catalog/:courseId', courseDetailPage);

// DEMO PAGE WITH ROUTE MIDDLEWARE
router.get('/demo', trackDemoPage, addDemoHeaders, demoPage);

//TEST ERRORS ROUTE
router.get('/test-error', testErrorPage);

export default router;