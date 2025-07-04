'use client'
import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react'

interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}

class ToastManager {
  private toasts: Toast[] = []
  private listeners: ((toasts: Toast[]) => void)[] = []

  subscribe(listener: (toasts: Toast[]) => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  private notify() {
    this.listeners.forEach(listener => listener(this.toasts))
  }

  add(toast: Omit<Toast, 'id'>) {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast = { id, ...toast }
    this.toasts.push(newToast)
    this.notify()

    // Auto remove after duration
    setTimeout(() => {
      this.remove(id)
    }, toast.duration || 5000)

    return id
  }

  remove(id: string) {
    this.toasts = this.toasts.filter(toast => toast.id !== id)
    this.notify()
  }

  success(title: string, message?: string) {
    return this.add({ type: 'success', title, message })
  }

  error(title: string, message?: string) {
    return this.add({ type: 'error', title, message })
  }

  warning(title: string, message?: string) {
    return this.add({ type: 'warning', title, message })
  }

  info(title: string, message?: string) {
    return this.add({ type: 'info', title, message })
  }
}

export const toast = new ToastManager()

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    return toast.subscribe(setToasts)
  }, [])

  const getIcon = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      default:
        return <AlertCircle className="w-5 h-5 text-blue-500" />
    }
  }

  const getBgColor = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200'
      case 'error':
        return 'bg-red-50 border-red-200'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200'
      default:
        return 'bg-blue-50 border-blue-200'
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`glass-card p-4 min-w-80 max-w-md border ${getBgColor(toast.type)} animate-slide-up`}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {getIcon(toast.type)}
            </div>
            <div className="ml-3 flex-1">
              <h4 className="text-sm font-medium text-charcoal">
                {toast.title}
              </h4>
              {toast.message && (
                <p className="mt-1 text-sm text-gray-600">
                  {toast.message}
                </p>
              )}
            </div>
            <button
              onClick={() => toast.remove(toast.id)}
              className="ml-3 flex-shrink-0 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
