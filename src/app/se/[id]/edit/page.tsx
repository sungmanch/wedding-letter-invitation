'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  getInvitationWithTemplate,
  updateInvitationData,
  updateInvitationSections,
  updateTemplateStyle,
  updateTemplateLayout,
} from '@/lib/super-editor/actions'
import { SuperEditorProvider, useSuperEditor } from '@/lib/super-editor/context'
import {
  EditorPanel,
  EditorToolbar,
  SectionManager,
  StyleEditor,
  InvitationPreview,
  OgMetadataEditor,
  SharePreview,
} from '@/lib/super-editor/components'
import { generatePreviewToken, getShareablePreviewUrl } from '@/lib/utils/preview-token'
import {
  DEFAULT_SECTION_ORDER,
  DEFAULT_SECTION_ENABLED,
  REORDERABLE_SECTIONS,
} from '@/lib/super-editor/schema/section-types'
import {
  replaceScreenVariant,
  createScreenFromVariant,
} from '@/lib/super-editor/builder/skeleton-resolver'
import { getDefaultVariant } from '@/lib/super-editor/skeletons/registry'
import type { LayoutSchema, Screen } from '@/lib/super-editor/schema/layout'
import type { StyleSchema } from '@/lib/super-editor/schema/style'
import type { UserData } from '@/lib/super-editor/schema/user-data'
import type { SectionType } from '@/lib/super-editor/schema/section-types'
import type { SectionScreen } from '@/lib/super-editor/skeletons/types'
import type { VariablesSchema } from '@/lib/super-editor/schema/variables'

type EditorTab = 'fields' | 'style' | 'sections' | 'share'

