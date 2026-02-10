-- Banking System Database Schema
-- Run this script in MySQL to create the necessary tables

CREATE DATABASE IF NOT EXISTS banking_system;
USE banking_system;

-- Admin table
CREATE TABLE IF NOT EXISTS admin (
    admin_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255)
);

-- Branch table
CREATE TABLE IF NOT EXISTS branch (
    branch_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    branch_name VARCHAR(255),
    branch_code VARCHAR(50),
    address VARCHAR(500)
);

-- Customer table
CREATE TABLE IF NOT EXISTS customer (
    customer_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    address VARCHAR(500),
    password VARCHAR(255),
    created_date DATE
);

-- Account table
CREATE TABLE IF NOT EXISTS account (
    account_id INT AUTO_INCREMENT PRIMARY KEY,
    account_number VARCHAR(50) NOT NULL UNIQUE,
    account_type VARCHAR(50) NOT NULL,
    balance DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    status VARCHAR(20),
    opened_date DATE,
    customer_id BIGINT,
    branch_id BIGINT,
    admin_id BIGINT,
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id),
    FOREIGN KEY (branch_id) REFERENCES branch(branch_id),
    FOREIGN KEY (admin_id) REFERENCES admin(admin_id)
);

-- Transaction table
CREATE TABLE IF NOT EXISTS transaction (
    transaction_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    amount DECIMAL(15,2),
    transaction_type VARCHAR(50),
    status VARCHAR(20),
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    account_id INT,
    FOREIGN KEY (account_id) REFERENCES account(account_id)
);

-- Insert default admin (ID: 1, Password: admin123)
INSERT INTO admin (admin_id, name, email, password) 
VALUES (1, 'Administrator', 'admin@bank.com', 'admin123')
ON DUPLICATE KEY UPDATE name = name;

-- Insert default branch
INSERT INTO branch (branch_id, branch_name, branch_code, address)
VALUES (1, 'Main Branch', 'MAIN001', '123 Main Street')
ON DUPLICATE KEY UPDATE branch_name = branch_name;

-- Verify tables
SHOW TABLES;
