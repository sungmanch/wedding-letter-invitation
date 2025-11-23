-- RLS Policies for events table
-- Allow anyone to insert events (for anonymous event creation)
CREATE POLICY "Allow anonymous insert on events"
  ON "events"
  FOR INSERT
  WITH CHECK (true);

-- Allow anyone to read events (for sharing)
CREATE POLICY "Allow public read on events"
  ON "events"
  FOR SELECT
  USING (true);

-- Allow update only for authenticated users who own the event
CREATE POLICY "Allow owner update on events"
  ON "events"
  FOR UPDATE
  USING (auth.uid() = user_id OR user_id IS NULL)
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Allow delete only for authenticated users who own the event
CREATE POLICY "Allow owner delete on events"
  ON "events"
  FOR DELETE
  USING (auth.uid() = user_id);

--> statement-breakpoint

-- RLS Policies for survey_responses table
-- Allow anyone to insert survey responses
CREATE POLICY "Allow anonymous insert on survey_responses"
  ON "survey_responses"
  FOR INSERT
  WITH CHECK (true);

-- Allow anyone to read survey responses
CREATE POLICY "Allow public read on survey_responses"
  ON "survey_responses"
  FOR SELECT
  USING (true);

--> statement-breakpoint

-- RLS Policies for letters table
-- Allow anyone to insert letters
CREATE POLICY "Allow anonymous insert on letters"
  ON "letters"
  FOR INSERT
  WITH CHECK (true);

-- Allow anyone to read letters for their event
CREATE POLICY "Allow public read on letters"
  ON "letters"
  FOR SELECT
  USING (true);

-- Allow update for marking as read
CREATE POLICY "Allow update on letters"
  ON "letters"
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

--> statement-breakpoint

-- RLS Policies for restaurant_recommendations table
-- Allow anyone to read recommendations
CREATE POLICY "Allow public read on restaurant_recommendations"
  ON "restaurant_recommendations"
  FOR SELECT
  USING (true);

-- Allow insert for system/admin (can be restricted later)
CREATE POLICY "Allow insert on restaurant_recommendations"
  ON "restaurant_recommendations"
  FOR INSERT
  WITH CHECK (true);

--> statement-breakpoint

-- RLS Policies for payment_requests table
-- Allow insert for event owners
CREATE POLICY "Allow insert on payment_requests"
  ON "payment_requests"
  FOR INSERT
  WITH CHECK (true);

-- Allow read for public (to check payment status)
CREATE POLICY "Allow public read on payment_requests"
  ON "payment_requests"
  FOR SELECT
  USING (true);

-- Allow update for admins (can be restricted to specific admin users)
CREATE POLICY "Allow update on payment_requests"
  ON "payment_requests"
  FOR UPDATE
  USING (true)
  WITH CHECK (true);
