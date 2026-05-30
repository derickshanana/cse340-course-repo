import express from 'express';

import { showHomePage } from './controllers/index.js';
import {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    organizationValidation,
    showEditOrganizationForm,
    processEditOrganizationForm
} from './controllers/organizations.js';
import {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    projectValidation
} from './controllers/projects.js';
import {
    showCategoriesPage,
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm
} from './controllers/categories.js';
import { testErrorPage } from './controllers/errors.js';

const router = express.Router();

// ─── Core routes ─────────────────────────────────────────────────────────────
router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/projects', showProjectsPage);
router.get('/categories', showCategoriesPage);
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/project/:id', showProjectDetailsPage);
router.get('/category/:id', showCategoryDetailsPage);

// ─── Activity 1 + 2 + 3: New Organization ────────────────────────────────────
// Route for new organization page
router.get('/new-organization', showNewOrganizationForm);

// Route to handle new organization form submission (with validation middleware)
router.post('/new-organization', organizationValidation, processNewOrganizationForm);

// ─── Activity 4: Edit Organization ───────────────────────────────────────────
// Route to display the edit organization form
router.get('/edit-organization/:id', showEditOrganizationForm);

// Route to handle the edit organization form submission (with validation middleware)
router.post('/edit-organization/:id', organizationValidation, processEditOrganizationForm);

// ─── Activity 5: New Project ──────────────────────────────────────────────────
// Route for new project page
router.get('/new-project', showNewProjectForm);

// Route to handle new project form submission (with validation middleware)
router.post('/new-project', projectValidation, processNewProjectForm);

// ─── Activity 6: Assign Categories ───────────────────────────────────────────
// Routes to handle the assign categories to project form
router.get('/assign-categories/:projectId', showAssignCategoriesForm);
router.post('/assign-categories/:projectId', processAssignCategoriesForm);

// ─── Error-handling routes ────────────────────────────────────────────────────
router.get('/test-error', testErrorPage);

export default router;