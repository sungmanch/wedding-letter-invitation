ALTER TABLE "super_editor_templates" ALTER COLUMN "editor_schema" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "super_editor_templates" ADD COLUMN "variables_schema" jsonb;