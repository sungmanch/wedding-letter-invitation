'use client'

import * as React from 'react'
import { updateInvitation } from '@/lib/actions/wedding'
import type { Invitation, InvitationDesign, InvitationPhoto, NewInvitation } from '@/lib/db/invitation-schema'

interface EditContextType {
  invitation: Invitation
  design: InvitationDesign | null | undefined
  photos: InvitationPhoto[]
  updateField: <K extends keyof Invitation>(field: K, value: Invitation[K]) => void
  updateFields: (fields: Partial<NewInvitation>) => void
  isSaving: boolean
  hasChanges: boolean
  lastSaved: Date | null
}

const EditContext = React.createContext<EditContextType | null>(null)

interface EditContextProviderProps {
  initialInvitation: Invitation
  initialDesign?: InvitationDesign | null
  initialPhotos: InvitationPhoto[]
  children: React.ReactNode
}

export function EditContextProvider({
  initialInvitation,
  initialDesign,
  initialPhotos,
  children,
}: EditContextProviderProps) {
  const [invitation, setInvitation] = React.useState<Invitation>(initialInvitation)
  const [design] = React.useState<InvitationDesign | null | undefined>(initialDesign)
  const [photos] = React.useState<InvitationPhoto[]>(initialPhotos)
  const [isSaving, setIsSaving] = React.useState(false)
  const [hasChanges, setHasChanges] = React.useState(false)
  const [lastSaved, setLastSaved] = React.useState<Date | null>(null)
  const [pendingChanges, setPendingChanges] = React.useState<Partial<NewInvitation>>({})

  // Debounced save effect
  React.useEffect(() => {
    if (Object.keys(pendingChanges).length === 0) return

    const timeoutId = setTimeout(async () => {
      setIsSaving(true)
      try {
        const result = await updateInvitation(invitation.id, pendingChanges)
        if (result.success && result.data) {
          setInvitation(result.data)
          setLastSaved(new Date())
          setHasChanges(true)
        }
      } catch (error) {
        console.error('Failed to save invitation:', error)
      } finally {
        setIsSaving(false)
        setPendingChanges({})
      }
    }, 500) // 500ms debounce

    return () => clearTimeout(timeoutId)
  }, [pendingChanges, invitation.id])

  const updateField = React.useCallback(<K extends keyof Invitation>(
    field: K,
    value: Invitation[K]
  ) => {
    // Update local state immediately for responsive UI
    setInvitation((prev) => ({ ...prev, [field]: value }))
    // Queue change for saving
    setPendingChanges((prev) => ({ ...prev, [field]: value }))
  }, [])

  const updateFields = React.useCallback((fields: Partial<NewInvitation>) => {
    // Update local state immediately
    setInvitation((prev) => ({ ...prev, ...fields }))
    // Queue changes for saving
    setPendingChanges((prev) => ({ ...prev, ...fields }))
  }, [])

  const value: EditContextType = {
    invitation,
    design,
    photos,
    updateField,
    updateFields,
    isSaving,
    hasChanges,
    lastSaved,
  }

  return (
    <EditContext.Provider value={value}>
      {children}
    </EditContext.Provider>
  )
}

export function useEditContext() {
  const context = React.useContext(EditContext)
  if (!context) {
    throw new Error('useEditContext must be used within EditContextProvider')
  }
  return context
}
