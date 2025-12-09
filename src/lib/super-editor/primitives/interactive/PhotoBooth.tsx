'use client'

import { useState } from 'react'
import type { PrimitiveNode, PhotoBoothProps } from '../../schema/primitives'
import type { RenderContext } from '../types'
import { getNodeProps, resolveDataBinding, mergeNodeStyles } from '../types'
import type { CustomFrame } from '../../../camera'
import { PhotoBooth as CameraPhotoBooth } from '../../../camera'

/**
 * PhotoBooth Primitive Renderer
 *
 * 에디터 프리뷰에서는 시작 버튼을 표시하고,
 * 실제 게스트 뷰에서는 카메라와 상호작용 가능
 */
export function PhotoBooth({
  node,
  context,
}: {
  node: PrimitiveNode
  context: RenderContext
}) {
  const props = getNodeProps<PhotoBoothProps>(node)
  const isSelected = context.mode === 'edit' && context.selectedNodeId === node.id
  const isEditMode = context.mode === 'edit'
  const [isBoothOpen, setIsBoothOpen] = useState(false)

  // frames 데이터 바인딩 해결
  let frames: CustomFrame[] = []
  if (props.frames) {
    const resolved = typeof props.frames === 'string'
      ? resolveDataBinding(props.frames, context.data)
      : props.frames
    if (Array.isArray(resolved)) {
      frames = resolved as CustomFrame[]
    }
  }

  const title = props.title
    ? resolveDataBinding(props.title, context.data) as string
    : 'Wedding Day'

  const defaultFrameIndex = props.defaultFrameIndex ?? 0
  const selectedFrame = frames[defaultFrameIndex] ?? frames[0]
  const compact = props.compact ?? false

  // 스타일 해결
  const style = mergeNodeStyles(node as PrimitiveNode & { tokenStyle?: Record<string, unknown> }, context)

  // 에디트 모드 또는 부스가 열리지 않은 경우 - 시작 화면 표시
  if (isEditMode || !isBoothOpen) {
    return (
      <div
        data-node-id={node.id}
        data-node-type={node.type}
        className={`relative ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
        style={style}
        onClick={() => {
          if (isEditMode) {
            context.onSelectNode?.(node.id)
          }
        }}
      >
        <div
          className="relative overflow-hidden"
          style={{
            aspectRatio: compact ? '1' : '3/4',
            backgroundColor: selectedFrame?.backgroundColor || 'var(--color-surface, #f5f5f5)',
            borderRadius: style.borderRadius,
          }}
        >
          {/* 프레임 프리뷰 배경 (있는 경우) */}
          {selectedFrame?.groomImage?.croppedUrl && (
            <img
              src={selectedFrame.groomImage.croppedUrl}
              alt=""
              className="absolute object-contain pointer-events-none opacity-30"
              style={{
                left: `${(selectedFrame.groomImage.position.x / 300) * 100}%`,
                top: `${(selectedFrame.groomImage.position.y / 300) * 100}%`,
                width: `${(selectedFrame.groomImage.position.width / 300) * 100}%`,
                height: `${(selectedFrame.groomImage.position.height / 300) * 100}%`,
              }}
            />
          )}
          {selectedFrame?.brideImage?.croppedUrl && (
            <img
              src={selectedFrame.brideImage.croppedUrl}
              alt=""
              className="absolute object-contain pointer-events-none opacity-30"
              style={{
                left: `${(selectedFrame.brideImage.position.x / 300) * 100}%`,
                top: `${(selectedFrame.brideImage.position.y / 300) * 100}%`,
                width: `${(selectedFrame.brideImage.position.width / 300) * 100}%`,
                height: `${(selectedFrame.brideImage.position.height / 300) * 100}%`,
              }}
            />
          )}

          {/* 시작 버튼 오버레이 */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
            <div className="text-5xl">📸</div>
            <div
              className="text-lg font-medium"
              style={{ color: 'var(--color-text-primary, #333)' }}
            >
              포토부스
            </div>
            <div
              className="text-sm"
              style={{ color: 'var(--color-text-secondary, #666)' }}
            >
              {frames.length > 0
                ? '신랑 신부와 함께 사진을 찍어보세요!'
                : '필터와 스티커로 사진을 꾸며보세요!'}
            </div>
            {!isEditMode && (
              <button
                onClick={() => setIsBoothOpen(true)}
                className="mt-2 px-6 py-3 rounded-full font-medium transition-transform active:scale-95"
                style={{
                  backgroundColor: 'var(--color-accent, #1a1a1a)',
                  color: 'var(--color-text-on-brand, #fff)',
                }}
              >
                사진 찍기
              </button>
            )}
            {isEditMode && (
              <div
                className="text-xs mt-2"
                style={{ color: 'var(--color-text-muted, #999)' }}
              >
                실제 청첩장에서 확인하세요
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // 포토부스 열림 - 전체 화면 카메라
  return (
    <div
      data-node-id={node.id}
      data-node-type={node.type}
      className="fixed inset-0 z-50 bg-white"
    >
      {/* 닫기 버튼 */}
      <button
        onClick={() => setIsBoothOpen(false)}
        className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center text-xl"
      >
        ✕
      </button>

      {/* 카메라 포토부스 */}
      <CameraPhotoBooth
        title={title}
        hostImageUrl={selectedFrame?.groomImage?.croppedUrl || undefined}
        hostPosition="left"
        onCapture={(dataUrl) => {
          console.log('Photo captured:', dataUrl.substring(0, 50))
        }}
        className="h-full"
      />
    </div>
  )
}

import type { PrimitiveRenderer } from '../types'

// 렌더러 export
export const photoBoothRenderer: PrimitiveRenderer<PhotoBoothProps> = {
  type: 'photobooth',
  render: (node, context) => <PhotoBooth key={node.id} node={node} context={context} />,
  editableProps: [
    {
      key: 'title',
      label: '타이틀',
      type: 'text',
      defaultValue: '',
    },
    {
      key: 'compact',
      label: '컴팩트 모드',
      type: 'boolean',
      defaultValue: false,
    },
  ],
}
