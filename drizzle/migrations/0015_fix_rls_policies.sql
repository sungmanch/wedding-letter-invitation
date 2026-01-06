-- Fix RLS policies for preset_requests and preset_request_images
-- The previous policies (0014) allowed all users to access all data

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Users can manage their own preset requests" ON "preset_requests";
DROP POLICY IF EXISTS "Users can manage images of their preset requests" ON "preset_request_images";

-- Create proper RLS policies for preset_requests
-- SELECT: users can only see their own requests
CREATE POLICY "preset_requests_select_own" ON "preset_requests"
  AS PERMISSIVE FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- INSERT: users can only insert with their own user_id
CREATE POLICY "preset_requests_insert_own" ON "preset_requests"
  AS PERMISSIVE FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: users can only update their own requests
CREATE POLICY "preset_requests_update_own" ON "preset_requests"
  AS PERMISSIVE FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE: users can only delete their own requests
CREATE POLICY "preset_requests_delete_own" ON "preset_requests"
  AS PERMISSIVE FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Create proper RLS policies for preset_request_images
-- Users can access images only if they own the parent request
CREATE POLICY "preset_request_images_select_own" ON "preset_request_images"
  AS PERMISSIVE FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM preset_requests
      WHERE id = request_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "preset_request_images_insert_own" ON "preset_request_images"
  AS PERMISSIVE FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM preset_requests
      WHERE id = request_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "preset_request_images_delete_own" ON "preset_request_images"
  AS PERMISSIVE FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM preset_requests
      WHERE id = request_id AND user_id = auth.uid()
    )
  );
