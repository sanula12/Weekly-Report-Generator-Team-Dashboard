CREATE TYPE report_status AS ENUM ('DRAFT', 'SUBMITTED', 'LATE');

CREATE TABLE reports (
                         id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                         user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                         project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
                         week_start DATE NOT NULL,
                         week_end DATE NOT NULL,
                         tasks_completed TEXT NOT NULL,
                         tasks_planned TEXT NOT NULL,
                         blockers TEXT,
                         hours_worked INTEGER,
                         notes TEXT,
                         status report_status NOT NULL DEFAULT 'DRAFT',
                         submitted_at TIMESTAMP,
                         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);