-- Create semesters table
CREATE TABLE IF NOT EXISTS semesters (
    id BIGSERIAL PRIMARY KEY,
    class_id BIGINT NOT NULL,
    semester_number INTEGER NOT NULL,
    academic_year VARCHAR(20),
    start_date DATE,
    end_date DATE,
    status VARCHAR(20),
    approved_by BIGINT,
    approved_at DATE,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE(class_id, semester_number, academic_year),
    CONSTRAINT check_semester_status CHECK (status IN ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'APPROVED')),
    CONSTRAINT check_semester_dates CHECK (end_date >= start_date)
);

-- Create indexes
CREATE INDEX idx_semesters_class ON semesters(class_id);
CREATE INDEX idx_semesters_status ON semesters(status);
CREATE INDEX idx_semesters_academic_year ON semesters(academic_year);