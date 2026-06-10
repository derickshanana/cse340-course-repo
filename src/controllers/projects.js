import { getUpcomingProjects, getProjectDetails, createProject, updateProject } from '../models/projects.js';
import { getCategoriesByProjectId } from '../models/categories.js';
import { getAllOrganizations } from '../models/organizations.js';
import { isUserVolunteering } from '../models/volunteers.js';
import { body, validationResult } from 'express-validator';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

// ─── Validation Rules ─────────────────────────────────────────────────────────

const projectValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
    body('location')
        .trim()
        .notEmpty().withMessage('Location is required')
        .isLength({ max: 200 }).withMessage('Location must be less than 200 characters'),
    body('date')
        .notEmpty().withMessage('Date is required')
        .isISO8601().withMessage('Date must be a valid date format'),
    body('organizationId')
        .notEmpty().withMessage('Organization is required')
        .isInt().withMessage('Organization must be a valid integer')
];

// ─── Controllers ─────────────────────────────────────────────────────────────

const showProjectsPage = async (req, res) => {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    const title = 'Upcoming Service Projects';
    res.render('projects', { title, projects });
};

/**
 * Shows the project details page.
 * If the user is logged in, also checks whether they are already volunteering.
 */
const showProjectDetailsPage = async (req, res) => {
    const id = req.params.id;
    const project = await getProjectDetails(id);
    const categories = await getCategoriesByProjectId(id);
    const title = project ? project.title : 'Project Details';

    // Check volunteer status only for logged-in users
    let volunteering = false;
    if (req.session && req.session.user) {
        volunteering = await isUserVolunteering(req.session.user.user_id, id);
    }

    res.render('project', { title, project, categories, volunteering });
};

const showNewProjectForm = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Add New Service Project';
    res.render('new-project', { title, organizations });
};

const processNewProjectForm = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        return res.redirect('/new-project');
    }

    const { title, description, location, date, organizationId } = req.body;
    const newProjectId = await createProject(title, description, location, date, organizationId);

    req.flash('success', 'New service project created successfully!');
    res.redirect(`/project/${newProjectId}`);
};

const showEditProjectForm = async (req, res) => {
    const projectId = req.params.id;
    const project = await getProjectDetails(projectId);
    const organizations = await getAllOrganizations();
    const title = 'Edit Service Project';
    res.render('edit-project', { title, project, organizations });
};

const processEditProjectForm = async (req, res) => {
    const projectId = req.params.id;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        return res.redirect(`/edit-project/${projectId}`);
    }

    const { title, description, location, date, organizationId } = req.body;
    await updateProject(projectId, title, description, location, date, organizationId);

    req.flash('success', 'Service project updated successfully!');
    res.redirect(`/project/${projectId}`);
};

export {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    projectValidation,
    showEditProjectForm,
    processEditProjectForm
};