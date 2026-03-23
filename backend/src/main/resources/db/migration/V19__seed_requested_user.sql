-- V19__seed_requested_user.sql
-- Seed the specific user requested by the user

INSERT INTO users (name, email, password, role, email_verified, is_active, created_at) 
VALUES (
    'User Student',
    '2k22cse123@kiot.ac.in',
    '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xdqD1RphLVCmdV36',
    'ROLE_STUDENT',
    true,
    true,
    CURRENT_TIMESTAMP
) ON CONFLICT (email) DO NOTHING;

-- Link to students table
-- Assuming class_id = 1 (CSE Year 1 Section A) exists from seed_departments.sql
INSERT INTO students (user_id, class_id, roll_number, registration_number, date_of_birth, is_active) 
SELECT id, 1, '23CSE123', 'REG23123', '2005-01-01', true 
FROM users 
WHERE email = '2k22cse123@kiot.ac.in'
ON CONFLICT (roll_number) DO NOTHING;
