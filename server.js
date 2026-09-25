// IMPORTS
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

/**
 * VARIABLES
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let demoPageCount = 0;

/**
 * EXPRESS (Server Setup) / MIDDLEWARE
 */
// Create an instance of an Express application
const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'production';

app.use((req, res, next) => {
    //make NODE_ENV available to all templates
    res.locals.NODE_ENV = NODE_ENV.toLowerCase() || 'production';
    //continue to next middleware or route handler
    next();
});
app.use(express.static(path.join(__dirname, 'public'))); // tells Epxress, any code in public directory should be accessible through your website
//set EJS as templating engine
app.set('view engine', 'ejs');
//tell Espress where to find your templates
app.set('views', path.join(__dirname, 'src/views'));

app.use((req, res, next) => {
    // Skip logging for routes that start with /. (like /.well-known/)
    if (!req.path.startsWith('/.')) {
        console.log(`${req.method} ${req.url}`);
    }
    next(); // Pass control to the next middleware or route
});

// Middleware to add global data to all templates
app.use((req, res, next) => {
    res.locals.NODE_ENV = NODE_ENV.toLowerCase() || 'production';
    // Add current year for copyright
    res.locals.currentYear = new Date().getFullYear();

    next();
});

// Global middleware for time-based greeting (week 3)
app.use((req, res, next) => {
    const currentHour = new Date().getHours();

   if (currentHour < 12) {
    res.locals.greeting = `Good morning, it's ${currentHour} hundred hour in the morning!`;
   } else if (currentHour < 17) {
    res.locals.greeting = `Good afternoon, it's currently ${currentHour} hundred hour in the afternoon.`;
   } else {
    res.locals.greeting = `At ${currentHour} hundred hour, it's going to be a great evening!!`;
   }

    next();
});

//Seasonal greeting
// app.use((req, res, next) => {
//     const currentSeason = new Date().getMonth();

//     if (currentSeason === 1) {
//         res.locals.greeting = `Happy New Year!`;
//     } else if (currentSeason === 2) {
//         res.locals.greeting = `Happy Valentines Day!`;
//     } else if (currentSeason === 3) {
//         res.locals.greeting = `Happy Spring!!`;
//     } else if (currentSeason === 4) {
//         res.locals.greeting = `Happy Easter Season`;
//     }else if (currentSeason === 5) {
//         res.locals.greeting = `Happy Memorial day!`;
//     } else if (currentSeason === 6) {
//         res.locals.greeting = `Enjoy the Summer!!`;
//     } else if (currentSeason === 7) {
//         res.locals.greeting = `Happy Fourth of July`;
//     } else if (currentSeason === 8) {
//         res.locals.greeting = `Back to School Season!`;
//     } else if (currentSeason === 9) {
//         res.locals.greeting = `Enjoy your Labor Day break!`;
//     } else if (currentSeason === 10) {
//         res.locals.greeting = `Happy Halloween`;
//     } else if (currentSeason === 12) {
//         res.locals.greeting = `Happy Thanksgiving Season`;
//     } else {
//         res.locals.greeting = `Merry Christmas`;
//     }

//     next();
// });
app.use((req, res, next) => {
    const greetings = [
        "Happy New Year!", 
        "Happy Valentines Day", 
        "Happy Spring", 
        "Happy Easter Season", 
        "Happy End of School and Memorial Day", 
        "Enjoy Summer", 
        "Happy Fourth of July!", 
        "Back to School Season", 
        "Enjoy your Labor Day break!", 
        "Happy Halloween", 
        "Happy Thanksgiving Season!", 
        "Merry Christmas!"
    ];

    const currentMonth = new Date().getMonth();
    res.locals.greeting = greetings[currentMonth];

    next();
});

//Global middleware to share query parameters with templates (week 3)
app.use((req, res, next) => {
    //make req.query available to all templates for debugging and conditional rendering
    res.locals.queryParams = req.query || {};

    next();
});


//Random theme middleware (week 3)
// Global middleware for random theme selection
app.use((req, res, next) => {
    const themes = ['blue-theme', 'green-theme', 'red-theme', 'purple-theme', 'yellow-theme', 'orange-theme'];

    // Your task: Pick a random theme from the array
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];// Your random selection logic here
    res.locals.bodyClass = randomTheme;

    next();
});


// Route-specific middleware that sets custom headers (week 3)
const addDemoHeaders = (req, res, next) => {
    res.setHeader('X-Demo-Page', 'true');
    res.setHeader('X-Middleware-Demo', 'This is a Demo Header.');

    next();
};

//Counting request for demo page (week3)
const trackDemoPage = (req, res, next) => {
    demoPageCount++;
    res.locals.demoPageCount = demoPageCount;

    next();
}

// Demo page route with header middleware(week 3)
app.get('/demo', trackDemoPage, addDemoHeaders, (req, res) => {
    res.render('demo', {
        title: 'Middleware Demo Page'
    });
});



