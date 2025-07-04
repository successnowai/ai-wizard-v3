import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { ProjectStep } from '@/types'

function generatePRD(steps: ProjectStep[]): string {
  // Organize step data
  const stepData: Record<number, any> = {}
  steps.forEach(step => {
    stepData[step.step_number] = step.form_data
  })

  const prd = `# Project Requirements Document (PRD)

Generated on: ${new Date().toLocaleDateString()}

## Executive Summary

This PRD outlines the comprehensive requirements for developing a complete digital presence and business system for **${stepData[1]?.company_name || 'Company'}**.

### Project Overview
- **Industry**: ${stepData[1]?.industry || 'Not specified'}
- **Target Market**: ${stepData[1]?.target_market || 'Not specified'}
- **Unique Value Proposition**: ${stepData[1]?.unique_value_proposition || 'Not specified'}
- **Timeline**: ${stepData[10]?.timeline_preference || 'To be determined'}
- **Budget Range**: ${stepData[10]?.budget_range || 'To be determined'}

---

## 1. Business Foundation

### Company Information
- **Company Name**: ${stepData[1]?.company_name || 'Not specified'}
- **Industry**: ${stepData[1]?.industry || 'Not specified'}
- **Contact Email**: ${stepData[1]?.contact_email || 'Not specified'}
- **Phone**: ${stepData[1]?.phone || 'Not specified'}
- **Current Website**: ${stepData[1]?.website_url || 'None'}

### Market Position
- **Target Market**: ${stepData[1]?.target_market || 'Not specified'}
- **Unique Value Proposition**: ${stepData[1]?.unique_value_proposition || 'Not specified'}

### Social Media Presence
${stepData[1]?.social_media || 'No social media links provided'}

---

## 2. Goals & Objectives

### Primary Business Goals
${stepData[2]?.primary_goals?.map((goal: string) => `- ${goal}`).join('\n') || '- Not specified'}

### Revenue Target
- **12-Month Goal**: ${stepData[2]?.revenue_goal || 'Not specified'}

### 90-Day Vision
${stepData[2]?.vision_90_days || 'Not specified'}

### Success Metrics
${stepData[2]?.success_metrics || 'Not specified'}

### Current Challenges
${stepData[2]?.current_challenges || 'Not specified'}

---

## 3. Brand Identity & Design

### Visual Identity
- **Logo**: ${stepData[3]?.logo ? 'Provided' : 'To be created'}
- **Brand Colors**: ${stepData[3]?.brand_colors || 'To be determined'}
- **Fonts**: ${stepData[3]?.preferred_fonts || 'To be determined'}

### Brand Personality
${stepData[3]?.brand_personality?.map((trait: string) => `- ${trait}`).join('\n') || '- Not specified'}

### Brand Story
${stepData[3]?.brand_story || 'Not specified'}

### Design References
- **Inspiration Sites**: ${stepData[3]?.inspiration_websites || 'None provided'}
- **Elements to Avoid**: ${stepData[3]?.avoid_elements || 'None specified'}

---

## 4. Website Requirements

### Site Purpose
- **Primary Purpose**: ${stepData[4]?.site_purpose || 'Not specified'}
- **Required Pages**: ${stepData[4]?.required_pages?.join(', ') || 'Not specified'}

### Call-to-Actions
- **Primary CTA**: ${stepData[4]?.main_cta || 'Not specified'}
- **Secondary CTA**: ${stepData[4]?.secondary_cta || 'Not specified'}

### Content Strategy
- **Key Messages**: ${stepData[4]?.key_messages || 'Not specified'}
- **Trust Elements**: ${stepData[4]?.trust_elements || 'Not specified'}
- **Example Sites**: ${stepData[4]?.website_examples || 'None provided'}

---

## 5. Sales Funnel Design

### Funnel Architecture
- **Funnel Type**: ${stepData[5]?.funnel_type || 'Not specified'}
- **Lead Magnet**: ${stepData[5]?.lead_magnet || 'Not specified'}
- **Main Offer**: ${stepData[5]?.main_offer || 'Not specified'}

### Pricing & Value Ladder
- **Pricing Structure**: ${stepData[5]?.pricing_structure || 'Not specified'}
- **Value Ladder**: ${stepData[5]?.value_ladder || 'Not specified'}

### Conversion Goals
${stepData[5]?.conversion_goals || 'Not specified'}

### Reference Funnels
${stepData[5]?.funnel_examples || 'None provided'}

---

## 6. AI Agent Configuration

### Agent Details
- **Agent Name**: ${stepData[6]?.agent_name || 'Not specified'}
- **Personality**: ${stepData[6]?.agent_personality?.join(', ') || 'Not specified'}
- **Communication Channels**: ${stepData[6]?.communication_channels?.join(', ') || 'Not specified'}

### Functionality
- **Primary Tasks**: ${stepData[6]?.agent_tasks?.join(', ') || 'Not specified'}
- **Business Hours**: ${stepData[6]?.business_hours || 'Not specified'}
- **Escalation Rules**: ${stepData[6]?.escalation_rules || 'Not specified'}
- **Knowledge Base**: ${stepData[6]?.agent_knowledge || 'To be developed'}

---

## 7. Marketing & SEO Strategy

### Advertising
- **Monthly Budget**: ${stepData[7]?.advertising_budget || 'Not specified'}
- **Platforms**: ${stepData[7]?.ad_platforms?.join(', ') || 'Not specified'}

### SEO Strategy
- **Target Keywords**: ${stepData[7]?.target_keywords || 'Not specified'}
- **Target Audience**: ${stepData[7]?.target_audience || 'Not specified'}
- **Core Message**: ${stepData[7]?.ad_message || 'Not specified'}

### Competitive Analysis
- **Competitor Ads**: ${stepData[7]?.competitor_ads || 'None noted'}
- **Local SEO**: ${stepData[7]?.local_seo || 'Not applicable'}

---

## 8. Automation & Workflows

### Email Marketing
- **Platform**: ${stepData[8]?.email_marketing || 'To be determined'}
- **Follow-up Strategy**: ${stepData[8]?.follow_up_sequence || 'Not specified'}

### Automation Triggers
${stepData[8]?.automation_triggers?.map((trigger: string) => `- ${trigger}`).join('\n') || '- Not specified'}

### Systems Integration
- **CRM**: ${stepData[8]?.crm_system || 'To be determined'}
- **Review Strategy**: ${stepData[8]?.review_strategy || 'Not specified'}
- **Retention Strategy**: ${stepData[8]?.retention_strategy || 'Not specified'}

---

## 9. Client Portal & Community

### Portal Purpose
${stepData[9]?.portal_purpose?.map((purpose: string) => `- ${purpose}`).join('\n') || '- Not specified'}

### Content Strategy
- **Content Types**: ${stepData[9]?.content_types?.join(', ') || 'Not specified'}
- **Course Outline**: ${stepData[9]?.course_outline ? 'Provided' : 'To be developed'}

### Community Management
- **Guidelines**: ${stepData[9]?.community_guidelines || 'To be developed'}
- **Engagement Strategy**: ${stepData[9]?.engagement_strategy || 'Not specified'}
- **Integrations**: ${stepData[9]?.portal_integrations || 'None specified'}

---

## 10. Project Delivery

### Final Requirements
- **Additional Assets**: ${stepData[10]?.additional_assets ? 'Provided' : 'None'}
- **Special Requirements**: ${stepData[10]?.special_requirements || 'None'}

### Priorities
- **Must-Have Features**: ${stepData[10]?.priority_features || 'Not specified'}
- **Nice-to-Have Features**: ${stepData[10]?.nice_to_have || 'Not specified'}

### Questions & Concerns
${stepData[10]?.final_questions || 'None'}

---

## Technical Implementation Notes

### Development Approach
Based on the requirements above, we recommend a modern, scalable architecture:

1. **Frontend**: Next.js 14 with TypeScript for optimal performance and SEO
2. **Backend**: Supabase for authentication, database, and real-time features
3. **AI Integration**: Claude API for intelligent agent functionality
4. **Hosting**: Vercel for global CDN and edge functions
5. **Analytics**: Google Analytics 4 with conversion tracking

### Key Integrations
- Payment processing (Stripe/PayPal)
- Email marketing platform integration
- CRM system API connection
- Social media APIs
- Calendar scheduling system
- Analytics and tracking pixels

### Security & Compliance
- SSL certificate and HTTPS enforcement
- GDPR compliance for data collection
- Regular security audits
- Automated backups
- DDoS protection

### Performance Targets
- Page load time < 3 seconds
- Mobile-first responsive design
- Core Web Vitals optimization
- 95+ PageSpeed score

---

## Next Steps

1. **Review & Approval**: Client to review this PRD and provide feedback
2. **Design Phase**: Create mockups and prototypes based on brand guidelines
3. **Development Sprint Planning**: Break down features into 2-week sprints
4. **Testing & Launch**: Comprehensive testing before go-live
5. **Training & Handoff**: Team training on all systems and tools

---

*This PRD serves as the master document for the project. Any changes should be documented and approved by all stakeholders.*`

  return prd
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
    const { projectId, steps } = body

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

    // Generate PRD
    const prd = generatePRD(steps)

    // Save generated PRD
    await supabase
      .from('generated_outputs')
      .insert({
        project_id: projectId,
        output_type: 'prd',
        content: prd,
        metadata: {
          generated_at: new Date().toISOString(),
          version: '1.0'
        }
      })

    return NextResponse.json({ prd })

  } catch (error) {
    console.error('Generate PRD API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
