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

    // Fetch statistics
    const [projectStats, userStats] = await Promise.all([
      supabase.from('projects').select('status', { count: 'exact' }),
      supabase.from('users').select('role', { count: 'exact' })
    ])

    const { data: projects } = projectStats
    const { data: users } = userStats

    // Count projects by status
    const totalProjects = projects?.length || 0
    const activeProjects = projects?.filter(p => p.status === 'in_progress').length || 0
    const completedProjects = projects?.filter(p => p.status === 'completed').length || 0
    const totalUsers = users?.filter(u => u.role === 'client').length || 0

    // Mock recent activity (in production, fetch from activity log)
    const recentActivity = [
      { description: 'New project created by John Doe', time: '2 hours ago' },
      { description: 'Project "Website Redesign" completed', time: '5 hours ago' },
      { description: 'AI Agent configuration updated', time: '1 day ago' }
    ]

    return NextResponse.json({
      totalProjects,
      activeProjects,
      completedProjects,
      totalUsers,
      recentActivity
    })

  } catch (error) {
    console.error('Dashboard stats API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
