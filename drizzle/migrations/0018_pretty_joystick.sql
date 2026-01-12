ALTER TABLE "game_discount_codes" ADD COLUMN "polar_discount_id" text;--> statement-breakpoint
ALTER TABLE "game_discount_codes" ADD COLUMN "polar_sync_status" text DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE "game_discount_codes" ADD COLUMN "polar_sync_error" text;