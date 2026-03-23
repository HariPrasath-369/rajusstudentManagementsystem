-- Create hods table
CREATE TABLE IF NOT EXISTS hods (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    dept_id BIGINT NOT NULL,
    appointment_date TIMESTAMP,
    office_room VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (dept_id) REFERENCES departments(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX idx_hods_user ON hods(user_id);
CREATE INDEX idx_hods_dept ON hods(dept_id);
CREATE INDEX idx_hods_is_active ON hods(is_active);