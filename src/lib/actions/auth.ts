'use server'

import { createClient } from '@/lib/supabase/server'
import { notifyNewEmailSignup } from '@/lib/slack'

interface SignUpResult {
  success: boolean
  error?: string
  userId?: string
}

export async function signUpWithEmail(
  email: string,
  password: string,
  name: string
): Promise<SignUpResult> {
  try {
    const supabase = await createClient()

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    })

    if (signUpError) {
      return {
        success: false,
        error: signUpError.message,
      }
    }

    if (!data.user) {
      return {
        success: false,
        error: '회원가입에 실패했습니다.',
      }
    }

    // Check if this email was already registered (identities array is empty)
    if (data.user.identities && data.user.identities.length === 0) {
      return {
        success: false,
        error: '이미 가입된 이메일입니다.',
      }
    }

    // Send Slack notification (don't block on failure)
    notifyNewEmailSignup(
      data.user.id,
      email,
      name,
      data.user.created_at
    ).catch(console.error)

    return {
      success: true,
      userId: data.user.id,
    }
  } catch (error) {
    console.error('signUpWithEmail error:', error)
    return {
      success: false,
      error: '회원가입에 실패했습니다. 다시 시도해주세요.',
    }
  }
}
