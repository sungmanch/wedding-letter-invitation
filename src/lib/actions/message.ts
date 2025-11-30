'use server'

import { db } from '@/lib/db'
import { invitations, invitationMessages, type InvitationMessage } from '@/lib/db/invitation-schema'
import { eq, and, desc } from 'drizzle-orm'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

const MAX_MESSAGE_LENGTH = 300

// Create a congratulatory message (Guest)
export async function createMessage(
  invitationId: string,
  guestName: string,
  content: string
): Promise<{ success: boolean; data?: InvitationMessage; error?: string }> {
  try {
    // Validate inputs
    if (!guestName.trim()) {
      return { success: false, error: '이름을 입력해주세요' }
    }

    if (!content.trim()) {
      return { success: false, error: '메시지를 입력해주세요' }
    }

    if (content.length > MAX_MESSAGE_LENGTH) {
      return { success: false, error: `메시지는 ${MAX_MESSAGE_LENGTH}자 이내로 입력해주세요` }
    }

    // Check if invitation exists and is published
    const invitation = await db.query.invitations.findFirst({
      where: eq(invitations.id, invitationId),
    })

    if (!invitation) {
      return { success: false, error: '청첩장을 찾을 수 없습니다' }
    }

    if (invitation.status !== 'published') {
      return { success: false, error: '아직 공개되지 않은 청첩장입니다' }
    }

    // Create message
    const [message] = await db.insert(invitationMessages).values({
      invitationId,
      guestName: guestName.trim(),
      content: content.trim(),
      isRead: false,
    }).returning()

    revalidatePath(`/${invitationId}/messages`)

    return { success: true, data: message }
  } catch (error) {
    console.error('Failed to create message:', error)
    return { success: false, error: '메시지 저장에 실패했습니다' }
  }
}

// Get messages for an invitation (Host only)
export async function getMessages(
  invitationId: string
): Promise<{ success: boolean; data?: InvitationMessage[]; error?: string }> {
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

    const messages = await db.query.invitationMessages.findMany({
      where: eq(invitationMessages.invitationId, invitationId),
      orderBy: [desc(invitationMessages.createdAt)],
    })

    return { success: true, data: messages }
  } catch (error) {
    console.error('Failed to get messages:', error)
    return { success: false, error: '메시지 조회에 실패했습니다' }
  }
}

// Mark message as read (Host only)
export async function markMessageAsRead(
  invitationId: string,
  messageId: string
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

    await db.update(invitationMessages)
      .set({ isRead: true })
      .where(and(
        eq(invitationMessages.id, messageId),
        eq(invitationMessages.invitationId, invitationId)
      ))

    revalidatePath(`/${invitationId}/messages`)

    return { success: true }
  } catch (error) {
    console.error('Failed to mark message as read:', error)
    return { success: false, error: '메시지 읽음 처리에 실패했습니다' }
  }
}

// Get unread message count (Host only)
export async function getUnreadMessageCount(
  invitationId: string
): Promise<{ success: boolean; count?: number; error?: string }> {
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

    const messages = await db.query.invitationMessages.findMany({
      where: and(
        eq(invitationMessages.invitationId, invitationId),
        eq(invitationMessages.isRead, false)
      ),
    })

    return { success: true, count: messages.length }
  } catch (error) {
    console.error('Failed to get unread count:', error)
    return { success: false, error: '읽지 않은 메시지 수 조회에 실패했습니다' }
  }
}
