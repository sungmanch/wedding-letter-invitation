CREATE TABLE "paper_invitation_photos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"request_id" uuid NOT NULL,
	"storage_path" varchar(500) NOT NULL,
	"url" varchar(500) NOT NULL,
	"display_order" integer NOT NULL,
	"is_main" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "paper_invitation_photos" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "paper_invitation_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"email" varchar(255) NOT NULL,
	"phone" varchar(20),
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"main_photo_path" varchar(500),
	"notes" text,
	"estimated_completion_date" timestamp,
	"completed_document_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "paper_invitation_requests" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "guestbook_messages" CASCADE;--> statement-breakpoint
DROP TABLE "super_editor_invitations" CASCADE;--> statement-breakpoint
DROP TABLE "super_editor_presets" CASCADE;--> statement-breakpoint
DROP TABLE "super_editor_templates" CASCADE;--> statement-breakpoint
ALTER TABLE "invitations" DROP CONSTRAINT IF EXISTS "invitations_se_invitation_id_fkey";
--> statement-breakpoint
DROP INDEX IF EXISTS "idx_invitations_se_invitation_id";--> statement-breakpoint
ALTER TABLE "rsvp_responses_v2" ADD COLUMN "side" varchar(10);--> statement-breakpoint
ALTER TABLE "rsvp_responses_v2" ADD COLUMN "bus_required" boolean;--> statement-breakpoint
ALTER TABLE "rsvp_responses_v2" ADD COLUMN "privacy_agreed" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "paper_invitation_photos" ADD CONSTRAINT "paper_invitation_photos_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "public"."paper_invitation_requests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_paper_invitation_photos_request_id" ON "paper_invitation_photos" USING btree ("request_id");--> statement-breakpoint
CREATE INDEX "idx_paper_invitation_requests_user_id" ON "paper_invitation_requests" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_paper_invitation_requests_status" ON "paper_invitation_requests" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_paper_invitation_requests_email" ON "paper_invitation_requests" USING btree ("email");--> statement-breakpoint
ALTER TABLE "invitations" DROP COLUMN "se_invitation_id";--> statement-breakpoint
CREATE POLICY "Users can manage photos of their paper invitation requests" ON "paper_invitation_photos" AS PERMISSIVE FOR ALL TO public;--> statement-breakpoint
CREATE POLICY "Users can manage their own paper invitation requests" ON "paper_invitation_requests" AS PERMISSIVE FOR ALL TO public;