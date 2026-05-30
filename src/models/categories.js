import db from './db.js'

const getAllCategories = async () => {
    const query = `
        SELECT category_id, name
        FROM public.category
        ORDER BY name;
    `;

    try {
        const result = await db.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error fetching categories:', error.message);
        throw error;
    }
};

const getCategoryDetails = async (categoryId) => {
    const query = `
        SELECT category_id, name
        FROM public.category
        WHERE category_id = $1;
    `;

    const queryParams = [categoryId];

    try {
        const result = await db.query(query, queryParams);
        return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
        console.error('Error fetching category details:', error.message);
        throw error;
    }
};

const getProjectsByCategoryId = async (categoryId) => {
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
        JOIN public.project_category pc
            ON p.project_id = pc.project_id
        JOIN public.organization o
            ON p.organization_id = o.organization_id
        WHERE pc.category_id = $1
        ORDER BY p.date ASC;
    `;

    const queryParams = [categoryId];

    try {
        const result = await db.query(query, queryParams);
        return result.rows;
    } catch (error) {
        console.error('Error fetching projects by category:', error.message);
        throw error;
    }
};

const getCategoriesByProjectId = async (projectId) => {
    const query = `
        SELECT
            c.category_id,
            c.name
        FROM public.category c
        JOIN public.project_category pc
            ON c.category_id = pc.category_id
        WHERE pc.project_id = $1
        ORDER BY c.name;
    `;

    const queryParams = [projectId];

    try {
        const result = await db.query(query, queryParams);
        return result.rows;
    } catch (error) {
        console.error('Error fetching categories by project:', error.message);
        throw error;
    }
};

// Alias used in Activity 6 controller
const getCategoriesByServiceProjectId = getCategoriesByProjectId;

/**
 * Assigns a single category to a project in the many-to-many table.
 * @param {number} categoryId
 * @param {number} projectId
 */
const assignCategoryToProject = async (categoryId, projectId) => {
    const query = `
        INSERT INTO project_category (category_id, project_id)
        VALUES ($1, $2);
    `;

    await db.query(query, [categoryId, projectId]);
};

/**
 * Replaces all category assignments for a project with a new set.
 * @param {number} projectId
 * @param {number[]} categoryIds - Array of category IDs to assign.
 */
const updateCategoryAssignments = async (projectId, categoryIds) => {
    // First, remove existing category assignments for the project
    const deleteQuery = `
        DELETE FROM project_category
        WHERE project_id = $1;
    `;
    await db.query(deleteQuery, [projectId]);

    // Next, add the new category assignments
    for (const categoryId of categoryIds) {
        await assignCategoryToProject(categoryId, projectId);
    }
};

export {
    getAllCategories,
    getCategoryDetails,
    getProjectsByCategoryId,
    getCategoriesByProjectId,
    getCategoriesByServiceProjectId,
    updateCategoryAssignments
};