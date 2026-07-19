'use client'

import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react'

type AlertType = 'error' | 'success' | 'warning' | 'info'

interface AlertProps {
  type: AlertType
  title?: string
  message: string
  onClose?: () => void
}

export default function Alert({ type, title, message, onClose }: AlertProps) {
  const styles = {
    error: 'bg-destructive/10 border-destructive/30 text-destructive',
    success: 'bg-green-500/10 border-green-500/30 text-green-500',
    warning: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500',
    info: 'bg-blue-500/10 border-blue-500/30 text-blue-500',
  }

  const icons = {
    error: <AlertCircle className="w-5 h-5" />,
    success: <CheckCircle className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
  }

  return (
    <div className={`flex items-start gap-3 p-4 rounded-lg border ${styles[type]} animate-slide-up`}>
      {icons[type]}
      <div className="flex-1">
        {title && <h3 className="font-semibold text-sm mb-1">{title}</h3>}
        <p className="text-sm">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-current/50 hover:text-current transition-colors"
        >
          ✕
        </button>
      )}
    </div>
  )
}
