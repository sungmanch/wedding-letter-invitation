'use server'

export async function verifyAdminPassword(
  password: string
): Promise<{ success: boolean; error?: string }> {
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminPassword) {
    console.error('ADMIN_PASSWORD environment variable is not set')
    return { success: false, error: '관리자 설정이 올바르지 않습니다.' }
  }

  if (password === adminPassword) {
    return { success: true }
  }

  return { success: false, error: '비밀번호가 올바르지 않습니다.' }
}
