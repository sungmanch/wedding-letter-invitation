'use client'

import { GuestbookMessageList } from '@/lib/super-editor/components'

interface GuestbookClientProps {
  invitationId: string
}

export function GuestbookClient({ invitationId }: GuestbookClientProps) {
  return (
    <GuestbookMessageList invitationId={invitationId} />
  )
}
