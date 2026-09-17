// IMPORTS
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

/**
 * VARIABLES
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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


// LISTEN
app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
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