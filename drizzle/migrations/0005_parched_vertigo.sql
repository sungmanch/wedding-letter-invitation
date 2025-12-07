ALTER TABLE "invitation_payments" DROP CONSTRAINT "invitation_payments_invitation_id_fkey";
--> statement-breakpoint
DROP INDEX "idx_invitation_payments_invitation_id";--> statement-breakpoint
ALTER TABLE "invitations" ADD COLUMN "payment_id" uuid;--> statement-breakpoint
ALTER TABLE "super_editor_invitations" ADD COLUMN "payment_id" uuid;--> statement-breakpoint
CREATE INDEX "idx_invitations_payment_id" ON "invitations" USING btree ("payment_id");--> statement-breakpoint
CREATE INDEX "idx_se_invitations_payment" ON "super_editor_invitations" USING btree ("payment_id");--> statement-breakpoint
ALTER TABLE "invitation_payments" DROP COLUMN "invitation_id";