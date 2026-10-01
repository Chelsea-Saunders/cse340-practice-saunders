// Create src/controllers/faculty/faculty.js with route handlers for faculty list and detail pages. Follow the same pattern you used for the course controllers:

// Import the faculty model functions
import { getFacultyById, getSortedFaculty, } from "../../models/faculty/faculty";
// Create a facultyListPage function that renders the faculty list page
const facultyListPage = (req, res) => {
    const faculty = getSortedFaculty('name');

    res.render('faculty', {
        title: 'Faculty List',
        faculty: faculty
    });
};

// Create a facultyDetailPage function that uses route parameters to look up individual faculty
const facultyDetailPage = (req, res, next) => {
    const facultyId = req.params.facultyId;
    const faculty = getFacultyById(facultyId);

    // Include proper error handling for invalid faculty IDs
    if (!faculty) {
        const err = new Error(`Faculty member ${facultyId} not found`);
        err.status = 404;
        return next(err);
    }

    res.render('faculty-detail', {
        title: faculty.name,
        faculty: faculty
    });
};

// Export both functions
export { facultyListPage, facultyDetailPage }