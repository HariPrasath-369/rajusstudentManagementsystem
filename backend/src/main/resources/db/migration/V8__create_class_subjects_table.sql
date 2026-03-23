-- Create class_subjects junction table
CREATE TABLE IF NOT EXISTS class_subjects (
    id BIGSERIAL PRIMARY KEY,
    class_id BIGINT NOT NULL,
    subject_id BIGINT NOT NULL,
    teacher_id BIGINT,
    academic_year VARCHAR(20),
    semester INTEGER,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE SET NULL,
    UNIQUE(class_id, subject_id, academic_year, semester)
);

-- Create indexes
CREATE INDEX idx_class_subjects_class ON class_subjects(class_id);
CREATE INDEX idx_class_subjects_subject ON class_subjects(subject_id);
CREATE INDEX idx_class_subjects_teacher ON class_subjects(teacher_id);
CREATE INDEX idx_class_subjects_academic_year ON class_subjects(academic_year);