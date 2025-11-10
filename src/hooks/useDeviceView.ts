/**
 * Custom hook for managing device view state
 * Handles desktop/tablet/mobile preview switching
 */

import { useState } from 'react'

export type DeviceView = 'desktop' | 'tablet' | 'mobile'

export function useDeviceView(initialView: DeviceView = 'desktop') {
  const [deviceView, setDeviceView] = useState<DeviceView>(initialView)

  const getDeviceStyles = () => {
    switch (deviceView) {
      case 'mobile':
        return {
          width: '375px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)',
          borderRadius: '24px',
        }
      case 'tablet':
        return {
          width: '768px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)',
          borderRadius: '24px',
        }
      case 'desktop':
      default:
        return {
          width: '100%',
          maxWidth: '1280px', // max-w-7xl
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
          borderRadius: '8px',
        }
    }
  }

  const getDeviceClassName = () => {
    switch (deviceView) {
      case 'mobile':
        return 'w-[375px]'
      case 'tablet':
        return 'w-[768px]'
      case 'desktop':
      default:
        return 'w-full max-w-7xl'
    }
  }

  return {
    deviceView,
    setDeviceView,
    getDeviceStyles,
    getDeviceClassName,
  }
}
