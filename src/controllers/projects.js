const showProjectsPage = async (req, res) => {
    const title = 'Service Projects';
    res.render('projects', { title });
};

export { showProjectsPage };