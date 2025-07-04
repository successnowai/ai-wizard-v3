import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { WIZARD_STEPS } from '@/utils/constants'

export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string; stepNumber: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { projectId, stepNumber } = params
    const stepNum = parseInt(stepNumber)

    // Verify project ownership
    const { data: project } = await supabase
      .from('projects')
      .select('id')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single()

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Fetch step data
    const { data: step, error } = await supabase
      .from('project_steps')
      .select('*')
      .eq('project_id', projectId)
      .eq('step_number', stepNum)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching step:', error)
      return NextResponse.json({ error: 'Failed to fetch step' }, { status: 500 })
    }

    return NextResponse.json({ step: step || null })

  } catch (error) {
    console.error('Step API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { projectId: string; stepNumber: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { projectId, stepNumber } = params
    const stepNum = parseInt(stepNumber)
    const body = await request.json()
    const { form_data, status } = body

    // Verify project ownership
    const { data: project } = await supabase
      .from('projects')
      .select('id')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single()

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Get step config
    const stepConfig = WIZARD_STEPS.find(s => s.stepNumber === stepNum)
    if (!stepConfig) {
      return NextResponse.json({ error: 'Invalid step number' }, { status: 400 })
    }

    // Check if step exists
    const { data: existingStep } = await supabase
      .from('project_steps')
      .select('id')
      .eq('project_id', projectId)
      .eq('step_number', stepNum)
      .single()

    let step
    if (existingStep) {
      // Update existing step
      const { data, error } = await supabase
        .from('project_steps')
        .update({
          form_data,
          status,
          updated_at: new Date().toISOString(),
          completed_at: status === 'completed' ? new Date().toISOString() : null
        })
        .eq('id', existingStep.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating step:', error)
        return NextResponse.json({ error: 'Failed to update step' }, { status: 500 })
      }
      step = data
    } else {
      // Create new step
      const { data, error } = await supabase
        .from('project_steps')
        .insert({
          project_id: projectId,
          step_number: stepNum,
          step_name: stepConfig.title,
          form_data,
          status,
          completed_at: status === 'completed' ? new Date().toISOString() : null
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating step:', error)
        return NextResponse.json({ error: 'Failed to create step' }, { status: 500 })
      }
      step = data
    }

    return NextResponse.json({ step })

  } catch (error) {
    console.error('Save step API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
