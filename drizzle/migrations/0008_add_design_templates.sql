-- design_templates 테이블 생성
CREATE TABLE IF NOT EXISTS "design_templates" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid,
  "name" varchar(100),
  "description" text,
  "source" varchar(20) NOT NULL,
  "template_data" jsonb NOT NULL,
  "generation_context" jsonb,
  "curation" jsonb,
  "thumbnail_url" varchar(500),
  "is_public" boolean DEFAULT false NOT NULL,
  "status" varchar(20) DEFAULT 'draft' NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS "idx_templates_user" ON "design_templates" ("user_id");
CREATE INDEX IF NOT EXISTS "idx_templates_status" ON "design_templates" ("status");
CREATE INDEX IF NOT EXISTS "idx_templates_source" ON "design_templates" ("source");

-- invitations 테이블에 template_id 컬럼 추가
ALTER TABLE "invitations" ADD COLUMN IF NOT EXISTS "template_id" uuid;
ALTER TABLE "invitations" ADD COLUMN IF NOT EXISTS "is_template_reuse" boolean DEFAULT false;
ALTER TABLE "invitations" ADD COLUMN IF NOT EXISTS "published_url" varchar(500);

-- Foreign key 추가
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_template_id_design_templates_id_fk"
  FOREIGN KEY ("template_id") REFERENCES "design_templates"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- RLS 활성화
ALTER TABLE "design_templates" ENABLE ROW LEVEL SECURITY;

-- RLS 정책: 사용자는 자신의 템플릿만 조회/수정 가능
CREATE POLICY "Users can view own templates" ON "design_templates"
  FOR SELECT USING (auth.uid() = user_id OR is_public = true OR user_id IS NULL);

CREATE POLICY "Users can insert own templates" ON "design_templates"
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own templates" ON "design_templates"
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own templates" ON "design_templates"
  FOR DELETE USING (auth.uid() = user_id);
