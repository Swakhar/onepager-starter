/**
 * Before/After Snapshot Hook
 * 
 * Custom hook for capturing and managing before/after snapshots of design changes.
 */

import { useState, useCallback } from 'react'
import { ColorScheme, FontScheme, TemplateData } from '@/types/template'

export interface BeforeSnapshot {
  colors: ColorScheme
  fonts: FontScheme
  data: TemplateData
  sectionOrder: string[]
}

interface UseSnapshotReturn {
  beforeSnapshot: BeforeSnapshot | null
  captureSnapshot: (
    colors: ColorScheme,
    fonts: FontScheme,
    data: TemplateData,
    sectionOrder: string[]
  ) => void
  clearSnapshot: () => void
  hasSnapshot: boolean
}

export function useSnapshot(): UseSnapshotReturn {
  const [beforeSnapshot, setBeforeSnapshot] = useState<BeforeSnapshot | null>(null)

  const captureSnapshot = useCallback((
    colors: ColorScheme,
    fonts: FontScheme,
    data: TemplateData,
    sectionOrder: string[]
  ) => {
    // Deep clone to ensure we capture actual state, not references
    const snapshot: BeforeSnapshot = {
      colors: JSON.parse(JSON.stringify(colors)),
      fonts: JSON.parse(JSON.stringify(fonts)),
      data: JSON.parse(JSON.stringify(data)),
      sectionOrder: JSON.parse(JSON.stringify(sectionOrder)),
    }
    
    setBeforeSnapshot(snapshot)
    
    console.log('📸 Snapshot captured:', {
      sections: sectionOrder,
      dataKeys: Object.keys(data || {}),
    })
  }, [])

  const clearSnapshot = useCallback(() => {
    setBeforeSnapshot(null)
  }, [])

  const hasSnapshot = beforeSnapshot !== null

  return {
    beforeSnapshot,
    captureSnapshot,
    clearSnapshot,
    hasSnapshot,
  }
}
