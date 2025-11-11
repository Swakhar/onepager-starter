/**
 * Custom hook for managing editor state
 * Handles site loading, saving, and updates
 */

import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Site } from '@/types/site'
import { loadSite, saveSite, createNewSite } from '@/lib/storage/siteStorage'
import { modernPortfolioSampleData } from '@/config/sampleData'
import { toast } from '@/components/ui/Toast'

export function useEditorState() {
  const router = useRouter()
  const { siteId } = router.query
  
  const [site, setSite] = useState<Site | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccessToast, setShowSuccessToast] = useState(false)

  // Load site on mount or when siteId changes
  useEffect(() => {
    const loadSiteData = async () => {
      if (siteId && typeof siteId === 'string') {
        const loaded = await loadSite(siteId)
        if (loaded) {
          setSite(loaded)
        } else {
          // Site not found, redirect to dashboard
          router.push('/dashboard')
        }
      } else {
        // Create a new demo site
        const newSite = createNewSite('modern-portfolio', 'My Portfolio')
        newSite.data = modernPortfolioSampleData
        setSite(newSite)
      }
    }
    loadSiteData()
  }, [siteId, router])

  // Save site
  const handleSave = async () => {
    if (!site) return
    
    setIsSaving(true)
    try {
      await saveSite({
        ...site,
        updatedAt: new Date().toISOString(),
      })
      setShowSuccessToast(true)
      setTimeout(() => setShowSuccessToast(false), 3000)
    } catch (error) {
      console.error('Failed to save site:', error)
      toast.error('Failed to save site', 'Please try again or check your connection')
    } finally {
      setIsSaving(false)
    }
  }

  // Publish site
  const handlePublish = async (withDomain?: string) => {
    if (!site) return
    
    setIsSaving(true)
    try {
      await saveSite({
        ...site,
        published: true,
        customDomain: withDomain || site.customDomain,
        updatedAt: new Date().toISOString(),
      })
      setShowSuccessToast(true)
      setTimeout(() => setShowSuccessToast(false), 3000)
      setSite({ ...site, published: true, customDomain: withDomain || site.customDomain })
    } catch (error) {
      console.error('Failed to publish site:', error)
      toast.error('Failed to publish site', 'Please try again or check your connection')
    } finally {
      setIsSaving(false)
    }
  }

  return {
    site,
    setSite,
    isSaving,
    showSuccessToast,
    handleSave,
    handlePublish,
  }
}
