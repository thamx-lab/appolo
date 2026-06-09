-- ==========================================
-- BLACK SHEEP - DATABASE SCHEMA
-- This file contains SQL instructions to setup tables in your Supabase PostgreSQL Database.
-- Run this in the Supabase SQL Editor to configure your database tables.
-- ==========================================

-- 1. Enable UUID Extension (this helps create unique random IDs automatically)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Clean existing tables if they exist to avoid conflict
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS members;
DROP TABLE IF EXISTS contacts;
DROP TABLE IF EXISTS plans;

-- 3. PLANS TABLE (Holds the membership tiers)
CREATE TABLE plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    price NUMERIC(10, 2) NOT NULL,
    duration VARCHAR(50) NOT NULL, -- e.g., 'month', 'year'
    features TEXT[] NOT NULL,      -- Array of features
    popular BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE plans IS 'Stores premium subscription packages for Black Sheep.';

-- 4. MEMBERS TABLE (Stores users who signed up for gym memberships)
CREATE TABLE members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50) NOT NULL,
    plan_id UUID REFERENCES plans(id) ON DELETE SET NULL, -- References the plan they picked
    status VARCHAR(50) DEFAULT 'pending',                 -- 'pending', 'active', 'cancelled'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE members IS 'Gym members who signed up for subscriptions.';

-- 5. CONTACTS TABLE (Stores custom client inquiry messages)
CREATE TABLE contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE contacts IS 'Support inquiries and contact forms filled by visitors.';

-- 6. PAYMENTS TABLE (Stores secure Razorpay-verified transaction logs)
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_name VARCHAR(255) NOT NULL,
    member_email VARCHAR(255) NOT NULL,
    plan_name VARCHAR(255) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    transaction_id VARCHAR(255) NOT NULL UNIQUE,  -- Razorpay payment_id
    order_id VARCHAR(255),                         -- Razorpay order_id
    status VARCHAR(50) DEFAULT 'completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE payments IS 'Logs of payments processed for Black Sheep subscriptions.';

-- ==========================================
-- SEED DATA - DEFAULT BLACK SHEEP MEMBERSHIP PLANS
-- Run this script to populate your luxury membership tiers.
-- ==========================================

INSERT INTO plans (name, price, duration, features, popular) VALUES
(
    'Silver Tier', 
    49.00, 
    'month', 
    ARRAY[
        'Access to elite Black Sheep floor', 
        'Premium high-tech bio-equipment', 
        'Locker room & organic spa access', 
        '1 complimentary trainer onboarding session'
    ], 
    false
),
(
    'Gold Elite Tier', 
    99.00, 
    'month', 
    ARRAY[
        'All-hours access (24/7 keycard)', 
        'Unlimited premium group classes', 
        'Custom biological nutrition profile', 
        'Personal dedicated locker & gear cleaning',
        'Bi-weekly sessions with a master trainer'
    ], 
    true
),
(
    'Black Sheep Platinum VIP', 
    249.00, 
    'month', 
    ARRAY[
        'Full 24/7 unrestricted VIP access', 
        'Private premium trainer assigned to you', 
        'Daily organic protein meal delivery', 
        'Access to VIP sauna, pool, and recovery lounges',
        'Elite monthly blood biomarker analysis',
        'Private physiological coaching'
    ], 
    false
);
