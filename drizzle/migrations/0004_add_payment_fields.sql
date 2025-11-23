-- Add payment fields to payment_requests table
ALTER TABLE "payment_requests" ADD COLUMN IF NOT EXISTS "amount" integer DEFAULT 9900 NOT NULL;
ALTER TABLE "payment_requests" ADD COLUMN IF NOT EXISTS "deposit_name" varchar(100);
ALTER TABLE "payment_requests" ADD COLUMN IF NOT EXISTS "deposit_at" timestamp;
ALTER TABLE "payment_requests" ADD COLUMN IF NOT EXISTS "notification_sent" boolean DEFAULT false NOT NULL;
