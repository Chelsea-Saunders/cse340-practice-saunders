// IMPORTS
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

import routes from './src/controllers/routes.js';
import { addLocalVariables } from './src/middleware/global.js';

//SERVER CONFIGURATION
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'production';

//SETUP EXPRESS SERVER
const app = express();

//CONFIGURE EXPRESS
app.use(express.static(path.join(__dirname, 'public'))); // tells Epxress, any code in public directory should be accessible through your website
//set EJS as templating engine
app.set('view engine', 'ejs');
//tell Espress where to find your templates
app.set('views', path.join(__dirname, 'src/views'));

//GLOBAL MIDDLEWARE
app.use(addLocalVariables);

//ROUTER
app.use('/', routes);

//404 CATCH-ALL ERROR HANDLER
app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

// //500 ERROR HANDLER
// app.get('/test-error', (req, res, next) => {
//     const err = new Error('This is a test error');
//     err.status = 500;
//     next(err);
// });

//GLOBAL ERROR HANDLING
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
app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});