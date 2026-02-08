-- 1. Create the Database
CREATE DATABASE IF NOT EXISTS portfolio_db;
USE portfolio_db;

-- 2. Create the Leads Table
CREATE TABLE IF NOT EXISTS leads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    source VARCHAR(50) DEFAULT 'Website',
    status ENUM('New', 'Contacted', 'Converted') DEFAULT 'New',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Optional: Insert a sample lead to test
INSERT INTO leads (name, email, source, status, notes) 
VALUES ('Test User', 'test@example.com', 'Website', 'New', 'This is a sample lead for testing.');