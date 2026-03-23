-- Create attendance table
CREATE TABLE IF NOT EXISTS attendance (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL,
    class_id BIGINT NOT NULL,
    subject_id BIGINT,
    date DATE NOT NULL,
    status VARCHAR(10) NOT NULL,
    is_submitted BOOLEAN DEFAULT false,
    submitted_by BIGINT,
    submitted_at TIMESTAMP,
    remarks TEXT,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE SET NULL,
    UNIQUE(student_id, class_id, date),
    CONSTRAINT check_attendance_status CHECK (status IN ('PRESENT', 'ABSENT', 'LATE', 'LEAVE'))
);

-- Create indexes
CREATE INDEX idx_attendance_student ON attendance(student_id);
CREATE INDEX idx_attendance_class_date ON attendance(class_id, date);
CREATE INDEX idx_attendance_subject ON attendance(subject_id);
CREATE INDEX idx_attendance_status ON attendance(status);
CREATE INDEX idx_attendance_is_submitted ON attendance(is_submitted);