import db from './db.js'

const getAllProjects = async () => {
    const query = `
        SELECT
            p.project_id,
            p.title,
            p.description,
            p.location,
            p.date,
            p.organization_id,
            o.name AS organization_name
        FROM public.project p
        JOIN public.organization o
            ON p.organization_id = o.organization_id
        ORDER BY p.date ASC;
    `;

    try {
        const result = await db.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error fetching projects:', error.message);
        throw error;
    }
};

const getProjectsByOrganizationId = async (organizationId) => {
    const query = `
        SELECT
            project_id,
            organization_id,
            title,
            description,
            location,
            date
        FROM public.project
        WHERE organization_id = $1
        ORDER BY date;
    `;

    const queryParams = [organizationId];
    const result = await db.query(query, queryParams);

    return result.rows;
};

const getUpcomingProjects = async (number_of_projects) => {
    const query = `
        SELECT
            p.project_id,
            p.title,
            p.description,
            p.location,
            p.date,
            p.organization_id,
            o.name AS organization_name
        FROM public.project p
        JOIN public.organization o
            ON p.organization_id = o.organization_id
        WHERE p.date >= CURRENT_DATE
        ORDER BY p.date ASC
        LIMIT $1;
    `;

    const queryParams = [number_of_projects];

    try {
        const result = await db.query(query, queryParams);
        return result.rows;
    } catch (error) {
        console.error('Error fetching upcoming projects:', error.message);
        throw error;
    }
};

const getProjectDetails = async (id) => {
    const query = `
        SELECT
            p.project_id,
            p.title,
            p.description,
            p.location,
            p.date,
            p.organization_id,
            o.name AS organization_name
        FROM public.project p
        JOIN public.organization o
            ON p.organization_id = o.organization_id
        WHERE p.project_id = $1;
    `;

    const queryParams = [id];

    try {
        const result = await db.query(query, queryParams);
        return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
        console.error('Error fetching project details:', error.message);
        throw error;
    }
};

/**
 * Creates a new service project in the database.
 * @param {string} title - The project title.
 * @param {string} description - The project description.
 * @param {string} location - The project location.
 * @param {string} date - The project date (ISO format).
 * @param {number} organizationId - The associated organization ID.
 * @returns {number} The id of the newly created project record.
 */
const createProject = async (title, description, location, date, organizationId) => {
    const query = `
      INSERT INTO project (title, description, location, date, organization_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING project_id;
    `;

    const queryParams = [title, description, location, date, organizationId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create project');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new project with ID:', result.rows[0].project_id);
    }

    return result.rows[0].project_id;
};

// Export the model functions
export { getAllProjects, getProjectsByOrganizationId, getUpcomingProjects, getProjectDetails, createProject };