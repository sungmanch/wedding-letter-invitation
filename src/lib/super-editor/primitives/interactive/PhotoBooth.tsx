'use client'

import type { PrimitiveNode, PhotoBoothProps } from '../../schema/primitives'
import type { RenderContext } from '../types'
import { getNodeProps, resolveDataBinding, getValueByPath, mergeNodeStyles } from '../types'
import type { CustomFrame } from '../../../camera'
import { PhotoBooth as CameraPhotoBooth } from '../../../camera'

/**
 * PhotoBooth Primitive Renderer
 *
 * 에디터 모드: 플레이스홀더 표시
 * 게스트 뷰: 인라인으로 카메라 렌더링 (팝업 없이)
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

  // frames 데이터 바인딩 해결
  // {{path}} 형태의 문자열이면 getValueByPath로 직접 배열 데이터를 가져옴
  let frames: CustomFrame[] = []
  if (props.frames) {
    if (typeof props.frames === 'string') {
      // {{photobooth.frames}} 형태에서 경로 추출
      const match = props.frames.match(/^\{\{(.+)\}\}$/)
      if (match) {
        const path = match[1].trim()
        const resolved = getValueByPath(context.data, path)
        if (Array.isArray(resolved)) {
          frames = resolved as CustomFrame[]
        }
      }
    } else if (Array.isArray(props.frames)) {
      frames = props.frames as CustomFrame[]
    }
  }

  const title = props.title
    ? resolveDataBinding(props.title, context.data) as string
    : 'Wedding Day'

  const defaultFrameIndex = props.defaultFrameIndex ?? 0
  const selectedFrame = frames[defaultFrameIndex] ?? frames[0]

  // 스타일 해결
  const style = mergeNodeStyles(node as PrimitiveNode & { tokenStyle?: Record<string, unknown> }, context)

  // 에디트 모드 - 플레이스홀더 표시
  if (isEditMode) {
    return (
      <div
        data-node-id={node.id}
        data-node-type={node.type}
        className={`relative ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
        style={style}
        onClick={() => context.onSelectNode?.(node.id)}
      >
        <div
          className="relative overflow-hidden"
          style={{
            aspectRatio: '3/4',
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

          {/* 에디트 모드 플레이스홀더 */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
            <div className="text-5xl">📸</div>
            <div
              className="text-lg font-medium"
              style={{ color: 'var(--color-text-primary, #333)' }}
            >
              포토부스
            </div>
            <div
              className="text-xs"
              style={{ color: 'var(--color-text-muted, #999)' }}
            >
              실제 청첩장에서 카메라가 표시됩니다
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 게스트 뷰 - 인라인 카메라 렌더링
  return (
    <div
      data-node-id={node.id}
      data-node-type={node.type}
      style={style}
    >
      <CameraPhotoBooth
        title={title}
        frames={frames}
        hostImageUrl={selectedFrame?.groomImage?.croppedUrl || undefined}
        hostPosition="left"
        onCapture={(dataUrl) => {
          console.log('Photo captured:', dataUrl.substring(0, 50))
        }}
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
