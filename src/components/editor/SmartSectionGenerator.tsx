import React, { useState } from 'react'
import { toast } from '@/components/ui/Toast'
import { Button } from '../ui/Button'

interface SmartSectionGeneratorProps {
  onSectionGenerated: (section: any) => void
  businessName?: string
  industry?: string
  templateId?: string // Add template awareness
}

export const SmartSectionGenerator: React.FC<SmartSectionGeneratorProps> = ({
  onSectionGenerated,
  businessName,
  industry,
  templateId = 'modern-portfolio',
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [sectionType, setSectionType] = useState('services')
  const [tone, setTone] = useState('professional')
  const [context, setContext] = useState('')
  const [generatedContent, setGeneratedContent] = useState<any>(null)

  // Define which sections each template supports
  const templateSections: Record<string, string[]> = {
    'modern-portfolio': ['hero', 'about', 'services', 'features', 'testimonials', 'contact'],
    'business-card': ['hero', 'about', 'services', 'features', 'testimonials', 'contact'],
    'creative-resume': ['hero', 'about', 'services', 'features', 'testimonials', 'contact'],
  }

  // Template-specific recommendations
  const templateRecommendations: Record<string, string[]> = {
    'modern-portfolio': ['hero', 'about', 'projects', 'testimonials'],
    'business-card': ['hero', 'about', 'services', 'contact'],
    'creative-resume': ['hero', 'about', 'skills', 'testimonials'],
  }

  // All available section types
  const allSectionTypes = [
    { value: 'hero', label: '🚀 Hero Section', description: 'Main headline and call-to-action', supported: true },
    { value: 'about', label: '👋 About Section', description: 'Company story and mission', supported: true },
    { value: 'services', label: '⚡ Services Section', description: 'What you offer', supported: false },
    { value: 'features', label: '✨ Features Section', description: 'Key benefits and capabilities', supported: false },
    { value: 'testimonials', label: '⭐ Testimonials', description: 'Customer reviews', supported: false },
    { value: 'cta', label: '📢 Call-to-Action', description: 'Conversion-focused section', supported: false },
    { value: 'contact', label: '📧 Contact Section', description: 'How to get in touch', supported: true },
  ]

  // Filter sections based on template
  const supportedSectionTypes = templateSections[templateId] || []
  const recommendedSections = templateRecommendations[templateId] || []
  
  const sectionTypes = allSectionTypes.map(section => ({
    ...section,
    supported: supportedSectionTypes.includes(section.value),
    recommended: recommendedSections.includes(section.value)
  }))

  // Set initial section type to first supported one
  React.useEffect(() => {
    const firstSupported = sectionTypes.find(s => s.supported)?.value
    if (firstSupported && !sectionTypes.find(s => s.value === sectionType)?.supported) {
      setSectionType(firstSupported || 'hero')
    }
  }, [templateId])

  const toneOptions = [
    { value: 'professional', label: 'Professional' },
    { value: 'friendly', label: 'Friendly' },
    { value: 'bold', label: 'Bold & Confident' },
    { value: 'casual', label: 'Casual' },
    { value: 'luxury', label: 'Luxury' },
    { value: 'technical', label: 'Technical' },
  ]

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/ai/generate-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionType,
          industry: industry || 'business',
          businessName: businessName || 'Your Business',
          tone,
          context: context || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate section')
      }

      setGeneratedContent(data.section)
      onSectionGenerated(data.section)
      // Don't close modal, show export options
    } catch (error: any) {
      console.error('Section generation error:', error)
      toast.error(`Failed to generate section: ${error.message}`)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleExport = (format: 'json' | 'markdown' | 'text') => {
    if (!generatedContent) return

    let content = ''
    
    switch (format) {
      case 'json':
        content = JSON.stringify(generatedContent, null, 2)
        break
      case 'markdown':
        content = `# ${generatedContent.title}\n\n`
        if (generatedContent.subtitle) content += `## ${generatedContent.subtitle}\n\n`
        if (generatedContent.content) content += `${generatedContent.content}\n\n`
        if (generatedContent.items) {
          generatedContent.items.forEach((item: any) => {
            content += `### ${item.title}\n${item.description}\n\n`
          })
        }
        break
      case 'text':
        content = `${generatedContent.title}\n\n`
        if (generatedContent.subtitle) content += `${generatedContent.subtitle}\n\n`
        if (generatedContent.content) content += `${generatedContent.content}\n\n`
        if (generatedContent.items) {
          generatedContent.items.forEach((item: any, i: number) => {
            content += `${i + 1}. ${item.title}\n   ${item.description}\n\n`
          })
        }
        break
    }

    // Copy to clipboard
    navigator.clipboard.writeText(content).then(() => {
      toast.success(`Content copied to clipboard as ${format.toUpperCase()}!`)
    })
  }

  const handleClose = () => {
    setIsOpen(false)
    setGeneratedContent(null)
    setContext('')
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white"
      >
        <span className="text-lg mr-2">🤖</span>
        Add AI Section
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[10000] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-5 bg-gradient-to-r from-green-600 to-teal-600">
              <h3 className="font-bold text-white flex items-center gap-2 text-lg">
                <span>🤖</span> AI Section Generator
              </h3>
              <p className="text-sm text-green-100 mt-1">
                Generate complete sections with AI-powered content
              </p>
            </div>

            <div className="p-6 space-y-5">
              {/* Section Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Choose Section Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {sectionTypes.map((type) => (
                    <div
                      key={type.value}
                      onClick={() => type.supported && setSectionType(type.value)}
                      className={`border-2 rounded-lg p-3 transition-all relative ${
                        !type.supported
                          ? 'opacity-40 cursor-not-allowed bg-gray-50'
                          : sectionType === type.value
                          ? 'border-green-600 bg-green-500 cursor-pointer'
                          : 'border-gray-200 hover:border-green-300 hover:bg-gray-50 cursor-pointer'
                      }`}
                      title={!type.supported ? 'Not available in current template' : ''}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <span className={`font-medium text-sm ${type.supported ? 'text-gray-900' : 'text-gray-400'}`}>
                            {type.label}
                          </span>
                          {type.recommended && (
                            <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-blue-100 text-blue-700 rounded">
                              Recommended
                            </span>
                          )}
                        </div>
                        {sectionType === type.value && type.supported && (
                          <div className="flex-shrink-0 w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                        {!type.supported && (
                          <span className="text-xs text-gray-400">🔒</span>
                        )}
                      </div>
                      <p className={`text-xs ${type.supported ? 'text-white' : 'text-gray-400'}`}>
                        {type.description}
                      </p>
                    </div>
                  ))}
                </div>
                
                {/* Show info about unsupported sections */}
                {sectionTypes.some(s => !s.supported) && (
                  <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <span className="text-amber-600 text-sm">💡</span>
                      <p className="text-xs text-amber-800">
                        Some sections are disabled because they're not available in your current template.
                        You can still generate them for inspiration and copy the content manually.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Tone Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content Tone
                </label>
                <div className="flex flex-wrap gap-2">
                  {toneOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setTone(option.value)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        tone === option.value
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Additional Context */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Context (Optional)
                </label>
                <textarea
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="E.g., 'Focus on sustainability', 'Mention 10+ years experience', 'Highlight fast delivery'..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-sm"
                  rows={3}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Provide specific details you want to include in the section
                </p>
              </div>

              {/* Preview Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">💡</span>
                  <div className="flex-1">
                    <h4 className="font-medium text-blue-900 text-sm mb-1">
                      What will be generated?
                    </h4>
                    <p className="text-xs text-blue-700">
                      AI will create complete content including headings, copy, and structure
                      based on your selections. You can edit everything after generation.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Show generated content preview and export options */}
              {generatedContent && (
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">✅</span>
                    <h4 className="font-bold text-green-900">Content Generated!</h4>
                  </div>
                  
                  <div className="bg-white rounded-lg p-3 mb-3 max-h-48 overflow-y-auto">
                    <h5 className="font-bold text-gray-900 mb-1">{generatedContent.title}</h5>
                    {generatedContent.subtitle && (
                      <p className="text-sm text-gray-600 mb-2">{generatedContent.subtitle}</p>
                    )}
                    {generatedContent.content && (
                      <p className="text-xs text-gray-700 mb-2">{generatedContent.content}</p>
                    )}
                    {generatedContent.items && (
                      <div className="space-y-1">
                        {generatedContent.items.slice(0, 3).map((item: any, i: number) => (
                          <div key={i} className="text-xs">
                            <span className="font-medium text-gray-900">{item.title}</span>
                            <span className="text-gray-600"> - {item.description.substring(0, 50)}...</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleExport('json')}
                      className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      📋 Copy JSON
                    </button>
                    <button
                      onClick={() => handleExport('markdown')}
                      className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      📝 Copy Markdown
                    </button>
                    <button
                      onClick={() => handleExport('text')}
                      className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      📄 Copy Text
                    </button>
                  </div>

                  <p className="text-xs text-green-700 mt-2 text-center">
                    💡 Content has been applied. Use export buttons to save for other uses.
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-200 flex gap-3">
              <Button
                variant="outline"
                onClick={handleClose}
                className="flex-1"
                disabled={isGenerating}
              >
                {generatedContent ? 'Close' : 'Cancel'}
              </Button>
              {!generatedContent && (
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
                >
                  {isGenerating ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Generating...
                    </>
                  ) : (
                    <>
                      <span className="mr-2">✨</span>
                      Generate Section
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
