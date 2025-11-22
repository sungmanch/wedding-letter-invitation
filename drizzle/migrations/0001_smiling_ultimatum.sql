ALTER TABLE "events" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "letters" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "payment_requests" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "restaurant_recommendations" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "survey_responses" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "users" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "users" CASCADE;--> statement-breakpoint
ALTER TABLE "events" DROP CONSTRAINT "events_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "payment_requests" DROP CONSTRAINT "payment_requests_approved_by_users_id_fk";
