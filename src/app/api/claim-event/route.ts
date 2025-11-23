import { NextResponse } from 'next/server'
import { claimEvent } from '@/lib/actions/event'

export async function POST(request: Request) {
  try {
    const { eventId } = await request.json()

    if (!eventId) {
      return NextResponse.json(
        { error: 'eventId is required' },
        { status: 400 }
      )
    }

    const result = await claimEvent(eventId)

    if (result.error) {
      return NextResponse.json(
        { error: result.error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Claim event API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
