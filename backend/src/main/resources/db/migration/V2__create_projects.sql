CREATE TABLE projects (
                          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                          name VARCHAR(100) NOT NULL,
                          description TEXT,
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE project_members (
                                 project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
                                 user_id UUID REFERENCES users(id) ON DELETE CASCADE,
                                 PRIMARY KEY (project_id, user_id)
);