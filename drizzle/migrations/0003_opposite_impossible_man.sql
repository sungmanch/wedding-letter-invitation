ALTER TABLE "super_editor_invitations" ADD COLUMN "section_order" jsonb;--> statement-breakpoint
ALTER TABLE "super_editor_invitations" ADD COLUMN "section_enabled" jsonb;--> statement-breakpoint
ALTER TABLE "super_editor_invitations" ADD COLUMN "is_paid" boolean DEFAULT false NOT NULL;