'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Project } from '@/types'
import { Plus, ArrowRight, Clock, CheckCircle } from 'lucide-react'
import { toast } from '@/components/ui/Toaster'

export default function WizardDashboard() {
  const { user, profile, loading } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [loadingProjects, setLoadingProjects] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || !profile)) {
      router.push('/')
      return
    }

    if (user) {
      fetchProjects()
    }
  }, [user, loading, router])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      if (response.ok) {
        const data = await response.json()
        setProjects(data.projects || [])
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
      toast.error('Failed to load projects')
    } finally {
      setLoadingProjects(false)
    }
  }

  const createNewProject = async () => {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `New Project ${new Date().toLocaleDateString()}`,
          description: 'Project created via wizard'
        })
      })

      if (response.ok) {
        const { project } = await response.json()
        router.push(`/wizard/${project.id}/step/1`)
      } else {
        throw new Error('Failed to create project')
      }
    } catch (error) {
      console.error('Error creating project:', error)
      toast.error('Failed to create new project')
    }
  }

  const continueProject = (projectId: string, currentStep: number) => {
    router.push(`/wizard/${projectId}/step/${currentStep}`)
  }

  if (loading || loadingProjects) {
    return (
      <div className="min-h-screen bg-soft-gray flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-charcoal">Loading your projects...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-soft-gray">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-charcoal">Welcome back, {profile?.full_name}</h1>
              <p className="text-gray-600 mt-1">Continue your project or start a new one</p>
            </div>
            <button
              onClick={createNewProject}
              className="btn-primary flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Project
            </button>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="container mx-auto px-6 py-8">
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <div className="glass-card p-12 max-w-md mx-auto">
              <div className="w-20 h-20 bg-bright-blue rounded-full flex items-center justify-center mx-auto mb-6">
                <Plus className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-charcoal mb-4">Start Your First Project</h3>
              <p className="text-gray-600 mb-8">
                Create a comprehensive development brief with our AI-powered 10-step wizard.
              </p>
              <button
                onClick={createNewProject}
                className="btn-primary"
              >
                Start New Project
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="glass-card glass-card-hover p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-charcoal mb-2">{project.title}</h3>
                    <p className="text-gray-600 text-sm">{project.description}</p>
                  </div>
                  <div className={`
                    px-3 py-1 rounded-full text-xs font-medium
                    ${project.status === 'completed' ? 'bg-green-100 text-green-800' :
                      project.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'}
                  `}>
                    {project.status.replace('_', ' ')}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress</span>
                    <span>{project.current_step}/{project.total_steps}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-bright-blue h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(project.current_step / project.total_steps) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {project.status === 'completed' ? (
                    <button
                      onClick={() => router.push(`/wizard/${project.id}/review`)}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg flex items-center justify-center"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      View Results
                    </button>
                  ) : (
                    <button
                      onClick={() => continueProject(project.id, project.current_step)}
                      className="flex-1 btn-primary flex items-center justify-center"
                    >
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Continue
                    </button>
                  )}
                </div>

                <div className="mt-3 text-xs text-gray-500">
                  Created: {new Date(project.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