//WEEK 3: COURSE CATELOG WITH ROUTE PARAMETERS
// Course data - place this after imports, before routes
const courses = {
    'CS121': {
        id: 'CS121',
        title: 'Introduction to Programming',
        description: 'Learn programming fundamentals using JavaScript and basic web development concepts.',
        credits: 3,
        sections: [
            { time: '9:00 AM', room: 'STC 392', professor: 'Brother Jack' },
            { time: '2:00 PM', room: 'STC 394', professor: 'Sister Enkey' },
            { time: '11:00 AM', room: 'STC 390', professor: 'Brother Keers' }
        ]
    },
    'MATH110': {
        id: 'MATH110',
        title: 'College Algebra',
        description: 'Fundamental algebraic concepts including functions, graphing, and problem solving.',
        credits: 4,
        sections: [
            { time: '8:00 AM', room: 'MC 301', professor: 'Sister Anderson' },
            { time: '1:00 PM', room: 'MC 305', professor: 'Brother Miller' },
            { time: '3:00 PM', room: 'MC 307', professor: 'Brother Thompson' }
        ]
    },
    'ENG101': {
        id: 'ENG101',
        title: 'Academic Writing',
        description: 'Develop writing skills for academic and professional communication.',
        credits: 3,
        sections: [
            { time: '10:00 AM', room: 'GEB 201', professor: 'Sister Anderson' },
            { time: '12:00 PM', room: 'GEB 205', professor: 'Brother Davis' },
            { time: '4:00 PM', room: 'GEB 203', professor: 'Sister Enkey' }
        ]
    },
    'ITM220': {
        id: 'ITM220',
        title: 'SQL',
        description: 'Learning Structured Quary Language',
        credits: 3,
        sections: [
            { time: '10:00 AM', room: 'ABC 352', professor: 'Sister Smith' },
            { time: '3:00 PM', room: 'ABC 315', professor: 'Sister Jones' },
            { time: '5:00 PM', room: 'ABC 984', professor: 'Brother Smalls' }
        ]
    }
};

/**
 * Configure Express middleware (week 3)
 */

// Middleware to make NODE_ENV available to all templates
app.use((req, res, next) => {
    res.locals.NODE_ENV = NODE_ENV.toLowerCase() || 'production';

    // Continue to the next middleware or route handler
    next();
});


/**
 * ROUTES (declared)
 */
app.get('/', (req, res) => {
    const title = "Welcome Home";
    res.render("home", { title });
});
app.get('/about', (req, res) => {
    const title = "About Me";
    res.render("about", { title });
});
app.get('/products', (req, res) => {
    const title = "Our Products";
    res.render("products", { title });
});
app.get('/contact', (req, res) => {
    const title = "Contact Us";
    res.render("contact", { title });
});
app.get('/course', (req, res) => {
    const title = "Course Catalog";
    res.render("course", { title });
});
app.get('/demo', (req, res) => {
    const title = "Middleware Demo";
    res.render("demo", { title });
});


//WEEK 3
// Course catalog list page
app.get('/catalog', (req, res) => {
    res.render('catalog', {
        title: 'Course Catalog',
        courses: courses
    });
});

// Enhanced course detail route with sorting(week 3)
app.get('/catalog/:courseId', (req, res, next) => {
    const courseId = req.params.courseId;
    const course = courses[courseId];

    if (!course) {
        const err = new Error(`Course ${courseId} not found`);
        err.status = 404;
        return next(err);
    }

    // Get sort parameter (default to 'time')
    const sortBy = req.query.sort || 'time';

    // Create a copy of sections to sort
    let sortedSections = [...course.sections];

    // Sort based on the parameter
    switch (sortBy) {
        case 'professor':
            sortedSections.sort((a, b) => a.professor.localeCompare(b.professor));
            break;
        case 'room':
            sortedSections.sort((a, b) => a.room.localeCompare(b.room));
            break;
        case 'time':
        default:
            // Keep original time order as default
            break;
    }

    console.log(`Viewing course: ${courseId}, sorted by: ${sortBy}`);

    res.render('course-detail', {
        title: `${course.id} - ${course.title}`,
        course: { ...course, sections: sortedSections },
        currentSort: sortBy
    });
});


//ERROR HANDLING MIDDLEWARE
//Test route for 500 errors
app.get('/test-error', (req, res, next) => {
    const err = new Error('This is a test error');
    err.status = 500;
    next(err);
});

//Catch-all route for 404 errors
app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

//Global error handler
app.use((err, req, res, next) => {
    //prevent infinite loops, if a response has already been sent, do nothing
    if (res.headerSent || res.finish) {
        return next(err);
    }

    //Determine status and template
    const status = err.status || 500;
    const template = status === 404? '404' : '500';

    //Prepare data for the template
    const context = {
        title: status === 404 ? 'Page Not Found' : 'Server Error', 
        error: NODE_ENV === 'production' ? 'An error occured' : err.message, 
        stack: NODE_ENV === 'production' ? null : err.stack,
        NODE_ENV // for websocket
    };

    //Render the appropriate error template with a fallback 
    res.status(status).render(`errors/${template}`, context, (renderErr, html) => {
        if (renderErr) {
            console.error('Render Error:', renderErr);
            if(!res.headerSent) {
                return res.status(status).send(`<h1>Error ${status}</h1><p>An error occured.</p>`);
            }
        }
        res.send(html);
    });
});

// When in development mode, start a WebSocket server for live reloading
if (NODE_ENV.includes('dev')) {
    const ws = await import('ws');

    try {
        const wsPort = parseInt(PORT) + 1;
        const wsServer = new ws.WebSocketServer({ port: wsPort });

        wsServer.on('listening', () => {
            console.log(`WebSocket server is running on port ${wsPort}`);
        });

        wsServer.on('error', (error) => {
            console.error('WebSocket server error:', error);
        });
    } catch (error) {
        console.error('Failed to start WebSocket server:', error);
    }
}

// LISTEN
app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});