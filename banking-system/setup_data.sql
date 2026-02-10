-- =============================================
-- BANKING SYSTEM - COMPLETE DATABASE SETUP
-- =============================================
-- This script initializes the database schema and data
-- Works with both MySQL CLI and Docker initialization

-- Use the database (created by Docker or manually)
CREATE DATABASE IF NOT EXISTS banking_system;
USE banking_system;

-- =============================================
-- STEP 1: DROP EXISTING TABLES (to fix schema)
-- =============================================
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS transaction;
DROP TABLE IF EXISTS account;
DROP TABLE IF EXISTS customer;
DROP TABLE IF EXISTS branch;
DROP TABLE IF EXISTS admin;
SET FOREIGN_KEY_CHECKS = 1;

-- =============================================
-- STEP 2: CREATE TABLES WITH CORRECT SCHEMA
-- =============================================

CREATE TABLE admin (
    admin_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    role VARCHAR(50),
    password VARCHAR(255)
);

CREATE TABLE branch (
    branch_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    branch_name VARCHAR(255),
    branch_code VARCHAR(50),
    address VARCHAR(500)
);

CREATE TABLE customer (
    customer_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    address VARCHAR(500),
    password VARCHAR(255),
    created_date DATE
);

CREATE TABLE account (
    account_id INT AUTO_INCREMENT PRIMARY KEY,
    account_number VARCHAR(50) NOT NULL UNIQUE,
    account_type VARCHAR(50) NOT NULL,
    balance DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    opened_date DATE,
    customer_id BIGINT,
    branch_id BIGINT,
    admin_id BIGINT,
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id) ON DELETE CASCADE,
    FOREIGN KEY (branch_id) REFERENCES branch(branch_id),
    FOREIGN KEY (admin_id) REFERENCES admin(admin_id)
);

CREATE TABLE transaction (
    transaction_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    amount DECIMAL(15,2) NOT NULL,
    transaction_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'SUCCESS',
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    account_id INT,
    FOREIGN KEY (account_id) REFERENCES account(account_id) ON DELETE CASCADE
);

-- =============================================
-- STEP 3: INSERT REQUIRED DATA
-- =============================================

-- Admin (login: admin@bestbank.com / admin123)
INSERT INTO admin (admin_id, name, email, password) VALUES
(1, 'Administrator', 'admin@bestbank.com', 'admin123');

-- Branch
INSERT INTO branch (branch_id, branch_name, branch_code, address) VALUES
(1, 'Main Branch', 'MAIN001', '123 Main Street, City Center');

-- Customers
-- Customer 1: Login as 1@bestbank.com / pass123
-- Customer 2: Login as 2@bestbank.com / pass123  
-- Customer 3: Login as 3@bestbank.com / pass123
INSERT INTO customer (customer_id, name, email, phone, address, password, created_date) VALUES
(1, 'Amitkumar Gouda', 'amit@example.com', '9876543210', '123 Customer Street', 'pass123', CURDATE()),
(2, 'Priya Sharma', 'priya@example.com', '9876543211', '456 Second Ave', 'pass123', CURDATE()),
(3, 'Rahul Verma', 'rahul@example.com', '9876543212', '789 Third Road', 'pass123', CURDATE());

-- Accounts
INSERT INTO account (account_id, account_number, account_type, balance, status, opened_date, customer_id, branch_id, admin_id) VALUES
(1, 'ACC10001', 'SAVINGS', 25000.00, 'ACTIVE', CURDATE(), 1, 1, 1),
(2, 'ACC10002', 'CURRENT', 50000.00, 'ACTIVE', CURDATE(), 1, 1, 1),
(3, 'ACC10003', 'SAVINGS', 15000.00, 'ACTIVE', CURDATE(), 2, 1, 1),
(4, 'ACC10004', 'CHECKING', 8000.00, 'ACTIVE', CURDATE(), 3, 1, 1);

-- Transactions
INSERT INTO transaction (transaction_id, amount, transaction_type, status, account_id) VALUES
(1, 5000.00, 'DEPOSIT', 'SUCCESS', 1),
(2, 2000.00, 'WITHDRAWAL', 'SUCCESS', 1),
(3, 1000.00, 'TRANSFER', 'SUCCESS', 1),
(4, 3000.00, 'DEPOSIT', 'SUCCESS', 2),
(5, 500.00, 'WITHDRAWAL', 'SUCCESS', 3);

-- =============================================
-- STEP 4: VERIFY DATA
-- =============================================

SELECT '========== CUSTOMERS ==========' AS '';
SELECT customer_id, name, email, phone, password FROM customer;

SELECT '========== ACCOUNTS ==========' AS '';
SELECT a.account_id, a.account_number, a.account_type, a.balance, a.status, c.name AS customer_name
FROM account a
JOIN customer c ON a.customer_id = c.customer_id;

SELECT '========== TRANSACTIONS ==========' AS '';
SELECT t.transaction_id, t.amount, t.transaction_type, t.status, a.account_number
FROM transaction t
JOIN account a ON t.account_id = a.account_id;

-- =============================================
-- LOGIN CREDENTIALS
-- =============================================
-- ADMIN LOGIN:
--   Email: admin@bestbank.com
--   Password: admin123
--
-- CUSTOMER LOGINS:
--   Customer 1 (Amitkumar): 1@bestbank.com / pass123
--   Customer 2 (Priya):     2@bestbank.com / pass123
--   Customer 3 (Rahul):     3@bestbank.com / pass123
-- =============================================
