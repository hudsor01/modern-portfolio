-- Update posts table with new fields
ALTER TABLE posts
ADD COLUMN IF NOT EXISTS excerpt TEXT,
ADD COLUMN IF NOT EXISTS cover_image VARCHAR(255),
ADD COLUMN IF NOT EXISTS published_at TIMESTAMP;

-- Add analytics table for storing page views
CREATE TABLE IF NOT EXISTS analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_path VARCHAR(255) NOT NULL,
  views INTEGER DEFAULT 1,
  unique_visitors INTEGER DEFAULT 1,
  avg_time_on_page INTEGER DEFAULT 0,
  bounce_rate DECIMAL(5,2) DEFAULT 0.00,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Add index for analytics queries
CREATE INDEX IF NOT EXISTS analytics_date_idx ON analytics(date);
CREATE INDEX IF NOT EXISTS analytics_path_idx ON analytics(page_path);

