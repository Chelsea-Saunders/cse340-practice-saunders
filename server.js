import 'dotenv/config';
// IMPORTS
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import flash from './src/middleware/flash.js';

import routes from './src/routes/routes.js';
import { addLocalVariables } from './src/middleware/global.js';
import { setupDatabase, testConnection } from './src/models/setup.js';
import { startSessionCleanup } from './src/utils/session-cleanup.js';

import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';

//SERVER CONFIGURATION
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'production';

//SETUP EXPRESS SERVER
const app = express();

// INITIALIZE POSTGRESQL SESSION STORE
const pgSession = connectPgSimple(session);

// app.post()

startSessionCleanup();


//CONFIGURE EXPRESS
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // tells Epxress, any code in public directory should be accessible through your website

//set EJS as templating engine
app.set('view engine', 'ejs');
//tell Espress where to find your templates
app.set('views', path.join(__dirname, 'src/views'));

//configure session middleware
app.use(session({
    store: new pgSession({
        conObject: {
            connectionString: process.env.DB_URL
        },
        tableName: 'session',
        createTableIfMissing: true
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        // secure: NODE_ENV.includes('dev') !== true,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    }
}));



// FLASH
app.use(flash);

//GLOBAL MIDDLEWARE
app.use(addLocalVariables);

// ignore favicon
app.get('/favicon.io', (req, res) => res.status(204).end());

//ROUTER
app.use('/', routes);

//404 CATCH-ALL ERROR HANDLER
app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

//GLOBAL ERROR HANDLING
app.use((err, req, res, next) => {

    console.error('SERVER ERROR CAUGHT:', err);

    //prevent infinite loops, if a response has already been sent, do nothing
    if (res.headerSent) {
        return next(err);
    }

    // console.error(err);
    // console.error(`404 on: ${req.method} ${req.originalUrl}`);

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
            if(!res.headersSent) {
                return res.status(status).send(`<h1>Error ${status}</h1><p>An error occured.</p>`);
            }
        } else {
            res.send(html);
        }
    });
});

// WEBSOCKET SERVER FOR LIVE RELOAD
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

// START SERVER
app.listen(PORT, async () => {
    await setupDatabase();
    await testConnection();
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});