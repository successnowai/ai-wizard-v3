'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { 
  Users, 
  FolderOpen, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertCircle,
  Activity
} from 'lucide-react'

interface DashboardStats {
  totalProjects: number
  activeProjects: number
  completedProjects: number
  totalUsers: number
  recentActivity: any[]
}

export default function AdminDashboard() {
  const { profile } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalUsers: 0,
    recentActivity: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/admin/dashboard/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-charcoal">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {profile?.full_name}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Projects</p>
              <p className="text-3xl font-bold text-charcoal mt-2">{stats.totalProjects}</p>
            </div>
            <div className="w-12 h-12 bg-bright-blue rounded-full flex items-center justify-center">
              <FolderOpen className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            All time projects
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Projects</p>
              <p className="text-3xl font-bold text-charcoal mt-2">{stats.activeProjects}</p>
            </div>
            <div className="w-12 h-12 bg-vibrant-yellow rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-charcoal" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            Currently in progress
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-3xl font-bold text-charcoal mt-2">{stats.completedProjects}</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            Ready for development
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-charcoal mt-2">{stats.totalUsers}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            Registered clients
          </div>
        </div>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-charcoal mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Recent Activity
          </h2>
          <div className="space-y-4">
            {stats.recentActivity.length > 0 ? (
              stats.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 pb-3 border-b last:border-0">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <Activity className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-charcoal">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No recent activity</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-charcoal mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button
              onClick={() => window.location.href = '/admin/projects'}
              className="w-full btn-primary flex items-center justify-center"
            >
              <FolderOpen className="w-4 h-4 mr-2" />
              View All Projects
            </button>
            <button
              onClick={() => window.location.href = '/admin/agents'}
              className="w-full btn-secondary flex items-center justify-center"
            >
              <Bot className="w-4 h-4 mr-2" />
              Configure AI Agents
            </button>
            <button
              onClick={() => window.location.href = '/admin/users'}
              className="w-full btn-secondary flex items-center justify-center"
            >
              <Users className="w-4 h-4 mr-2" />
              Manage Users
            </button>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="mt-8 glass-card p-6">
        <h2 className="text-xl font-bold text-charcoal mb-4">System Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div>
              <p className="font-medium text-charcoal">API Status</p>
              <p className="text-sm text-gray-500">All systems operational</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div>
              <p className="font-medium text-charcoal">Database</p>
              <p className="text-sm text-gray-500">Healthy - 23ms response</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div>
              <p className="font-medium text-charcoal">AI Agents</p>
              <p className="text-sm text-gray-500">10/10 agents active</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
