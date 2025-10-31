import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/Button'
import { Tabs } from '@/components/ui/Tabs'
import { DesignPanel } from '@/components/editor/panels/DesignPanel'
import { ContentPanel } from '@/components/editor/panels/ContentPanel'
import { Site } from '@/types/site'
import { TemplateData, ColorScheme, FontScheme } from '@/types/template'
import { templates } from '@/config/templates'
import { modernPortfolioSampleData, businessCardSampleData, creativeResumeSampleData } from '@/config/sampleData'
import { saveSite, loadSite, createNewSite } from '@/lib/storage/siteStorage'

// Dynamically import template components
const ModernPortfolio = dynamic(() => import('@/components/templates/modern-portfolio'))
const BusinessCard = dynamic(() => import('@/components/templates/business-card'))
const CreativeResume = dynamic(() => import('@/components/templates/creative-resume'))

type EditorTab = 'content' | 'design' | 'settings'

// Template component mapping
const templateComponents: Record<string, React.ComponentType<{ data: TemplateData; colors: ColorScheme; fonts: FontScheme }>> = {
  'modern-portfolio': ModernPortfolio as any,
  'business-card': BusinessCard as any,
  'creative-resume': CreativeResume as any,
}

export default function EditorPage() {
  const router = useRouter()
  const { siteId } = router.query
  
  const [site, setSite] = useState<Site | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<EditorTab>('content')
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')

  useEffect(() => {
    // Load site from storage or create new one
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

  const handleSave = async () => {
    if (!site) return
    
    setIsSaving(true)
    try {
      await saveSite({
        ...site,
        updatedAt: new Date().toISOString(),
      })
      alert('Site saved successfully!')
    } catch (error) {
      console.error('Failed to save site:', error)
      alert('Failed to save site')
    } finally {
      setIsSaving(false)
    }
  }

  const handlePublish = async () => {
    if (!site) return
    
    setIsSaving(true)
    try {
      await saveSite({
        ...site,
        published: true,
        updatedAt: new Date().toISOString(),
      })
      alert('Site published successfully!')
      setSite({ ...site, published: true })
    } catch (error) {
      console.error('Failed to publish site:', error)
      alert('Failed to publish site')
    } finally {
      setIsSaving(false)
    }
  }

  if (!site) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading editor...</p>
        </div>
      </div>
    )
  }

  const template = templates[site.templateId]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Editor Toolbar */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/dashboard')}
                className="hover:bg-gray-100"
              >
                ← Back
              </Button>
              <div className="border-l border-gray-300 pl-4">
                <h1 className="text-lg font-bold text-gray-900">{site.title}</h1>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  {template?.name || 'Template'} 
                  <span className="text-gray-300">•</span>
                  {site.published ? (
                    <span className="inline-flex items-center gap-1 text-green-600 font-medium">
                      <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                      Published
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-gray-500">
                      <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                      Draft
                    </span>
                  )}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
                className="border-2 hover:bg-gray-50 font-semibold"
              >
                {isSaving ? 'Saving...' : '💾 Save'}
              </Button>
              <Button
                size="sm"
                onClick={handlePublish}
                disabled={isSaving}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg font-semibold"
              >
                {site.published ? '🚀 Update' : '🚀 Publish'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar - Editor Panel */}
          <aside className="lg:col-span-1">
            <div className="sticky top-28 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              {/* Tabs */}
              <Tabs
                tabs={[
                  { id: 'content', label: '📝 Content' },
                  { id: 'design', label: '🎨 Design' },
                  { id: 'settings', label: '⚙️ Settings' },
                ]}
                activeTab={activeTab}
                onChange={(tabId) => setActiveTab(tabId as EditorTab)}
              />

              {/* Tab Content */}
              <div className="p-6 max-h-[calc(100vh-250px)] overflow-y-auto">
                {activeTab === 'content' && (
                  <ContentPanel
                    data={site.data}
                    onDataChange={(newData: TemplateData) => setSite({ ...site, data: newData })}
                  />
                )}

                {activeTab === 'design' && (
                  <DesignPanel
                    colors={site.settings.colors}
                    fonts={site.settings.fonts}
                    onColorsChange={(colors) => 
                      setSite({ ...site, settings: { ...site.settings, colors } })
                    }
                    onFontsChange={(fonts) =>
                      setSite({ ...site, settings: { ...site.settings, fonts } })
                    }
                  />
                )}

                {activeTab === 'settings' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Site Title
                      </label>
                      <input
                        type="text"
                        value={site.title}
                        onChange={(e) => setSite({ ...site, title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        URL Slug
                      </label>
                      <input
                        type="text"
                        value={site.slug}
                        onChange={(e) => setSite({ ...site, slug: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        yoursite.com/{site.slug}
                      </p>
                    </div>

                    <div className="pt-4 border-t">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        SEO Title
                      </label>
                      <input
                        type="text"
                        value={site.settings.seo?.title || ''}
                        onChange={(e) => setSite({ 
                          ...site, 
                          settings: { 
                            ...site.settings, 
                            seo: { ...site.settings.seo, title: e.target.value } 
                          } 
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        SEO Description
                      </label>
                      <textarea
                        value={site.settings.seo?.description || ''}
                        onChange={(e) => setSite({ 
                          ...site, 
                          settings: { 
                            ...site.settings, 
                            seo: { ...site.settings.seo, description: e.target.value } 
                          } 
                        })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Main - Live Preview */}
          <main className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              {/* Browser Chrome */}
              <div className="bg-gradient-to-r from-gray-100 to-gray-200 px-6 py-4 border-b border-gray-300 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors"></div>
                  </div>
                  <div className="text-center px-4">
                    <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <span>👁️</span> Live Preview
                    </p>
                  </div>
                </div>

                {/* Device View Switcher */}
                <div className="flex gap-1 bg-white rounded-lg p-1 shadow-inner">
                  <button
                    onClick={() => setDeviceView('desktop')}
                    className={`px-4 py-2 text-xs font-semibold rounded transition-all ${
                      deviceView === 'desktop'
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    🖥️ Desktop
                  </button>
                  <button
                    onClick={() => setDeviceView('tablet')}
                    className={`px-4 py-2 text-xs font-semibold rounded transition-all ${
                      deviceView === 'tablet'
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    📱 Tablet
                  </button>
                  <button
                    onClick={() => setDeviceView('mobile')}
                    className={`px-4 py-2 text-xs font-semibold rounded transition-all ${
                      deviceView === 'mobile'
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    📱 Mobile
                  </button>
                </div>
              </div>
              
              {/* Preview */}
              <div className="flex justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-8 min-h-[700px]">
                <div 
                  className={`bg-white transition-all duration-500 ease-in-out ${
                    deviceView === 'mobile' 
                      ? 'w-[375px] max-h-[667px]' 
                      : deviceView === 'tablet'
                      ? 'w-[768px] max-h-[1024px]'
                      : 'w-full max-h-none'
                  }`}
                  style={{ 
                    boxShadow: deviceView !== 'desktop' ? '0 20px 60px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.1)' : 'none',
                    borderRadius: deviceView !== 'desktop' ? '20px' : '0',
                    overflow: 'auto',
                    scrollbarWidth: 'thin',
                  }}
                >
                  {(() => {
                    const TemplateComponent = templateComponents[site.templateId]
                    if (!TemplateComponent) {
                      return (
                        <div className="p-12 text-center">
                          <span className="text-6xl block mb-4">😕</span>
                          <p className="text-gray-500 font-medium">Template not found</p>
                        </div>
                      )
                    }
                    return (
                      <div className={`${deviceView !== 'desktop' ? 'min-h-full' : ''}`}>
                        <TemplateComponent
                          data={site.data}
                          colors={site.settings.colors}
                          fonts={site.settings.fonts}
                        />
                      </div>
                    )
                  })()}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
