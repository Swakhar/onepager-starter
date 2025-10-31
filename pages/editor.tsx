import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import ModernPortfolio from '@/components/templates/modern-portfolio'
import { Button } from '@/components/ui/Button'
import { Input, Label } from '@/components/ui/Input'
import { Site } from '@/types/site'
import { templates } from '@/config/templates'
import { modernPortfolioSampleData } from '@/config/sampleData'
import { saveSite, loadSite, createNewSite } from '@/lib/storage/siteStorage'

export default function EditorPage() {
  const router = useRouter()
  const { siteId } = router.query
  
  const [site, setSite] = useState<Site | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    // Load site from storage or create new one
    if (siteId && typeof siteId === 'string') {
      const loaded = loadSite(siteId)
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
    <div className="min-h-screen bg-gray-50">
      {/* Editor Toolbar */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/dashboard')}
              >
                ← Back
              </Button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{site.title}</h1>
                <p className="text-sm text-gray-500">
                  {template?.name || 'Template'} • {site.published ? 'Published' : 'Draft'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
              <Button
                size="sm"
                onClick={handlePublish}
                disabled={isSaving}
              >
                {site.published ? 'Update' : 'Publish'}
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
            <div className="sticky top-24 bg-white rounded-lg shadow p-6 space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-4">Site Settings</h2>
                
                <div className="space-y-4">
                  <div>
                    <Label>Site Title</Label>
                    <Input
                      value={site.title}
                      onChange={(e) => setSite({ ...site, title: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label>URL Slug</Label>
                    <Input
                      value={site.slug}
                      onChange={(e) => setSite({ ...site, slug: e.target.value })}
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      yoursite.com/{site.slug}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-gray-600">
                  <strong>Note:</strong> Full editor with content editing, color picker, and layout controls coming next!
                </p>
              </div>
            </div>
          </aside>

          {/* Main - Live Preview */}
          <main className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="bg-gray-100 px-4 py-3 border-b flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="flex-1 text-center text-sm text-gray-600">
                  Live Preview
                </div>
              </div>
              
              <div className="overflow-auto max-h-[calc(100vh-200px)]">
                <ModernPortfolio
                  data={site.data}
                  colors={site.settings.colors}
                  fonts={site.settings.fonts}
                />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
