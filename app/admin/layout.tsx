'use client'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'
import { 
  LayoutDashboard, 
  FolderOpen, 
  Bot, 
  Settings, 
  LogOut,
  Menu,
  X,
  Users,
  BarChart
} from 'lucide-react'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, profile, loading, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!loading && (!user || !profile || !['admin', 'super_admin'].includes(profile.role))) {
      router.push('/')
    }
  }, [user, profile, loading, router])

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-soft-gray flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-charcoal">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
    return null
  }

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Projects', href: '/admin/projects', icon: FolderOpen },
    { name: 'AI Agents', href: '/admin/agents', icon: Bot },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-soft-gray">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-white rounded-lg shadow-lg"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        sidebar-nav lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6">
            <h2 className="text-2xl font-bold text-white">DevNOW Admin</h2>
            <p className="text-sm text-gray-400 mt-1">Management Console</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 pb-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* User info & logout */}
          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-bright-blue rounded-full flex items-center justify-center text-white font-bold">
                {profile.full_name?.charAt(0) || 'A'}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">{profile.full_name}</p>
                <p className="text-xs text-gray-400">{profile.role}</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="nav-item w-full justify-center"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        <main className="p-6">
          {children}
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
