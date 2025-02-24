-- Create media table
CREATE TABLE IF NOT EXISTS media (
  id VARCHAR(255) PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  url VARCHAR(255) NOT NULL,
  size INTEGER NOT NULL,
  type VARCHAR(255) NOT NULL,
  width INTEGER,
  height INTEGER,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  metadata JSONB DEFAULT '{}'
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_media_filename ON media(filename);
CREATE INDEX IF NOT EXISTS idx_media_type ON media(type);
CREATE INDEX IF NOT EXISTS idx_media_uploaded_at ON media(uploaded_at);

