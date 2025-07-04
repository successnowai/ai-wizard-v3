import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// Mock Claude API response for development
// Replace with actual Anthropic API integration
async function callClaudeAPI(
  messages: any[],
  agent: any,
  formData: any,
  stepNumber: number
) {
  // In production, use the Anthropic API
  // For now, return a mock response based on the agent configuration
  
  const lastUserMessage = messages[messages.length - 1]?.content || ''
  
  // Generate contextual response based on step
  const contextResponses: Record<number, (data: any) => string> = {
    1: (data) => `Based on your business "${data.company_name || 'your company'}" in the ${data.industry || 'your'} industry, I recommend focusing on clearly defining your unique value proposition. Your target market of "${data.target_market || 'your audience'}" needs to understand what makes you different.`,
    2: (data) => `Your goal to ${data.primary_goals?.[0] || 'grow your business'} is achievable with the right strategy. For your 90-day vision, I suggest breaking it down into weekly milestones. This will help you track progress effectively.`,
    3: (data) => `For your brand personality of ${data.brand_personality?.[0] || 'professional'}, I recommend using ${data.brand_colors || 'a cohesive color palette'} that resonates with your target audience. Your brand story should emphasize ${data.unique_value_proposition || 'what makes you unique'}.`,
    4: (data) => `For a ${data.site_purpose || 'lead generation'} website, your main CTA "${data.main_cta || 'Get Started'}" should be prominently displayed. The key messages you want to communicate align well with your business goals.`,
    5: (data) => `Your ${data.funnel_type || 'lead generation'} funnel with "${data.lead_magnet || 'your offer'}" as the entry point is a solid approach. The pricing structure you've outlined will work well with this funnel design.`,
    6: (data) => `Your AI agent "${data.agent_name || 'Assistant'}" with a ${data.agent_personality?.[0] || 'professional'} personality will be perfect for ${data.agent_tasks?.[0] || 'customer support'}. I'll help you create conversation flows that feel natural.`,
    7: (data) => `With a ${data.advertising_budget || 'reasonable'} budget, focusing on ${data.ad_platforms?.[0] || 'Google Ads'} is a smart choice. Your target keywords around "${data.target_keywords || 'your services'}" show good search volume.`,
    8: (data) => `Your automation strategy using ${data.email_marketing || 'email marketing'} will help nurture leads effectively. The follow-up sequence you've outlined will keep prospects engaged throughout their journey.`,
    9: (data) => `Your client portal focusing on ${data.portal_purpose?.[0] || 'course delivery'} will create great value for your customers. The content types you've selected will keep members engaged.`,
    10: (data) => `Excellent work completing all steps! Your project timeline of ${data.timeline_preference || '2-4 weeks'} is realistic. The priority features you've identified align perfectly with your business goals from Step 2.`
  }
  
  const baseResponse = contextResponses[stepNumber]?.(formData) || agent.intro_message
  
  // Add suggestions based on form data
  const suggestions = generateSuggestions(stepNumber, formData)
  
  return {
    response: baseResponse,
    suggestions: Object.keys(suggestions).length > 0 ? suggestions : undefined
  }
}

function generateSuggestions(stepNumber: number, formData: any): Record<string, any> {
  // Generate smart suggestions based on step and existing data
  const suggestions: Record<string, any> = {}
  
  switch (stepNumber) {
    case 1:
      if (!formData.unique_value_proposition && formData.company_name) {
        suggestions.unique_value_proposition = `${formData.company_name} provides innovative solutions that save time and increase efficiency for ${formData.target_market || 'businesses'}.`
      }
      break
    case 2:
      if (!formData.success_metrics && formData.primary_goals?.length > 0) {
        suggestions.success_metrics = `Monthly lead generation targets, conversion rate improvements, and customer satisfaction scores.`
      }
      break
    case 3:
      if (!formData.brand_colors && formData.brand_personality?.includes('Professional')) {
        suggestions.brand_colors = '#007BFF (Blue), #333333 (Charcoal), #FFD700 (Gold Accent)'
      }
      break
    case 4:
      if (!formData.key_messages && formData.site_purpose) {
        suggestions.key_messages = `Clear value proposition, social proof through testimonials, and a compelling call-to-action that drives ${formData.site_purpose}.`
      }
      break
  }
  
  return suggestions
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { messages, agent, formData, stepNumber } = body

    try {
      // Call Claude API (or mock for development)
      const aiResponse = await callClaudeAPI(messages, agent, formData, stepNumber)
      
      return NextResponse.json(aiResponse)
    } catch (error) {
      console.error('AI API error:', error)
      
      // Return fallback response
      return NextResponse.json({
        response: agent.fallback_responses[0] || "I'm having trouble responding right now. Please try again.",
        suggestions: undefined
      })
    }

  } catch (error) {
    console.error('Chat AI response API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
