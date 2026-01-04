'use server'

/**
 * Super Editor v2 - Geocode Action
 *
 * VWorld Geocoder API를 사용하여 도로명주소를 좌표로 변환
 */

// ============================================
// Types
// ============================================

export interface GeocodeResult {
  success: boolean
  lat?: number
  lng?: number
  error?: string
}

// ============================================
// Geocode Action
// ============================================

/**
 * 도로명주소를 좌표(위도/경도)로 변환
 * VWorld Geocoder API 사용 (국토교통부)
 */
export async function geocodeAddress(address: string): Promise<GeocodeResult> {
  if (!address.trim()) {
    return { success: false, error: '주소를 입력해주세요' }
  }

  const apiKey = process.env.VWORLD_API_KEY
  if (!apiKey) {
    console.error('VWORLD_API_KEY is not set')
    return { success: false, error: 'Geocoding API가 설정되지 않았습니다' }
  }

  try {
    const url = new URL('https://api.vworld.kr/req/address')
    url.searchParams.set('service', 'address')
    url.searchParams.set('request', 'getCoord')
    url.searchParams.set('version', '2.0')
    url.searchParams.set('crs', 'epsg:4326')
    url.searchParams.set('type', 'ROAD')
    url.searchParams.set('refine', 'true')
    url.searchParams.set('simple', 'false')
    url.searchParams.set('format', 'json')
    url.searchParams.set('key', apiKey)
    url.searchParams.set('address', address)

    const response = await fetch(url.toString())

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }

    const data = await response.json()

    // VWorld API 응답 구조 확인
    if (data.response?.status === 'OK' && data.response?.result?.point) {
      const point = data.response.result.point
      return {
        success: true,
        lat: parseFloat(point.y),
        lng: parseFloat(point.x),
      }
    }

    // 도로명 주소로 찾지 못한 경우 지번 주소로 재시도
    url.searchParams.set('type', 'PARCEL')
    const retryResponse = await fetch(url.toString())
    const retryData = await retryResponse.json()

    if (retryData.response?.status === 'OK' && retryData.response?.result?.point) {
      const point = retryData.response.result.point
      return {
        success: true,
        lat: parseFloat(point.y),
        lng: parseFloat(point.x),
      }
    }

    return { success: false, error: '주소를 찾을 수 없습니다' }
  } catch (error) {
    console.error('Geocoding failed:', error)
    return { success: false, error: '좌표 변환에 실패했습니다' }
  }
}
