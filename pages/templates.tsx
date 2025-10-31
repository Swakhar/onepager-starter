import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Button } from '@/components/ui/Button'
import { Tooltip } from '@/components/ui/Tooltip'
import { TemplatePreviewModal } from '@/components/ui/TemplatePreviewModal'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { templates } from '@/config/templates'
import { modernPortfolioSampleData, businessCardSampleData, creativeResumeSampleData } from '@/config/sampleData'
import { createNewSite, saveSite } from '@/lib/storage/siteStorage'

export default function TemplatesPage() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null)

  const categories = Array.from(new Set(Object.values(templates).map(t => t.category)))
  
  const filteredTemplates = Object.values(templates).filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'portfolio': return '💼'
      case 'resume': return '📄'
      case 'business': return '💳'
      case 'landing': return '🚀'
      default: return '📄'
    }
  }

  const getSampleData = (templateId: string) => {
    switch(templateId) {
      case 'modern-portfolio': return modernPortfolioSampleData
      case 'business-card': return businessCardSampleData
      case 'creative-resume': return creativeResumeSampleData
      default: return {}
    }
  }

  const handleUseTemplate = async (templateId: string, templateName: string) => {
    setIsCreating(true)
    setPreviewTemplate(null) // Close preview modal
    try {
      const newSite = createNewSite(templateId, `My ${templateName}`)
      newSite.data = getSampleData(templateId)
      await saveSite(newSite)
      router.push(`/editor?siteId=${newSite.id}`)
    } catch (error) {
      console.error('Failed to create site:', error)
      alert('Failed to create site. Please try again.')
    } finally {
      setIsCreating(false)
    }
  }

  const currentPreviewTemplate = previewTemplate ? templates[previewTemplate] : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <Link href="/">
              <Button variant="ghost" className="hover:bg-gray-100">
                ← Back to Home
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                Go to Dashboard
              </Button>
            </Link>
          </div>
          
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Choose Your Perfect <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Template</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Start with a professionally designed template and customize it to match your unique style
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Search and Filter */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="w-full md:w-96">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
                }`}
              >
                All Templates
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all capitalize flex items-center gap-2 ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
                  }`}
                >
                  <span>{getCategoryIcon(category)}</span>
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Results count */}
          <p className="mt-4 text-gray-600">
            {filteredTemplates.length} {filteredTemplates.length === 1 ? 'template' : 'templates'} found
          </p>
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-6xl mb-4 block">😕</span>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filter</p>
            <Button onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemplates.map((template) => (
              <Card 
                key={template.id}
                className="group hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-indigo-200 overflow-hidden bg-white"
              >
                {/* Template Preview */}
                <div className="relative aspect-video bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 overflow-hidden">
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/90 via-purple-600/90 to-pink-600/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center p-6">
                    <div className="text-center">
                      <Button 
                        size="lg"
                        onClick={() => handleUseTemplate(template.id, template.name)}
                        disabled={isCreating}
                        className="bg-white text-indigo-600 hover:bg-gray-50 shadow-xl transform group-hover:scale-110 transition-transform"
                      >
                        {isCreating ? 'Creating...' : 'Use This Template →'}
                      </Button>
                    </div>
                  </div>

                  {/* Template Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-7xl group-hover:scale-110 transition-transform duration-300">
                      {getCategoryIcon(template.category)}
                    </span>
                  </div>

                  {/* Premium Badge */}
                  {template.isPremium && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                      ⭐ PREMIUM
                    </div>
                  )}

                  {/* Category Badge */}
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700 capitalize flex items-center gap-1">
                    <span>{getCategoryIcon(template.category)}</span>
                    {template.category}
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className="text-xl group-hover:text-indigo-600 transition-colors">
                    {template.name}
                  </CardTitle>
                  <CardDescription className="mt-2 text-sm leading-relaxed">
                    {template.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Sections included */}
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <span>📦</span> Includes:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {template.sections.slice(0, 4).map((section) => (
                        <span
                          key={section.id}
                          className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-medium border border-indigo-100"
                        >
                          {section.name}
                        </span>
                      ))}
                      {template.sections.length > 4 && (
                        <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-medium">
                          +{template.sections.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Tooltip content="Preview this template">
                      <Button 
                        onClick={() => setPreviewTemplate(template.id)}
                        variant="outline" 
                        className="flex-1 group-hover:bg-gray-50 transition-all font-semibold"
                      >
                        👁️ Preview
                      </Button>
                    </Tooltip>
                    <Tooltip content="Use this template and start editing">
                      <Button 
                        onClick={() => handleUseTemplate(template.id, template.name)}
                        disabled={isCreating}
                        className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all font-semibold"
                      >
                        {isCreating ? 'Creating...' : 'Use →'}
                      </Button>
                    </Tooltip>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <section className="mt-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/10"></div>
          <div className="relative text-center">
            <span className="text-6xl mb-4 block">🎨</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Can't find what you're looking for?</h2>
            <p className="text-lg mb-8 text-indigo-100 max-w-2xl mx-auto">
              More templates are coming soon! Start with one of our existing templates and customize it to your needs.
            </p>
            <Link href="/dashboard">
              <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-50 shadow-xl transform hover:scale-105 transition-all">
                Get Started Now →
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Template Preview Modal */}
      {currentPreviewTemplate && (
        <TemplatePreviewModal
          templateId={previewTemplate!}
          templateName={currentPreviewTemplate.name}
          sampleData={getSampleData(previewTemplate!)}
          colors={{
            primary: '#6366f1',
            secondary: '#8b5cf6',
            accent: '#ec4899',
            background: '#ffffff',
            text: '#111827',
            textSecondary: '#6b7280',
          }}
          fonts={{
            heading: '"Inter", sans-serif',
            body: '"Inter", sans-serif',
            headingSizes: {
              h1: 'text-4xl md:text-5xl lg:text-6xl',
              h2: 'text-3xl md:text-4xl lg:text-5xl',
              h3: 'text-2xl md:text-3xl lg:text-4xl',
            },
          }}
          isOpen={!!previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          onUseTemplate={() => handleUseTemplate(previewTemplate!, currentPreviewTemplate.name)}
        />
      )}
    </div>
  )
}
