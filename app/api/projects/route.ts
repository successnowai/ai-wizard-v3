import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { z } from 'zod'

const createProjectSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional()
})

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch user's projects
    const { data: projects, error } = await supabase
      .from('projects')
      .select(`
        *,
        users!inner(full_name, email)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching projects:', error)
      return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
    }

    return NextResponse.json({ projects: projects || [] })

  } catch (error) {
    console.error('Projects API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse request body
    const body = await request.json()
    const { title, description } = createProjectSchema.parse(body)

    // Create new project
    const { data: project, error } = await supabase
      .from('projects')
      .insert({
        user_id: user.id,
        title,
        description,
        status: 'draft',
        current_step: 1,
        total_steps: 10
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating project:', error)
      return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
    }

    // Initialize first step
    await supabase
      .from('project_steps')
      .insert({
        project_id: project.id,
        step_number: 1,
        step_name: 'Business Snapshot',
        status: 'not_started'
      })

    return NextResponse.json({ project })

  } catch (error) {
    console.error('Create project API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
