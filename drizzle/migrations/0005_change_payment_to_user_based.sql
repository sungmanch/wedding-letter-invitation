-- Change payment_requests from event-based to user-based
-- Drop existing payment_requests table and recreate with new structure

-- Drop the old table (will cascade to any dependent objects)
DROP TABLE IF EXISTS "payment_requests" CASCADE;

-- Recreate with user-based structure
CREATE TABLE IF NOT EXISTS "payment_requests" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL, -- References auth.users (FK set manually in Supabase)
  "amount" integer DEFAULT 9900 NOT NULL,
  "deposit_name" varchar(100), -- Format: WL-{userId prefix}-{userName}
  "deposit_at" timestamp, -- When user clicked "입금 완료했어요"
  "status" varchar(20) DEFAULT 'pending' NOT NULL,
  "requested_at" timestamp DEFAULT now() NOT NULL,
  "approved_at" timestamp,
  "approved_by" uuid, -- References auth.users (FK set manually in Supabase)
  "notification_sent" boolean DEFAULT false NOT NULL
);

-- Enable RLS
ALTER TABLE "payment_requests" ENABLE ROW LEVEL SECURITY;

-- Add index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS "payment_requests_user_id_idx" ON "payment_requests" ("user_id");

-- Add index on status for admin queries
CREATE INDEX IF NOT EXISTS "payment_requests_status_idx" ON "payment_requests" ("status");
