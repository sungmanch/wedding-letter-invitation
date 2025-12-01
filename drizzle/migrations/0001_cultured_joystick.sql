ALTER TABLE "invitation_messages" DROP CONSTRAINT "invitation_messages_invitation_id_invitations_id_fk";
--> statement-breakpoint
ALTER TABLE "invitation_designs" DROP CONSTRAINT "invitation_designs_invitation_id_invitations_id_fk";
--> statement-breakpoint
ALTER TABLE "invitation_payments" DROP CONSTRAINT "invitation_payments_invitation_id_invitations_id_fk";
--> statement-breakpoint
ALTER TABLE "invitation_photos" DROP CONSTRAINT "invitation_photos_invitation_id_invitations_id_fk";
--> statement-breakpoint
DROP INDEX "idx_invitation_messages_invitation_id";--> statement-breakpoint
DROP INDEX "idx_invitation_designs_invitation_id";--> statement-breakpoint
DROP INDEX "idx_invitation_payments_invitation_id";--> statement-breakpoint
DROP INDEX "idx_invitation_payments_user_id";--> statement-breakpoint
DROP INDEX "idx_invitation_photos_invitation_id";--> statement-breakpoint
DROP INDEX "idx_invitations_status";--> statement-breakpoint
DROP INDEX "idx_invitations_user_id";--> statement-breakpoint
DROP INDEX "idx_templates_source";--> statement-breakpoint
DROP INDEX "idx_templates_status";--> statement-breakpoint
DROP INDEX "idx_templates_user";--> statement-breakpoint
ALTER TABLE "invitation_designs" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "invitations" ADD COLUMN "template_id" uuid;--> statement-breakpoint
ALTER TABLE "invitations" ADD COLUMN "is_template_reuse" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "invitations" ADD COLUMN "published_url" varchar(500);--> statement-breakpoint
CREATE INDEX "idx_invitation_messages_invitation_id" ON "invitation_messages" USING btree ("invitation_id");--> statement-breakpoint
CREATE INDEX "idx_invitation_designs_invitation_id" ON "invitation_designs" USING btree ("invitation_id");--> statement-breakpoint
CREATE INDEX "idx_invitation_payments_invitation_id" ON "invitation_payments" USING btree ("invitation_id");--> statement-breakpoint
CREATE INDEX "idx_invitation_payments_user_id" ON "invitation_payments" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_invitation_photos_invitation_id" ON "invitation_photos" USING btree ("invitation_id");--> statement-breakpoint
CREATE INDEX "idx_invitations_status" ON "invitations" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_invitations_user_id" ON "invitations" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_templates_source" ON "design_templates" USING btree ("source");--> statement-breakpoint
CREATE INDEX "idx_templates_status" ON "design_templates" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_templates_user" ON "design_templates" USING btree ("user_id");--> statement-breakpoint
ALTER TABLE "survey_responses" DROP COLUMN "price_range";--> statement-breakpoint
ALTER POLICY "Anyone can view designs of published invitations" ON "invitation_designs" TO public USING ((invitation_id IN ( SELECT invitations.id FROM invitations WHERE ((invitations.status)::text = 'published'::text))));--> statement-breakpoint
ALTER POLICY "Anyone can view photos of published invitations" ON "invitation_photos" TO public USING ((invitation_id IN ( SELECT invitations.id FROM invitations WHERE ((invitations.status)::text = 'published'::text))));