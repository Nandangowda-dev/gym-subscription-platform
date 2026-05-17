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

-- 3. Trainers Table (Contains private PII data secure from public leakage)
CREATE TABLE trainers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    specialty VARCHAR(100) NOT NULL,
    age INT,
    gender VARCHAR(20),
    email VARCHAR(150),
    phone VARCHAR(20),
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed Default Admin User (Password: 'admin123')
-- Seed Default Plans (Prices in INR)
INSERT INTO plans (name, price, features, is_active) VALUES
('Basic', 1499, ARRAY['Full gym access', 'Locker room access', '1 complementary fitness assessment'], true),
('Premium', 2999, ARRAY['Full gym access', 'Locker room access', 'Unlimited group classes', 'Custom workout plan'], true),
('Pro', 5999, ARRAY['Full gym access', 'Locker room & Sauna', 'Unlimited group classes', '4x Personal training/mo', 'Nutrition guide'], true);

-- Seed Default Trainers (with private demographic fields)
INSERT INTO trainers (name, specialty, age, gender, email, phone, image_url, is_active) VALUES
('Coach Rajesh', 'Bodybuilding & Strength', 32, 'Male', 'rajesh@fitcore.in', '+91 98765 43210', 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=150&auto=format&fit=crop&q=80', true),
('Coach Priya', 'CrossFit & Cardio', 28, 'Female', 'priya@fitcore.in', '+91 87654 32109', 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=150&auto=format&fit=crop&q=80', true),
('Coach Amit', 'Yoga & Core Recovery', 35, 'Male', 'amit@fitcore.in', '+91 76543 21098', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', true);
