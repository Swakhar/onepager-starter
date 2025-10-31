import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { templates } from '@/config/templates'

export default function TemplatesPage() {
  const categories = Array.from(new Set(Object.values(templates).map(t => t.category)))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <Link href="/">
              <Button variant="ghost">← Back to Home</Button>
            </Link>
            <Link href="/dashboard">
              <Button>Go to Dashboard</Button>
            </Link>
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Template</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Start with a professionally designed template and customize it to match your style
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {categories.map((category) => {
          const categoryTemplates = Object.values(templates).filter(t => t.category === category)
          
          return (
            <section key={category} className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 capitalize">
                {category} Templates
              </h2>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {categoryTemplates.map((template) => (
                  <Card 
                    key={template.id}
                    className="hover:shadow-xl transition-all duration-300 group"
                  >
                    {/* Template Preview */}
                    <div className="aspect-video bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-white/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Link href="/dashboard">
                          <Button size="lg">
                            Use Template
                          </Button>
                        </Link>
                      </div>
                      <span className="text-6xl">
                        {category === 'portfolio' && '💼'}
                        {category === 'resume' && '📄'}
                        {category === 'business' && '💳'}
                        {category === 'landing' && '🚀'}
                      </span>
                    </div>

                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-xl">{template.name}</CardTitle>
                        {template.isPremium && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-medium">
                            Premium
                          </span>
                        )}
                      </div>
                      <CardDescription className="mt-2">
                        {template.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-3">
                        {/* Sections included */}
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">Includes:</p>
                          <div className="flex flex-wrap gap-2">
                            {template.sections.slice(0, 3).map((section) => (
                              <span
                                key={section.id}
                                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                              >
                                {section.name}
                              </span>
                            ))}
                            {template.sections.length > 3 && (
                              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                +{template.sections.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>

                        <Link href="/dashboard">
                          <Button variant="outline" className="w-full group-hover:bg-indigo-50 group-hover:text-indigo-700 group-hover:border-indigo-200">
                            Choose Template
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )
        })}

        {/* CTA Section */}
        <section className="mt-20 text-center bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Can't find what you're looking for?</h2>
          <p className="text-lg mb-8 text-indigo-100">
            More templates are coming soon! Start with one of our existing templates and customize it to your needs.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-50">
              Get Started Now
            </Button>
          </Link>
        </section>
      </main>
    </div>
  )
}
