CREATE TABLE "editor_document_branches_v2" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"parent_document_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"title" varchar(200) DEFAULT '새 브랜치' NOT NULL,
	"description" varchar(500),
	"blocks" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"style" jsonb NOT NULL,
	"animation" jsonb DEFAULT '{}'::jsonb,
	"build_result" jsonb,
	"published_url" varchar(500),
	"og_title" varchar(100),
	"og_description" varchar(200),
	"og_image_url" varchar(500),
	"status" varchar(20) DEFAULT 'draft' NOT NULL,
	"error_message" text,
	"is_paid" boolean DEFAULT false NOT NULL,
	"payment_id" uuid,
	"slug" varchar(100),
	"is_public" boolean DEFAULT true NOT NULL,
	"password" varchar(100),
	"view_count" integer DEFAULT 0 NOT NULL,
	"document_version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"published_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "editor_document_branches_v2" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "editor_document_branches_v2" ADD CONSTRAINT "editor_document_branches_v2_parent_document_id_editor_documents_v2_id_fk" FOREIGN KEY ("parent_document_id") REFERENCES "public"."editor_documents_v2"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_editor_branches_v2_parent" ON "editor_document_branches_v2" USING btree ("parent_document_id");--> statement-breakpoint
CREATE INDEX "idx_editor_branches_v2_user" ON "editor_document_branches_v2" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_editor_branches_v2_status" ON "editor_document_branches_v2" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_editor_branches_v2_slug" ON "editor_document_branches_v2" USING btree ("slug");