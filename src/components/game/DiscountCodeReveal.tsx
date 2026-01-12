'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Gift, Copy, Check, Loader2 } from 'lucide-react'
import type { ScoreGrade } from '@/lib/game/score-calculator'

interface DiscountCodeRevealProps {
  score: number
  grade: ScoreGrade
  discountPercent: number
}

export function DiscountCodeReveal({
  score,
  grade,
  discountPercent,
}: DiscountCodeRevealProps) {
  const [code, setCode] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // API에서 할인코드 가져오기
  useEffect(() => {
    if (discountPercent <= 0) {
      setLoading(false)
      return
    }

    async function fetchDiscountCode() {
      try {
        const response = await fetch('/api/game/discount', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ score, grade, discountPercent }),
        })

        if (!response.ok) {
          throw new Error('Failed to generate discount code')
        }

        const data = await response.json()
        setCode(data.code)
      } catch (err) {
        setError('할인코드 생성에 실패했습니다')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchDiscountCode()
  }, [score, grade, discountPercent])

  const copyCode = () => {
    if (code) {
      navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (discountPercent <= 0) return null

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="p-4 rounded-2xl"
      style={{
        background: 'linear-gradient(to right, var(--blush-50), var(--blush-100))',
        border: '1px solid var(--blush-200)'
      }}
    >
      <div className="flex items-center justify-center gap-2 mb-2">
        <Gift className="w-5 h-5" style={{ color: 'var(--blush-500)' }} />
        <span className="font-semibold" style={{ color: 'var(--blush-600)' }}>
          {discountPercent}% 할인 쿠폰 획득!
        </span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-2">
          <Loader2 className="w-5 h-5 animate-spin" style={{ color: 'var(--blush-400)' }} />
        </div>
      ) : error ? (
        <p className="text-sm text-center" style={{ color: 'var(--blush-600)' }}>{error}</p>
      ) : code ? (
        <>
          <div className="flex items-center justify-center gap-2">
            <code
              className="px-4 py-2 rounded-lg font-mono text-lg font-bold"
              style={{ background: 'var(--bg-pure)', color: 'var(--text-primary)', border: '1px solid var(--border-default)' }}
            >
              {code}
            </code>
            <button
              onClick={copyCode}
              className="p-2 rounded-lg transition-colors"
              style={{ background: 'transparent' }}
            >
              {copied ? (
                <Check className="w-5 h-5" style={{ color: 'var(--blush-500)' }} />
              ) : (
                <Copy className="w-5 h-5" style={{ color: 'var(--text-light)' }} />
              )}
            </button>
          </div>
          <p className="text-xs mt-2 text-center" style={{ color: 'var(--text-muted)' }}>7일간 유효합니다</p>
        </>
      ) : null}
    </motion.div>
  )
}
