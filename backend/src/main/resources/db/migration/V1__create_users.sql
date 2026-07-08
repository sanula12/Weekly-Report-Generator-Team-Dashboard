CREATE TYPE user_role AS ENUM ('MEMBER', 'MANAGER');

CREATE TABLE users (
                       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                       name VARCHAR(100) NOT NULL,
                       email VARCHAR(255) NOT NULL UNIQUE,
                       password VARCHAR(255) NOT NULL,
                       role user_role NOT NULL DEFAULT 'MEMBER',
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);