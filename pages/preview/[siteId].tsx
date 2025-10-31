import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Site } from '@/types/site'
import { TemplateData, ColorScheme, FontScheme } from '@/types/template'
import { loadSite } from '@/lib/storage/siteStorage'
import { templates } from '@/config/templates'

// Dynamically import template components
const ModernPortfolio = dynamic(() => import('@/components/templates/modern-portfolio'))
const BusinessCard = dynamic(() => import('@/components/templates/business-card'))
const CreativeResume = dynamic(() => import('@/components/templates/creative-resume'))

// Template component mapping
const templateComponents: Record<string, React.ComponentType<{ data: TemplateData; colors: ColorScheme; fonts: FontScheme }>> = {
  'modern-portfolio': ModernPortfolio as any,
  'business-card': BusinessCard as any,
  'creative-resume': CreativeResume as any,
}

export default function PreviewPage() {
  const router = useRouter()
  const { siteId } = router.query
  const [site, setSite] = useState<Site | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const loadSiteData = async () => {
      if (siteId && typeof siteId === 'string') {
        const loaded = await loadSite(siteId)
        if (loaded) {
          setSite(loaded)
        } else {
          setNotFound(true)
        }
      }
    }
    loadSiteData()
  }, [siteId])

  if (notFound) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Site Not Found</h1>
          <p className="text-gray-600 mb-8">The site you're looking for doesn't exist.</p>
          <a href="/dashboard" className="text-indigo-600 hover:underline">
            Go to Dashboard
          </a>
        </div>
      </div>
    )
  }

  if (!site) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading site...</p>
        </div>
      </div>
    )
  }

  const template = templates[site.templateId]
  const TemplateComponent = templateComponents[site.templateId]

  return (
    <>
      {/* Preview Banner (only shown when not published) */}
      {!site.published && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-6 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-yellow-800">
                Preview Mode - This site is not published yet
              </span>
            </div>
            <a href={`/editor?siteId=${site.id}`} className="text-sm text-yellow-800 hover:underline">
              Edit Site
            </a>
          </div>
        </div>
      )}

      {/* Render the template */}
      {TemplateComponent ? (
        <TemplateComponent
          data={site.data}
          colors={site.settings.colors}
          fonts={site.settings.fonts}
        />
      ) : (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Template "{template?.name || site.templateId}" not found
            </h1>
            <a href={`/editor?siteId=${site.id}`} className="text-indigo-600 hover:underline">
              Edit Site
            </a>
          </div>
        </div>
      )}
    </>
  )
}
