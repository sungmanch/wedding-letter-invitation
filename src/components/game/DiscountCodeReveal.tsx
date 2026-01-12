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
      className="p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl border border-rose-100"
    >
      <div className="flex items-center justify-center gap-2 mb-2">
        <Gift className="w-5 h-5 text-rose-500" />
        <span className="font-semibold text-rose-600">
          {discountPercent}% 할인 쿠폰 획득!
        </span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-2">
          <Loader2 className="w-5 h-5 animate-spin text-rose-400" />
        </div>
      ) : error ? (
        <p className="text-sm text-red-500 text-center">{error}</p>
      ) : code ? (
        <>
          <div className="flex items-center justify-center gap-2">
            <code className="px-4 py-2 bg-white rounded-lg font-mono text-lg font-bold text-stone-800 border">
              {code}
            </code>
            <button
              onClick={copyCode}
              className="p-2 hover:bg-white rounded-lg transition-colors"
            >
              {copied ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : (
                <Copy className="w-5 h-5 text-stone-400" />
              )}
            </button>
          </div>
          <p className="text-xs text-stone-500 mt-2 text-center">7일간 유효합니다</p>
        </>
      ) : null}
    </motion.div>
  )
}
