'use server'

interface SlackBlock {
  type: string
  text?: {
    type: string
    text: string
  }
  elements?: unknown[]
  fields?: unknown[]
}

interface SlackMessage {
  text: string
  blocks?: SlackBlock[]
}

export async function sendSlackNotification(message: SlackMessage): Promise<boolean> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL

  if (!webhookUrl) {
    console.error('SLACK_WEBHOOK_URL is not configured')
    return false
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    })

    if (!response.ok) {
      console.error('Slack webhook failed:', response.statusText)
      return false
    }

    return true
  } catch (error) {
    console.error('Failed to send Slack notification:', error)
    return false
  }
}

export async function notifyNewKakaoSignup(
  userId: string,
  userEmail: string | undefined,
  createdAt: string
): Promise<boolean> {
  const now = new Date(createdAt).toLocaleString('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })

  const message: SlackMessage = {
    text: `🎉 새로운 카카오 회원가입`,
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '🎉 새로운 카카오 회원가입',
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*👤 사용자 ID:*\n\`${userId}\``,
          },
          {
            type: 'mrkdwn',
            text: `*📧 이메일:*\n${userEmail || 'N/A'}`,
          },
          {
            type: 'mrkdwn',
            text: `*⏰ 가입 시간:*\n${now}`,
          },
          {
            type: 'mrkdwn',
            text: `*🔐 Provider:*\nKakao OAuth`,
          },
        ],
      },
      {
        type: 'divider',
      },
    ],
  }

  return await sendSlackNotification(message)
}

export async function notifyRecommendationRequest(
  eventId: string,
  groupName: string,
  responseCount: number
): Promise<boolean> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const adminUrl = `${baseUrl}/admin/${eventId}`
  const now = new Date().toLocaleString('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })

  const message: SlackMessage = {
    text: `🍽️ 새로운 식당 추천 요청`,
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '🍽️ 새로운 식당 추천 요청',
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*📋 그룹명:*\n${groupName}`,
          },
          {
            type: 'mrkdwn',
            text: `*👥 응답 수:*\n${responseCount}명`,
          },
          {
            type: 'mrkdwn',
            text: `*🆔 이벤트 ID:*\n\`${eventId}\``,
          },
          {
            type: 'mrkdwn',
            text: `*⏰ 요청 시간:*\n${now}`,
          },
        ],
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `<${adminUrl}|🔗 어드민 페이지에서 확인하기>`,
        },
      },
      {
        type: 'divider',
      },
    ],
  }

  return await sendSlackNotification(message)
}
