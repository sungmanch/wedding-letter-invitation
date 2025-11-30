'use server'

import { db } from '@/lib/db'
import { invitations, invitationDesigns, invitationPhotos, type NewInvitation, type Invitation, type InvitationDesign, type InvitationPhoto } from '@/lib/db/invitation-schema'
import { eq, and, desc } from 'drizzle-orm'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Create a new invitation (draft)
export async function createInvitation(data: Partial<NewInvitation>): Promise<{ success: boolean; data?: Invitation; error?: string }> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: '로그인이 필요합니다' }
    }

    const [invitation] = await db.insert(invitations).values({
      userId: user.id,
      groomName: data.groomName || '',
      brideName: data.brideName || '',
      weddingDate: data.weddingDate || new Date().toISOString().split('T')[0],
      weddingTime: data.weddingTime || '12:00',
      venueName: data.venueName || '',
      venueAddress: data.venueAddress || '',
      status: 'draft',
      ...data,
    }).returning()

    revalidatePath('/my/invitations')

    return { success: true, data: invitation }
  } catch (error) {
    console.error('Failed to create invitation:', error)
    return { success: false, error: '청첩장 생성에 실패했습니다' }
  }
}

// Update an invitation
export async function updateInvitation(
  invitationId: string,
  data: Partial<NewInvitation>
): Promise<{ success: boolean; data?: Invitation; error?: string }> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: '로그인이 필요합니다' }
    }

    // Verify ownership
    const existing = await db.query.invitations.findFirst({
      where: and(
        eq(invitations.id, invitationId),
        eq(invitations.userId, user.id)
      ),
    })

    if (!existing) {
      return { success: false, error: '청첩장을 찾을 수 없습니다' }
    }

    const [updated] = await db.update(invitations)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(invitations.id, invitationId))
      .returning()

    revalidatePath('/my/invitations')
    revalidatePath(`/${invitationId}`)

    return { success: true, data: updated }
  } catch (error) {
    console.error('Failed to update invitation:', error)
    return { success: false, error: '청첩장 수정에 실패했습니다' }
  }
}

// Get an invitation by ID
export async function getInvitation(
  invitationId: string
): Promise<{ success: boolean; data?: Invitation & { selectedDesign?: InvitationDesign | null; photos?: InvitationPhoto[] }; error?: string }> {
  try {
    const invitation = await db.query.invitations.findFirst({
      where: eq(invitations.id, invitationId),
      with: {
        selectedDesign: true,
        photos: {
          orderBy: (photos, { asc }) => [asc(photos.displayOrder)],
        },
      },
    })

    if (!invitation) {
      return { success: false, error: '청첩장을 찾을 수 없습니다' }
    }

    return { success: true, data: invitation }
  } catch (error) {
    console.error('Failed to get invitation:', error)
    return { success: false, error: '청첩장 조회에 실패했습니다' }
  }
}

// Get my invitations
export async function getMyInvitations(): Promise<{ success: boolean; data?: Invitation[]; error?: string }> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: '로그인이 필요합니다' }
    }

    const myInvitations = await db.query.invitations.findMany({
      where: and(
        eq(invitations.userId, user.id),
        // Don't show deleted invitations
        // We can't use 'ne' in this version, so we'll filter client-side if needed
      ),
      orderBy: [desc(invitations.createdAt)],
    })

    // Filter out deleted invitations
    const filtered = myInvitations.filter(inv => inv.status !== 'deleted')

    return { success: true, data: filtered }
  } catch (error) {
    console.error('Failed to get my invitations:', error)
    return { success: false, error: '청첩장 목록 조회에 실패했습니다' }
  }
}

