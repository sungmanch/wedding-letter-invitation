-- Add RLS policies for payment_requests (user-based)
-- These were lost when the table was dropped in migration 0005

-- Policy 1: Users can insert their own payment requests
DROP POLICY IF EXISTS "Users can insert own payment requests" ON "payment_requests";
CREATE POLICY "Users can insert own payment requests"
  ON "payment_requests"
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy 2: Users can read their own payment requests
DROP POLICY IF EXISTS "Users can read own payment requests" ON "payment_requests";
CREATE POLICY "Users can read own payment requests"
  ON "payment_requests"
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy 3: Admins can read all payment requests
-- TODO: Replace with actual admin check when admin role is implemented
DROP POLICY IF EXISTS "Service role can read all payment requests" ON "payment_requests";
CREATE POLICY "Service role can read all payment requests"
  ON "payment_requests"
  FOR SELECT
  TO service_role
  USING (true);

-- Policy 4: Admins can update payment requests (for approval)
-- TODO: Replace with actual admin check when admin role is implemented
DROP POLICY IF EXISTS "Service role can update payment requests" ON "payment_requests";
CREATE POLICY "Service role can update payment requests"
  ON "payment_requests"
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Add unique constraint on deposit_name to prevent duplicates
ALTER TABLE "payment_requests"
  ADD CONSTRAINT "payment_requests_deposit_name_unique"
  UNIQUE ("deposit_name");
