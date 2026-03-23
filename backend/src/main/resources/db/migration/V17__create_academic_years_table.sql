-- Create academic years table
CREATE TABLE IF NOT EXISTS academic_years (
    id BIGSERIAL PRIMARY KEY,
    year VARCHAR(20) NOT NULL UNIQUE,
    start_date DATE,
    end_date DATE,
    is_current BOOLEAN DEFAULT false,
    CONSTRAINT check_academic_year_dates CHECK (end_date >= start_date)
);

-- Create indexes
CREATE INDEX idx_academic_years_year ON academic_years(year);
CREATE INDEX idx_academic_years_current ON academic_years(is_current);