'use server'

import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import {
  paperInvitationRequests,
  paperInvitationPhotos,
  type PaperInvitationRequest,
} from '@/lib/db/invitation-schema'
import { createClient } from '@/lib/supabase/server'
import { notifyPaperInvitationRequest } from '@/lib/slack'

const BUCKET_NAME = 'paper-invitation-photos'
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_PAPER_PHOTOS = 10
const MIN_DAYS_FOR_COMPLETION = 4

/**
 * 종이 청첩장 신청 제출
 */
export async function submitPaperInvitationRequest(
  formData: FormData
): Promise<{ success: boolean; data?: PaperInvitationRequest; error?: string }> {
  try {
    const supabase = await createClient()

    // 사용자 정보 (로그인 선택사항)
    const { data: { user } } = await supabase.auth.getUser()

    // 폼 데이터 추출
    const phone = formData.get('phone') as string
    const email = formData.get('email') as string | null
    const notes = formData.get('notes') as string | null
    const paperFiles = formData.getAll('paperFiles') as File[]
    const mainFile = formData.get('mainFile') as File | null

    // 유효성 검사
    if (!phone) {
      return { success: false, error: '연락처를 입력해주세요' }
    }

    if (paperFiles.length === 0) {
      return { success: false, error: '종이 청첩장 사진을 최소 1장 이상 업로드해주세요' }
    }

    if (paperFiles.length > MAX_PAPER_PHOTOS) {
      return { success: false, error: `종이 청첩장 사진은 최대 ${MAX_PAPER_PHOTOS}장까지 업로드할 수 있습니다` }
    }

    if (!mainFile) {
      return { success: false, error: '메인 이미지를 업로드해주세요' }
    }

    // 예상 완료일 계산 (최소 4일 후)
    const estimatedCompletionDate = new Date()
    estimatedCompletionDate.setDate(estimatedCompletionDate.getDate() + MIN_DAYS_FOR_COMPLETION)

    // 신청 레코드 생성
    const [request] = await db.insert(paperInvitationRequests).values({
      userId: user?.id ?? null,
      email: email || null,
      phone,
      notes: notes || null,
      status: 'pending',
      estimatedCompletionDate,
    }).returning()

    // 종이 청첩장 사진 업로드
    let displayOrder = 0

    for (const file of paperFiles) {
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
      const filename = `${request.id}/paper-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

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

      // DB에 사진 정보 저장 (종이 청첩장 사진은 isMain: false)
      await db.insert(paperInvitationPhotos).values({
        requestId: request.id,
        storagePath: filename,
        url: urlData.publicUrl,
        displayOrder,
        isMain: false,
      })

      displayOrder++
    }

    // 메인 이미지 업로드
    let mainPhotoPath: string | null = null

    if (ALLOWED_TYPES.includes(mainFile.type) && mainFile.size <= MAX_FILE_SIZE) {
      const ext = mainFile.name.split('.').pop() || 'jpg'
      const filename = `${request.id}/main-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filename, mainFile, {
          cacheControl: '3600',
          upsert: false,
        })

      if (!uploadError) {
        const { data: urlData } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(filename)

        // DB에 메인 사진 정보 저장
        await db.insert(paperInvitationPhotos).values({
          requestId: request.id,
          storagePath: filename,
          url: urlData.publicUrl,
          displayOrder: 999, // 메인 이미지는 별도 순서
          isMain: true,
        })

        mainPhotoPath = filename
      }
    }

    // 메인 사진 경로 업데이트
    if (mainPhotoPath) {
      await db.update(paperInvitationRequests)
        .set({ mainPhotoPath })
        .where(eq(paperInvitationRequests.id, request.id))
    }

    // Slack 알림 발송 (비동기, 실패해도 신청 성공에 영향 없음)
    notifyPaperInvitationRequest(
      request.id,
      phone,
      email,
      paperFiles.length,
      estimatedCompletionDate,
      !!notes
    ).catch(console.error)

    return { success: true, data: request }
  } catch (error) {
    console.error('Failed to submit paper invitation request:', error)
    return { success: false, error: '신청에 실패했습니다. 다시 시도해주세요.' }
  }
}

/**
 * 종이 청첩장 신청 상태 조회
 */
export async function getPaperInvitationRequest(
  requestId: string
): Promise<{ success: boolean; data?: PaperInvitationRequest; error?: string }> {
  try {
    const request = await db.query.paperInvitationRequests.findFirst({
      where: eq(paperInvitationRequests.id, requestId),
      with: {
        photos: true,
      },
    })

    if (!request) {
      return { success: false, error: '신청 정보를 찾을 수 없습니다' }
    }

    return { success: true, data: request }
  } catch (error) {
    console.error('Failed to get paper invitation request:', error)
    return { success: false, error: '조회에 실패했습니다' }
  }
}
