-- Create OTP table
CREATE TABLE IF NOT EXISTS otp (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    otp VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    is_used BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_otp_email ON otp(email);
CREATE INDEX idx_otp_expires ON otp(expires_at);
CREATE INDEX idx_otp_is_used ON otp(is_used);