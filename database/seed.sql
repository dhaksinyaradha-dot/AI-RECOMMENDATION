-- ============================================
-- AI-RECOMMENDATION - SAMPLE SEED DATA
-- ============================================

-- ---------- SKILLS ----------
INSERT INTO skills (skill_name, category) VALUES
('Python', 'Programming'),
('Java', 'Programming'),
('C++', 'Programming'),
('JavaScript', 'Programming'),
('React', 'Web Development'),
('Node.js', 'Backend'),
('SQL', 'Database'),
('Machine Learning', 'AI/ML'),
('Deep Learning', 'AI/ML'),
('TensorFlow', 'AI/ML'),
('PyTorch', 'AI/ML'),
('Generative AI', 'AI/ML'),
('Computer Vision', 'AI/ML'),
('Cybersecurity', 'Security'),
('Cloud Computing', 'Cloud'),
('Docker', 'DevOps'),
('Git', 'Tools'),
('Entrepreneurship', 'Business')
ON CONFLICT (skill_name) DO NOTHING;


-- ---------- INTERESTS ----------
INSERT INTO interests (interest_name) VALUES
('Artificial Intelligence'),
('Generative AI'),
('Web Development'),
('Cybersecurity'),
('Data Science'),
('Cloud Computing'),
('Robotics'),
('Entrepreneurship'),
('Open Source'),
('Competitive Programming')
ON CONFLICT (interest_name) DO NOTHING;


-- ---------- EVENTS ----------
INSERT INTO events
(title, description, event_type, location, mode,
 event_date, registration_deadline, organizer)
VALUES

(
 'Generative AI Hackathon',
 'Build applications using LLMs, RAG and generative AI.',
 'Hackathon',
 'Coimbatore',
 'Offline',
 '2026-10-15',
 '2026-10-05',
 'HackGURU'
),

(
 'Machine Learning Workshop',
 'Hands-on machine learning using Python and scikit-learn.',
 'Workshop',
 'Coimbatore',
 'Offline',
 '2026-10-10',
 '2026-10-08',
 'AI Club'
),

(
 'React Web Development Workshop',
 'Learn React, modern frontend development and API integration.',
 'Workshop',
 'Online',
 'Online',
 '2026-10-12',
 '2026-10-11',
 'WebDev Community'
),

(
 'Cybersecurity Challenge',
 'Solve practical cybersecurity and ethical hacking challenges.',
 'Competition',
 'Online',
 'Online',
 '2026-10-20',
 '2026-10-18',
 'CyberSec Club'
),

(
 'Cloud Computing Conference',
 'Explore cloud architecture, deployment and DevOps.',
 'Conference',
 'Chennai',
 'Offline',
 '2026-11-02',
 '2026-10-28',
 'Cloud Community'
),

(
 'Data Science Hackathon',
 'Build data-driven solutions using Python, SQL and machine learning.',
 'Hackathon',
 'Bengaluru',
 'Hybrid',
 '2026-10-25',
 '2026-10-20',
 'Data Science Society'
),

(
 'Deep Learning with PyTorch',
 'Learn neural networks and computer vision using PyTorch.',
 'Workshop',
 'Online',
 'Online',
 '2026-11-05',
 '2026-11-03',
 'ML Community'
),

(
 'Open Source Sprint',
 'Collaborate on real-world open-source projects using Git and GitHub.',
 'Competition',
 'Coimbatore',
 'Offline',
 '2026-10-30',
 '2026-10-25',
 'Open Source Club'
),

(
 'Competitive Programming Contest',
 'Algorithmic programming contest focused on problem solving.',
 'Competition',
 'Online',
 'Online',
 '2026-10-18',
 '2026-10-17',
 'Coding Club'
),

(
 'Startup Innovation Summit',
 'Explore entrepreneurship, product building and startup strategy.',
 'Conference',
 'Coimbatore',
 'Offline',
 '2026-11-10',
 '2026-11-05',
 'Startup Cell'
);


-- ---------- EVENT ↔ SKILL MAPPING ----------
INSERT INTO event_skills (event_id, skill_id)
SELECT e.event_id, s.skill_id
FROM events e
CROSS JOIN skills s
WHERE
    (
        e.title = 'Generative AI Hackathon'
        AND s.skill_name IN
        ('Python', 'Machine Learning', 'Generative AI')
    )
    OR
    (
        e.title = 'Machine Learning Workshop'
        AND s.skill_name IN
        ('Python', 'Machine Learning', 'SQL')
    )
    OR
    (
        e.title = 'React Web Development Workshop'
        AND s.skill_name IN
        ('JavaScript', 'React', 'Node.js')
    )
    OR
    (
        e.title = 'Cybersecurity Challenge'
        AND s.skill_name IN
        ('Cybersecurity', 'Python', 'Git')
    )
    OR
    (
        e.title = 'Cloud Computing Conference'
        AND s.skill_name IN
        ('Cloud Computing', 'Docker', 'Git')
    )
    OR
    (
        e.title = 'Data Science Hackathon'
        AND s.skill_name IN
        ('Python', 'SQL', 'Machine Learning')
    )
    OR
    (
        e.title = 'Deep Learning with PyTorch'
        AND s.skill_name IN
        ('Python', 'Deep Learning', 'PyTorch', 'Computer Vision')
    )
    OR
    (
        e.title = 'Open Source Sprint'
        AND s.skill_name IN
        ('Git', 'JavaScript', 'Python')
    )
    OR
    (
        e.title = 'Competitive Programming Contest'
        AND s.skill_name IN
        ('Python', 'Java', 'C++')
    )
    OR
    (
        e.title = 'Startup Innovation Summit'
        AND s.skill_name IN
        ('Entrepreneurship')
    )
ON CONFLICT DO NOTHING;