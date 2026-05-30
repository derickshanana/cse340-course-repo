import { getAllOrganizations, getOrganizationDetails, createOrganization, updateOrganization } from '../models/organizations.js';
import { getProjectsByOrganizationId } from '../models/projects.js';
import { body, validationResult } from 'express-validator';

// ─── Validation Rules (Activity 3) ───────────────────────────────────────────

// Define validation and sanitization rules for organization form
const organizationValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Organization name is required')
        .isLength({ min: 3, max: 150 })
        .withMessage('Organization name must be between 3 and 150 characters'),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('Organization description is required')
        .isLength({ max: 500 })
        .withMessage('Organization description cannot exceed 500 characters'),
    body('contactEmail')
        .normalizeEmail()
        .notEmpty()
        .withMessage('Contact email is required')
        .isEmail()
        .withMessage('Please provide a valid email address')
];

// ─── Controllers ─────────────────────────────────────────────────────────────

const showOrganizationsPage = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Our Partner Organizations';

    res.render('organizations', { title, organizations });
};

const showOrganizationDetailsPage = async (req, res) => {
    const organizationId = req.params.id;
    const organizationDetails = await getOrganizationDetails(organizationId);
    const projects = await getProjectsByOrganizationId(organizationId);
    const title = 'Organization Details';

    res.render('organization', { title, organizationDetails, projects });
};

// Activity 1: Show the new organization form
const showNewOrganizationForm = async (req, res) => {
    const title = 'Add New Organization';

    res.render('new-organization', { title });
};

// Activity 1 + 2 + 3: Process new organization form with validation and flash
const processNewOrganizationForm = async (req, res) => {
    // Activity 3: Check for validation errors
    const results = validationResult(req);
    if (!results.isEmpty()) {
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        return res.redirect('/new-organization');
    }

    const { name, description, contactEmail } = req.body;
    const logoFilename = 'placeholder-logo.png'; // Use the placeholder logo for all new organizations

    const organizationId = await createOrganization(name, description, contactEmail, logoFilename);

    // Activity 2: Set a success flash message
    req.flash('success', 'Organization added successfully!');

    res.redirect(`/organization/${organizationId}`);
};

// Activity 4: Show the edit organization form (pre-populated)
const showEditOrganizationForm = async (req, res) => {
    const organizationId = req.params.id;
    const organizationDetails = await getOrganizationDetails(organizationId);

    const title = 'Edit Organization';
    res.render('edit-organization', { title, organizationDetails });
};

// Activity 4: Process the edit organization form submission
const processEditOrganizationForm = async (req, res) => {
    const organizationId = req.params.id;

    // Activity 4 validation
    const results = validationResult(req);
    if (!results.isEmpty()) {
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        return res.redirect('/edit-organization/' + organizationId);
    }

    const { name, description, contactEmail, logoFilename } = req.body;

    await updateOrganization(organizationId, name, description, contactEmail, logoFilename);

    req.flash('success', 'Organization updated successfully!');

    res.redirect(`/organization/${organizationId}`);
};


// Export any controller functions
export {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    organizationValidation,
    showEditOrganizationForm,
    processEditOrganizationForm
};