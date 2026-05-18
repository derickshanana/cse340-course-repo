
-- ========================================
-- Organization Table
-- ========================================
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);



-- ========================================
-- Insert sample data: Organizations
-- ========================================
INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');

-- ========================================
-- Project Table
-- ========================================
CREATE TABLE project (
    project_id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    organization_id INT NOT NULL,
    CONSTRAINT fk_project_organization
        FOREIGN KEY (organization_id)
        REFERENCES organization(organization_id)
        ON DELETE CASCADE
);


-- ========================================
-- Insert sample data: Projects
-- ========================================
INSERT INTO project (name, description, organization_id)
VALUES
('Park Cleanup', 'Join us to clean up local parks and make them beautiful for everyone to enjoy.', 1),
('Food Drive', 'Help collect and distribute food to those in need in our local community.', 3),
('Community Tutoring', 'Volunteer to tutor students in various subjects to help them succeed academically.', 2);


-- ========================================
-- Category Table
-- ========================================
CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);


-- ========================================
-- Insert sample data: Categories
-- ========================================
INSERT INTO category (name)
VALUES
('Environmental'),
('Educational'),
('Community Service'),
('Health and Wellness');


-- ========================================
-- Project-Category Junction Table
-- (Many-to-many: a project can belong to
--  multiple categories and vice versa)
-- ========================================
CREATE TABLE project_category (
    project_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (project_id, category_id),
    CONSTRAINT fk_pc_project
        FOREIGN KEY (project_id)
        REFERENCES project(project_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_pc_category
        FOREIGN KEY (category_id)
        REFERENCES category(category_id)
        ON DELETE CASCADE
);


-- ========================================
-- Insert sample data: Project-Category links
-- ========================================
-- Park Cleanup → Environmental, Community Service
INSERT INTO project_category (project_id, category_id) VALUES (1, 1), (1, 3);

-- Food Drive → Community Service, Health and Wellness
INSERT INTO project_category (project_id, category_id) VALUES (2, 3), (2, 4);

-- Community Tutoring → Educational, Community Service
INSERT INTO project_category (project_id, category_id) VALUES (3, 2), (3, 3);

