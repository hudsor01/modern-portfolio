-- Initialize database with required extensions
-- This runs automatically when the PostgreSQL container starts

-- Enable citext extension (used for case-insensitive slugs)
CREATE EXTENSION IF NOT EXISTS citext;

-- Enable other useful extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Log successful initialization
DO $$
BEGIN
  RAISE NOTICE 'Database initialized with extensions: citext, uuid-ossp, pg_trgm';
END $$;
