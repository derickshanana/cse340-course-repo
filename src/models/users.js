import db from './db.js';
import bcrypt from 'bcrypt';

/**
 * Creates a new user in the database with the default 'user' role.
 * @param {string} name - Display name
 * @param {string} email - Email address (used as username)
 * @param {string} passwordHash - Bcrypt-hashed password
 * @returns {number} The new user's ID
 */
const createUser = async (name, email, passwordHash) => {
    const default_role = 'user';
    const query = `
        INSERT INTO users (name, email, password_hash, role_id)
        VALUES ($1, $2, $3, (SELECT role_id FROM roles WHERE role_name = $4))
        RETURNING user_id
    `;
    const queryParams = [name, email, passwordHash, default_role];

    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create user');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new user with ID:', result.rows[0].user_id);
    }

    return result.rows[0].user_id;
};

/**
 * Finds a user by email, joining in their role name.
 * Updated for Team Activity: returns role_name instead of role_id.
 * @param {string} email
 * @returns {object|null} User row or null
 */
const findUserByEmail = async (email) => {
    const query = `
        SELECT u.user_id, u.name, u.email, u.password_hash, r.role_name
        FROM users u
        JOIN roles r ON u.role_id = r.role_id
        WHERE u.email = $1
    `;
    const queryParams = [email];

    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        return null; // User not found
    }

    return result.rows[0];
};

/**
 * Compares a plain-text password against a bcrypt hash.
 * @param {string} password - Plain text password
 * @param {string} passwordHash - Stored bcrypt hash
 * @returns {boolean}
 */
const verifyPassword = async (password, passwordHash) => {
    return bcrypt.compare(password, passwordHash);
};

/**
 * Authenticates a user by email and password.
 * Returns the user object (without password_hash) on success, null on failure.
 * @param {string} email
 * @param {string} password
 * @returns {object|null}
 */
const authenticateUser = async (email, password) => {
    const user = await findUserByEmail(email);

    if (!user) {
        return null; // No user with that email
    }

    const passwordMatches = await verifyPassword(password, user.password_hash);

    if (!passwordMatches) {
        return null; // Wrong password
    }

    // Remove the password hash before returning — never expose it
    const { password_hash, ...safeUser } = user;
    return safeUser;
};

/**
 * Retrieves all users with their role names (for admin users page).
 * @returns {Array} Array of user rows
 */
const getAllUsers = async () => {
    const query = `
        SELECT u.user_id, u.name, u.email, r.role_name, u.created_at
        FROM users u
        JOIN roles r ON u.role_id = r.role_id
        ORDER BY u.created_at ASC
    `;

    const result = await db.query(query);
    return result.rows;
};

export { createUser, authenticateUser, getAllUsers };
