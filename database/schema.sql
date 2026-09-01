CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    location VARCHAR(100),
    career_goal VARCHAR(150),
    target_company VARCHAR(150),
    github_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE skills (
    skill_id SERIAL PRIMARY KEY,
    skill_name VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(100)
);
CREATE TABLE user_skills (
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    skill_id INT REFERENCES skills(skill_id) ON DELETE CASCADE,
    proficiency_level INT CHECK (proficiency_level BETWEEN 1 AND 5),
    PRIMARY KEY (user_id, skill_id)
);
CREATE TABLE events (
    event_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_type VARCHAR(50),
    location VARCHAR(100),
    mode VARCHAR(20),
    event_date DATE,
    registration_deadline DATE,
    organizer VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE event_skills (
    event_id INT REFERENCES events(event_id) ON DELETE CASCADE,
    skill_id INT REFERENCES skills(skill_id) ON DELETE CASCADE,
    PRIMARY KEY (event_id, skill_id)
);
CREATE TABLE user_events (
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    event_id INT REFERENCES events(event_id) ON DELETE CASCADE,
    status VARCHAR(20) CHECK (
        status IN ('saved', 'registered', 'completed')
    ),
    PRIMARY KEY (user_id, event_id)
);
CREATE TABLE interests (
    interest_id SERIAL PRIMARY KEY,
    interest_name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE user_interests (
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    interest_id INT REFERENCES interests(interest_id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, interest_id)
);
CREATE TABLE recommendations (
    recommendation_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    event_id INT REFERENCES events(event_id) ON DELETE CASCADE,
    match_score DECIMAL(5,2),
    recommendation_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);