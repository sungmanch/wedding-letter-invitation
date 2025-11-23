'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Users, Calendar } from 'lucide-react'
import { Button, Card, CardContent, Input } from '@/components/ui'
import { getPendingRequests } from '@/lib/actions/recommendation'

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const [requests, setRequests] = useState<Array<{
    id: string
    groupName: string
    responseCount: number
    createdAt: string
  }>>([])

  const handleLogin = () => {
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'

    if (password === adminPassword) {
      setIsAuthenticated(true)
      setError('')
      fetchRequests()
    } else {
      setError('비밀번호가 올바르지 않습니다.')
    }
  }

  const fetchRequests = async () => {
    setIsLoading(true)
    const result = await getPendingRequests()

    if (result.data) {
      setRequests(result.data)
    }
    setIsLoading(false)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8">
            <h1 className="mb-6 text-center text-2xl font-bold text-charcoal">
              어드민 로그인
            </h1>
            <div className="space-y-4">
              <Input
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleLogin()
                }}
              />
              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}
              <Button fullWidth onClick={handleLogin}>
                로그인
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-charcoal">
              청모장 어드민
            </h1>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchRequests}
              isLoading={isLoading}
            >
              새로고침
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-charcoal">
            대기 중인 추천 요청
          </h2>
          <p className="text-sm text-charcoal/60">
            {requests.length}개의 요청이 대기 중입니다
          </p>
        </div>

        {requests.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-charcoal/60">
                대기 중인 요청이 없습니다
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <Link key={request.id} href={`/admin/${request.id}`}>
                <Card className="transition-shadow hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="mb-2 text-lg font-semibold text-charcoal">
                          {request.groupName}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-charcoal/60">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{request.responseCount}명 응답</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(request.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline">
                        처리하기
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
