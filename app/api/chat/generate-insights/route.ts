import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// Generate insights based on form data
async function generateInsights(agent: any, formData: any, stepNumber: number) {
  const insights: Record<number, (data: any) => string> = {
    1: (data) => {
      const hasAllData = data.company_name && data.industry && data.target_market
      if (!hasAllData) {
        return "Please complete all the form fields first so I can provide personalized insights for your business."
      }
      return `
Based on your business information, here are my strategic insights:

**Market Position**: As a ${data.industry} company targeting ${data.target_market}, you're in a ${
  ['Technology', 'Healthcare', 'Finance'].includes(data.industry) ? 'high-growth' : 'competitive'
} market. Your unique value proposition "${data.unique_value_proposition}" gives you a strong differentiator.

**Recommendations**:
1. Focus on building trust through case studies and testimonials
2. Develop content that addresses specific pain points of ${data.target_market}
3. Consider a freemium or trial model to reduce barrier to entry
4. Leverage ${data.social_media ? 'your social media presence' : 'social media'} for thought leadership

**Next Steps**: In the following steps, we'll build on this foundation to create a comprehensive go-to-market strategy.
      `
    },
    2: (data) => {
      const goals = data.primary_goals || []
      const revenueGoal = data.revenue_goal || 'Not specified'
      return `
Based on your goals and 90-day vision, here's my strategic analysis:

**Goal Alignment**: Your primary goals to ${goals.slice(0, 3).join(', ')} are well-aligned with your revenue target of ${revenueGoal}.

**90-Day Action Plan**:
Week 1-2: Foundation building and quick wins
Week 3-4: Launch initial campaigns and test messaging
Week 5-8: Scale what works, iterate on what doesn't
Week 9-12: Optimize and prepare for next quarter

**Success Metrics Framework**:
- Leading indicators: Website traffic, lead generation, engagement rates
- Lagging indicators: Conversion rates, revenue, customer satisfaction

**Critical Success Factors**: ${data.current_challenges ? `Addressing your challenges around "${data.current_challenges}"` : 'Focus on consistent execution and measurement'}
      `
    },
    3: (data) => {
      const personality = data.brand_personality || []
      return `
Here's my brand strategy analysis based on your inputs:

**Brand Personality Profile**: Your brand traits of ${personality.join(', ')} create a ${
  personality.includes('Professional') ? 'trustworthy and authoritative' : 
  personality.includes('Creative') ? 'innovative and memorable' : 
  'distinctive and appealing'
} presence.

**Visual Identity Recommendations**:
- Primary Colors: ${data.brand_colors || 'Deep blue (#007BFF) for trust, gold accents (#FFD700) for premium feel'}
- Typography: ${data.preferred_fonts || 'Modern sans-serif for headers, readable serif for body text'}
- Design Style: ${personality.includes('Minimalist') ? 'Clean, spacious layouts with plenty of whitespace' : 'Rich, engaging layouts with visual interest'}

**Brand Voice**: ${data.brand_story ? 'Your brand story provides an authentic foundation' : 'Develop a brand story that connects emotionally with your audience'}

**Implementation Priority**: Start with consistent visual identity across all touchpoints.
      `
    },
    4: (data) => {
      const purpose = data.site_purpose || 'Lead Generation'
      const pages = data.required_pages || []
      return `
Based on your website requirements, here's my content strategy:

**Site Architecture** for ${purpose}:
${pages.includes('Home') ? '- Homepage: Hero section with clear value prop, social proof, and primary CTA' : ''}
${pages.includes('Services/Products') ? '- Services: Detailed offerings with benefits-focused copy' : ''}
${pages.includes('About') ? '- About: Story-driven narrative that builds trust' : ''}
${pages.includes('Contact') ? '- Contact: Multiple contact methods with response time expectations' : ''}

**Conversion Optimization**:
- Primary CTA: "${data.main_cta}" should appear above the fold and throughout the journey
- Secondary CTA: "${data.secondary_cta || 'Learn More'}" for users not ready to convert
- Trust Elements: ${data.trust_elements || 'Include testimonials, certifications, and guarantees'}

**Content Priorities**:
1. Clear, benefit-focused headlines
2. Scannable content with bullet points
3. Visual hierarchy guiding to CTAs
4. Mobile-first responsive design

**SEO Foundation**: Structure content around your target keywords from Step 7.
      `
    },
    5: (data) => {
      const funnelType = data.funnel_type || 'Lead Magnet → Email → Sale'
      return `
Here's your customized funnel strategy:

**Funnel Architecture** (${funnelType}):

Top of Funnel (Awareness):
- Lead Magnet: "${data.lead_magnet || 'Free valuable resource'}"
- Traffic Sources: Paid ads, SEO, social media
- Expected Conversion: 20-30% opt-in rate

Middle of Funnel (Consideration):
- Email Nurture Sequence: 5-7 emails over 2 weeks
- Value Building: Case studies, testimonials, demos
- Expected Conversion: 10-15% to sales conversation

Bottom of Funnel (Decision):
- Main Offer: "${data.main_offer || 'Your core service'}"
- Pricing: ${data.pricing_structure || 'Clear, value-based pricing'}
- Expected Conversion: 20-30% close rate

**Optimization Strategies**:
1. A/B test headlines and CTAs
2. Implement exit-intent popups
3. Add urgency and scarcity elements
4. Create a downsell/upsell sequence

**Revenue Projection**: With proper execution, this funnel could generate ${
  data.revenue_goal === '$100K-500K' ? '10-50 qualified leads per month' : 
  data.revenue_goal === '$500K-1M' ? '50-100 qualified leads per month' : 
  '100+ qualified leads per month'
}.
      `
    }
  }

  const insight = insights[stepNumber]?.(formData) || 
    `Based on the information you've provided, I can see you're making great progress. Complete all the fields to get more detailed insights and recommendations tailored to your specific situation.`

  // Generate relevant suggestions
  const suggestions = generateSmartSuggestions(stepNumber, formData)

  return {
    insights: insight,
    suggestions: Object.keys(suggestions).length > 0 ? suggestions : undefined
  }
}

