import { validationResult } from 'express-validator';

// apply validation to the route
const registerUser = (req, res) => {
    const results = validationResult(req);

    if (!results.isEmpty()) {
        return res.status(400).json ({
            success: false,
            errors: results.array()
        });
    }

    const { email, password, age } = req.body;
    console.log('Valid registration: ', { email, age });

    res.json({
        success: true,
        message: 'Registration successful'
    });
};

export {
    registerUser
};