-- Create materials table
CREATE TABLE IF NOT EXISTS materials (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    subject_id BIGINT,
    teacher_id BIGINT NOT NULL,
    type VARCHAR(20),
    file_url VARCHAR(255),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE,
    CONSTRAINT check_material_type CHECK (type IN ('NOTES', 'ASSIGNMENT', 'SYLLABUS', 'REFERENCE', 'VIDEO', 'OTHER'))
);

-- Create indexes
CREATE INDEX idx_materials_subject ON materials(subject_id);
CREATE INDEX idx_materials_teacher ON materials(teacher_id);
CREATE INDEX idx_materials_type ON materials(type);
CREATE INDEX idx_materials_uploaded_at ON materials(uploaded_at);