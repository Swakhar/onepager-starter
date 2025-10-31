import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Site } from '@/types/site'
import { loadAllSites, createNewSite } from '@/lib/storage/siteStorage'
import { templates } from '@/config/templates'
import { modernPortfolioSampleData } from '@/config/sampleData'

export default function DashboardPage() {
  const [sites, setSites] = useState<Site[]>([])

  useEffect(() => {
    const loadedSites = loadAllSites()
    setSites(loadedSites)
  }, [])

  const handleCreateSite = (templateId: string) => {
    const newSite = createNewSite(templateId, `My ${templates[templateId].name}`)
    
    // Add sample data for modern-portfolio
    if (templateId === 'modern-portfolio') {
      newSite.data = modernPortfolioSampleData
    }
    
    // Redirect to editor
    window.location.href = `/editor?siteId=${newSite.id}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Sites</h1>
              <p className="text-gray-600 mt-1">Create and manage your one-page websites</p>
            </div>
            <Link href="/">
              <Button variant="outline">← Back to Home</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Template Selection */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Site</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.values(templates).map((template) => (
              <Card 
                key={template.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => handleCreateSite(template.id)}
              >
                <div className="aspect-video bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                  <span className="text-6xl">{template.category === 'portfolio' ? '💼' : '📄'}</span>
                </div>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {template.name}
                    {template.isPremium && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                        Premium
                      </span>
                    )}
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-2">{template.description}</p>
                </CardHeader>
                <CardContent>
                  <Button className="w-full group-hover:bg-indigo-700">
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Existing Sites */}
        {sites.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Sites</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sites.map((site) => {
                const template = templates[site.templateId]
                return (
                  <Card key={site.id} className="hover:shadow-lg transition-shadow">
                    <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <span className="text-4xl">🌐</span>
                    </div>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between text-lg">
                        {site.title}
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          site.published 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {site.published ? 'Published' : 'Draft'}
                        </span>
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        {template?.name || 'Template'}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        Last updated: {new Date(site.updatedAt).toLocaleDateString()}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
                        <Link href={`/editor?siteId=${site.id}`} className="flex-1">
                          <Button variant="outline" className="w-full">
                            Edit
                          </Button>
                        </Link>
                        <Link href={`/preview/${site.id}`} className="flex-1">
                          <Button className="w-full">
                            View
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </section>
        )}

        {sites.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No sites yet. Create your first site above!</p>
          </div>
        )}
      </main>
    </div>
  )
}
