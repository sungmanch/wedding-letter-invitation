'use client'

import * as React from 'react'
import { updateInvitation, updateInvitationDesign } from '@/lib/actions/wedding'
import type { Invitation, InvitationDesign, InvitationPhoto, NewInvitation } from '@/lib/db/invitation-schema'
import type { SectionSetting } from '@/lib/types/invitation-design'
import { createDefaultDesignData, migrateDesignData } from '@/lib/utils/design-migration'
import type { InvitationDesignData } from '@/lib/types/invitation-design'
import type { ColorPalette, FontSet, ThemeTemplate } from '@/lib/themes/schema'

interface EditContextType {
  invitation: Invitation
  design: InvitationDesign | null | undefined
  photos: InvitationPhoto[]
  updateField: <K extends keyof Invitation>(field: K, value: Invitation[K]) => void
  updateFields: (fields: Partial<NewInvitation>) => void
  isSaving: boolean
  hasChanges: boolean
  lastSaved: Date | null
  // Design 관련 추가
  designData: InvitationDesignData
  sections: SectionSetting[]
  updateSections: (sections: SectionSetting[]) => void
  updateDesignData: (data: Partial<InvitationDesignData>) => void
  // 스타일 관련
  colors: ColorPalette
  fonts: FontSet
  updateColors: (colors: ColorPalette) => void
  updateFonts: (fonts: FontSet) => void
  // 템플릿 적용
  applyTemplate: (template: ThemeTemplate, options: { applyColors: boolean; applyFonts: boolean; applySections: boolean }) => void
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
  const [design, setDesign] = React.useState<InvitationDesign | null | undefined>(initialDesign)
  const [photos] = React.useState<InvitationPhoto[]>(initialPhotos)
  const [isSaving, setIsSaving] = React.useState(false)
  const [hasChanges, setHasChanges] = React.useState(false)
  const [lastSaved, setLastSaved] = React.useState<Date | null>(null)
  const [pendingChanges, setPendingChanges] = React.useState<Partial<NewInvitation>>({})

  // Design data 상태 (v2 형식으로 마이그레이션)
  const [designData, setDesignData] = React.useState<InvitationDesignData>(() =>
    migrateDesignData(initialDesign?.designData)
  )
  const [pendingDesignChanges, setPendingDesignChanges] = React.useState<Partial<InvitationDesignData> | null>(null)

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

  // Design data 저장 effect
  React.useEffect(() => {
    if (!pendingDesignChanges || !design?.id) return

    const timeoutId = setTimeout(async () => {
      setIsSaving(true)
      try {
        const result = await updateInvitationDesign(design.id, { designData })
        if (result.success && result.data) {
          setDesign(result.data)
          setLastSaved(new Date())
          setHasChanges(true)
        }
      } catch (error) {
        console.error('Failed to save design:', error)
      } finally {
        setIsSaving(false)
        setPendingDesignChanges(null)
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [pendingDesignChanges, design?.id, designData])

  // 섹션 업데이트
  const updateSections = React.useCallback((sections: SectionSetting[]) => {
    setDesignData((prev) => {
      const updated = {
        ...prev,
        sections,
        meta: { ...prev.meta, updatedAt: new Date().toISOString() },
      }
      setPendingDesignChanges(updated)
      return updated
    })
  }, [])

  // 디자인 데이터 부분 업데이트
  const updateDesignData = React.useCallback((data: Partial<InvitationDesignData>) => {
    setDesignData((prev) => {
      const updated = {
        ...prev,
        ...data,
        meta: { ...prev.meta, updatedAt: new Date().toISOString() },
      }
      setPendingDesignChanges(updated)
      return updated
    })
  }, [])

  // 색상 업데이트
  const updateColors = React.useCallback((colors: ColorPalette) => {
    setDesignData((prev) => {
      const updated = {
        ...prev,
        globalStyles: { ...prev.globalStyles, colors },
        meta: { ...prev.meta, updatedAt: new Date().toISOString() },
      }
      setPendingDesignChanges(updated)
      return updated
    })
  }, [])

  // 폰트 업데이트
  const updateFonts = React.useCallback((fonts: FontSet) => {
    setDesignData((prev) => {
      const updated = {
        ...prev,
        globalStyles: { ...prev.globalStyles, fonts },
        meta: { ...prev.meta, updatedAt: new Date().toISOString() },
      }
      setPendingDesignChanges(updated)
      return updated
    })
  }, [])

  // 템플릿 적용
  const applyTemplate = React.useCallback((
    template: ThemeTemplate,
    options: { applyColors: boolean; applyFonts: boolean; applySections: boolean }
  ) => {
    setDesignData((prev) => {
      // 섹션 변환 (SectionType -> ExtendedSectionType)
      const convertedSections: SectionSetting[] = options.applySections
        ? template.sections.map((s, index) => ({
            id: s.id,
            type: s.type as SectionSetting['type'], // SectionType is subset of ExtendedSectionType
            enabled: s.enabled,
            order: index,
            label: {},
            layout: {
              type: s.layout,
              padding: (s.style.padding || 'medium') as SectionSetting['layout']['padding'],
              alignment: 'center' as const,
            },
            animation: s.animation,
            settings: s.content?.themeSpecific || {},
          }))
        : prev.sections

      const updated: InvitationDesignData = {
        ...prev,
        template: {
          id: template.id,
          source: template.source,
          name: template.nameKo,
        },
        globalStyles: {
          ...prev.globalStyles,
          ...(options.applyColors && { colors: template.defaultColors }),
          ...(options.applyFonts && { fonts: template.defaultFonts }),
        },
        sections: convertedSections,
        meta: { ...prev.meta, updatedAt: new Date().toISOString() },
      }
      setPendingDesignChanges(updated)
      return updated
    })
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
    designData,
    sections: designData.sections,
    updateSections,
    updateDesignData,
    colors: designData.globalStyles.colors,
    fonts: designData.globalStyles.fonts,
    updateColors,
    updateFonts,
    applyTemplate,
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
