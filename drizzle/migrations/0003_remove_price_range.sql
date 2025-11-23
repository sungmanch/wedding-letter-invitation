-- Remove price_range column from survey_responses table
ALTER TABLE "survey_responses" DROP COLUMN IF EXISTS "price_range";
