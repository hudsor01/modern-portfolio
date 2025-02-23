CREATE TABLE IF NOT EXISTS "contacts" (
  "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "name" varchar(255) NOT NULL,
  "email" varchar(255) NOT NULL,
  "subject" varchar(255) NOT NULL,
  "message" text NOT NULL,
  "status" varchar(50) NOT NULL DEFAULT 'new',
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "subscribers" (
  "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "email" varchar(255) UNIQUE NOT NULL,
  "status" varchar(50) NOT NULL DEFAULT 'active',
  "subscribed_at" timestamp NOT NULL DEFAULT now(),
  "unsubscribed_at" timestamp,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "media" (
  "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "filename" varchar(255) NOT NULL,
  "url" text NOT NULL,
  "size" integer NOT NULL,
  "type" varchar(255) NOT NULL,
  "width" integer,
  "height" integer,
  "uploaded_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "rate_limit" (
  "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "identifier" varchar(255) NOT NULL,
  "timestamp" timestamp NOT NULL DEFAULT now()
);

CREATE INDEX idx_rate_limit_identifier ON rate_limit(identifier);
CREATE INDEX idx_rate_limit_timestamp ON rate_limit(timestamp);

