'use client'

import type { PrimitiveNode, MapEmbedProps } from '../../schema/primitives'
import type { RenderContext, PrimitiveRenderer } from '../types'
import { toInlineStyle, getNodeProps, resolveDataBinding } from '../types'

export function MapEmbed({
  node,
  context,
}: {
  node: PrimitiveNode
  context: RenderContext
}) {
  const props = getNodeProps<MapEmbedProps>(node)
  const style = toInlineStyle(node.style)

  const isSelected = context.mode === 'edit' && context.selectedNodeId === node.id

  // 데이터 바인딩 해결
  const address = resolveDataBinding(props.address || '', context.data) as string
  const name = resolveDataBinding(props.name || '', context.data) as string
  const lat = props.lat
  const lng = props.lng
  const provider = props.provider || 'kakao'
  const height = props.height || 300

  const containerStyle: React.CSSProperties = {
    width: '100%',
    height: typeof height === 'number' ? `${height}px` : height,
    borderRadius: '8px',
    overflow: 'hidden',
    ...style,
    outline: isSelected ? '2px solid #3b82f6' : undefined,
  }

  // 네비게이션 버튼 생성
  const navigationButtons = props.navigationButtons || ['kakao', 'naver', 'tmap']

  const openNavigation = (app: 'kakao' | 'naver' | 'tmap') => {
    const urls: Record<string, string> = {
      kakao: `https://map.kakao.com/link/to/${encodeURIComponent(name)},${lat},${lng}`,
      naver: `https://map.naver.com/v5/directions/-/-/-/transit?c=${lng},${lat},15,0,0,0,dh`,
      tmap: `https://apis.openapi.sk.com/tmap/app/routes?appKey=TMAP_APP_KEY&goalname=${encodeURIComponent(name)}&goalx=${lng}&goaly=${lat}`,
    }
    window.open(urls[app], '_blank')
  }

  // 지도 iframe URL
  const getMapUrl = () => {
    switch (provider) {
      case 'kakao':
        return `https://map.kakao.com/link/map/${encodeURIComponent(name)},${lat},${lng}`
      case 'naver':
        return `https://map.naver.com/v5/?c=${lng},${lat},15,0,0,0,dh`
      case 'google':
        return `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`
      default:
        return ''
    }
  }

  return (
    <div
      data-node-id={node.id}
      data-node-type="map-embed"
      style={containerStyle}
      onClick={
        context.mode === 'edit'
          ? (e) => {
              e.stopPropagation()
              context.onSelectNode?.(node.id)
            }
          : undefined
      }
    >
      {/* 지도 컨테이너 */}
      <div
        style={{
          width: '100%',
          height: 'calc(100% - 50px)',
          backgroundColor: '#f3f4f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        {context.mode === 'edit' ? (
          // 편집 모드에서는 플레이스홀더 표시
          <>
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9ca3af"
              strokeWidth="1.5"
            >
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
              <circle cx="12" cy="9" r="2.5" />
            </svg>
            <span style={{ color: '#6b7280', fontSize: '14px' }}>{name}</span>
            <span style={{ color: '#9ca3af', fontSize: '12px' }}>{address}</span>
          </>
        ) : (
          // 미리보기/빌드 모드에서는 실제 지도 또는 정적 이미지
          <iframe
            src={getMapUrl()}
            width="100%"
            height="100%"
            style={{ border: 'none' }}
            loading="lazy"
            title={`${name} 지도`}
          />
        )}
      </div>

      {/* 네비게이션 버튼 */}
      <div
        style={{
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          backgroundColor: '#fff',
          borderTop: '1px solid #e5e7eb',
        }}
      >
        {navigationButtons.map((app) => (
          <button
            key={app}
            onClick={(e) => {
              e.stopPropagation()
              if (context.mode !== 'edit') {
                openNavigation(app)
              }
            }}
            style={{
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: 500,
              color: '#374151',
              backgroundColor: '#f3f4f6',
              border: 'none',
              borderRadius: '6px',
              cursor: context.mode === 'edit' ? 'default' : 'pointer',
            }}
          >
            {app === 'kakao' && '카카오맵'}
            {app === 'naver' && '네이버지도'}
            {app === 'tmap' && 'T맵'}
          </button>
        ))}
      </div>
    </div>
  )
}

export const mapEmbedRenderer: PrimitiveRenderer<MapEmbedProps> = {
  type: 'map-embed',
  render: (node, context) => (
    <MapEmbed key={node.id} node={node} context={context} />
  ),
  editableProps: [
    {
      key: 'name',
      label: '장소명',
      type: 'text',
    },
    {
      key: 'address',
      label: '주소',
      type: 'text',
    },
    {
      key: 'lat',
      label: '위도',
      type: 'number',
    },
    {
      key: 'lng',
      label: '경도',
      type: 'number',
    },
    {
      key: 'provider',
      label: '지도 제공자',
      type: 'select',
      options: [
        { value: 'kakao', label: '카카오맵' },
        { value: 'naver', label: '네이버지도' },
        { value: 'google', label: '구글맵' },
      ],
      defaultValue: 'kakao',
    },
    {
      key: 'height',
      label: '높이',
      type: 'number',
      defaultValue: 300,
    },
  ],
}
