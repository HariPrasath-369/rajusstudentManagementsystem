-- Create marks table
CREATE TABLE IF NOT EXISTS marks (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL,
    subject_id BIGINT NOT NULL,
    marks_type VARCHAR(20) NOT NULL,
    marks_obtained DECIMAL(5,2),
    max_marks DECIMAL(5,2),
    academic_year VARCHAR(20),
    semester INTEGER,
    entered_by BIGINT,
    entered_at TIMESTAMP,
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    UNIQUE(student_id, subject_id, marks_type, semester),
    CONSTRAINT check_marks_range CHECK (marks_obtained >= 0 AND marks_obtained <= max_marks),
    CONSTRAINT check_marks_type CHECK (marks_type IN ('ASSESSMENT', 'PRACTICAL', 'SEMESTER', 'INTERNAL', 'EXTERNAL'))
);

-- Create indexes
CREATE INDEX idx_marks_student ON marks(student_id);
CREATE INDEX idx_marks_subject ON marks(subject_id);
CREATE INDEX idx_marks_semester ON marks(semester);
CREATE INDEX idx_marks_is_published ON marks(is_published);