-- ========================================
-- Organization Table
-- ========================================
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name            VARCHAR(150) NOT NULL,
    description     TEXT         NOT NULL,
    contact_email   VARCHAR(255) NOT NULL,
    logo_filename   VARCHAR(255) NOT NULL
);

-- ========================================
-- Insert sample data: Organizations
-- ========================================
INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders',  'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers',   'An urban farming collective promoting food sustainability and education in local neighborhoods.',       'contact@greenharvest.org',      'greenharvest-logo.png'),
('UnityServe Volunteers',  'A volunteer coordination group supporting local charities and service initiatives.',                   'hello@unityserve.org',          'unityserve-logo.png');


-- ========================================
-- Project Table
-- ========================================
CREATE TABLE project (
    project_id      SERIAL        PRIMARY KEY,
    title           VARCHAR(200)  NOT NULL,
    description     TEXT          NOT NULL,
    location        VARCHAR(255)  NOT NULL,
    date            DATE          NOT NULL,
    organization_id INT           NOT NULL,
    CONSTRAINT fk_project_organization
        FOREIGN KEY (organization_id)
        REFERENCES organization(organization_id)
        ON DELETE CASCADE
);

-- ========================================
-- Insert sample data: Projects
-- (5 per organization = 15 total)
-- ========================================

-- BrightFuture Builders (org 1)
INSERT INTO project (title, description, location, date, organization_id) VALUES
('Park Cleanup',         'Join us to clean up local parks and make them beautiful for everyone to enjoy.',         'Central Park, Bulawayo',       '2026-08-02', 1),
('School Renovation',    'Help renovate classrooms at a local primary school to improve learning conditions.',     'Makokoba Primary, Bulawayo',   '2026-08-16', 1),
('Road Repair Drive',    'Assist with filling potholes and repairing pedestrian paths in our neighbourhood.',      'Suburbs Road, Bulawayo',       '2026-09-06', 1),
('Bridge Build',         'Volunteer to help construct a small footbridge over a seasonal stream.',                 'Luveve, Bulawayo',             '2026-09-20', 1),
('Community Hall Paint', 'Repaint the interior and exterior of the local community hall.',                         'Nkulumane Hall, Bulawayo',     '2026-10-04', 1);

-- GreenHarvest Growers (org 2)
INSERT INTO project (title, description, location, date, organization_id) VALUES
('Urban Garden Setup',   'Help establish raised-bed vegetable gardens in underserved neighbourhoods.',             'Mpopoma, Bulawayo',            '2026-08-09', 2),
('Tree Planting Day',    'Plant indigenous trees along school fences to restore green cover.',                     'Pumula South, Bulawayo',       '2026-08-23', 2),
('Compost Workshop',     'Run a hands-on composting workshop for local residents and farmers.',                    'Cowdray Park, Bulawayo',       '2026-09-13', 2),
('Water Harvesting',     'Install simple rainwater-harvesting systems at three community gardens.',                'Entumbane, Bulawayo',          '2026-09-27', 2),
('Harvest Festival',     'Celebrate the harvest season and distribute fresh produce to vulnerable families.',      'Emganwini, Bulawayo',          '2026-10-18', 2);

-- UnityServe Volunteers (org 3)
INSERT INTO project (title, description, location, date, organization_id) VALUES
('Food Drive',           'Help collect and distribute food parcels to those in need in our local community.',      'City Centre, Bulawayo',        '2026-08-30', 3),
('Community Tutoring',   'Volunteer to tutor students in Maths and English to help them succeed academically.',    'Famona Library, Bulawayo',     '2026-09-07', 3),
('Clothing Donation',    'Sort and distribute donated clothing to families affected by recent flooding.',          'Tshabalala, Bulawayo',         '2026-09-21', 3),
('Senior Care Visit',    'Spend time with elderly residents at a local care home — play games and share meals.',   'Barbourfields, Bulawayo',      '2026-10-11', 3),
('Blood Drive',          'Assist the Red Cross in coordinating a community blood donation event.',                 'Mater Dei Hospital, Bulawayo', '2026-10-25', 3);


-- ========================================
-- Category Table
-- ========================================
CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE
);

-- ========================================
-- Insert sample data: Categories
-- ========================================
INSERT INTO category (name) VALUES
('Environmental'),
('Educational'),
('Community Service'),
('Health and Wellness');


-- ========================================
-- Project-Category Junction Table
-- (Many-to-many relationship)
-- ========================================
CREATE TABLE project_category (
    project_id  INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (project_id, category_id),
    CONSTRAINT fk_pc_project
        FOREIGN KEY (project_id)  REFERENCES project(project_id)   ON DELETE CASCADE,
    CONSTRAINT fk_pc_category
        FOREIGN KEY (category_id) REFERENCES category(category_id) ON DELETE CASCADE
);

-- ========================================
-- Insert sample data: Project-Category links
-- ========================================
INSERT INTO project_category (project_id, category_id) VALUES
(1,  1), (1,  3),   -- Park Cleanup          → Environmental, Community Service
(2,  3),            -- School Renovation      → Community Service
(3,  3),            -- Road Repair Drive      → Community Service
(4,  3),            -- Bridge Build           → Community Service
(5,  3),            -- Community Hall Paint   → Community Service
(6,  1), (6,  3),   -- Urban Garden Setup     → Environmental, Community Service
(7,  1),            -- Tree Planting Day      → Environmental
(8,  1), (8,  2),   -- Compost Workshop       → Environmental, Educational
(9,  1),            -- Water Harvesting       → Environmental
(10, 1), (10, 3),   -- Harvest Festival       → Environmental, Community Service
(11, 3), (11, 4),   -- Food Drive             → Community Service, Health and Wellness
(12, 2), (12, 3),   -- Community Tutoring     → Educational, Community Service
(13, 3),            -- Clothing Donation      → Community Service
(14, 3), (14, 4),   -- Senior Care Visit      → Community Service, Health and Wellness
(15, 3), (15, 4);   -- Blood Drive            → Community Service, Health and Wellness