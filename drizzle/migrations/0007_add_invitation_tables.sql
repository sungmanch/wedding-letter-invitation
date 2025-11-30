-- Migration: Add Invitation Tables for 모바일 청첩장
-- Date: 2025-11-30

-- ============================================
-- 청첩장 테이블 (invitations)
-- ============================================
CREATE TABLE IF NOT EXISTS "invitations" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" uuid,

  -- 신랑/신부 정보
  "groom_name" varchar(50) NOT NULL,
  "bride_name" varchar(50) NOT NULL,
  "groom_father_name" varchar(50),
  "groom_mother_name" varchar(50),
  "bride_father_name" varchar(50),
  "bride_mother_name" varchar(50),

  -- 결혼 정보
  "wedding_date" date NOT NULL,
  "wedding_time" time NOT NULL,
  "venue_name" varchar(100) NOT NULL,
  "venue_address" varchar(255) NOT NULL,
  "venue_detail" varchar(100),
  "venue_map_url" varchar(500),

  -- 연락처
  "groom_phone" varchar(20),
  "bride_phone" varchar(20),
  "groom_father_phone" varchar(20),
  "groom_mother_phone" varchar(20),
  "bride_father_phone" varchar(20),
  "bride_mother_phone" varchar(20),

  -- 계좌 정보
  "groom_bank" varchar(50),
  "groom_account" varchar(50),
  "groom_account_holder" varchar(50),
  "bride_bank" varchar(50),
  "bride_account" varchar(50),
  "bride_account_holder" varchar(50),

  -- AI 프롬프트 및 디자인
  "style_prompt" text,
  "selected_design_id" uuid,

  -- 상태
  "status" varchar(20) NOT NULL DEFAULT 'draft',
  "is_paid" boolean NOT NULL DEFAULT false,

  -- 메타
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now()
);

-- ============================================
-- AI 생성 디자인 테이블 (invitation_designs)
-- ============================================
CREATE TABLE IF NOT EXISTS "invitation_designs" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "invitation_id" uuid NOT NULL REFERENCES "invitations"("id") ON DELETE CASCADE,

  "design_data" jsonb NOT NULL,
  "generation_batch" integer NOT NULL,
  "is_selected" boolean NOT NULL DEFAULT false,

  "created_at" timestamp NOT NULL DEFAULT now()
);

-- ============================================
-- 사진 테이블 (invitation_photos)
-- ============================================
CREATE TABLE IF NOT EXISTS "invitation_photos" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "invitation_id" uuid NOT NULL REFERENCES "invitations"("id") ON DELETE CASCADE,

  "storage_path" varchar(500) NOT NULL,
  "url" varchar(500) NOT NULL,
  "display_order" integer NOT NULL,

  "created_at" timestamp NOT NULL DEFAULT now()
);

-- ============================================
-- 축하 메시지 테이블 (invitation_messages)
-- ============================================
CREATE TABLE IF NOT EXISTS "invitation_messages" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "invitation_id" uuid NOT NULL REFERENCES "invitations"("id") ON DELETE CASCADE,

  "guest_name" varchar(50) NOT NULL,
  "content" text NOT NULL,

  "is_read" boolean NOT NULL DEFAULT false,
  "created_at" timestamp NOT NULL DEFAULT now()
);

-- ============================================
-- 결제 테이블 (invitation_payments)
-- ============================================
CREATE TABLE IF NOT EXISTS "invitation_payments" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "invitation_id" uuid NOT NULL REFERENCES "invitations"("id") ON DELETE CASCADE,
  "user_id" uuid NOT NULL,

  "polar_checkout_id" varchar(100),
  "polar_order_id" varchar(100),
  "amount" integer NOT NULL,
  "status" varchar(20) NOT NULL DEFAULT 'pending',

  "created_at" timestamp NOT NULL DEFAULT now(),
  "completed_at" timestamp
);

-- ============================================
-- RLS 활성화
-- ============================================
ALTER TABLE "invitations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "invitation_designs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "invitation_photos" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "invitation_messages" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "invitation_payments" ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS Policies - invitations
-- ============================================
-- 본인 청첩장 관리
CREATE POLICY "Users can manage their own invitations"
ON "invitations" FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- published 상태는 누구나 조회 가능
CREATE POLICY "Anyone can view published invitations"
ON "invitations" FOR SELECT
USING (status = 'published');

-- ============================================
-- RLS Policies - invitation_designs
-- ============================================
CREATE POLICY "Users can manage designs of their invitations"
ON "invitation_designs" FOR ALL
USING (
  invitation_id IN (
    SELECT id FROM invitations WHERE user_id = auth.uid()
  )
)
WITH CHECK (
  invitation_id IN (
    SELECT id FROM invitations WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Anyone can view designs of published invitations"
ON "invitation_designs" FOR SELECT
USING (
  invitation_id IN (
    SELECT id FROM invitations WHERE status = 'published'
  )
);

-- ============================================
-- RLS Policies - invitation_photos
-- ============================================
CREATE POLICY "Users can manage photos of their invitations"
ON "invitation_photos" FOR ALL
USING (
  invitation_id IN (
    SELECT id FROM invitations WHERE user_id = auth.uid()
  )
)
WITH CHECK (
  invitation_id IN (
    SELECT id FROM invitations WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Anyone can view photos of published invitations"
ON "invitation_photos" FOR SELECT
USING (
  invitation_id IN (
    SELECT id FROM invitations WHERE status = 'published'
  )
);

-- ============================================
-- RLS Policies - invitation_messages
-- ============================================
-- 누구나 메시지 작성 가능
CREATE POLICY "Anyone can create messages"
ON "invitation_messages" FOR INSERT
WITH CHECK (true);

-- 본인 청첩장의 메시지만 열람 가능
CREATE POLICY "Owners can view messages"
ON "invitation_messages" FOR SELECT
USING (
  invitation_id IN (
    SELECT id FROM invitations WHERE user_id = auth.uid()
  )
);

-- 본인 청첩장의 메시지만 수정 가능 (is_read 업데이트용)
CREATE POLICY "Owners can update messages"
ON "invitation_messages" FOR UPDATE
USING (
  invitation_id IN (
    SELECT id FROM invitations WHERE user_id = auth.uid()
  )
);

-- ============================================
-- RLS Policies - invitation_payments
-- ============================================
CREATE POLICY "Users can manage their own payments"
ON "invitation_payments" FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- ============================================
-- Indexes for performance
-- ============================================
CREATE INDEX IF NOT EXISTS "idx_invitations_user_id" ON "invitations"("user_id");
CREATE INDEX IF NOT EXISTS "idx_invitations_status" ON "invitations"("status");
CREATE INDEX IF NOT EXISTS "idx_invitation_designs_invitation_id" ON "invitation_designs"("invitation_id");
CREATE INDEX IF NOT EXISTS "idx_invitation_photos_invitation_id" ON "invitation_photos"("invitation_id");
CREATE INDEX IF NOT EXISTS "idx_invitation_messages_invitation_id" ON "invitation_messages"("invitation_id");
CREATE INDEX IF NOT EXISTS "idx_invitation_payments_invitation_id" ON "invitation_payments"("invitation_id");
CREATE INDEX IF NOT EXISTS "idx_invitation_payments_user_id" ON "invitation_payments"("user_id");
