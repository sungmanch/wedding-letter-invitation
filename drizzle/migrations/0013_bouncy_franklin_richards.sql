ALTER TABLE "paper_invitation_requests" ALTER COLUMN "email" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "paper_invitation_requests" ALTER COLUMN "phone" SET NOT NULL;