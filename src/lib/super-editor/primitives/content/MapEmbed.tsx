'use client'

import type { PrimitiveNode, MapEmbedProps } from '../../schema/primitives'
import type { RenderContext, PrimitiveRenderer } from '../types'
import { getNodeProps, resolveDataBinding, mergeNodeStyles } from '../types'
import { NaverMap } from './NaverMap'

// 확장된 노드 타입 (tokenStyle 포함)
interface ExtendedNode extends PrimitiveNode {
  tokenStyle?: Record<string, unknown>
}

export function MapEmbed({
  node,
  context,
}: {
  node: PrimitiveNode
  context: RenderContext
}) {
  const extNode = node as ExtendedNode
  const props = getNodeProps<MapEmbedProps>(node)
  const style = mergeNodeStyles(extNode, context)

  const isSelected = context.mode === 'edit' && context.selectedNodeId === node.id

  // 데이터 바인딩 해결
  const address = resolveDataBinding(props.address || '', context.data) as string
  const name = resolveDataBinding(props.name || '', context.data) as string
  const rawLat = resolveDataBinding(String(props.lat || ''), context.data)
  const rawLng = resolveDataBinding(String(props.lng || ''), context.data)
  const lat = typeof rawLat === 'number' ? rawLat : parseFloat(String(rawLat)) || 0
  const lng = typeof rawLng === 'number' ? rawLng : parseFloat(String(rawLng)) || 0
  // 네이버 지도 고정 사용
  const provider = 'naver' as const
  const zoom = props.zoom || 16
  const showMarker = props.showMarker !== false
  const height = props.height || 280

  // 네비게이션 버튼 생성
  const navigationButtons = props.navigationButtons || ['kakao', 'naver', 'tmap']

  const containerStyle: React.CSSProperties = {
    width: '100%',
    borderRadius: '8px',
    overflow: 'hidden',
    ...style,
    outline: isSelected ? '2px solid #3b82f6' : undefined,
  }

  // 편집 모드 플레이스홀더
  if (context.mode === 'edit') {
    return (
      <div
        data-node-id={node.id}
        data-node-type="map-embed"
        style={containerStyle}
        onClick={(e) => {
          e.stopPropagation()
          context.onSelectNode?.(node.id)
        }}
      >
        <div
          style={{
            width: '100%',
            height: typeof height === 'number' ? `${height}px` : height,
            backgroundColor: '#f3f4f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
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
          <span style={{ color: '#6b7280', fontSize: '14px' }}>{name || '장소명'}</span>
          <span style={{ color: '#9ca3af', fontSize: '12px' }}>{address || '주소'}</span>
          <span style={{ color: '#9ca3af', fontSize: '11px' }}>
            네이버 지도
          </span>
        </div>
      </div>
    )
  }

  // 미리보기/빌드 모드 - 네이버 지도 API 사용
  if (provider === 'naver') {
    return (
      <div data-node-id={node.id} data-node-type="map-embed" style={containerStyle}>
        <NaverMap
          lat={lat}
          lng={lng}
          name={name}
          address={address}
          zoom={zoom}
          showMarker={showMarker}
          height={height}
          navigationButtons={navigationButtons}
        />
      </div>
    )
  }

  // 카카오/구글맵은 iframe 사용
  const getMapUrl = () => {
    switch (provider) {
      case 'kakao':
        return `https://map.kakao.com/link/map/${encodeURIComponent(name)},${lat},${lng}`
      case 'google':
        return `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`
      default:
        return ''
    }
  }

  const openNavigation = (app: 'kakao' | 'naver' | 'tmap') => {
    const urls: Record<string, string> = {
      kakao: `https://map.kakao.com/link/to/${encodeURIComponent(name)},${lat},${lng}`,
      naver: `https://map.naver.com/v5/directions/-/-/-/transit?c=${lng},${lat},15,0,0,0,dh`,
      tmap: `https://apis.openapi.sk.com/tmap/app/routes?appKey=TMAP_APP_KEY&goalname=${encodeURIComponent(name)}&goalx=${lng}&goaly=${lat}`,
    }
    window.open(urls[app], '_blank')
  }

  return (
    <div data-node-id={node.id} data-node-type="map-embed" style={containerStyle}>
      {/* 지도 영역 */}
      <div
        style={{
          width: '100%',
          height: typeof height === 'number' ? `${height}px` : height,
        }}
      >
        <iframe
          src={getMapUrl()}
          width="100%"
          height="100%"
          style={{ border: 'none' }}
          loading="lazy"
          title={`${name} 지도`}
        />
      </div>

      {/* 주소 정보 */}
      {address && (
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: '#fff',
            borderTop: '1px solid #e5e7eb',
          }}
        >
          <p style={{ margin: 0, fontSize: '14px', color: '#374151', textAlign: 'center' }}>
            {address}
          </p>
        </div>
      )}

      {/* 네비게이션 버튼 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          padding: '12px 16px',
          backgroundColor: '#fff',
          borderTop: '1px solid #e5e7eb',
        }}
      >
        {navigationButtons.map((app) => (
          <button
            key={app}
            onClick={() => openNavigation(app)}
            style={{
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: 500,
              color: '#374151',
              backgroundColor: '#f3f4f6',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
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
