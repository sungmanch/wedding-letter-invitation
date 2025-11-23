'use server'

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendRecommendationCompleteEmail(
  userEmail: string,
  eventId: string,
  groupName: string
): Promise<boolean> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const recommendUrl = `${baseUrl}/${eventId}/recommend`

  try {
    await resend.emails.send({
      from: '청모장 <onboarding@resend.dev>',
      to: userEmail,
      subject: `🍽️ ${groupName} 맞춤 식당 추천이 완료되었습니다!`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .container {
                background: linear-gradient(135deg, #ffc4d6 0%, #f5deb3 100%);
                border-radius: 16px;
                padding: 40px;
                text-align: center;
              }
              .icon {
                font-size: 48px;
                margin-bottom: 20px;
              }
              h1 {
                color: #1a1a1a;
                margin-bottom: 16px;
              }
              p {
                color: #4a4a4a;
                margin-bottom: 12px;
              }
              .button {
                display: inline-block;
                background-color: #ff6b9d;
                color: white;
                text-decoration: none;
                padding: 16px 32px;
                border-radius: 8px;
                font-weight: 600;
                margin-top: 24px;
              }
              .footer {
                margin-top: 32px;
                font-size: 14px;
                color: #888;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="icon">🍽️</div>
              <h1>식당 추천이 완료되었어요!</h1>
              <p><strong>${groupName}</strong>의 맞춤 추천을 확인해보세요.</p>
              <p>AI가 친구들의 취향을 분석해서<br>완벽한 식당을 찾았어요!</p>
              <a href="${recommendUrl}" class="button">
                지금 바로 확인하기 →
              </a>
              <div class="footer">
                <p>청모장이 도움이 되셨나요?<br>친구들에게도 추천해주세요 💕</p>
              </div>
            </div>
          </body>
        </html>
      `,
    })

    return true
  } catch (error) {
    console.error('Failed to send recommendation complete email:', error)
    return false
  }
}
