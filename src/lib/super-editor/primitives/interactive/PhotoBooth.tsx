'use client'

import type { PrimitiveNode, PhotoBoothProps } from '../../schema/primitives'
import type { RenderContext } from '../types'
import { getNodeProps, resolveDataBinding, mergeNodeStyles } from '../types'
import type { CustomFrame } from '../../../camera'

/**
 * PhotoBooth Primitive Renderer
 *
 * 에디터 프리뷰에서는 첫 번째 프레임을 표시하고,
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
    : ''

  const defaultFrameIndex = props.defaultFrameIndex ?? 0
  const selectedFrame = frames[defaultFrameIndex] ?? frames[0]
  const compact = props.compact ?? false

  // 스타일 해결
  const style = mergeNodeStyles(node as PrimitiveNode & { tokenStyle?: Record<string, unknown> }, context)

  // 프레임이 없는 경우
  if (frames.length === 0) {
    return (
      <div
        data-node-id={node.id}
        data-node-type={node.type}
        className={`relative ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
        style={{
          ...style,
          aspectRatio: compact ? '1' : '4/3',
          backgroundColor: 'var(--color-surface, #f5f5f5)',
        }}
        onClick={() => context.onSelectNode?.(node.id)}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
          <div className="text-4xl">📸</div>
          <div className="text-sm" style={{ color: 'var(--color-text-secondary, #666)' }}>
            프레임이 아직 등록되지 않았습니다
          </div>
          <div className="text-xs" style={{ color: 'var(--color-text-muted, #999)' }}>
            에디터에서 프레임을 추가해주세요
          </div>
        </div>
      </div>
    )
  }

  // 프레임이 있는 경우 - 프리뷰 모드
  return (
    <div
      data-node-id={node.id}
      data-node-type={node.type}
      className={`relative ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      style={style}
      onClick={() => context.onSelectNode?.(node.id)}
    >
      {/* 프레임 프리뷰 */}
      <div
        className="relative overflow-hidden"
        style={{
          aspectRatio: compact ? '1' : '4/3',
          backgroundColor: selectedFrame?.backgroundColor || '#000',
          borderRadius: style.borderRadius,
        }}
      >
        {/* 신랑 이미지 */}
        {selectedFrame?.groomImage?.croppedUrl && (
          <img
            src={selectedFrame.groomImage.croppedUrl}
            alt="신랑"
            className="absolute object-contain pointer-events-none"
            style={{
              left: `${(selectedFrame.groomImage.position.x / 400) * 100}%`,
              top: `${(selectedFrame.groomImage.position.y / 300) * 100}%`,
              width: `${(selectedFrame.groomImage.position.width / 400) * 100}%`,
              height: `${(selectedFrame.groomImage.position.height / 300) * 100}%`,
            }}
          />
        )}

        {/* 신부 이미지 */}
        {selectedFrame?.brideImage?.croppedUrl && (
          <img
            src={selectedFrame.brideImage.croppedUrl}
            alt="신부"
            className="absolute object-contain pointer-events-none"
            style={{
              left: `${(selectedFrame.brideImage.position.x / 400) * 100}%`,
              top: `${(selectedFrame.brideImage.position.y / 300) * 100}%`,
              width: `${(selectedFrame.brideImage.position.width / 400) * 100}%`,
              height: `${(selectedFrame.brideImage.position.height / 300) * 100}%`,
            }}
          />
        )}

        {/* 타이틀 오버레이 */}
        {title && (
          <div
            className="absolute bottom-4 left-0 right-0 text-center"
            style={{
              color: '#fff',
              textShadow: '0 1px 3px rgba(0,0,0,0.5)',
              fontFamily: 'var(--typo-heading-md-font-family, inherit)',
              fontSize: compact ? '14px' : '18px',
              fontWeight: 500,
            }}
          >
            {title}
          </div>
        )}

        {/* 프리뷰 안내 오버레이 */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <div className="px-4 py-2 bg-white/90 rounded-lg text-center">
            <div className="text-sm font-medium text-gray-800">📸 포토부스</div>
            <div className="text-xs text-gray-600 mt-1">
              실제 청첩장에서 확인하세요
            </div>
          </div>
        </div>
      </div>

      {/* 프레임 수 표시 (여러 개인 경우) */}
      {frames.length > 1 && (
        <div
          className="mt-2 text-center text-xs"
          style={{ color: 'var(--color-text-muted, #999)' }}
        >
          {frames.length}개의 프레임 중 첫 번째 표시 중
        </div>
      )}
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
