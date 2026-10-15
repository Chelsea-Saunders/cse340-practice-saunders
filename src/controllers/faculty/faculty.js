// Import the faculty model functions
import { getFacultyBySlug, getSortedFaculty, } from "../../models/faculty/faculty.js";
// Create a facultyListPage function that renders the faculty list page
const facultyListPage = async (req, res, next) => {
    try {
        const sort = req.query.sort || 'name';
        const faculty = await getSortedFaculty(sort);

        console.log(`Faculty Data ${faculty} from model.`)

        res.render('faculty/list', {
            title: 'Faculty List',
            faculty: faculty,
            currentSort: sort
        });
    } catch (err) {
        next(err);
    }
};

// Create a facultyDetailPage function that uses route parameters to look up individual faculty
const facultyDetailPage = async (req, res, next) => {
    try {
        const facultySlug = req.params.slug || req.params.slugId;
        const faculty = await getFacultyBySlug(facultySlug);

        console.log(`Faculty Data ${faculty} from model.`)

        // Include proper error handling for invalid faculty IDs
        if (!faculty) {
            const err = new Error(`Faculty member ${facultySlug} not found`);
            err.status = 404;
            return next(err);
        }

        res.render('faculty/details', {
            title: faculty.name,
            faculty: faculty
        });
    } catch(err) {
        next(err);
    }
};

// Export both functions
export { facultyListPage, facultyDetailPage }