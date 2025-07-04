import { Database } from './database'

// User types
export type User = Database['public']['Tables']['users']['Row']
export type UserInsert = Database['public']['Tables']['users']['Insert']
export type UserUpdate = Database['public']['Tables']['users']['Update']
export type UserRole = User['role']

// Project types
export type Project = Database['public']['Tables']['projects']['Row']
export type ProjectInsert = Database['public']['Tables']['projects']['Insert']
export type ProjectUpdate = Database['public']['Tables']['projects']['Update']
export type ProjectStatus = Project['status']

// Project step types
export type ProjectStep = Database['public']['Tables']['project_steps']['Row']
export type ProjectStepInsert = Database['public']['Tables']['project_steps']['Insert']
export type ProjectStepUpdate = Database['public']['Tables']['project_steps']['Update']
export type StepStatus = ProjectStep['status']

// AI agent types
export type AIAgent = Database['public']['Tables']['ai_agents']['Row']
export type AIAgentInsert = Database['public']['Tables']['ai_agents']['Insert']
export type AIAgentUpdate = Database['public']['Tables']['ai_agents']['Update']

// Chat message types
export type ChatMessage = Database['public']['Tables']['chat_messages']['Row']
export type ChatMessageInsert = Database['public']['Tables']['chat_messages']['Insert']
export type ChatMessageUpdate = Database['public']['Tables']['chat_messages']['Update']
export type ChatRole = ChatMessage['role']

// File types
export type File = Database['public']['Tables']['files']['Row']
export type FileInsert = Database['public']['Tables']['files']['Insert']
export type FileUpdate = Database['public']['Tables']['files']['Update']

// Generated output types
export type GeneratedOutput = Database['public']['Tables']['generated_outputs']['Row']
export type GeneratedOutputInsert = Database['public']['Tables']['generated_outputs']['Insert']
export type GeneratedOutputUpdate = Database['public']['Tables']['generated_outputs']['Update']

// Wizard types
export interface WizardStepConfig {
  stepNumber: number
  title: string
  description: string
  icon: string
  fields: FormField[]
}

export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'tel' | 'url' | 'textarea' | 'select' | 'multiselect' | 'file' | 'number' | 'date'
  required: boolean
  placeholder?: string
  options?: string[]
  helpText?: string
  validation?: {
    min?: number
    max?: number
    pattern?: string
    message?: string
  }
}

// API Response types
export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
}

export interface ProjectWithSteps extends Project {
  project_steps: ProjectStep[]
  users: User
}

export interface StepFormData {
  [key: string]: any
}

export interface AIResponse {
  response: string
  suggestions?: StepFormData
  metadata?: Record<string, any>
}

// Claude API types
export interface ClaudeMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface ClaudeConfig {
  model: string
  temperature: number
  max_tokens: number
  system_prompt: string
}

// File upload types
export interface UploadedFile {
  name: string
  url: string
  size: number
  type: string
}

// PRD types
export interface ProjectPRD {
  clientInfo: StepFormData
  brandingAssets: StepFormData
  websiteStructure: StepFormData
  funnelLogic: StepFormData
  agentInstructions: StepFormData
  marketingStrategy: StepFormData
  automationFlows: StepFormData
  scrapedInspiration: any[]
  claudePrompt: string
  generatedAssets: {
    headlines: string[]
    adCopy: string[]
    emailSequences: string[]
    agentPrompts: string[]
  }
}
