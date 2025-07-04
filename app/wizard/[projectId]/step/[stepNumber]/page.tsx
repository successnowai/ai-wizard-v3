'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Project, ProjectStep, AIAgent } from '@/types'
import { WIZARD_STEPS } from '@/utils/constants'
import { StepForm } from '@/components/wizard/StepForm'
import { ChatInterface } from '@/components/wizard/ChatInterface'
import { StepNavigation } from '@/components/wizard/StepNavigation'
import { ProgressIndicator } from '@/components/wizard/ProgressIndicator'
import { ArrowLeft, Save } from 'lucide-react'
import { toast } from '@/components/ui/Toaster'

export default function WizardStepPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const projectId = params.projectId as string
  const stepNumber = parseInt(params.stepNumber as string)

  const [project, setProject] = useState<Project | null>(null)
  const [stepData, setStepData] = useState<ProjectStep | null>(null)
  const [aiAgent, setAiAgent] = useState<AIAgent | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const currentStepConfig = WIZARD_STEPS.find(s => s.stepNumber === stepNumber)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/')
      return
    }

    if (user && projectId && stepNumber) {
      fetchStepData()
    }
  }, [user, authLoading, projectId, stepNumber])

  const fetchStepData = async () => {
    try {
      setLoading(true)
      
      // Fetch project data
      const projectResponse = await fetch(`/api/projects/${projectId}`)
      if (!projectResponse.ok) throw new Error('Project not found')
      const projectData = await projectResponse.json()
      setProject(projectData.project)

      // Fetch step data
      const stepResponse = await fetch(`/api/wizard/step/${projectId}/${stepNumber}`)
      if (stepResponse.ok) {
        const stepData = await stepResponse.json()
        setStepData(stepData.step)
        setFormData(stepData.step?.form_data || {})
      }

      // Fetch AI agent configuration
      const agentResponse = await fetch(`/api/admin/agents/${stepNumber}`)
      if (agentResponse.ok) {
        const agentData = await agentResponse.json()
        setAiAgent(agentData.agent)
      }

    } catch (error) {
      console.error('Error fetching step data:', error)
      toast.error('Failed to load step data')
      router.push('/wizard')
    } finally {
      setLoading(false)
    }
  }

  const handleFormChange = (fieldName: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }))
  }

  const validateForm = () => {
    if (!currentStepConfig) return false
    
    for (const field of currentStepConfig.fields) {
      if (field.required) {
        const value = formData[field.name]
        if (!value || (Array.isArray(value) && value.length === 0)) {
          return false
        }
      }
    }
    return true
  }

  const saveStep = async (isCompleting: boolean = false) => {
    setSaving(true)
    try {
      const response = await fetch(`/api/wizard/step/${projectId}/${stepNumber}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form_data: formData,
          status: isCompleting ? 'completed' : 'in_progress'
        })
      })

      if (!response.ok) throw new Error('Failed to save step')

      const data = await response.json()
      setStepData(data.step)
      
      if (isCompleting) {
        // Update project progress
        await fetch(`/api/projects/${projectId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            current_step: Math.min(stepNumber + 1, 10),
            status: stepNumber === 10 ? 'completed' : 'in_progress'
          })
        })

        toast.success('Step completed successfully!')
        
        // Navigate to next step or completion
        if (stepNumber < 10) {
          router.push(`/wizard/${projectId}/step/${stepNumber + 1}`)
        } else {
          router.push(`/wizard/${projectId}/review`)
        }
      } else {
        toast.success('Progress saved')
      }

    } catch (error) {
      console.error('Error saving step:', error)
      toast.error('Failed to save step')
    } finally {
      setSaving(false)
    }
  }

  const handleNext = () => {
    if (!validateForm()) {
      toast.error('Please fill in all required fields')
      return
    }
    saveStep(true)
  }

  const handlePrevious = () => {
    if (stepNumber > 1) {
      router.push(`/wizard/${projectId}/step/${stepNumber - 1}`)
    } else {
      router.push('/wizard')
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-soft-gray flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-charcoal">Loading step data...</p>
        </div>
      </div>
    )
  }

  if (!currentStepConfig || !project) {
    return (
      <div className="min-h-screen bg-soft-gray flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-charcoal mb-4">Step not found</h2>
          <button onClick={() => router.push('/wizard')} className="btn-primary">
            Back to Projects
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-soft-gray">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/wizard')}
                className="text-gray-600 hover:text-charcoal"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-charcoal">{project.title}</h1>
                <p className="text-gray-600">Step {stepNumber}: {currentStepConfig.title}</p>
              </div>
            </div>
            <button
              onClick={() => saveStep(false)}
              disabled={saving}
              className="btn-secondary flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Draft'}
            </button>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-4">
          <ProgressIndicator currentStep={stepNumber} totalSteps={10} />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Form */}
          <div className="space-y-6">
            <div className="glass-card p-8">
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">{currentStepConfig.icon}</div>
                <div>
                  <h2 className="text-2xl font-bold text-charcoal">{currentStepConfig.title}</h2>
                  <p className="text-gray-600 mt-1">{currentStepConfig.description}</p>
                </div>
              </div>

              <StepForm
                stepConfig={currentStepConfig}
                formData={formData}
                onChange={handleFormChange}
              />
            </div>

            <StepNavigation
              currentStep={stepNumber}
              totalSteps={10}
              onPrevious={handlePrevious}
              onNext={handleNext}
              isLoading={saving}
              canProceed={validateForm()}
            />
          </div>

          {/* Right Side - AI Chat */}
          <div className="space-y-6">
            {aiAgent && (
              <ChatInterface
                agent={aiAgent}
                projectId={projectId}
                stepNumber={stepNumber}
                formData={formData}
                onFormSuggestion={(suggestions) => {
                  // Apply AI suggestions to form
                  Object.entries(suggestions).forEach(([field, value]) => {
                    handleFormChange(field, value)
                  })
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
