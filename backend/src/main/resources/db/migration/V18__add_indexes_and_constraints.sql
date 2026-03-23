-- ============================================
-- Additional Indexes for Performance
-- ============================================

-- Composite indexes for common queries
CREATE INDEX idx_attendance_student_date ON attendance(student_id, date);
CREATE INDEX idx_marks_student_semester ON marks(student_id, semester);
CREATE INDEX idx_timetable_teacher_day ON timetable(teacher_id, day_of_week);
CREATE INDEX idx_leaves_student_status ON leaves(student_id, status);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);

-- Partial indexes for active records
CREATE INDEX idx_users_active ON users(id) WHERE is_active = true;
CREATE INDEX idx_teachers_active ON teachers(id) WHERE is_active = true;
CREATE INDEX idx_students_active ON students(id) WHERE is_active = true;

-- ============================================
-- Foreign Key Constraints
-- ============================================

-- Add missing foreign key constraints
ALTER TABLE departments ADD CONSTRAINT fk_departments_hod 
    FOREIGN KEY (hod_id) REFERENCES hods(id) ON DELETE SET NULL;

ALTER TABLE classes ADD CONSTRAINT fk_classes_advisor 
    FOREIGN KEY (advisor_id) REFERENCES teachers(id) ON DELETE SET NULL;

ALTER TABLE class_subjects ADD CONSTRAINT fk_class_subjects_teacher 
    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE SET NULL;

ALTER TABLE attendance ADD CONSTRAINT fk_attendance_submitted_by 
    FOREIGN KEY (submitted_by) REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE marks ADD CONSTRAINT fk_marks_entered_by 
    FOREIGN KEY (entered_by) REFERENCES users(id) ON DELETE SET NULL;

-- ============================================
-- Check Constraints
-- ============================================

-- Additional check constraints for data integrity
ALTER TABLE users ADD CONSTRAINT chk_user_email_format 
    CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

ALTER TABLE students ADD CONSTRAINT chk_student_roll_format 
    CHECK (roll_number ~ '^[A-Z0-9]{5,15}$');

ALTER TABLE subjects ADD CONSTRAINT chk_credit_hours 
    CHECK (credit_hours BETWEEN 1 AND 6);

ALTER TABLE timetable ADD CONSTRAINT chk_timetable_duration 
    CHECK (EXTRACT(HOUR FROM (end_time - start_time)) <= 2);

-- ============================================
-- Triggers for Audit
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Views for Analytics
-- ============================================

-- Student performance view
CREATE OR REPLACE VIEW student_performance_view AS
SELECT 
    s.id AS student_id,
    s.roll_number,
    u.name AS student_name,
    c.id AS class_id,
    c.year,
    c.section,
    AVG(m.marks_obtained / m.max_marks * 100) AS average_percentage,
    COUNT(DISTINCT CASE WHEN a.status = 'PRESENT' THEN a.date END) * 100.0 / 
        COUNT(DISTINCT a.date) AS attendance_percentage
FROM students s
JOIN users u ON s.user_id = u.id
JOIN classes c ON s.class_id = c.id
LEFT JOIN marks m ON s.id = m.student_id AND m.is_published = true
LEFT JOIN attendance a ON s.id = a.student_id
WHERE s.is_active = true
GROUP BY s.id, s.roll_number, u.name, c.id, c.year, c.section;

-- Department statistics view
CREATE OR REPLACE VIEW department_statistics_view AS
SELECT 
    d.id AS department_id,
    d.name AS department_name,
    COUNT(DISTINCT t.id) AS teacher_count,
    COUNT(DISTINCT s.id) AS student_count,
    COUNT(DISTINCT sub.id) AS subject_count,
    COUNT(DISTINCT c.id) AS class_count
FROM departments d
LEFT JOIN teachers t ON d.id = t.dept_id AND t.is_active = true
LEFT JOIN classes c ON d.id = c.dept_id AND c.is_active = true
LEFT JOIN students s ON c.id = s.class_id AND s.is_active = true
LEFT JOIN subjects sub ON d.id = sub.dept_id AND sub.is_active = true
WHERE d.is_active = true
GROUP BY d.id, d.name;