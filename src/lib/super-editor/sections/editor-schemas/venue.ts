/**
 * Venue Section - EditorSchema Fields
 * 예식장 위치 및 교통편 안내
 */

import type { EditorSection } from '../../schema/editor'

export const venueEditorSection: EditorSection = {
  id: 'venue',
  title: '오시는 길',
  description: '예식장 위치 및 교통편 정보',
  icon: 'map-pin',
  order: 1,
  fields: [
    {
      id: 'venue-name',
      type: 'text',
      label: '예식장 이름',
      dataPath: 'venue.name',
      placeholder: '예) 더채플앳청담',
      required: true,
      order: 0,
    },
    {
      id: 'venue-hall',
      type: 'text',
      label: '홀 이름',
      dataPath: 'venue.hall',
      placeholder: '예) 그랜드볼룸 3층',
      order: 1,
    },
    {
      id: 'venue-address',
      type: 'text',
      label: '주소',
      dataPath: 'venue.address',
      placeholder: '도로명 주소를 입력하세요',
      required: true,
      order: 2,
    },
    {
      id: 'venue-location',
      type: 'location',
      label: '지도 위치',
      dataPath: 'venue.coordinates',
      mapProvider: 'kakao',
      searchEnabled: true,
      required: true,
      order: 3,
    },
    {
      id: 'venue-phone',
      type: 'phone',
      label: '예식장 연락처',
      dataPath: 'venue.phone',
      placeholder: '02-1234-5678',
      order: 4,
    },
    {
      id: 'venue-parking',
      type: 'textarea',
      label: '주차 안내',
      dataPath: 'venue.parking',
      placeholder: '주차 안내 정보를 입력하세요',
      rows: 2,
      order: 5,
    },
    {
      id: 'transport-group',
      type: 'group',
      label: '교통편 안내',
      dataPath: 'venue.transport',
      layout: 'vertical',
      order: 6,
      fields: [
        {
          id: 'transport-car',
          type: 'textarea',
          label: '자가용',
          dataPath: 'venue.transport.car',
          placeholder: '자가용 이용 안내',
          rows: 3,
          order: 0,
        },
        {
          id: 'transport-subway',
          type: 'textarea',
          label: '지하철',
          dataPath: 'venue.transport.subway',
          placeholder: '지하철 이용 안내',
          rows: 3,
          order: 1,
        },
        {
          id: 'transport-bus',
          type: 'textarea',
          label: '버스',
          dataPath: 'venue.transport.bus',
          placeholder: '버스 이용 안내',
          rows: 3,
          order: 2,
        },
      ],
    },
  ],
}
