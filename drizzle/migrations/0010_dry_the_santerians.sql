CREATE TABLE "ai_edit_logs_v2" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"document_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"prompt" text NOT NULL,
	"target_block_id" uuid,
	"context" jsonb,
	"patches" jsonb,
	"explanation" text,
	"success" boolean NOT NULL,
	"error_message" text,
	"snapshot_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ai_edit_logs_v2" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "ai_edit_logs_v2" ADD CONSTRAINT "ai_edit_logs_v2_document_id_editor_documents_v2_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."editor_documents_v2"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_edit_logs_v2" ADD CONSTRAINT "ai_edit_logs_v2_snapshot_id_editor_snapshots_v2_id_fk" FOREIGN KEY ("snapshot_id") REFERENCES "public"."editor_snapshots_v2"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_ai_edit_logs_v2_doc" ON "ai_edit_logs_v2" USING btree ("document_id");--> statement-breakpoint
CREATE INDEX "idx_ai_edit_logs_v2_user" ON "ai_edit_logs_v2" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_ai_edit_logs_v2_created" ON "ai_edit_logs_v2" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_ai_edit_logs_v2_success" ON "ai_edit_logs_v2" USING btree ("success");