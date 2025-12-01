-- Add updated_at column to invitation_designs table
ALTER TABLE "invitation_designs" ADD COLUMN IF NOT EXISTS "updated_at" timestamp DEFAULT now() NOT NULL;
