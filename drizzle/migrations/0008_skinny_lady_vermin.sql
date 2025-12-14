ALTER TABLE "super_editor_invitations" ADD COLUMN "intro_effect" varchar(50) DEFAULT 'none';--> statement-breakpoint
ALTER TABLE "super_editor_invitations" ADD COLUMN "calligraphy_config" jsonb;
