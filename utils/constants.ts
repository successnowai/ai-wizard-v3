// Wizard step configurations
export const WIZARD_STEPS = [
  {
    stepNumber: 1,
    title: "Business Snapshot", 
    description: "Define your core business model and target market",
    icon: "🏢",
    fields: [
      { name: 'company_name', label: 'Company Name', type: 'text', required: true },
      { name: 'industry', label: 'Industry', type: 'select', required: true, options: [
        'Technology', 'Healthcare', 'Finance', 'Retail', 'Manufacturing', 
        'Professional Services', 'Education', 'Real Estate', 'Other'
      ]},
      { name: 'contact_email', label: 'Contact Email', type: 'email', required: true },
      { name: 'phone', label: 'Phone Number', type: 'tel', required: false },
      { name: 'website_url', label: 'Current Website (if any)', type: 'url', required: false },
      { name: 'social_media', label: 'Social Media Links', type: 'textarea', required: false },
      { name: 'target_market', label: 'Target Market', type: 'textarea', required: true },
      { name: 'unique_value_proposition', label: 'What makes you unique?', type: 'textarea', required: true }
    ]
  },
  {
    stepNumber: 2,
    title: "Goals & Outcomes",
    description: "Select goals and define your 90-day vision", 
    icon: "🎯",
    fields: [
      { name: 'primary_goals', label: 'Primary Business Goals', type: 'multiselect', required: true, options: [
        'Generate more leads', 'Increase sales calls', 'Build brand awareness', 
        'Improve customer retention', 'Launch new product', 'Expand market reach',
        'Automate processes', 'Reduce costs', 'Improve customer service'
      ]},
      { name: 'revenue_goal', label: 'Revenue Goal (next 12 months)', type: 'select', required: true, options: [
        'Under $100K', '$100K-500K', '$500K-1M', '$1M-5M', '$5M+'
      ]},
      { name: 'vision_90_days', label: '90-Day Vision', type: 'textarea', required: true },
      { name: 'success_metrics', label: 'How will you measure success?', type: 'textarea', required: true },
      { name: 'current_challenges', label: 'Current Business Challenges', type: 'textarea', required: true }
    ]
  },
  {
    stepNumber: 3,
    title: "Design & Branding",
    description: "Upload logo, define colors, fonts, and brand inspiration",
    icon: "🎨", 
    fields: [
      { name: 'logo', label: 'Logo Upload', type: 'file', required: false },
      { name: 'brand_colors', label: 'Brand Colors (if established)', type: 'text', required: false },
      { name: 'preferred_fonts', label: 'Preferred Fonts', type: 'text', required: false },
      { name: 'brand_personality', label: 'Brand Personality', type: 'multiselect', required: true, options: [
        'Professional', 'Modern', 'Creative', 'Trustworthy', 'Innovative',
        'Friendly', 'Luxury', 'Minimalist', 'Bold', 'Playful'
      ]},
      { name: 'inspiration_websites', label: 'Design Inspiration URLs', type: 'textarea', required: false },
      { name: 'brand_story', label: 'Brand Story/Bio', type: 'textarea', required: true },
      { name: 'avoid_elements', label: 'Design Elements to Avoid', type: 'textarea', required: false }
    ]
  },
  {
    stepNumber: 4,
    title: "Website Content",
    description: "Define site structure, content sections, and inspirational examples",
    icon: "📄",
    fields: [
      { name: 'site_purpose', label: 'Primary Website Purpose', type: 'select', required: true, options: [
        'Lead Generation', 'E-commerce', 'Portfolio/Showcase', 'Information/Blog',
        'Service Booking', 'Community/Membership', 'Landing Page'
      ]},
      { name: 'required_pages', label: 'Required Pages', type: 'multiselect', required: true, options: [
        'Home', 'About', 'Services/Products', 'Contact', 'Blog', 'Testimonials',
        'FAQ', 'Pricing', 'Portfolio', 'Team', 'Privacy Policy', 'Terms'
      ]},
      { name: 'main_cta', label: 'Main Call-to-Action', type: 'text', required: true },
      { name: 'secondary_cta', label: 'Secondary Call-to-Action', type: 'text', required: false },
      { name: 'key_messages', label: 'Key Messages to Communicate', type: 'textarea', required: true },
      { name: 'trust_elements', label: 'Trust Elements (certifications, awards, etc.)', type: 'textarea', required: false },
      { name: 'website_examples', label: 'Website Examples You Like', type: 'textarea', required: false }
    ]
  },
  {
    stepNumber: 5,
    title: "Funnel Design", 
    description: "Design your sales funnel, offers, and lead magnets",
    icon: "🔄",
    fields: [
      { name: 'funnel_type', label: 'Primary Funnel Type', type: 'select', required: true, options: [
        'Lead Magnet → Email → Sale', 'Webinar → Sale', 'Free Trial → Paid',
        'Consultation → Service', 'Product Demo → Sale', 'Content → Newsletter → Sale'
      ]},
      { name: 'lead_magnet', label: 'Lead Magnet/Free Offer', type: 'textarea', required: true },
      { name: 'main_offer', label: 'Main Offer/Service', type: 'textarea', required: true },
      { name: 'pricing_structure', label: 'Pricing Structure', type: 'textarea', required: true },
      { name: 'value_ladder', label: 'Value Ladder (low → high offers)', type: 'textarea', required: false },
      { name: 'funnel_examples', label: 'Funnel Examples You Admire', type: 'textarea', required: false },
      { name: 'conversion_goals', label: 'Conversion Goals', type: 'textarea', required: true }
    ]
  },
  {
    stepNumber: 6,
    title: "AI Agent Setup",
    description: "Configure your AI assistant for customer interaction",
    icon: "🤖",
    fields: [
      { name: 'agent_name', label: 'AI Agent Name', type: 'text', required: true },
      { name: 'agent_personality', label: 'Agent Personality', type: 'multiselect', required: true, options: [
        'Professional', 'Friendly', 'Helpful', 'Expert', 'Casual', 'Formal', 
        'Enthusiastic', 'Calm', 'Witty', 'Empathetic'
      ]},
      { name: 'communication_channels', label: 'Communication Channels', type: 'multiselect', required: true, options: [
        'Website Chat', 'Voice Calls', 'SMS/Text', 'Email', 'WhatsApp', 'Social Media'
      ]},
      { name: 'agent_tasks', label: 'Agent Primary Tasks', type: 'multiselect', required: true, options: [
        'Answer Questions', 'Book Appointments', 'Qualify Leads', 'Provide Support',
        'Process Orders', 'Collect Feedback', 'Send Reminders', 'Upsell/Cross-sell'
      ]},
      { name: 'business_hours', label: 'Business Hours', type: 'text', required: true },
      { name: 'escalation_rules', label: 'When to Transfer to Human', type: 'textarea', required: true },
      { name: 'agent_knowledge', label: 'Specific Knowledge/Scripts', type: 'textarea', required: false }
    ]
  },
  {
    stepNumber: 7,
    title: "Ads & SEO",
    description: "Plan your advertising and search optimization strategy", 
    icon: "📢",
    fields: [
      { name: 'advertising_budget', label: 'Monthly Advertising Budget', type: 'select', required: true, options: [
        'Under $500', '$500-1K', '$1K-3K', '$3K-5K', '$5K-10K', '$10K+'
      ]},
      { name: 'ad_platforms', label: 'Preferred Ad Platforms', type: 'multiselect', required: true, options: [
        'Google Ads', 'Facebook/Instagram', 'LinkedIn', 'YouTube', 'TikTok', 
        'Twitter', 'Pinterest', 'Local Directories'
      ]},
      { name: 'target_keywords', label: 'Target Keywords', type: 'textarea', required: true },
      { name: 'target_audience', label: 'Target Audience Demographics', type: 'textarea', required: true },
      { name: 'ad_message', label: 'Core Advertising Message', type: 'textarea', required: true },
      { name: 'competitor_ads', label: 'Competitor Ads You\'ve Noticed', type: 'textarea', required: false },
      { name: 'local_seo', label: 'Local SEO Requirements', type: 'textarea', required: false }
    ]
  },
  {
    stepNumber: 8,
    title: "Automation Setup",
    description: "Design follow-up workflows and automated systems",
    icon: "⚙️",
    fields: [
      { name: 'email_marketing', label: 'Email Marketing Platform Preference', type: 'select', required: false, options: [
        'Mailchimp', 'ConvertKit', 'ActiveCampaign', 'HubSpot', 'Klaviyo', 'Other', 'None yet'
      ]},
      { name: 'follow_up_sequence', label: 'Follow-up Sequence Strategy', type: 'textarea', required: true },
      { name: 'automation_triggers', label: 'Automation Triggers', type: 'multiselect', required: true, options: [
        'New lead signup', 'Purchase completion', 'Cart abandonment', 'Email open',
        'Website visit', 'Demo request', 'Support ticket', 'Renewal reminder'
      ]},
      { name: 'crm_system', label: 'CRM System Preference', type: 'select', required: false, options: [
        'HubSpot', 'Salesforce', 'Pipedrive', 'Zoho', 'Monday.com', 'Other', 'None yet'
      ]},
      { name: 'review_strategy', label: 'Customer Review Strategy', type: 'textarea', required: false },
      { name: 'retention_strategy', label: 'Customer Retention Strategy', type: 'textarea', required: true }
    ]
  },
  {
    stepNumber: 9,
    title: "Client Portal & Community",
    description: "Design client portal and community features",
    icon: "👥",
    fields: [
      { name: 'portal_purpose', label: 'Client Portal Purpose', type: 'multiselect', required: true, options: [
        'Course/Training Access', 'Project Updates', 'Resource Library', 
        'Community Forum', 'Support Center', 'File Sharing', 'Progress Tracking'
      ]},
      { name: 'content_types', label: 'Content Types to Include', type: 'multiselect', required: true, options: [
        'Video Lessons', 'PDF Resources', 'Templates', 'Worksheets',
        'Live Sessions', 'Q&A Forums', 'Progress Quizzes', 'Certificates'
      ]},
      { name: 'course_outline', label: 'Course/Content Outline', type: 'file', required: false },
      { name: 'community_guidelines', label: 'Community Guidelines', type: 'textarea', required: false },
      { name: 'engagement_strategy', label: 'Member Engagement Strategy', type: 'textarea', required: true },
      { name: 'portal_integrations', label: 'Required Integrations', type: 'textarea', required: false }
    ]
  },
  {
    stepNumber: 10,
    title: "Final Review & Assets",
    description: "Upload final assets and review project checklist",
    icon: "✅",
    fields: [
      { name: 'additional_assets', label: 'Additional Assets Upload', type: 'file', required: false },
      { name: 'special_requirements', label: 'Special Requirements/Notes', type: 'textarea', required: false },
      { name: 'timeline_preference', label: 'Preferred Timeline', type: 'select', required: true, options: [
        '2-4 weeks', '1-2 months', '2-3 months', '3+ months', 'Flexible'
      ]},
      { name: 'budget_range', label: 'Project Budget Range', type: 'select', required: true, options: [
        '$5K-10K', '$10K-25K', '$25K-50K', '$50K-100K', '$100K+'
      ]},
      { name: 'priority_features', label: 'Priority Features (Must Have)', type: 'textarea', required: true },
      { name: 'nice_to_have', label: 'Nice-to-Have Features', type: 'textarea', required: false },
      { name: 'final_questions', label: 'Any Final Questions or Concerns?', type: 'textarea', required: false }
    ]
  }
] as const

export type WizardStepNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

// API endpoints
export const API_ENDPOINTS = {
  AUTH: '/api/auth',
  PROJECTS: '/api/projects',
  WIZARD: '/api/wizard',
  CHAT: '/api/chat',
  ADMIN: '/api/admin',
  AGENTS: '/api/admin/agents',
  SCRAPER: '/api/scraper',
  UPLOAD: '/api/upload'
} as const

// App configuration
export const APP_CONFIG = {
  name: 'DevNOW Platform',
  description: 'AI-Powered Client Onboarding & Project Execution',
  version: '1.0.0',
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedFileTypes: ['.pdf', '.doc', '.docx', '.png', '.jpg', '.jpeg', '.gif', '.zip'],
  chatMessageLimit: 100,
  autoSaveInterval: 30000 // 30 seconds
} as const
