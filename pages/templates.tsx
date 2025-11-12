import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { toast } from '@/components/ui/Toast'
import { Button } from '@/components/ui/Button'
import { Tooltip } from '@/components/ui/Tooltip'
import { TemplatePreviewModal } from '@/components/ui/TemplatePreviewModal'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { templates } from '@/config/templates'
import { modernPortfolioSampleData, businessCardSampleData, creativeResumeSampleData, restaurantElegantSampleData } from '@/config/sampleData'
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
      case 'restaurant': return '🍽️'
      case 'landing': return '🚀'
      default: return '📄'
    }
  }

  const getSampleData = (templateId: string) => {
    switch(templateId) {
      case 'modern-portfolio': return modernPortfolioSampleData
      case 'business-card': return businessCardSampleData
      case 'creative-resume': return creativeResumeSampleData
      case 'restaurant-elegant': return restaurantElegantSampleData
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
      toast.error('Failed to create site. Please try again.')
    } finally {
      setIsCreating(false)
    }
  }

  const currentPreviewTemplate = previewTemplate ? templates[previewTemplate] : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <Link href="/">
              <Button variant="ghost" className="hover:bg-gray-100 -ml-2">
                <span className="text-lg">←</span>
                <span className="ml-2 hidden sm:inline">Back to Home</span>
              </Button>
            </Link>
            <div className="flex gap-2 w-full sm:w-auto">
              <Link href="/login" className="flex-1 sm:flex-initial">
                <Button variant="outline" className="w-full">
                  Sign In
                </Button>
              </Link>
              <Link href="/dashboard" className="flex-1 sm:flex-initial">
                <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/30">
                  Dashboard →
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-semibold mb-4 border border-indigo-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              {filteredTemplates.length} Professional Templates
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
              Choose Your Perfect{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Template
              </span>
            </h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Start with a professionally designed template and customize it to match your unique style in minutes
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Search and Filter */}
        <div className="mb-8 sm:mb-12">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
            {/* Search */}
            <div className="w-full lg:w-96">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-300 bg-white shadow-sm hover:shadow-md transition-all"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl group-focus-within:scale-110 transition-transform">🔍</span>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-all text-sm sm:text-base ${
                  selectedCategory === 'all'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300'
                }`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-all capitalize flex items-center gap-2 text-sm sm:text-base ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 scale-105'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-base sm:text-lg">{getCategoryIcon(category)}</span>
                  <span className="hidden sm:inline">{category}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm sm:text-base text-gray-600">
              <span className="font-semibold text-gray-900">{filteredTemplates.length}</span> {filteredTemplates.length === 1 ? 'template' : 'templates'} found
            </p>
            {(searchQuery || selectedCategory !== 'all') && (
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-16 sm:py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-100 mb-6">
              <span className="text-4xl sm:text-5xl">😕</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">No templates found</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-6">Try adjusting your search or filter</p>
            <Button 
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredTemplates.map((template) => (
              <Card 
                key={template.id}
                className="group hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 hover:border-indigo-200 overflow-hidden bg-white hover:-translate-y-1"
              >
                {/* Template Preview */}
                <div className="relative aspect-video bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 overflow-hidden">
                  {/* Animated Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.3),transparent_50%)] animate-pulse"></div>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/95 via-purple-600/95 to-pink-600/95 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center p-4 sm:p-6">
                    <div className="text-center transform scale-95 group-hover:scale-100 transition-transform duration-500">
                      <p className="text-white text-xs sm:text-sm mb-3 sm:mb-4 font-medium">Ready to customize?</p>
                      <Button 
                        size="lg"
                        onClick={() => handleUseTemplate(template.id, template.name)}
                        disabled={isCreating}
                        className="bg-white text-indigo-600 hover:bg-gray-50 shadow-2xl transform hover:scale-105 transition-all text-sm sm:text-base px-4 sm:px-6"
                      >
                        {isCreating ? '⏳ Creating...' : '✨ Use Template'}
                      </Button>
                    </div>
                  </div>

                  {/* Template Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl sm:text-7xl group-hover:scale-110 transition-transform duration-500">
                      {getCategoryIcon(template.category)}
                    </span>
                  </div>

                  {/* Premium Badge */}
                  {template.isPremium && (
                    <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 animate-pulse">
                      ⭐ <span className="hidden sm:inline">PREMIUM</span>
                    </div>
                  )}

                  {/* Category Badge */}
                  <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 bg-white/95 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full text-xs font-medium text-gray-700 capitalize flex items-center gap-1 shadow-sm">
                    <span className="text-sm">{getCategoryIcon(template.category)}</span>
                    <span className="hidden sm:inline">{template.category}</span>
                  </div>
                </div>

                <CardHeader className="pb-3 px-4 sm:px-6">
                  <CardTitle className="text-lg sm:text-xl group-hover:text-indigo-600 transition-colors leading-tight">
                    {template.name}
                  </CardTitle>
                  <CardDescription className="mt-2 text-xs sm:text-sm leading-relaxed line-clamp-2">
                    {template.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4 px-4 sm:px-6">
                  {/* Sections included */}
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <span>📦</span> <span className="hidden sm:inline">Includes:</span>
                    </p>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {template.sections.slice(0, 3).map((section) => (
                        <span
                          key={section.id}
                          className="text-xs bg-indigo-50 text-indigo-700 px-2 sm:px-3 py-1 rounded-full font-medium border border-indigo-100"
                        >
                          {section.name}
                        </span>
                      ))}
                      {template.sections.length > 3 && (
                        <Tooltip content={`${template.sections.slice(3).map(s => s.name).join(', ')}`}>
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 sm:px-3 py-1 rounded-full font-medium cursor-help">
                            +{template.sections.length - 3}
                          </span>
                        </Tooltip>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <Tooltip content="Preview this template">
                      <Button 
                        onClick={() => setPreviewTemplate(template.id)}
                        variant="outline" 
                        className="flex-1 hover:bg-gray-50 transition-all font-semibold text-sm border-2 hover:border-gray-300"
                      >
                        <span className="sm:hidden">👁️</span>
                        <span className="hidden sm:inline">👁️ Preview</span>
                      </Button>
                    </Tooltip>
                    <Tooltip content="Use this template and start editing">
                      <Button 
                        onClick={() => handleUseTemplate(template.id, template.name)}
                        disabled={isCreating}
                        className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all font-semibold text-sm shadow-lg shadow-indigo-500/30"
                      >
                        {isCreating ? '⏳' : '✨ Use'}
                      </Button>
                    </Tooltip>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <section className="mt-16 sm:mt-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          
          <div className="relative text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/10 backdrop-blur-sm mb-6 animate-bounce">
              <span className="text-4xl sm:text-5xl">🎨</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              Can't find what you're looking for?
            </h2>
            <p className="text-sm sm:text-base md:text-lg mb-6 sm:mb-8 text-indigo-100 max-w-2xl mx-auto px-4">
              More templates are coming soon! Start with one of our existing templates and customize it to your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <Link href="/dashboard">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-white text-indigo-600 hover:bg-gray-50 shadow-2xl transform hover:scale-105 transition-all font-semibold"
                >
                  Get Started Now →
                </Button>
              </Link>
              <Link href="/signup">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="w-full sm:w-auto border-2 border-white text-white hover:bg-white/10 backdrop-blur-sm font-semibold"
                >
                  Sign Up Free
                </Button>
              </Link>
            </div>
            
            {/* Stats */}
            <div className="mt-8 sm:mt-12 grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1">
                  {Object.keys(templates).length}+
                </div>
                <div className="text-xs sm:text-sm text-indigo-200">Templates</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1">5min</div>
                <div className="text-xs sm:text-sm text-indigo-200">Setup Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1">∞</div>
                <div className="text-xs sm:text-sm text-indigo-200">Customization</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="mt-16 sm:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {[
            { icon: '⚡', title: 'Lightning Fast', desc: 'Build your site in minutes' },
            { icon: '🎨', title: 'Fully Customizable', desc: 'Every element is editable' },
            { icon: '📱', title: 'Mobile Responsive', desc: 'Looks great on all devices' },
            { icon: '🚀', title: 'Deploy Instantly', desc: 'Go live with one click' },
          ].map((feature, idx) => (
            <div 
              key={idx}
              className="group p-6 bg-white rounded-xl border-2 border-gray-100 hover:border-indigo-200 hover:shadow-xl transition-all duration-300 text-center"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-indigo-50 to-purple-50 mb-4 group-hover:scale-110 transition-transform">
                <span className="text-2xl">{feature.icon}</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">
                {feature.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600">
                {feature.desc}
              </p>
            </div>
          ))}
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
            backgroundAlt: '#f9fafb',
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
