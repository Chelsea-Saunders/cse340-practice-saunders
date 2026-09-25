const homePage = (req, res) => {
    res.render('home', { title: 'Home' });
};
const aboutPage = (req, res) => {
    res.render('about', { title: 'About' });
};
const demoPage = (req, res) => {
    res.render('demo', { title: 'Demo' });
};
const testErrorPage = (req, res, next) => {
    const error = new Error('This is a test error');
    err.status = 500;
    next(err);
};

export { homePage, aboutPage, demoPage, testErrorPage }