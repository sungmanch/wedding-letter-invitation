'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface TimePickerProps {
  value?: string // HH:mm format
  onChange: (time: string) => void
  className?: string
}

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1)
const MINUTES = ['00', '30']

export function TimePicker({ value, onChange, className }: TimePickerProps) {
  const [period, setPeriod] = React.useState<'AM' | 'PM'>('PM')
  const [hour, setHour] = React.useState(12)
  const [minute, setMinute] = React.useState('00')

  React.useEffect(() => {
    if (value) {
      const [h, m] = value.split(':').map(Number)
      if (h >= 12) {
        setPeriod('PM')
        setHour(h === 12 ? 12 : h - 12)
      } else {
        setPeriod('AM')
        setHour(h === 0 ? 12 : h)
      }
      setMinute(m === 30 ? '30' : '00')
    }
  }, [value])

  const handleChange = (newPeriod: 'AM' | 'PM', newHour: number, newMinute: string) => {
    let h = newHour
    if (newPeriod === 'PM' && newHour !== 12) {
      h = newHour + 12
    } else if (newPeriod === 'AM' && newHour === 12) {
      h = 0
    }
    const time = `${h.toString().padStart(2, '0')}:${newMinute}`
    onChange(time)
  }

  return (
    <div className={cn('flex flex-col gap-4 p-4', className)}>
      {/* Period Selection */}
      <div className="flex gap-2">
        {(['AM', 'PM'] as const).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => {
              setPeriod(p)
              handleChange(p, hour, minute)
            }}
            className={cn(
              'flex-1 py-3 rounded-xl text-base font-medium transition-colors',
              period === p
                ? 'bg-[#D4768A] text-white'
                : 'bg-gray-100 text-charcoal hover:bg-gray-200'
            )}
          >
            {p === 'AM' ? '오전' : '오후'}
          </button>
        ))}
      </div>

      {/* Hour Selection */}
      <div className="grid grid-cols-4 gap-2">
        {HOURS.map((h) => (
          <button
            key={h}
            type="button"
            onClick={() => {
              setHour(h)
              handleChange(period, h, minute)
            }}
            className={cn(
              'py-3 rounded-xl text-base font-medium transition-colors',
              hour === h
                ? 'bg-[#D4768A] text-white'
                : 'bg-gray-100 text-charcoal hover:bg-gray-200'
            )}
          >
            {h}시
          </button>
        ))}
      </div>

      {/* Minute Selection */}
      <div className="flex gap-2">
        {MINUTES.map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMinute(m)
              handleChange(period, hour, m)
            }}
            className={cn(
              'flex-1 py-3 rounded-xl text-base font-medium transition-colors',
              minute === m
                ? 'bg-[#D4768A] text-white'
                : 'bg-gray-100 text-charcoal hover:bg-gray-200'
            )}
          >
            {m}분
          </button>
        ))}
      </div>

      {/* Preview */}
      <div className="text-center py-2 text-lg font-semibold text-charcoal">
        {period === 'AM' ? '오전' : '오후'} {hour}시 {minute}분
      </div>
    </div>
  )
}
