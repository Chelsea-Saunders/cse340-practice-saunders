let demoPageCount = 0;

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

export { addDemoHeaders, trackDemoPage };