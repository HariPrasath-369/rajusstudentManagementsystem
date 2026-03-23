-- Create students table
CREATE TABLE IF NOT EXISTS students (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    class_id BIGINT,
    roll_number VARCHAR(20) UNIQUE,
    registration_number VARCHAR(20) UNIQUE,
    date_of_birth DATE,
    father_name VARCHAR(100),
    mother_name VARCHAR(100),
    address TEXT,
    admission_year INTEGER,
    is_active BOOLEAN DEFAULT true,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE SET NULL
);

-- Create indexes
CREATE INDEX idx_students_user ON students(user_id);
CREATE INDEX idx_students_class ON students(class_id);
CREATE INDEX idx_students_roll_number ON students(roll_number);
CREATE INDEX idx_students_registration ON students(registration_number);
CREATE INDEX idx_students_is_active ON students(is_active);