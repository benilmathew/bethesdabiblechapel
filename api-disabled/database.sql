-- Bethesda Church Database Schema
-- MySQL Database Structure

-- Create Database
CREATE DATABASE IF NOT EXISTS bethesda_church CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bethesda_church;

-- Sermons Table
CREATE TABLE IF NOT EXISTS sermons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    speaker VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    description TEXT,
    audio_url VARCHAR(500),
    video_url VARCHAR(500),
    notes_url VARCHAR(500),
    image_url VARCHAR(500),
    scripture_reference VARCHAR(200),
    series VARCHAR(100),
    status ENUM('draft', 'published', 'archived') DEFAULT 'published',
    views INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_date (date),
    INDEX idx_speaker (speaker),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Events Table
CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    location VARCHAR(255),
    image_url VARCHAR(500),
    category VARCHAR(50),
    registration_required BOOLEAN DEFAULT FALSE,
    max_attendees INT,
    status ENUM('draft', 'published', 'cancelled') DEFAULT 'published',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_date (date),
    INDEX idx_category (category),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Contact Submissions Table
CREATE TABLE IF NOT EXISTS contact_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('new', 'read', 'replied') DEFAULT 'new',
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_submitted (submitted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Users Table (for admin authentication)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    role ENUM('admin', 'editor', 'viewer') DEFAULT 'viewer',
    status ENUM('active', 'inactive') DEFAULT 'active',
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Ministries Table
CREATE TABLE IF NOT EXISTS ministries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    leader VARCHAR(100),
    contact_email VARCHAR(100),
    meeting_day VARCHAR(20),
    meeting_time TIME,
    location VARCHAR(255),
    image_url VARCHAR(500),
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('subscribed', 'unsubscribed') DEFAULT 'subscribed',
    INDEX idx_email (email),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Prayer Requests Table
CREATE TABLE IF NOT EXISTS prayer_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    request TEXT NOT NULL,
    is_public BOOLEAN DEFAULT FALSE,
    status ENUM('pending', 'approved', 'archived') DEFAULT 'pending',
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample Data for Sermons
INSERT INTO sermons (title, speaker, date, description, scripture_reference, series) VALUES
('Walking in Faith', 'Pastor John Smith', '2026-01-19', 'Discover how to strengthen your faith journey and trust God\'s plan for your life.', 'Hebrews 11:1-6', 'Faith Series'),
('The Power of Prayer', 'Pastor Sarah Johnson', '2026-01-12', 'Learn about the transformative power of prayer in our daily lives.', 'Matthew 6:5-15', 'Prayer Series'),
('Love Your Neighbor', 'Pastor Mike Williams', '2026-01-05', 'Understanding what it means to truly love our neighbors as ourselves.', 'Matthew 22:37-40', 'Love Series');

-- Sample Data for Events
INSERT INTO events (title, description, date, start_time, end_time, location, category) VALUES
('Sunday Worship Service', 'Join us for inspiring worship and biblical teaching.', '2026-01-26', '09:00:00', '12:00:00', 'Main Sanctuary', 'Worship'),
('Mid-Week Bible Study', 'Dive deeper into God\'s Word with our community.', '2026-01-29', '19:00:00', '20:30:00', 'Fellowship Hall', 'Study'),
('Youth Night', 'Fun, fellowship, and faith for our youth community.', '2026-02-02', '18:00:00', '21:00:00', 'Youth Center', 'Youth');

-- Sample Data for Ministries
INSERT INTO ministries (name, description, leader, contact_email, meeting_day) VALUES
('Children\'s Ministry', 'Nurturing the faith of our youngest members through age-appropriate teaching and activities.', 'Jane Smith', 'children@bethesdachurch.org', 'Sunday'),
('Youth Group', 'Building strong foundations of faith for teenagers through fellowship and biblical teaching.', 'Mike Johnson', 'youth@bethesdachurch.org', 'Friday'),
('Women\'s Ministry', 'Empowering women to grow in their faith and support one another.', 'Sarah Williams', 'women@bethesdachurch.org', 'Tuesday');
