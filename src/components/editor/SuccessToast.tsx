/**
 * Success Toast Component
 * Animated success notification toast
 */

import React from 'react'

interface SuccessToastProps {
  show: boolean
  message?: string
  description?: string
}

export const SuccessToast: React.FC<SuccessToastProps> = ({
  show,
  message = 'Success!',
  description = 'Your changes have been saved',
}) => {
  if (!show) return null

  return (
    <div className="fixed top-6 right-6 z-[100] bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-fadeIn border border-green-400/30">
      <span className="text-2xl">✅</span>
      <div>
        <p className="font-semibold">{message}</p>
        <p className="text-sm text-green-50">{description}</p>
      </div>
    </div>
  )
}
