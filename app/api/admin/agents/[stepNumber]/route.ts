import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(
  request: NextRequest,
  { params }: { params: { stepNumber: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    const stepNum = parseInt(params.stepNumber)

    // For public access during wizard, we allow viewing active agents
    // Admin check only for management features
    const { data: agent, error } = await supabase
      .from('ai_agents')
      .select('*')
      .eq('step_number', stepNum)
      .eq('is_active', true)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching agent:', error)
      return NextResponse.json({ error: 'Failed to fetch agent' }, { status: 500 })
    }

    return NextResponse.json({ agent: agent || null })

  } catch (error) {
    console.error('Agent API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { stepNumber: string } }
) {
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

    const stepNum = parseInt(params.stepNumber)
    const body = await request.json()

    // Update agent configuration
    const { data: agent, error } = await supabase
      .from('ai_agents')
      .update({
        ...body,
        updated_at: new Date().toISOString()
      })
      .eq('step_number', stepNum)
      .select()
      .single()

    if (error) {
      console.error('Error updating agent:', error)
      return NextResponse.json({ error: 'Failed to update agent' }, { status: 500 })
    }

    return NextResponse.json({ agent })

  } catch (error) {
    console.error('Update agent API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
