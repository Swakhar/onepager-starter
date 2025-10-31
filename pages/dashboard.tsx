import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Site } from '@/types/site'
import { loadAllSites, createNewSite, deleteSite } from '@/lib/storage/siteStorage'
import { templates } from '@/config/templates'
import { modernPortfolioSampleData, businessCardSampleData, creativeResumeSampleData } from '@/config/sampleData'

type DashboardView = 'templates' | 'sites'

export default function DashboardPage() {
  const [sites, setSites] = useState<Site[]>([])
  const [activeView, setActiveView] = useState<DashboardView>('sites')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadSites = async () => {
      setIsLoading(true)
      try {
        const loadedSites = await loadAllSites()
        setSites(loadedSites)
      } catch (error) {
        console.error('Failed to load sites:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadSites()
  }, [])

  const handleCreateSite = async (templateId: string) => {
    const newSite = createNewSite(templateId, `My ${templates[templateId].name}`)
    
    // Add sample data based on template
    if (templateId === 'modern-portfolio') {
      newSite.data = modernPortfolioSampleData
    } else if (templateId === 'business-card') {
      newSite.data = businessCardSampleData
    } else if (templateId === 'creative-resume') {
      newSite.data = creativeResumeSampleData
    }
    
    // Save the site first
    const { saveSite } = await import('@/lib/storage/siteStorage')
    await saveSite(newSite)
    
    // Update local state
    setSites([newSite, ...sites])
    
    // Redirect to editor
    window.location.href = `/editor?siteId=${newSite.id}`
  }

  const handleDeleteSite = async (siteId: string) => {
    setIsDeleting(true)
    try {
      await deleteSite(siteId)
      setSites(sites.filter(s => s.id !== siteId))
      setDeleteConfirm(null)
    } catch (error) {
      console.error('Failed to delete site:', error)
      alert('Failed to delete site. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  const getTemplateIcon = (category: string) => {
    switch (category) {
      case 'portfolio': return '💼'
      case 'business': return '📇'
      case 'resume': return '📄'
      case 'landing': return '🚀'
      default: return '📄'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Header */}
      <header className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3">
                Welcome to OnePager 👋
              </h1>
              <p className="text-xl text-blue-100 mb-4">
                Create stunning one-page websites in minutes
              </p>
              <div className="flex items-center gap-6 text-sm text-blue-100">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🚀</span>
                  <span>{sites.length} {sites.length === 1 ? 'Site' : 'Sites'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🎨</span>
                  <span>{Object.keys(templates).length} Templates</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⚡</span>
                  <span>Fast & Easy</span>
                </div>
              </div>
            </div>
            <Link href="/">
              <Button 
                variant="outline" 
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                ← Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Tabs Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveView('sites')}
              className={`py-4 px-2 font-medium border-b-2 transition-colors ${
                activeView === 'sites'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="text-xl">🌐</span>
                <span>My Sites ({sites.length})</span>
              </span>
            </button>
            <button
              onClick={() => setActiveView('templates')}
              className={`py-4 px-2 font-medium border-b-2 transition-colors ${
                activeView === 'templates'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="text-xl">✨</span>
                <span>Create New</span>
              </span>
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* My Sites View */}
        {activeView === 'sites' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Your Websites</h2>
                <p className="text-gray-600 mt-1">Manage and edit your published sites</p>
              </div>
              <Button onClick={() => setActiveView('templates')}>
                <span className="mr-2">+</span> Create New Site
              </Button>
            </div>

            {sites.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-300">
                <div className="max-w-md mx-auto">
                  <div className="text-7xl mb-6">🚀</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    No sites yet
                  </h3>
                  <p className="text-gray-600 mb-8">
                    Create your first website in just a few clicks. Choose from our professional templates and start building!
                  </p>
                  <Button size="lg" onClick={() => setActiveView('templates')}>
                    <span className="mr-2">✨</span> Browse Templates
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">{sites.map((site) => {
                  const template = templates[site.templateId]
                  return (
                    <Card
                      key={site.id}
                      className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-500 relative overflow-hidden"
                    >
                      {/* Status Badge */}
                      <div className="absolute top-4 right-4 z-10">
                        {site.published ? (
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full border border-green-200">
                            ✓ Published
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full border border-yellow-200">
                            ● Draft
                          </span>
                        )}
                      </div>

                      {/* Thumbnail */}
                      <div
                        className="aspect-video bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                        <span className="text-6xl relative z-10">
                          {getTemplateIcon(template?.category || 'other')}
                        </span>
                      </div>

                      <CardHeader>
                        <CardTitle className="text-lg">{site.title}</CardTitle>
                        <p className="text-sm text-gray-500 mt-1">
                          {template?.name || 'Unknown Template'}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          Updated {formatDate(site.updatedAt)}
                        </p>
                      </CardHeader>

                      <CardContent>
                        <div className="flex gap-2">
                          <Link href={`/editor?siteId=${site.id}`} className="flex-1">
                            <Button className="w-full" size="sm">
                              ✏️ Edit
                            </Button>
                          </Link>
                          <Link href={`/preview/${site.id}`} className="flex-1">
                            <Button variant="outline" className="w-full" size="sm">
                              👁️ Preview
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteConfirm(site.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            🗑️
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Templates View */}
        {activeView === 'templates' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Choose a Template</h2>
              <p className="text-gray-600 mt-1">Select a professional template to start building your site</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">{Object.values(templates).map((template) => (
                <Card
                  key={template.id}
                  className="hover:shadow-xl transition-all duration-300 cursor-pointer group border-2 hover:border-blue-500 relative overflow-hidden"
                  onClick={() => handleCreateSite(template.id)}
                >
                  {/* Premium Badge */}
                  {template.isPremium && (
                    <div className="absolute top-4 right-4 z-10">
                      <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold rounded-full shadow-lg">
                        ⭐ PREMIUM
                      </span>
                    </div>
                  )}

                  {/* Thumbnail with Hover Effect */}
                  <div className="aspect-video bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all" />
                    <span className="text-7xl relative z-10 group-hover:scale-110 transition-transform">
                      {getTemplateIcon(template.category)}
                    </span>
                  </div>

                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-lg group-hover:text-blue-600 transition-colors">
                      {template.name}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {template.description}
                    </p>
                  </CardHeader>

                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 capitalize">
                        {template.category}
                      </span>
                      <Button
                        size="sm"
                        className="group-hover:bg-blue-600 transition-colors"
                      >
                        Use Template →
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-fadeIn">
            <div className="text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Delete Site?
              </h3>
              <p className="text-gray-600 mb-8">
                Are you sure you want to delete "{sites.find(s => s.id === deleteConfirm)?.title}"? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setDeleteConfirm(null)}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  className="flex-1"
                  onClick={() => handleDeleteSite(deleteConfirm)}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
