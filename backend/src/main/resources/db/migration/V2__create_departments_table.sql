-- Create departments table (Trigger Checksum Mismatch)
CREATE TABLE IF NOT EXISTS departments (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(10) NOT NULL UNIQUE,
    description TEXT,
    hod_id BIGINT,
    established_year INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_departments_code ON departments(code);
CREATE INDEX idx_departments_hod ON departments(hod_id);
CREATE INDEX idx_departments_is_active ON departments(is_active);