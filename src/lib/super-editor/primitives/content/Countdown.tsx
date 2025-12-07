'use client'

import { useState, useEffect, useMemo } from 'react'
import { parseISO, differenceInSeconds } from 'date-fns'
import type { PrimitiveNode } from '../../schema/primitives'
import type { RenderContext, PrimitiveRenderer } from '../types'
import { resolveDataBinding, mergeNodeStyles } from '../types'

export interface CountdownProps {
  /** 결혼 날짜 (ISO format: YYYY-MM-DD) */
  date: string
  /** 결혼 시간 (HH:mm format) */
  time?: string
  /** 레이아웃 방향 */
  direction?: 'row' | 'column'
  /** 카드 스타일 표시 여부 */
  showCards?: boolean
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
  total: number
}

function calculateTimeLeft(targetDate: Date): TimeLeft {
  const now = new Date()
  const totalSeconds = differenceInSeconds(targetDate, now)

  if (totalSeconds <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 }
  }

  const days = Math.floor(totalSeconds / (60 * 60 * 24))
  const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60))
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60)
  const seconds = totalSeconds % 60

  return { days, hours, minutes, seconds, total: totalSeconds }
}

// 확장된 노드 타입
interface ExtendedNode extends PrimitiveNode {
  tokenStyle?: Record<string, unknown>
}

export function Countdown({
  node,
  context,
}: {
  node: PrimitiveNode
  context: RenderContext
}) {
  const extNode = node as ExtendedNode
  const props = (node.props || {}) as unknown as CountdownProps
  const mergedStyle = mergeNodeStyles(extNode, context)

  // 데이터 바인딩 해결
  const dateString = resolveDataBinding(props.date || '', context.data) as string
  const timeString = resolveDataBinding(props.time || '12:00', context.data) as string

  const { showCards = true } = props

  // 목표 날짜 계산
  const targetDate = useMemo(() => {
    if (!dateString) return new Date()
    try {
      const date = parseISO(dateString)
      if (timeString) {
        const [hours, minutes] = timeString.split(':').map(Number)
        date.setHours(hours, minutes, 0, 0)
      }
      return date
    } catch {
      return new Date()
    }
  }, [dateString, timeString])

  // 실시간 카운트다운 상태
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft(targetDate))

  // setInterval로 매초 업데이트
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate))
    }, 1000)

    // 초기값 즉시 계산
    setTimeLeft(calculateTimeLeft(targetDate))

    return () => clearInterval(timer)
  }, [targetDate])

  const countdownItems = [
    { value: timeLeft.days, label: 'DAYS' },
    { value: timeLeft.hours, label: 'HOURS' },
    { value: timeLeft.minutes, label: 'MINUTES' },
    { value: timeLeft.seconds, label: 'SECONDS' },
  ]

  return (
    <div
      data-node-id={node.id}
      data-node-type="countdown"
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: 'var(--spacing-xs, 4px)',
        justifyContent: 'center',
        flexWrap: 'nowrap',
        width: '100%',
        ...mergedStyle,
      }}
    >
      {countdownItems.map((item) => (
        <div
          key={item.label}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            flex: '1 1 0',
            maxWidth: '80px',
            ...(showCards
              ? {
                  padding: '12px 8px',
                  backgroundColor: 'var(--color-background)',
                  borderRadius: 'var(--radius-md, 8px)',
                  boxShadow: 'var(--shadow-md)',
                }
              : {}),
          }}
        >
          <span
            style={{
              fontFamily: 'var(--typo-display-lg-font-family)',
              fontSize: 'clamp(20px, 6vw, 32px)',
              fontWeight: 'var(--typo-display-lg-font-weight, 700)',
              color: 'var(--color-text-primary)',
              lineHeight: 1,
            }}
          >
            {item.value}
          </span>
          <span
            style={{
              fontFamily: 'var(--typo-caption-font-family)',
              fontSize: '10px',
              color: 'var(--color-text-muted)',
              letterSpacing: '0.05em',
            }}
          >
            {item.label}
          </span>
        </div>
      ))}
    </div>
  )
}

export const countdownRenderer: PrimitiveRenderer<CountdownProps> = {
  type: 'countdown',
  render: (node, context) => <Countdown key={node.id} node={node} context={context} />,
  editableProps: [
    {
      key: 'date',
      label: '결혼 날짜',
      type: 'text',
    },
    {
      key: 'time',
      label: '결혼 시간',
      type: 'text',
    },
    {
      key: 'showCards',
      label: '카드 스타일',
      type: 'boolean',
      defaultValue: true,
    },
  ],
}