// Delete an invitation (soft delete)
export async function deleteInvitation(
  invitationId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: '로그인이 필요합니다' }
    }

    // Verify ownership
    const existing = await db.query.invitations.findFirst({
      where: and(
        eq(invitations.id, invitationId),
        eq(invitations.userId, user.id)
      ),
    })

    if (!existing) {
      return { success: false, error: '청첩장을 찾을 수 없습니다' }
    }

    await db.update(invitations)
      .set({
        status: 'deleted',
        updatedAt: new Date(),
      })
      .where(eq(invitations.id, invitationId))

    revalidatePath('/my/invitations')

    return { success: true }
  } catch (error) {
    console.error('Failed to delete invitation:', error)
    return { success: false, error: '청첩장 삭제에 실패했습니다' }
  }
}

// Get designs for an invitation
export async function getInvitationDesigns(
  invitationId: string
): Promise<{ success: boolean; data?: InvitationDesign[]; error?: string }> {
  try {
    const designs = await db.query.invitationDesigns.findMany({
      where: eq(invitationDesigns.invitationId, invitationId),
      orderBy: [desc(invitationDesigns.createdAt)],
    })

    return { success: true, data: designs }
  } catch (error) {
    console.error('Failed to get invitation designs:', error)
    return { success: false, error: '디자인 조회에 실패했습니다' }
  }
}

// Save screen structure as a new design
export async function saveScreenStructure(
  invitationId: string,
  screenStructure: unknown
): Promise<{ success: boolean; data?: InvitationDesign; error?: string }> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: '로그인이 필요합니다' }
    }

    // Verify ownership
    const existing = await db.query.invitations.findFirst({
      where: and(
        eq(invitations.id, invitationId),
        eq(invitations.userId, user.id)
      ),
    })

    if (!existing) {
      return { success: false, error: '청첩장을 찾을 수 없습니다' }
    }

    // Get the latest batch number
    const latestDesign = await db.query.invitationDesigns.findFirst({
      where: eq(invitationDesigns.invitationId, invitationId),
      orderBy: [desc(invitationDesigns.generationBatch)],
    })

    const newBatch = (latestDesign?.generationBatch || 0) + 1

    // Deselect all existing designs
    await db.update(invitationDesigns)
      .set({ isSelected: false })
      .where(eq(invitationDesigns.invitationId, invitationId))

    // Insert the new design with screen structure
    const [newDesign] = await db.insert(invitationDesigns).values({
      invitationId,
      designData: screenStructure as InvitationDesign['designData'],
      generationBatch: newBatch,
      isSelected: true,
    }).returning()

    // Update the invitation with selected design ID
    await db.update(invitations)
      .set({
        selectedDesignId: newDesign.id,
        updatedAt: new Date(),
      })
      .where(eq(invitations.id, invitationId))

    revalidatePath(`/${invitationId}`)

    return { success: true, data: newDesign }
  } catch (error) {
    console.error('Failed to save screen structure:', error)
    return { success: false, error: '디자인 저장에 실패했습니다' }
  }
}

// Select a design for an invitation
export async function selectDesign(
  invitationId: string,
  designId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: '로그인이 필요합니다' }
    }

    // Verify ownership
    const existing = await db.query.invitations.findFirst({
      where: and(
        eq(invitations.id, invitationId),
        eq(invitations.userId, user.id)
      ),
    })

    if (!existing) {
      return { success: false, error: '청첩장을 찾을 수 없습니다' }
    }

    // Deselect all designs for this invitation
    await db.update(invitationDesigns)
      .set({ isSelected: false })
      .where(eq(invitationDesigns.invitationId, invitationId))

    // Select the new design
    await db.update(invitationDesigns)
      .set({ isSelected: true })
      .where(eq(invitationDesigns.id, designId))

    // Update the invitation with selected design ID
    await db.update(invitations)
      .set({
        selectedDesignId: designId,
        updatedAt: new Date(),
      })
      .where(eq(invitations.id, invitationId))

    revalidatePath(`/${invitationId}`)

    return { success: true }
  } catch (error) {
    console.error('Failed to select design:', error)
    return { success: false, error: '디자인 선택에 실패했습니다' }
  }
}
