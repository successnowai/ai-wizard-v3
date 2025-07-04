'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Project, ProjectStep } from '@/types'
import { WIZARD_STEPS } from '@/utils/constants'
import { ArrowLeft, Download, CheckCircle, Copy, Eye } from 'lucide-react'
import { toast } from '@/components/ui/Toaster'

export default function ProjectReviewPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const projectId = params.projectId as string

  const [project, setProject] = useState<Project | null>(null)
  const [steps, setSteps] = useState<ProjectStep[]>([])
  const [prd, setPRD] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/')
      return
    }

    if (user && projectId) {
      fetchProjectData()
    }
  }, [user, authLoading, projectId])

  const fetchProjectData = async () => {
    try {
      setLoading(true)
      
      // Fetch project with all steps
      const response = await fetch(`/api/projects/${projectId}`)
      if (!response.ok) throw new Error('Project not found')
      
      const data = await response.json()
      setProject(data.project)
      setSteps(data.project.project_steps || [])

      // Generate PRD if all steps completed
      const allCompleted = data.project.project_steps?.length === 10 &&
        data.project.project_steps.every((s: ProjectStep) => s.status === 'completed')
      
      if (allCompleted) {
        generatePRD(data.project.project_steps)
      }

    } catch (error) {
      console.error('Error fetching project data:', error)
      toast.error('Failed to load project data')
      router.push('/wizard')
    } finally {
      setLoading(false)
    }
  }

  const generatePRD = async (projectSteps: ProjectStep[]) => {
    setGenerating(true)
    try {
      const response = await fetch('/api/wizard/generate-prd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, steps: projectSteps })
      })

      if (!response.ok) throw new Error('Failed to generate PRD')

      const data = await response.json()
      setPRD(data.prd)

    } catch (error) {
      console.error('Error generating PRD:', error)
      toast.error('Failed to generate PRD')
    } finally {
      setGenerating(false)
    }
  }

  const copyPRD = () => {
    navigator.clipboard.writeText(prd)
    toast.success('PRD copied to clipboard')
  }

  const downloadPRD = () => {
    const blob = new Blob([prd], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${project?.title || 'project'}-prd.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('PRD downloaded')
  }

  const getStepData = (stepNumber: number) => {
    return steps.find(s => s.step_number === stepNumber)
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-soft-gray flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-charcoal">Loading project review...</p>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-soft-gray flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-charcoal mb-4">Project not found</h2>
          <button onClick={() => router.push('/wizard')} className="btn-primary">
            Back to Projects
          </button>
        </div>
      </div>
    )
  }

  const allStepsCompleted = steps.length === 10 && 
    steps.every(s => s.status === 'completed')

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
                <p className="text-gray-600">Project Review & PRD</p>
              </div>
            </div>
            {allStepsCompleted && prd && (
              <div className="flex space-x-3">
                <button
                  onClick={copyPRD}
                  className="btn-secondary flex items-center"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy PRD
                </button>
                <button
                  onClick={downloadPRD}
                  className="btn-primary flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PRD
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Completion Status */}
        {!allStepsCompleted && (
          <div className="glass-card p-6 mb-8 bg-yellow-50 border-yellow-200">
            <h2 className="text-xl font-bold text-charcoal mb-2">Project Incomplete</h2>
            <p className="text-gray-600">
              Please complete all steps to generate your Project Requirements Document (PRD).
            </p>
          </div>
        )}

        {/* Steps Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {WIZARD_STEPS.map((stepConfig) => {
            const stepData = getStepData(stepConfig.stepNumber)
            const isCompleted = stepData?.status === 'completed'
            
            return (
              <div key={stepConfig.stepNumber} className="glass-card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="text-3xl mr-3">{stepConfig.icon}</div>
                    <div>
                      <h3 className="font-bold text-charcoal">
                        Step {stepConfig.stepNumber}: {stepConfig.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {stepConfig.description}
                      </p>
                    </div>
                  </div>
                  {isCompleted ? (
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  ) : (
                    <button
                      onClick={() => router.push(`/wizard/${projectId}/step/${stepConfig.stepNumber}`)}
                      className="text-bright-blue hover:text-blue-700 text-sm flex items-center"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Complete
                    </button>
                  )}
                </div>

                {stepData?.form_data && (
                  <div className="mt-4 space-y-2">
                    {Object.entries(stepData.form_data).slice(0, 3).map(([key, value]) => (
                      <div key={key} className="text-sm">
                        <span className="font-medium text-gray-700">{key.replace(/_/g, ' ')}:</span>
                        <span className="ml-2 text-gray-600">
                          {Array.isArray(value) ? value.join(', ') : String(value)}
                        </span>
                      </div>
                    ))}
                    {Object.keys(stepData.form_data).length > 3 && (
                      <p className="text-sm text-gray-500">
                        +{Object.keys(stepData.form_data).length - 3} more fields
                      </p>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* PRD Display */}
        {allStepsCompleted && (
          <div className="glass-card p-8">
            <h2 className="text-2xl font-bold text-charcoal mb-6">
              Project Requirements Document (PRD)
            </h2>
            
            {generating ? (
              <div className="text-center py-12">
                <div className="spinner mx-auto mb-4"></div>
                <p className="text-gray-600">Generating comprehensive PRD...</p>
              </div>
            ) : prd ? (
              <div className="prose prose-lg max-w-none">
                <pre className="whitespace-pre-wrap bg-gray-50 p-6 rounded-lg text-sm">
                  {prd}
                </pre>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">PRD will be generated once all steps are completed.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
