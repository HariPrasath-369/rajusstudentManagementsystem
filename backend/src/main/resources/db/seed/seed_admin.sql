-- ============================================
-- Seed Admin User (Password: Admin@123)
-- ============================================

-- Insert Principal user
-- Password is BCrypt encoded for "Admin@123"
INSERT INTO users (name, email, password, role, email_verified, is_active, created_at) 
VALUES (
    'System Administrator',
    'admin@university.edu',
    '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xdqD1RphLVCmdV36',
    'ROLE_PRINCIPAL',
    true,
    true,
    CURRENT_TIMESTAMP
) ON CONFLICT (email) DO NOTHING;

-- ============================================
-- Seed Sample HOD Users
-- ============================================

-- Computer Science HOD
INSERT INTO users (name, email, password, role, email_verified, is_active, created_at) 
VALUES (
    'Dr. John Smith',
    'hod.cse@university.edu',
    '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xdqD1RphLVCmdV36',
    'ROLE_HOD',
    true,
    true,
    CURRENT_TIMESTAMP
) ON CONFLICT (email) DO NOTHING;

-- Electronics HOD
INSERT INTO users (name, email, password, role, email_verified, is_active, created_at) 
VALUES (
    'Dr. Sarah Johnson',
    'hod.ece@university.edu',
    '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xdqD1RphLVCmdV36',
    'ROLE_HOD',
    true,
    true,
    CURRENT_TIMESTAMP
) ON CONFLICT (email) DO NOTHING;

-- Mechanical HOD
INSERT INTO users (name, email, password, role, email_verified, is_active, created_at) 
VALUES (
    'Dr. Robert Williams',
    'hod.me@university.edu',
    '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xdqD1RphLVCmdV36',
    'ROLE_HOD',
    true,
    true,
    CURRENT_TIMESTAMP
) ON CONFLICT (email) DO NOTHING;

-- ============================================
-- Seed Sample Teacher Users
-- ============================================

