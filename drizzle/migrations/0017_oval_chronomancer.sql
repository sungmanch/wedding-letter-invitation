CREATE TABLE "game_discount_codes" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"discount_percent" integer NOT NULL,
	"score" integer NOT NULL,
	"grade" text NOT NULL,
	"user_id" text,
	"used" boolean DEFAULT false NOT NULL,
	"used_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL,
	CONSTRAINT "game_discount_codes_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE INDEX "game_discount_codes_code_idx" ON "game_discount_codes" USING btree ("code");--> statement-breakpoint
CREATE INDEX "game_discount_codes_user_idx" ON "game_discount_codes" USING btree ("user_id");