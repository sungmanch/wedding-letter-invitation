CREATE TABLE "super_editor_invitations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"template_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"user_data" jsonb NOT NULL,
	"build_result" jsonb,
	"published_url" varchar(500),
	"status" varchar(20) DEFAULT 'draft' NOT NULL,
	"error_message" text,
	"slug" varchar(100),
	"is_public" boolean DEFAULT true NOT NULL,
	"password" varchar(100),
	"view_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"published_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "super_editor_invitations" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "super_editor_presets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"category" varchar(50) NOT NULL,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"preset_data" jsonb NOT NULL,
	"thumbnail_url" varchar(500),
	"preview_data" jsonb,
	"is_public" boolean DEFAULT true NOT NULL,
	"is_system" boolean DEFAULT false NOT NULL,
	"usage_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "super_editor_presets" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "super_editor_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(200) NOT NULL,
	"description" text,
	"category" varchar(50) NOT NULL,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"thumbnail_url" varchar(500),
	"layout_schema" jsonb NOT NULL,
	"style_schema" jsonb NOT NULL,
	"editor_schema" jsonb NOT NULL,
	"version" varchar(20) DEFAULT '1.0' NOT NULL,
	"generation_context" jsonb,
	"status" varchar(20) DEFAULT 'draft' NOT NULL,
	"is_public" boolean DEFAULT false NOT NULL,
	"usage_count" integer DEFAULT 0 NOT NULL,
	"rating" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"published_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "super_editor_templates" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "super_editor_invitations" ADD CONSTRAINT "super_editor_invitations_template_id_super_editor_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."super_editor_templates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_se_invitations_template" ON "super_editor_invitations" USING btree ("template_id");--> statement-breakpoint
CREATE INDEX "idx_se_invitations_user" ON "super_editor_invitations" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_se_invitations_status" ON "super_editor_invitations" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_se_invitations_slug" ON "super_editor_invitations" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "idx_se_presets_category" ON "super_editor_presets" USING btree ("category");--> statement-breakpoint
CREATE INDEX "idx_se_presets_is_public" ON "super_editor_presets" USING btree ("is_public");--> statement-breakpoint
CREATE INDEX "idx_se_templates_category" ON "super_editor_templates" USING btree ("category");--> statement-breakpoint
CREATE INDEX "idx_se_templates_status" ON "super_editor_templates" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_se_templates_is_public" ON "super_editor_templates" USING btree ("is_public");