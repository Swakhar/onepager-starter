import React, { useEffect, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastMessage {
  id: string
  type: ToastType
  title: string
  description?: string
  duration?: number
}

interface ToastProps {
  message: ToastMessage
  onClose: (id: string) => void
}

const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  const [isExiting, setIsExiting] = useState(false)

  // CRITICAL FIX: Wrap onClose in useCallback to stabilize the reference
  const handleAutoClose = useCallback(() => {
    setIsExiting(true)
    setTimeout(() => onClose(message.id), 300)
  }, [message.id, onClose])

  useEffect(() => {
    const duration = message.duration || 4000
    const timer = setTimeout(handleAutoClose, duration)

    return () => clearTimeout(timer)
  }, [message.duration, handleAutoClose]) // Fixed: use message.duration instead of duration

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => onClose(message.id), 300)
  }

  const typeStyles = {
    success: {
      gradient: 'from-green-500 to-emerald-500',
      icon: '✅',
      border: 'border-green-400/30',
      text: 'text-green-50',
    },
    error: {
      gradient: 'from-red-500 to-rose-500',
      icon: '❌',
      border: 'border-red-400/30',
      text: 'text-red-50',
    },
    warning: {
      gradient: 'from-yellow-500 to-orange-500',
      icon: '⚠️',
      border: 'border-yellow-400/30',
      text: 'text-yellow-50',
    },
    info: {
      gradient: 'from-blue-500 to-indigo-500',
      icon: 'ℹ️',
      border: 'border-blue-400/30',
      text: 'text-blue-50',
    },
  }

  const style = typeStyles[message.type]

  return (
    <div
      className={`
        bg-gradient-to-r ${style.gradient} text-white px-6 py-4 rounded-xl shadow-2xl 
        flex items-start gap-3 border ${style.border} min-w-[320px] max-w-[500px]
        ${isExiting ? 'animate-slideOutRight' : 'animate-slideInRight'}
      `}
    >
      <span className="text-2xl flex-shrink-0">{style.icon}</span>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-white">{message.title}</p>
        {message.description && (
          <p className={`text-sm ${style.text} mt-1`}>{message.description}</p>
        )}
      </div>
      <button
        onClick={handleClose}
        className="flex-shrink-0 text-white/70 hover:text-white transition-colors ml-2"
        aria-label="Close"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  )
}

interface ToastContainerProps {
  messages: ToastMessage[]
  onClose: (id: string) => void
}

const ToastContainer: React.FC<ToastContainerProps> = ({ messages, onClose }) => {
  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      <div className="pointer-events-auto space-y-3">
        {messages.map((message) => (
          <Toast key={message.id} message={message} onClose={onClose} />
        ))}
      </div>
    </div>
  )
}

// Toast Manager (Singleton)
class ToastManager {
  private listeners: Set<(messages: ToastMessage[]) => void> = new Set()
  private messages: ToastMessage[] = []

  subscribe(listener: (messages: ToastMessage[]) => void) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private notify() {
    this.listeners.forEach((listener) => listener([...this.messages]))
  }

  show(type: ToastType, title: string, description?: string, duration?: number) {
    const id = `toast-${Date.now()}-${Math.random()}`
    const message: ToastMessage = { id, type, title, description, duration }
    this.messages.push(message)
    this.notify()
    return id
  }

  success(title: string, description?: string, duration?: number) {
    return this.show('success', title, description, duration)
  }

  error(title: string, description?: string, duration?: number) {
    return this.show('error', title, description, duration)
  }

  warning(title: string, description?: string, duration?: number) {
    return this.show('warning', title, description, duration)
  }

  info(title: string, description?: string, duration?: number) {
    return this.show('info', title, description, duration)
  }

  close(id: string) {
    this.messages = this.messages.filter((m) => m.id !== id)
    this.notify()
  }

  closeAll() {
    this.messages = []
    this.notify()
  }
}

export const toast = new ToastManager()

// React Component to render toasts
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ToastMessage[]>([])
  const [mounted, setMounted] = useState(false)

  // CRITICAL FIX: Create stable onClose callback
  const handleClose = useCallback((id: string) => {
    toast.close(id)
  }, [])

  useEffect(() => {
    setMounted(true)
    const unsubscribe = toast.subscribe(setMessages)
    return () => {
      unsubscribe()
    }
  }, [])

  if (!mounted) return <>{children}</>

  return (
    <>
      {children}
      {createPortal(
        <ToastContainer messages={messages} onClose={handleClose} />,
        document.body
      )}
    </>
  )
}
