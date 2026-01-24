-- Bethesda Church Database Schema for Cloudflare D1
-- SQLite-compatible schema (converted from MySQL)

-- Sermons Table
CREATE TABLE IF NOT EXISTS sermons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    speaker TEXT NOT NULL,
    date TEXT NOT NULL,
    description TEXT,
    audio_url TEXT,
    video_url TEXT,
    notes_url TEXT,
    image_url TEXT,
    scripture_reference TEXT,
    series TEXT,
    status TEXT DEFAULT 'published' CHECK(status IN ('draft', 'published', 'archived')),
    views INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_sermons_date ON sermons(date);
CREATE INDEX IF NOT EXISTS idx_sermons_speaker ON sermons(speaker);
CREATE INDEX IF NOT EXISTS idx_sermons_status ON sermons(status);

-- Events Table
CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    date TEXT NOT NULL,
    start_time TEXT,
    end_time TEXT,
    location TEXT,
    image_url TEXT,
    category TEXT,
    registration_required INTEGER DEFAULT 0,
    max_attendees INTEGER,
    status TEXT DEFAULT 'published' CHECK(status IN ('draft', 'published', 'cancelled')),
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);

-- Ministries Table
CREATE TABLE IF NOT EXISTS ministries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    leader TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    meeting_time TEXT,
    meeting_location TEXT,
    image_url TEXT,
    status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive')),
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_ministries_status ON ministries(status);

-- Contact Submissions Table
CREATE TABLE IF NOT EXISTS contact_submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    submitted_at TEXT DEFAULT (datetime('now')),
    status TEXT DEFAULT 'new' CHECK(status IN ('new', 'read', 'responded'))
);

CREATE INDEX IF NOT EXISTS idx_contact_email ON contact_submissions(email);
CREATE INDEX IF NOT EXISTS idx_contact_status ON contact_submissions(status);

-- Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    first_name TEXT,
    last_name TEXT,
    status TEXT DEFAULT 'subscribed' CHECK(status IN ('subscribed', 'unsubscribed')),
    subscribed_at TEXT DEFAULT (datetime('now')),
    unsubscribed_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_status ON newsletter_subscribers(status);

-- Sample Data for Testing
-- Uncomment to insert sample data

-- INSERT INTO sermons (title, speaker, date, description, series, views) VALUES
-- ('The Power of Prayer', 'Pastor John Smith', '2024-01-15', 'Exploring the transformative power of prayer in our daily lives.', 'Prayer Series', 0),
-- ('Walking in Faith', 'Pastor Jane Doe', '2024-01-08', 'Understanding what it means to walk by faith and not by sight.', 'Faith Series', 0);

-- INSERT INTO events (title, description, date, start_time, end_time, location, category) VALUES
-- ('Sunday Service', 'Join us for our weekly worship service', '2024-01-21', '10:00', '11:30', 'Main Sanctuary', 'worship'),
-- ('Bible Study', 'Midweek Bible study and fellowship', '2024-01-24', '19:00', '20:30', 'Fellowship Hall', 'study');

-- INSERT INTO ministries (name, description, leader, status) VALUES
-- ('Youth Ministry', 'Ministry for teenagers and young adults', 'John Doe', 'active'),
-- ('Children''s Ministry', 'Sunday school and activities for children', 'Jane Smith', 'active');
