-- ============================================
-- Seed Departments
-- ============================================

INSERT INTO departments (name, code, description, established_year, is_active) VALUES
('Computer Science and Engineering', 'CSE', 'Department of Computer Science and Engineering', 2000, true),
('Electronics and Communication Engineering', 'ECE', 'Department of Electronics and Communication Engineering', 2001, true),
('Mechanical Engineering', 'ME', 'Department of Mechanical Engineering', 1999, true),
('Civil Engineering', 'CE', 'Department of Civil Engineering', 2002, true),
('Electrical Engineering', 'EE', 'Department of Electrical Engineering', 2000, true),
('Information Technology', 'IT', 'Department of Information Technology', 2005, true),
('Business Administration', 'MBA', 'Department of Business Administration', 2010, true),
('Mathematics', 'MATH', 'Department of Mathematics', 1998, true);

-- ============================================
-- Seed Academic Years
-- ============================================

INSERT INTO academic_years (year, start_date, end_date, is_current) VALUES
('2023-2024', '2023-06-01', '2024-05-31', false),
('2024-2025', '2024-06-01', '2025-05-31', true),
('2025-2026', '2025-06-01', '2026-05-31', false);

-- ============================================
-- Seed Subjects
-- ============================================

-- Computer Science Subjects
INSERT INTO subjects (name, code, credit_hours, dept_id, semester, is_elective, is_active) VALUES
('Data Structures', 'CS201', 4, 1, 3, false, true),
('Algorithms', 'CS202', 4, 1, 4, false, true),
('Database Systems', 'CS301', 3, 1, 5, false, true),
('Operating Systems', 'CS302', 3, 1, 5, false, true),
('Computer Networks', 'CS401', 3, 1, 6, false, true),
('Artificial Intelligence', 'CS402', 3, 1, 6, false, true),
('Machine Learning', 'CS501', 3, 1, 7, true, true),
('Cloud Computing', 'CS502', 3, 1, 7, true, true);

-- Electronics Subjects
INSERT INTO subjects (name, code, credit_hours, dept_id, semester, is_elective, is_active) VALUES
('Digital Electronics', 'EC201', 4, 2, 3, false, true),
('Analog Circuits', 'EC202', 4, 2, 4, false, true),
('Microprocessors', 'EC301', 3, 2, 5, false, true),
('Communication Systems', 'EC302', 3, 2, 5, false, true),
('VLSI Design', 'EC401', 3, 2, 6, false, true),
('Embedded Systems', 'EC402', 3, 2, 6, false, true);

-- Mechanical Subjects
INSERT INTO subjects (name, code, credit_hours, dept_id, semester, is_elective, is_active) VALUES
('Thermodynamics', 'ME201', 4, 3, 3, false, true),
('Fluid Mechanics', 'ME202', 4, 3, 4, false, true),
('Strength of Materials', 'ME301', 3, 3, 5, false, true),
('Machine Design', 'ME302', 3, 3, 5, false, true),
('Manufacturing Processes', 'ME401', 3, 3, 6, false, true);

-- ============================================
-- Seed Classes
-- ============================================

-- Computer Science Classes
INSERT INTO classes (dept_id, year, section, class_size, is_advisor_assigned, advisor_id, is_active) 
SELECT 1, 1, 'A', 60, true, t.id, true 
FROM teachers t 
JOIN users u ON t.user_id = u.id 
WHERE u.email = 'advisor.cs1@university.edu'
ON CONFLICT DO NOTHING;

INSERT INTO classes (dept_id, year, section, class_size, is_active) VALUES
(1, 1, 'B', 60, true),
(1, 2, 'A', 55, true),
(1, 2, 'B', 55, true),
(1, 3, 'A', 50, true),
(1, 3, 'B', 50, true),
(1, 4, 'A', 45, true);

-- Electronics Classes
INSERT INTO classes (dept_id, year, section, class_size, is_active) VALUES
(2, 1, 'A', 60, true),
(2, 2, 'A', 55, true),
(2, 3, 'A', 50, true);

-- Mechanical Classes
INSERT INTO classes (dept_id, year, section, class_size, is_active) VALUES
(3, 1, 'A', 60, true),
(3, 2, 'A', 55, true),
(3, 3, 'A', 50, true);