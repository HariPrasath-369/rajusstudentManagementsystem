-- Create subjects table
CREATE TABLE IF NOT EXISTS subjects (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) NOT NULL UNIQUE,
    credit_hours INTEGER,
    dept_id BIGINT,
    semester INTEGER,
    is_elective BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    FOREIGN KEY (dept_id) REFERENCES departments(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX idx_subjects_dept ON subjects(dept_id);
CREATE INDEX idx_subjects_code ON subjects(code);
CREATE INDEX idx_subjects_semester ON subjects(semester);
CREATE INDEX idx_subjects_is_active ON subjects(is_active);