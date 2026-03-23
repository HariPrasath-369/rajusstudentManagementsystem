-- Create classes table
CREATE TABLE IF NOT EXISTS classes (
    id BIGSERIAL PRIMARY KEY,
    dept_id BIGINT NOT NULL,
    year INTEGER NOT NULL,
    section VARCHAR(10),
    class_size INTEGER,
    advisor_id BIGINT,
    is_active BOOLEAN DEFAULT true,
    FOREIGN KEY (dept_id) REFERENCES departments(id) ON DELETE CASCADE,
    FOREIGN KEY (advisor_id) REFERENCES teachers(id) ON DELETE SET NULL,
    UNIQUE(dept_id, year, section)
);

-- Create indexes
CREATE INDEX idx_classes_dept ON classes(dept_id);
CREATE INDEX idx_classes_advisor ON classes(advisor_id);
CREATE INDEX idx_classes_year ON classes(year);
CREATE INDEX idx_classes_is_active ON classes(is_active);