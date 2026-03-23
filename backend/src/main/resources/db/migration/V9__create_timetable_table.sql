-- Create timetable table
CREATE TABLE IF NOT EXISTS timetable (
    id BIGSERIAL PRIMARY KEY,
    class_id BIGINT NOT NULL,
    subject_id BIGINT NOT NULL,
    teacher_id BIGINT NOT NULL,
    day_of_week VARCHAR(10) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    academic_year VARCHAR(20),
    semester INTEGER,
    room_number VARCHAR(20),
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE,
    CONSTRAINT check_time_range CHECK (start_time < end_time)
);

-- Create indexes
CREATE INDEX idx_timetable_class ON timetable(class_id);
CREATE INDEX idx_timetable_teacher ON timetable(teacher_id);
CREATE INDEX idx_timetable_day ON timetable(day_of_week);
CREATE INDEX idx_timetable_class_day ON timetable(class_id, day_of_week);