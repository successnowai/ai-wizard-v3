import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Get current user and verify admin
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Fetch all projects with user info
    const { data: projects, error } = await supabase
      .from('projects')
      .select(`
        *,
        users!inner(id, email, full_name, company_name),
        project_steps(*)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching projects:', error)
      return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
    }

    return NextResponse.json({ projects: projects || [] })

  } catch (error) {
    console.error('Admin projects API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