function EditPageContent() {
  const params = useParams()
  const router = useRouter()
  const invitationId = params.id as string

  const { state, setTemplate, setUserData, setStyle } = useSuperEditor()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [copySuccess, setCopySuccess] = useState(false)
  const [sectionOrder, setSectionOrder] = useState<SectionType[]>(DEFAULT_SECTION_ORDER)
  const [sectionEnabled, setSectionEnabled] =
    useState<Record<SectionType, boolean>>(DEFAULT_SECTION_ENABLED)
  const [selectedNodeId, setSelectedNodeId] = useState<string | undefined>()
  const [activeTab, setActiveTab] = useState<EditorTab>('fields')
  // 변수 선언 (에디터 필드 생성용)
  const [variablesSchema, setVariablesSchema] = useState<VariablesSchema | undefined>()
  // Variant switcher state (dev mode only)
  const [sectionVariants, setSectionVariants] = useState<Record<SectionType, string>>(
    {} as Record<SectionType, string>
  )
  // OG 기본값
  const [ogDefaults, setOgDefaults] = useState({
    title: '',
    description: '',
    mainImageUrl: '',
    groomName: '신랑',
    brideName: '신부',
  })
  // OG 현재값 (실시간 미리보기용)
  const [ogValues, setOgValues] = useState({ title: '', description: '', imageUrl: '' })

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getInvitationWithTemplate(invitationId)
        if (!data) {
          setError('청첩장을 찾을 수 없습니다.')
          return
        }

        const { invitation, template } = data
        setTemplate(
          template.layoutSchema as LayoutSchema,
          template.styleSchema as StyleSchema
        )
        setUserData(invitation.userData as UserData)
        // 변수 선언 저장 (에디터 필드 생성에 사용)
        if (template.variablesSchema) {
          setVariablesSchema(template.variablesSchema as VariablesSchema)
        }
        setSectionOrder((invitation.sectionOrder as SectionType[]) ?? DEFAULT_SECTION_ORDER)
        setSectionEnabled(
          (invitation.sectionEnabled as Record<SectionType, boolean>) ?? DEFAULT_SECTION_ENABLED
        )

        // OG 기본값 설정
        const userData = invitation.userData as UserData
        const weddingData = userData.data as {
          couple?: { groom?: { name?: string }; bride?: { name?: string } }
          wedding?: { dateDisplay?: string }
          venue?: { name?: string }
          photos?: { main?: string; cover?: string }
        } | undefined
        const groomName = weddingData?.couple?.groom?.name || '신랑'
        const brideName = weddingData?.couple?.bride?.name || '신부'
        const dateDisplay = weddingData?.wedding?.dateDisplay || ''
        const venueName = weddingData?.venue?.name || ''
        const mainImageUrl = weddingData?.photos?.main || weddingData?.photos?.cover || ''
        setOgDefaults({
          title: `${groomName} ♥ ${brideName} 결혼합니다`,
          description: dateDisplay && venueName
            ? `${dateDisplay} | ${venueName}에서 축하해주세요`
            : '모바일 청첩장',
          mainImageUrl,
          groomName,
          brideName,
        })

        // Initialize section variants from layout or defaults (dev mode only)
        if (process.env.NODE_ENV === 'development') {
          const layout = template.layoutSchema as LayoutSchema
          const initialVariants: Record<SectionType, string> = {} as Record<SectionType, string>
          for (const screen of layout.screens) {
            const sectionType = screen.sectionType as SectionType
            // Try to get variant from screen name or use default
            const defaultVar = getDefaultVariant(sectionType)
            initialVariants[sectionType] = defaultVar?.id ?? 'default'
          }
          setSectionVariants(initialVariants)
        }
      } catch (err) {
        console.error('Failed to load invitation:', err)
        setError('청첩장을 불러오는데 실패했습니다.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [invitationId, setTemplate, setUserData])

  // userData 변경 시 OG 기본값 업데이트 (실시간 반영)
  useEffect(() => {
    if (!state.userData) return

    const weddingData = state.userData.data as {
      couple?: { groom?: { name?: string }; bride?: { name?: string } }
      wedding?: { dateDisplay?: string }
      venue?: { name?: string }
      photos?: { main?: string; cover?: string }
    } | undefined

    const groomName = weddingData?.couple?.groom?.name || '신랑'
    const brideName = weddingData?.couple?.bride?.name || '신부'
    const dateDisplay = weddingData?.wedding?.dateDisplay || ''
    const venueName = weddingData?.venue?.name || ''
    const mainImageUrl = weddingData?.photos?.main || weddingData?.photos?.cover || ''

    setOgDefaults({
      title: `${groomName} ♥ ${brideName} 결혼합니다`,
      description: dateDisplay && venueName
        ? `${dateDisplay} | ${venueName}에서 축하해주세요`
        : '모바일 청첩장',
      mainImageUrl,
      groomName,
      brideName,
    })
  }, [state.userData])

  const handleSave = useCallback(async () => {
    if (!state.userData) return

    setSaving(true)
    try {
      // userData 저장
      await updateInvitationData(invitationId, state.userData)

      // sectionOrder, sectionEnabled 저장
      await updateInvitationSections(invitationId, sectionOrder, sectionEnabled)

      // layout 저장 (섹션 추가/variant 변경 반영)
      if (state.layout) {
        await updateTemplateLayout(invitationId, state.layout)
      }

      // style 저장
      if (state.style) {
        await updateTemplateStyle(invitationId, state.style)
      }
    } catch (err) {
      console.error('Failed to save:', err)
      alert('저장에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }, [invitationId, state.userData, state.layout, state.style, sectionOrder, sectionEnabled])

  const handleGenerateShareUrl = useCallback(async () => {
    try {
      const token = await generatePreviewToken(invitationId, 'owner')
      const url = getShareablePreviewUrl(invitationId, token)
      setShareUrl(url)
    } catch (err) {
      console.error('Failed to generate share URL:', err)
      alert('공유 링크 생성에 실패했습니다.')
    }
  }, [invitationId])

  const handleCopyShareUrl = useCallback(async () => {
    if (!shareUrl) return

    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }, [shareUrl])

  const handlePreview = useCallback(() => {
    router.push(`/se/${invitationId}/preview`)
  }, [router, invitationId])

  const handleSelectNode = useCallback((id: string) => {
    setSelectedNodeId(id)
  }, [])

  const handleSectionOrderChange = useCallback(
    async (newOrder: SectionType[]) => {
      setSectionOrder(newOrder)
      try {
        await updateInvitationSections(invitationId, newOrder, sectionEnabled)
      } catch (err) {
        console.error('Failed to save section order:', err)
      }
    },
    [invitationId, sectionEnabled]
  )

  const handleSectionEnabledChange = useCallback(
    async (newEnabled: Record<SectionType, boolean>) => {
      setSectionEnabled(newEnabled)
      try {
        await updateInvitationSections(invitationId, sectionOrder, newEnabled)
      } catch (err) {
        console.error('Failed to save section enabled:', err)
      }
    },
    [invitationId, sectionOrder]
  )

  // 스타일 변경 (프리뷰 업데이트만, 저장은 handleSave에서)
  const handleStyleChange = useCallback(
    (newStyle: StyleSchema) => {
      setStyle(newStyle)
    },
    [setStyle]
  )

  // Variant change handler (dev mode only)
  const handleVariantChange = useCallback(
    (sectionType: SectionType, variantId: string) => {
      if (process.env.NODE_ENV !== 'development' || !state.layout) return

      setSectionVariants((prev) => ({ ...prev, [sectionType]: variantId }))

      // Update layout with new variant screen
      const newScreens = replaceScreenVariant(
        state.layout.screens as SectionScreen[],
        sectionType,
        variantId
      )

      const newLayout: LayoutSchema = {
        ...state.layout,
        screens: newScreens as Screen[],
      }

      // Update context state (visual update only, not saved to DB)
      setTemplate(newLayout, state.style!)
    },
    [state.layout, state.style, setTemplate]
  )

  // Add section handler (dev mode only)
  const handleAddSection = useCallback(
    (sectionType: SectionType) => {
      if (process.env.NODE_ENV !== 'development' || !state.layout) return

      // Get default variant for the section
      const defaultVariant = getDefaultVariant(sectionType)
      if (!defaultVariant) {
        console.error(`No default variant for section: ${sectionType}`)
        return
      }

      // Create new screen from skeleton
      const newScreen = createScreenFromVariant(sectionType, defaultVariant.id)
      if (!newScreen) {
        console.error(`Failed to create screen for section: ${sectionType}`)
        return
      }

      // Add to layout
      const newScreens = [...state.layout.screens, newScreen as Screen]
      const newLayout: LayoutSchema = {
        ...state.layout,
        screens: newScreens,
      }

      // Update section order and enabled state
      if (!sectionOrder.includes(sectionType)) {
        setSectionOrder((prev) => [...prev, sectionType])
      }
      setSectionEnabled((prev) => ({ ...prev, [sectionType]: true }))
      setSectionVariants((prev) => ({ ...prev, [sectionType]: defaultVariant.id }))

      // Update context state
      setTemplate(newLayout, state.style!)
    },
    [state.layout, state.style, setTemplate, sectionOrder]
  )

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8">
          <p className="text-lg font-medium text-gray-900">{error}</p>
          <button
            onClick={() => router.push('/super-editor')}
            className="mt-4 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600"
          >
            새로 만들기
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-gray-900">청첩장 편집</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 text-sm font-medium"
            >
              {saving ? '저장 중...' : '저장'}
            </button>
            <button
              onClick={handleGenerateShareUrl}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium"
            >
              공유 링크 생성
            </button>
            <button
              onClick={handlePreview}
              className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 text-sm font-medium"
            >
              미리보기
            </button>
            <button
              onClick={() => router.push(`/paywall?type=2&id=${invitationId}`)}
              className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 text-sm font-medium"
            >
              결제하기
            </button>
          </div>
        </div>

        {/* 공유 링크 표시 */}
        {shareUrl && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg flex items-center gap-2">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 px-3 py-1.5 bg-white border border-blue-200 rounded text-sm"
            />
            <button
              onClick={handleCopyShareUrl}
              className="px-3 py-1.5 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              {copySuccess ? '복사됨!' : '복사'}
            </button>
            <span className="text-xs text-blue-600">1시간 동안 유효</span>
          </div>
        )}
      </header>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 왼쪽: 에디터 패널 */}
        <div className="w-[400px] flex flex-col bg-white border-r border-gray-200 shrink-0">
          {/* 탭 네비게이션 */}
          <div className="flex border-b border-gray-200 shrink-0">
            <button
              onClick={() => setActiveTab('fields')}
              className={`flex-1 px-3 py-3 text-sm font-medium transition-colors ${
                activeTab === 'fields'
                  ? 'text-rose-600 border-b-2 border-rose-500 bg-rose-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              내용
            </button>
            <button
              onClick={() => setActiveTab('style')}
              className={`flex-1 px-3 py-3 text-sm font-medium transition-colors ${
                activeTab === 'style'
                  ? 'text-rose-600 border-b-2 border-rose-500 bg-rose-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              스타일
            </button>
            <button
              onClick={() => setActiveTab('sections')}
              className={`flex-1 px-3 py-3 text-sm font-medium transition-colors ${
                activeTab === 'sections'
                  ? 'text-rose-600 border-b-2 border-rose-500 bg-rose-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              섹션
            </button>
            <button
              onClick={() => setActiveTab('share')}
              className={`flex-1 px-3 py-3 text-sm font-medium transition-colors ${
                activeTab === 'share'
                  ? 'text-rose-600 border-b-2 border-rose-500 bg-rose-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              공유
            </button>
          </div>

          {/* 탭 콘텐츠 */}
          {activeTab === 'fields' && (
            <>
              <EditorToolbar />
              <EditorPanel
                className="flex-1 overflow-y-auto"
                layout={state.layout ?? undefined}
                declarations={variablesSchema?.declarations}
                enabledSections={
                  ['intro', ...sectionOrder.filter((s) => sectionEnabled[s])] as SectionType[]
                }
              />
            </>
          )}
          {activeTab === 'style' && state.style && (
            <StyleEditor style={state.style} onStyleChange={handleStyleChange} className="flex-1" />
          )}
          {activeTab === 'sections' && (
            <div className="flex-1 overflow-y-auto">
              <SectionManager
                sectionOrder={sectionOrder.filter((s): s is SectionType =>
                  REORDERABLE_SECTIONS.includes(s as (typeof REORDERABLE_SECTIONS)[number])
                )}
                sectionEnabled={sectionEnabled}
                onOrderChange={handleSectionOrderChange}
                onEnabledChange={handleSectionEnabledChange}
                layout={state.layout ?? undefined}
                onAddSection={handleAddSection}
              />
            </div>
          )}
          {activeTab === 'share' && (
            <OgMetadataEditor
              invitationId={invitationId}
              defaultTitle={ogDefaults.title}
              defaultDescription={ogDefaults.description}
              mainImageUrl={ogDefaults.mainImageUrl}
              groomName={ogDefaults.groomName}
              brideName={ogDefaults.brideName}
              className="flex-1 overflow-y-auto"
              onChange={setOgValues}
            />
          )}
        </div>

        {/* 중앙: 미리보기 */}
        {activeTab === 'share' ? (
          // 공유 탭: 배경 전체가 스크롤되는 레이아웃
          <div className="flex-1 bg-gray-200 overflow-y-auto">
            <SharePreview
              ogTitle={ogValues.title || ogDefaults.title}
              ogDescription={ogValues.description || ogDefaults.description}
              ogImageUrl={ogValues.imageUrl || null}
            />
          </div>
        ) : (
          // 다른 탭: 중앙 정렬된 PhoneFrame 레이아웃
          <div className="flex-1 flex flex-col bg-gray-200">
            <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
              {state.layout && state.style && state.userData ? (
                <InvitationPreview
                  layout={state.layout}
                  style={state.style}
                  userData={state.userData}
                  sectionOrder={sectionOrder}
                  sectionEnabled={sectionEnabled}
                  mode="edit"
                  selectedNodeId={selectedNodeId}
                  onSelectNode={handleSelectNode}
                  sectionVariants={sectionVariants}
                  onVariantChange={handleVariantChange}
                  withFrame
                  frameWidth={375}
                  frameHeight={667}
                />
              ) : (
                <div className="text-center text-gray-500">
                  <p className="text-lg font-medium">미리보기 로딩 중...</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function SuperEditorEditPage() {
  return (
    <SuperEditorProvider>
      <EditPageContent />
    </SuperEditorProvider>
  )
}
