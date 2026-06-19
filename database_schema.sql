-- ==========================================
-- MatchGig Premium Coin System Database Schema
-- Production Relational Database Layout (PostgreSQL / CockroachDB / Cloud SQL)
-- ==========================================

-- Enable standard UUID extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255) PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    avatar TEXT,
    cover_image TEXT,
    role VARCHAR(50) DEFAULT 'Regular' CHECK (role IN ('Regular', 'Freelancer', 'Client', 'Admin')),
    bio TEXT,
    skills TEXT[],
    city VARCHAR(100) DEFAULT 'Lahore',
    country VARCHAR(100) DEFAULT 'Pakistan',
    rating NUMERIC(3, 2) DEFAULT 0.0 CHECK (rating >= 0.0 AND rating <= 5.0),
    completed_jobs INTEGER DEFAULT 0,
    badge VARCHAR(50) DEFAULT 'None' CHECK (badge IN ('None', 'Verified', 'Business', 'Creator')),
    subscription VARCHAR(50) DEFAULT 'Free' CHECK (subscription IN ('Free', 'Pro', 'VIP')),
    is_banned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Wallets Table
CREATE TABLE IF NOT EXISTS wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(255) UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    coin_balance BIGINT DEFAULT 100 NOT NULL CHECK (coin_balance >= 0), -- Welcome bonus constraint (defaults to 100)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Gifts Table (Virtual Store Gifts)
CREATE TABLE IF NOT EXISTS gifts (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    icon VARCHAR(10) NOT NULL,
    cost BIGINT NOT NULL CHECK (cost > 0),
    color VARCHAR(100) DEFAULT 'text-amber-500',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. CoinTransactions Table
CREATE TABLE IF NOT EXISTS coin_transactions (
    id VARCHAR(100) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (
        type IN (
            'purchase', 
            'spend_gift', 
            'receive_gift', 
            'order_earn', 
            'order_pay', 
            'withdrawal', 
            'subscription', 
            'bonus', 
            'adjustment',
            'mint'
        )
    ),
    amount INTEGER NOT NULL, -- Can be positive (earn/mint/bonus) or negative (spend/withdraw)
    description TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Withdrawals Table
CREATE TABLE IF NOT EXISTS withdrawals (
    id VARCHAR(100) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL CHECK (amount > 0),
    method VARCHAR(100) NOT NULL, -- e.g., 'Easypaisa', 'JazzCash', 'Bank Transfer'
    account_number VARCHAR(100) NOT NULL,
    account_name VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Declined')),
    rejection_reason TEXT,
    fee_deducted NUMERIC(10, 2) DEFAULT 0.0,
    net_payout NUMERIC(10, 2) DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Subscriptions Table
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(255) UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tier VARCHAR(50) NOT NULL CHECK (tier IN ('Free', 'Pro', 'VIP')),
    price_coins INTEGER NOT NULL,
    starts_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP + INTERVAL '30 days',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Admin Settings Table
CREATE TABLE IF NOT EXISTS admin_settings (
    id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1), -- Single row restriction pattern
    total_coin_supply BIGINT DEFAULT 100000000 NOT NULL CHECK (total_coin_supply >= 0),
    circulating_coins BIGINT DEFAULT 0 NOT NULL CHECK (circulating_coins >= 0),
    coin_name VARCHAR(100) DEFAULT 'MatchGig Coin',
    coin_symbol VARCHAR(10) DEFAULT '🪙',
    pkr_rate NUMERIC(10, 2) DEFAULT 1.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- Triggers for Dynamic Updated At & State Tracking
-- ==========================================

-- Function to update timestamp
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER trigger_update_users_timestamp BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_timestamp_column();
CREATE TRIGGER trigger_update_wallets_timestamp BEFORE UPDATE ON wallets FOR EACH ROW EXECUTE PROCEDURE update_timestamp_column();
CREATE TRIGGER trigger_update_withdrawals_timestamp BEFORE UPDATE ON withdrawals FOR EACH ROW EXECUTE PROCEDURE update_timestamp_column();

-- Trigger function to maintain Welcome Coins on user creation
CREATE OR REPLACE FUNCTION handle_new_user_registration()
RETURNS TRIGGER AS $$
DECLARE
    welcome_amt INTEGER := 100;
BEGIN
    -- 1. Create a wallet for the user and award the welcome bonus
    INSERT INTO wallets (user_id, coin_balance)
    VALUES (NEW.id, welcome_amt);

    -- 2. Log welcome bonus transaction audit trail
    INSERT INTO coin_transactions (id, user_id, type, amount, description, timestamp)
    VALUES (
        'tx_welcome_' || NEW.id || '_' || EXTRACT(EPOCH FROM NOW())::INTEGER,
        NEW.id,
        'bonus',
        welcome_amt,
        '🎁 100 free coins welcome registration bonus drop credited!',
        NOW()
    );

    -- 3. Enforce updates to admin_settings circulating coins
    UPDATE admin_settings 
    SET circulating_coins = circulating_coins + welcome_amt
    WHERE id = 1;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger users welcome bonus on insert
CREATE TRIGGER trigger_on_user_auth_welcome
AFTER INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION handle_new_user_registration();

-- Seed Default Admin Settings row
INSERT INTO admin_settings (id, total_coin_supply, circulating_coins, coin_name, coin_symbol, pkr_rate)
VALUES (1, 100000000, 0, 'MatchGig Coin', '🪙', 1.0)
ON CONFLICT (id) DO NOTHING;

-- Seed Default virtual store gifts
INSERT INTO gifts (id, name, icon, cost, color) VALUES
('gift_1', 'Rose', '🌹', 10, 'text-red-500'),
('gift_2', 'Heart', '❤️', 25, 'text-pink-500'),
('gift_3', 'Star', '⭐', 50, 'text-purple-400'),
('gift_4', 'Crown', '👑', 100, 'text-yellow-400 font-bold'),
('gift_5', 'Diamond', '💎', 500, 'text-cyan-400'),
('gift_6', 'Rocket', '🚀', 1000, 'text-amber-500'),
('gift_7', 'Golden Trophy', '🏆', 5000, 'text-yellow-500 animate-pulse')
ON CONFLICT (id) DO NOTHING;
