import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createDocument } from '@/lib/super-editor-v2/actions/document'

export async function POST() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const document = await createDocument({
      title: '새 청첩장',
      useSampleData: true,
    })

    return NextResponse.json({
      success: true,
      documentId: document.id,
    })
  } catch (error) {
    console.error('Create blank document error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
