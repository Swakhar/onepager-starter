import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { Site } from '@/types/site'
import { TemplateData, ColorScheme, FontScheme } from '@/types/template'
import { loadSite } from '@/lib/storage/siteStorage'
import { templates } from '@/config/templates'
import { initAnalytics } from '@/lib/analytics/tracker'

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
  const [unauthorized, setUnauthorized] = useState(false)

  useEffect(() => {
    const loadSiteData = async () => {
      if (siteId && typeof siteId === 'string') {
        const loaded = await loadSite(siteId)
        if (loaded) {
          // Check if site is published
          if (!loaded.published) {
            setUnauthorized(true)
            // Redirect after showing message
            setTimeout(() => router.push('/'), 2000)
            return
          }
          setSite(loaded)
          
          // Initialize analytics tracking for published sites
          if (loaded.published && loaded.id) {
            console.log('[Preview] Initializing analytics for site:', loaded.id)
            initAnalytics(loaded.id)
          }
        } else {
          setNotFound(true)
        }
      }
    }
    loadSiteData()
  }, [siteId, router])

  if (unauthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <div className="text-center bg-white p-12 rounded-2xl shadow-2xl max-w-md">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Unauthorized</h1>
          <p className="text-gray-600 mb-2">
            This site is not published yet.
          </p>
          <p className="text-sm text-gray-500">
            Redirecting to home page...
          </p>
        </div>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-12 rounded-2xl shadow-2xl max-w-md">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Site Not Found</h1>
          <p className="text-gray-600 mb-8">The site you're looking for doesn't exist.</p>
          <a href="/dashboard" className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
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
      {/* SEO Meta Tags */}
      <Head>
        <title>{site.title || 'OnePager Site'}</title>
        <meta name="description" content={site.settings.seo.description || 'Created with OnePager'} />
        <meta name="keywords" content={Array.isArray(site.settings.seo.keywords) ? site.settings.seo.keywords.join(', ') : (site.settings.seo.keywords || '')} />
        
        {/* Open Graph */}
        <meta property="og:title" content={site.settings.seo.title || site.title} />
        <meta property="og:description" content={site.settings.seo.description || 'Created with OnePager'} />
        {site.settings.seo.ogImage && <meta property="og:image" content={site.settings.seo.ogImage} />}
        <meta property="og:type" content="website" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={site.settings.seo.title || site.title} />
        <meta name="twitter:description" content={site.settings.seo.description || 'Created with OnePager'} />
        {site.settings.seo.ogImage && <meta name="twitter:image" content={site.settings.seo.ogImage} />}
        
        {/* Favicon */}
        {site.settings.seo.favicon && <link rel="icon" href={site.settings.seo.favicon} />}
        
        {/* Custom Domain Hint */}
        {site.customDomain && <link rel="canonical" href={`https://${site.customDomain}`} />}
      </Head>

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
          data={{
            ...site.data,
            sectionOrder: site.settings.layout.sectionOrder, // CRITICAL: Pass sectionOrder so hidden sections stay hidden
          }}
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
