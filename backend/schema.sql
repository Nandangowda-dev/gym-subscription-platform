-- FITCORE Gym Database Schema
-- Run this script inside your PostgreSQL database to initialize the production-grade tables.

-- Drop tables if they exist (for a clean setup)
DROP TABLE IF EXISTS trainers CASCADE;
DROP TABLE IF EXISTS plans CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user' NOT NULL, -- 'user', 'admin'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Plans Table
CREATE TABLE plans (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    price INT NOT NULL, -- price in INR
    features TEXT[] NOT NULL, -- Array of features
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Trainers Table
CREATE TABLE trainers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    specialty VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed Default Admin User (Password is hashed: 'admin123')
-- Hash created using bcrypt with 10 rounds: $2a$10$T6q9xI8Y3tXW21fFf9F4xeG6L36n.d/hJ02R1qFkO5.L3sQ6HwHn2 (or similar)
-- For easy startup, the backend automatically seeds the admin user if the table is empty!

-- Seed Default Plans (Prices in INR)
INSERT INTO plans (name, price, features, is_active) VALUES
('Basic', 1499, ARRAY['Full gym access', 'Locker room access', '1 complementary fitness assessment'], true),
('Premium', 2999, ARRAY['Full gym access', 'Locker room access', 'Unlimited group classes', 'Custom workout plan'], true),
('Pro', 5999, ARRAY['Full gym access', 'Locker room & Sauna', 'Unlimited group classes', '4x Personal training/mo', 'Nutrition guide'], true);

-- Seed Default Trainers
INSERT INTO trainers (name, specialty, is_active) VALUES
('Coach Rajesh', 'Bodybuilding & Strength', true),
('Coach Priya', 'CrossFit & Cardio', true),
('Coach Amit', 'Yoga & Core Recovery', true);
