import { addVolunteer, removeVolunteer, getVolunteerProjectsByUserId } from '../models/volunteers.js';

/**
 * POST /project/:id/volunteer
 * Adds the logged-in user as a volunteer for a project,
 * then redirects back to the project details page.
 */
const volunteerForProject = async (req, res) => {
    const projectId = req.params.id;
    const userId = req.session.user.user_id;

    await addVolunteer(userId, projectId);

    req.flash('success', 'You have signed up to volunteer for this project!');
    res.redirect(`/project/${projectId}`);
};

/**
 * POST /project/:id/unvolunteer
 * Removes the logged-in user as a volunteer from a project,
 * then redirects back to the project details page.
 */
const unvolunteerFromProject = async (req, res) => {
    const projectId = req.params.id;
    const userId = req.session.user.user_id;

    await removeVolunteer(userId, projectId);

    req.flash('success', 'You have been removed as a volunteer from this project.');
    res.redirect(`/project/${projectId}`);
};

/**
 * POST /dashboard/unvolunteer/:id
 * Removes the logged-in user as a volunteer from a project
 * when triggered from the dashboard, then redirects back to dashboard.
 */
const unvolunteerFromDashboard = async (req, res) => {
    const projectId = req.params.id;
    const userId = req.session.user.user_id;

    await removeVolunteer(userId, projectId);

    req.flash('success', 'You have been removed as a volunteer from that project.');
    res.redirect('/dashboard');
};

export { volunteerForProject, unvolunteerFromProject, unvolunteerFromDashboard };