import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

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

    // Fetch chat messages
    const { data: messages, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('project_id', projectId)
      .eq('step_number', parseInt(stepNumber))
      .order('timestamp', { ascending: true })

    if (error) {
      console.error('Error fetching messages:', error)
      return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
    }

    return NextResponse.json({ messages: messages || [] })

  } catch (error) {
    console.error('Chat messages API error:', error)
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
    const body = await request.json()
    const { messages } = body

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

    // Delete existing messages for this step
    await supabase
      .from('chat_messages')
      .delete()
      .eq('project_id', projectId)
      .eq('step_number', parseInt(stepNumber))

    // Insert new messages
    if (messages && messages.length > 0) {
      const messagesToInsert = messages.map((msg: any) => ({
        project_id: projectId,
        step_number: parseInt(stepNumber),
        role: msg.role,
        content: msg.content,
        metadata: msg.metadata || {},
        timestamp: msg.timestamp || new Date().toISOString()
      }))

      const { error: insertError } = await supabase
        .from('chat_messages')
        .insert(messagesToInsert)

      if (insertError) {
        console.error('Error saving messages:', insertError)
        return NextResponse.json({ error: 'Failed to save messages' }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Save chat messages API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