INSERT INTO users (name, email, password, role, email_verified, is_active, created_at) VALUES
('Prof. Alice Brown', 'teacher.cs1@university.edu', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xdqD1RphLVCmdV36', 'ROLE_TEACHER', true, true, CURRENT_TIMESTAMP),
('Prof. Bob Wilson', 'teacher.cs2@university.edu', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xdqD1RphLVCmdV36', 'ROLE_TEACHER', true, true, CURRENT_TIMESTAMP),
('Prof. Carol Davis', 'teacher.ece1@university.edu', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xdqD1RphLVCmdV36', 'ROLE_TEACHER', true, true, CURRENT_TIMESTAMP),
('Prof. David Miller', 'teacher.me1@university.edu', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xdqD1RphLVCmdV36', 'ROLE_TEACHER', true, true, CURRENT_TIMESTAMP);

-- ============================================
-- Seed Sample Class Advisor (CA) Users
-- ============================================

INSERT INTO users (name, email, password, role, email_verified, is_active, created_at) VALUES
('Advisor Jane Doe', 'advisor.cs1@university.edu', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xdqD1RphLVCmdV36', 'ROLE_CA', true, true, CURRENT_TIMESTAMP);

-- ============================================
-- Seed Sample Student Users
-- ============================================

INSERT INTO users (name, email, password, role, email_verified, is_active, created_at) VALUES
('Student One', 'student1@university.edu', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xdqD1RphLVCmdV36', 'ROLE_STUDENT', true, true, CURRENT_TIMESTAMP),
('Student Two', 'student2@university.edu', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xdqD1RphLVCmdV36', 'ROLE_STUDENT', true, true, CURRENT_TIMESTAMP),
('Student Three', 'student3@university.edu', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xdqD1RphLVCmdV36', 'ROLE_STUDENT', true, true, CURRENT_TIMESTAMP),
('User Student', '2k22cse123@kiot.ac.in', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xdqD1RphLVCmdV36', 'ROLE_STUDENT', true, true, CURRENT_TIMESTAMP);

-- ============================================
-- Seed HODs
-- ============================================

INSERT INTO hods (user_id, dept_id, employee_id, joining_date, is_active) 
SELECT id, 1, 'HOD_CSE_001', CURRENT_TIMESTAMP, true FROM users WHERE email = 'hod.cse@university.edu'
ON CONFLICT (employee_id) DO NOTHING;

INSERT INTO hods (user_id, dept_id, employee_id, joining_date, is_active) 
SELECT id, 2, 'HOD_ECE_001', CURRENT_TIMESTAMP, true FROM users WHERE email = 'hod.ece@university.edu'
ON CONFLICT (employee_id) DO NOTHING;

INSERT INTO hods (user_id, dept_id, employee_id, joining_date, is_active) 
SELECT id, 3, 'HOD_ME_001', CURRENT_TIMESTAMP, true FROM users WHERE email = 'hod.me@university.edu'
ON CONFLICT (employee_id) DO NOTHING;

-- ============================================
-- Seed Teachers
-- ============================================

INSERT INTO teachers (user_id, dept_id, employee_id, qualification, specialization, joining_date, is_active) 
SELECT id, 1, 'T_CSE_001', 'PhD', 'Machine Learning', CURRENT_TIMESTAMP, true FROM users WHERE email = 'teacher.cs1@university.edu'
ON CONFLICT (employee_id) DO NOTHING;

INSERT INTO teachers (user_id, dept_id, employee_id, qualification, specialization, joining_date, is_active) 
SELECT id, 1, 'T_CSE_002', 'M.Tech', 'Algorithms', CURRENT_TIMESTAMP, true FROM users WHERE email = 'teacher.cs2@university.edu'
ON CONFLICT (employee_id) DO NOTHING;

INSERT INTO teachers (user_id, dept_id, employee_id, qualification, specialization, joining_date, is_active) 
SELECT id, 2, 'T_ECE_001', 'PhD', 'VLSI', CURRENT_TIMESTAMP, true FROM users WHERE email = 'teacher.ece1@university.edu'
ON CONFLICT (employee_id) DO NOTHING;

INSERT INTO teachers (user_id, dept_id, employee_id, qualification, specialization, joining_date, is_active) 
SELECT id, 3, 'T_ME_001', 'M.E', 'Thermodynamics', CURRENT_TIMESTAMP, true FROM users WHERE email = 'teacher.me1@university.edu'
ON CONFLICT (employee_id) DO NOTHING;

-- Seed CA as Teacher
INSERT INTO teachers (user_id, dept_id, employee_id, qualification, specialization, joining_date, is_active) 
SELECT id, 1, 'CA_CSE_001', 'M.Tech', 'Computer Science', CURRENT_TIMESTAMP, true FROM users WHERE email = 'advisor.cs1@university.edu'
ON CONFLICT (employee_id) DO NOTHING;

-- ============================================
-- Seed Students
-- ============================================

INSERT INTO students (user_id, class_id, roll_number, registration_number, date_of_birth, is_active) 
SELECT id, 1, 'CSE23001', 'REG23001', '2005-05-15', true FROM users WHERE email = 'student1@university.edu'
ON CONFLICT (roll_number) DO NOTHING;

INSERT INTO students (user_id, class_id, roll_number, registration_number, date_of_birth, is_active) 
SELECT id, 1, 'CSE23002', 'REG23002', '2005-08-20', true FROM users WHERE email = 'student2@university.edu'
ON CONFLICT (roll_number) DO NOTHING;

INSERT INTO students (user_id, class_id, roll_number, registration_number, date_of_birth, is_active) 
SELECT id, 2, 'CSE23003', 'REG23003', '2005-03-10', true FROM users WHERE email = 'student3@university.edu'
ON CONFLICT (roll_number) DO NOTHING;

INSERT INTO students (user_id, class_id, roll_number, registration_number, date_of_birth, is_active) 
SELECT id, 1, '23CSE123', 'REG23123', '2005-01-01', true FROM users WHERE email = '2k22cse123@kiot.ac.in'
ON CONFLICT (roll_number) DO NOTHING;