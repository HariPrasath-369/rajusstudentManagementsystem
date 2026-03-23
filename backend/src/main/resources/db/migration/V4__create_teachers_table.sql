-- Create teachers table
CREATE TABLE IF NOT EXISTS teachers (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    dept_id BIGINT,
    employee_id VARCHAR(50) UNIQUE,
    qualification VARCHAR(255),
    specialization VARCHAR(255),
    joining_date TIMESTAMP,
    is_class_advisor BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (dept_id) REFERENCES departments(id) ON DELETE SET NULL
);

-- Create indexes
CREATE INDEX idx_teachers_user ON teachers(user_id);
CREATE INDEX idx_teachers_dept ON teachers(dept_id);
CREATE INDEX idx_teachers_employee_id ON teachers(employee_id);
CREATE INDEX idx_teachers_is_active ON teachers(is_active);
CREATE INDEX idx_teachers_class_advisor ON teachers(is_class_advisor);