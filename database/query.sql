USE CAPSTONE_PROJECT;

-- 1. Table: users
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Table: account
CREATE TABLE account (
    account_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    balance DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 3. Table: transaction_category
CREATE TABLE transaction_category (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(50) NOT NULL
);

-- 4. Table: transactions
CREATE TABLE transactions (
    transaction_id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    account_id INT NOT NULL,
    amount DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    description VARCHAR(255) NOT NULL,
    type ENUM('income', 'expense') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES account(account_id),
    FOREIGN KEY (category_id) REFERENCES transaction_category(category_id)
); 

-- Insert default categories
INSERT INTO transaction_category (category) 
VALUES 
('FOOD & BEVERAGE'),
('TRANSPORTATION'),
('HOUSING'),
('HEALTH'),
('LIFESTYLE'),
('INCOME'),
('OTHERS');