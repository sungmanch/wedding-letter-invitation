'use server'

import { db } from '@/lib/db'
import {
  presetRequests,
  presetRequestImages,
  type PresetRequest,
} from '@/lib/db/invitation-schema'
import { createClient } from '@/lib/supabase/server'
import { notifyPresetRequest } from '@/lib/slack'

const BUCKET_NAME = 'preset-request-images'
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_IMAGES = 3

/**
 * 프리셋 요청 제출
 */
export async function submitPresetRequest(
  formData: FormData
): Promise<{ success: boolean; data?: PresetRequest; error?: string }> {
  try {
    const supabase = await createClient()

    // 사용자 정보 (로그인 필수)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: '로그인이 필요합니다' }
    }

    // 폼 데이터 추출
    const sectionType = formData.get('sectionType') as string
    const description = formData.get('description') as string
    const email = formData.get('email') as string
    const imageFiles = formData.getAll('images') as File[]

    // 유효성 검사
    if (!sectionType) {
      return { success: false, error: '섹션 타입이 필요합니다' }
    }

    if (!description || description.trim().length < 10) {
      return { success: false, error: '설명을 10자 이상 입력해주세요' }
    }

    if (!email || !email.includes('@')) {
      return { success: false, error: '유효한 이메일을 입력해주세요' }
    }

    // 요청 레코드 생성
    const [request] = await db.insert(presetRequests).values({
      userId: user.id,
      sectionType,
      description: description.trim(),
      email,
      status: 'pending',
    }).returning()

    // 이미지 업로드 (옵션)
    let uploadedCount = 0

    for (let i = 0; i < Math.min(imageFiles.length, MAX_IMAGES); i++) {
      const file = imageFiles[i]

      // 빈 파일 건너뛰기
      if (!file || file.size === 0) continue

      // 타입 검증
      if (!ALLOWED_TYPES.includes(file.type)) {
        console.warn(`Skipping file with unsupported type: ${file.type}`)
        continue
      }

      // 크기 검증
      if (file.size > MAX_FILE_SIZE) {
        console.warn(`Skipping file exceeding size limit: ${file.size}`)
        continue
      }

      // 파일명 생성
      const ext = file.name.split('.').pop() || 'jpg'
      const filename = `${request.id}/${Date.now()}-${i}.${ext}`

      // Supabase Storage에 업로드
      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filename, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) {
        console.error('Failed to upload file:', uploadError)
        continue
      }

      // Public URL 가져오기
      const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filename)

      // DB에 이미지 정보 저장
      await db.insert(presetRequestImages).values({
        requestId: request.id,
        storagePath: filename,
        url: urlData.publicUrl,
        displayOrder: i,
      })

      uploadedCount++
    }

    // 슬랙 알림 발송 (fire-and-forget)
    notifyPresetRequest(
      {
        sectionType: request.sectionType,
        email: request.email,
        description: request.description,
      },
      uploadedCount
    ).catch(console.error)

    return { success: true, data: request }
  } catch (error) {
    console.error('Failed to submit preset request:', error)
    return { success: false, error: '요청에 실패했습니다. 다시 시도해주세요.' }
  }
}
