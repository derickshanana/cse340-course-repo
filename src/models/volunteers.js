import db from './db.js';

/**
 * Adds a user as a volunteer for a project.
 * The UNIQUE constraint on (user_id, project_id) prevents duplicate signups.
 * @param {number} userId
 * @param {number} projectId
 * @returns {number} The new volunteer_id
 */
const addVolunteer = async (userId, projectId) => {
    const query = `
        INSERT INTO volunteers (user_id, project_id)
        VALUES ($1, $2)
        ON CONFLICT (user_id, project_id) DO NOTHING
        RETURNING volunteer_id
    `;

    const result = await db.query(query, [userId, projectId]);

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log(`User ${userId} volunteered for project ${projectId}`);
    }

    return result.rows.length > 0 ? result.rows[0].volunteer_id : null;
};

/**
 * Removes a user as a volunteer from a project.
 * @param {number} userId
 * @param {number} projectId
 */
const removeVolunteer = async (userId, projectId) => {
    const query = `
        DELETE FROM volunteers
        WHERE user_id = $1 AND project_id = $2
    `;

    await db.query(query, [userId, projectId]);

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log(`User ${userId} removed from project ${projectId}`);
    }
};

/**
 * Checks whether a specific user is already volunteering for a project.
 * @param {number} userId
 * @param {number} projectId
 * @returns {boolean}
 */
const isUserVolunteering = async (userId, projectId) => {
    const query = `
        SELECT 1 FROM volunteers
        WHERE user_id = $1 AND project_id = $2
    `;

    const result = await db.query(query, [userId, projectId]);
    return result.rows.length > 0;
};

/**
 * Returns all projects a user has signed up to volunteer for,
 * joined with project and organization details.
 * @param {number} userId
 * @returns {Array} Array of project rows
 */
const getVolunteerProjectsByUserId = async (userId) => {
    const query = `
        SELECT
            p.project_id,
            p.title,
            p.description,
            p.location,
            p.date,
            p.organization_id,
            o.name AS organization_name,
            v.signed_up_at
        FROM volunteers v
        JOIN project p      ON v.project_id   = p.project_id
        JOIN organization o ON p.organization_id = o.organization_id
        WHERE v.user_id = $1
        ORDER BY p.date ASC
    `;

    const result = await db.query(query, [userId]);
    return result.rows;
};

export { addVolunteer, removeVolunteer, isUserVolunteering, getVolunteerProjectsByUserId };