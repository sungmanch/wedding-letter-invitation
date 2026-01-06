CREATE TABLE "preset_request_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"request_id" uuid NOT NULL,
	"storage_path" varchar(500) NOT NULL,
	"url" varchar(500) NOT NULL,
	"display_order" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "preset_request_images" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "preset_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"section_type" varchar(50) NOT NULL,
	"description" text NOT NULL,
	"email" varchar(255) NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"completed_preset_id" varchar(100),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "preset_requests" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "preset_request_images" ADD CONSTRAINT "preset_request_images_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "public"."preset_requests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_preset_request_images_request_id" ON "preset_request_images" USING btree ("request_id");--> statement-breakpoint
CREATE INDEX "idx_preset_requests_user_id" ON "preset_requests" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_preset_requests_section_type" ON "preset_requests" USING btree ("section_type");--> statement-breakpoint
CREATE INDEX "idx_preset_requests_status" ON "preset_requests" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_preset_requests_email" ON "preset_requests" USING btree ("email");--> statement-breakpoint
CREATE POLICY "Users can manage images of their preset requests" ON "preset_request_images" AS PERMISSIVE FOR ALL TO public;--> statement-breakpoint
CREATE POLICY "Users can manage their own preset requests" ON "preset_requests" AS PERMISSIVE FOR ALL TO public;