function generateSmartSuggestions(stepNumber: number, formData: any): Record<string, any> {
  const suggestions: Record<string, any> = {}
  
  // Step-specific smart suggestions based on common patterns
  switch (stepNumber) {
    case 1:
      if (formData.industry === 'Technology' && !formData.unique_value_proposition) {
        suggestions.unique_value_proposition = 'We leverage cutting-edge technology to deliver solutions that are 10x faster and more reliable than traditional alternatives.'
      }
      break
    case 2:
      if (formData.primary_goals?.includes('Generate more leads') && !formData.success_metrics) {
        suggestions.success_metrics = 'Number of qualified leads per month, cost per lead, lead-to-customer conversion rate, and average customer lifetime value.'
      }
      break
    case 3:
      if (formData.brand_personality?.includes('Professional') && !formData.brand_colors) {
        suggestions.brand_colors = '#003366 (Navy Blue), #FFFFFF (White), #FFD700 (Gold Accent)'
        suggestions.preferred_fonts = 'Helvetica Neue for headers, Georgia for body text'
      }
      break
    case 4:
      if (formData.site_purpose === 'Lead Generation' && !formData.main_cta) {
        suggestions.main_cta = 'Get Your Free Consultation'
        suggestions.secondary_cta = 'Download Our Guide'
      }
      break
    case 5:
      if (formData.funnel_type?.includes('Lead Magnet') && !formData.lead_magnet) {
        suggestions.lead_magnet = 'Free 10-Point Checklist: How to Double Your Results in 30 Days'
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
    const { agent, formData, stepNumber } = body

    try {
      // Generate insights based on form data
      const insightData = await generateInsights(agent, formData, stepNumber)
      
      return NextResponse.json(insightData)
    } catch (error) {
      console.error('Insights generation error:', error)
      
      return NextResponse.json({
        insights: 'I encountered an issue generating insights. Please ensure all required fields are completed and try again.',
        suggestions: undefined
      })
    }

  } catch (error) {
    console.error('Generate insights API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
