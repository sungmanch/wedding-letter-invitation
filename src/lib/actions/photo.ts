'use server'

import { db } from '@/lib/db'
import { invitations, invitationPhotos, type InvitationPhoto } from '@/lib/db/invitation-schema'
import { eq, and, asc } from 'drizzle-orm'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

const BUCKET_NAME = 'wedding-photos'
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/heic', 'image/heif', 'image/webp']
const MAX_PHOTOS = 10

// Upload photos
export async function uploadPhotos(
  invitationId: string,
  formData: FormData
): Promise<{ success: boolean; data?: InvitationPhoto[]; error?: string }> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: '로그인이 필요합니다' }
    }

    // Verify ownership
    const invitation = await db.query.invitations.findFirst({
      where: and(
        eq(invitations.id, invitationId),
        eq(invitations.userId, user.id)
      ),
    })

    if (!invitation) {
      return { success: false, error: '청첩장을 찾을 수 없습니다' }
    }

    // Get current photo count
    const existingPhotos = await db.query.invitationPhotos.findMany({
      where: eq(invitationPhotos.invitationId, invitationId),
    })

    const files = formData.getAll('files') as File[]

    if (existingPhotos.length + files.length > MAX_PHOTOS) {
      return { success: false, error: `최대 ${MAX_PHOTOS}장까지 업로드할 수 있습니다` }
    }

    const uploadedPhotos: InvitationPhoto[] = []
    let displayOrder = existingPhotos.length

    for (const file of files) {
      // Validate file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        console.warn(`Skipping file with unsupported type: ${file.type}`)
        continue
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        console.warn(`Skipping file exceeding size limit: ${file.size}`)
        continue
      }

      // Generate unique filename
      const ext = file.name.split('.').pop() || 'jpg'
      const filename = `${invitationId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      // Upload to Supabase Storage
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

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filename)

      // Save to database
      const [photo] = await db.insert(invitationPhotos).values({
        invitationId,
        storagePath: filename,
        url: urlData.publicUrl,
        displayOrder,
      }).returning()

      uploadedPhotos.push(photo)
      displayOrder++
    }

    revalidatePath(`/${invitationId}`)

    return { success: true, data: uploadedPhotos }
  } catch (error) {
    console.error('Failed to upload photos:', error)
    return { success: false, error: '사진 업로드에 실패했습니다' }
  }
}

// Delete a photo
export async function deletePhoto(
  invitationId: string,
  photoId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: '로그인이 필요합니다' }
    }

    // Verify ownership
    const invitation = await db.query.invitations.findFirst({
      where: and(
        eq(invitations.id, invitationId),
        eq(invitations.userId, user.id)
      ),
    })

    if (!invitation) {
      return { success: false, error: '청첩장을 찾을 수 없습니다' }
    }

    // Get the photo
    const photo = await db.query.invitationPhotos.findFirst({
      where: and(
        eq(invitationPhotos.id, photoId),
        eq(invitationPhotos.invitationId, invitationId)
      ),
    })

    if (!photo) {
      return { success: false, error: '사진을 찾을 수 없습니다' }
    }

    // Delete from storage
    const { error: deleteError } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([photo.storagePath])

    if (deleteError) {
      console.error('Failed to delete from storage:', deleteError)
    }

    // Delete from database
    await db.delete(invitationPhotos)
      .where(eq(invitationPhotos.id, photoId))

    // Re-order remaining photos
    const remainingPhotos = await db.query.invitationPhotos.findMany({
      where: eq(invitationPhotos.invitationId, invitationId),
      orderBy: [asc(invitationPhotos.displayOrder)],
    })

    for (let i = 0; i < remainingPhotos.length; i++) {
      await db.update(invitationPhotos)
        .set({ displayOrder: i })
        .where(eq(invitationPhotos.id, remainingPhotos[i].id))
    }

    revalidatePath(`/${invitationId}`)

    return { success: true }
  } catch (error) {
    console.error('Failed to delete photo:', error)
    return { success: false, error: '사진 삭제에 실패했습니다' }
  }
}

// Reorder photos
export async function reorderPhotos(
  invitationId: string,
  photoIds: string[]
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: '로그인이 필요합니다' }
    }

    // Verify ownership
    const invitation = await db.query.invitations.findFirst({
      where: and(
        eq(invitations.id, invitationId),
        eq(invitations.userId, user.id)
      ),
    })

    if (!invitation) {
      return { success: false, error: '청첩장을 찾을 수 없습니다' }
    }

    // Update order for each photo
    for (let i = 0; i < photoIds.length; i++) {
      await db.update(invitationPhotos)
        .set({ displayOrder: i })
        .where(and(
          eq(invitationPhotos.id, photoIds[i]),
          eq(invitationPhotos.invitationId, invitationId)
        ))
    }

    revalidatePath(`/${invitationId}`)

    return { success: true }
  } catch (error) {
    console.error('Failed to reorder photos:', error)
    return { success: false, error: '사진 순서 변경에 실패했습니다' }
  }
}

// Get photos for an invitation
export async function getPhotos(
  invitationId: string
): Promise<{ success: boolean; data?: InvitationPhoto[]; error?: string }> {
  try {
    const photos = await db.query.invitationPhotos.findMany({
      where: eq(invitationPhotos.invitationId, invitationId),
      orderBy: [asc(invitationPhotos.displayOrder)],
    })

    return { success: true, data: photos }
  } catch (error) {
    console.error('Failed to get photos:', error)
    return { success: false, error: '사진 조회에 실패했습니다' }
  }
}
