CREATE TABLE "guestbook_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"invitation_id" uuid NOT NULL,
	"cookie_id" varchar(100) NOT NULL,
	"name" varchar(50) NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "guestbook_messages" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "guestbook_messages" ADD CONSTRAINT "guestbook_messages_invitation_id_super_editor_invitations_id_fk" FOREIGN KEY ("invitation_id") REFERENCES "public"."super_editor_invitations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_guestbook_invitation" ON "guestbook_messages" USING btree ("invitation_id");--> statement-breakpoint
CREATE INDEX "idx_guestbook_cookie" ON "guestbook_messages" USING btree ("cookie_id");