import { hash } from 'bcrypt';
import db from '../db.js';

/** 
 * Checks if an email address is already registered in the database.
 * 
 * @param {string} email - The email address to check
 * @returns {Promise<boolean>} True if email exists, false otherwise
 */

const emailExists = async (email) => {
    const query = `
    SELECT EXISTS(SELECT 1 FROM users WHERE email = $1) as exists
    `;
    const results = await db.query(query, [email]);
    return results.rows[0].exists;
};

/**
 * Saves a new user to the database with the hased password
 * 
 * @param {string} name - the users full name
 * @param {string} email - the users email address
 * @param {string} hashedPassword - the bcrypt-hashed password
 * @returns {Promise<Object>} - The newly created user record (without password)
 */

const saveUser = async (name, email, hashedPassword) => {
    const query = `
        INSERT INTO users (name, email, password)
        VALUES ($1, $2, $3)
        RETURNING id, name, email, created_at
    `;

    const result = await db.query(query, [name, email, hashedPassword]);
    return result.rows[0];
};

/**
 * Retrieves all registered users from database.
 * 
 * @returns {Promise<Array>} - Array of user records (without passwords)
 */

const getAllUsers = async () => {
    const query = `
        SELECT id, name, email, created_at
        FROM users
        ORDER BY created_at DESC
        `;
        const result = await db.query(query);
        return result.rows;
};

export { emailExists, saveUser, getAllUsers };