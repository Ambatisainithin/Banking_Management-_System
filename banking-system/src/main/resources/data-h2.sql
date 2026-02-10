-- H2 Database Initialization Data for Azure Deployment

-- Admin
INSERT INTO admin (admin_id, name, email, password) VALUES (1, 'Administrator', 'admin@bestbank.com', 'admin123');

-- Branch
INSERT INTO branch (branch_id, branch_name, branch_code, address) VALUES (1, 'Main Branch', 'MAIN001', '123 Main Street');

-- Customers
INSERT INTO customer (customer_id, name, email, phone, address, password, created_date) VALUES 
(1, 'Amitkumar Gouda', 'amit@example.com', '9876543210', '123 Street', 'pass123', CURRENT_DATE),
(2, 'Priya Sharma', 'priya@example.com', '9876543211', '456 Ave', 'pass123', CURRENT_DATE),
(3, 'Rahul Verma', 'rahul@example.com', '9876543212', '789 Road', 'pass123', CURRENT_DATE);

-- Accounts
INSERT INTO account (account_id, account_number, account_type, balance, status, opened_date, customer_id, branch_id, admin_id) VALUES 
(1, 'ACC10001', 'SAVINGS', 25000.00, 'ACTIVE', CURRENT_DATE, 1, 1, 1),
(2, 'ACC10002', 'CURRENT', 50000.00, 'ACTIVE', CURRENT_DATE, 1, 1, 1),
(3, 'ACC10003', 'SAVINGS', 15000.00, 'ACTIVE', CURRENT_DATE, 2, 1, 1),
(4, 'ACC10004', 'CHECKING', 8000.00, 'ACTIVE', CURRENT_DATE, 3, 1, 1);

-- Transactions
INSERT INTO transaction (transaction_id, amount, transaction_type, status, account_id) VALUES 
(1, 5000.00, 'DEPOSIT', 'SUCCESS', 1),
(2, 2000.00, 'WITHDRAWAL', 'SUCCESS', 1),
(3, 1000.00, 'TRANSFER', 'SUCCESS', 1),
(4, 3000.00, 'DEPOSIT', 'SUCCESS', 2),
(5, 500.00, 'WITHDRAWAL', 'SUCCESS', 3);
