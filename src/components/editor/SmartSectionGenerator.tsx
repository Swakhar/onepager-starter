import React, { useState } from 'react'
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

  // Define which sections each template supports
  const templateSections: Record<string, string[]> = {
    'modern-portfolio': ['hero', 'about', 'contact'],
    'business-card': ['hero', 'about', 'contact'],
    'creative-resume': ['hero', 'about', 'contact'],
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
  const sectionTypes = allSectionTypes.map(section => ({
    ...section,
    supported: supportedSectionTypes.includes(section.value)
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

      onSectionGenerated(data.section)
      setIsOpen(false)
      setContext('')
    } catch (error: any) {
      console.error('Section generation error:', error)
      alert(`Failed to generate section: ${error.message}`)
    } finally {
      setIsGenerating(false)
    }
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
                      className={`border-2 rounded-lg p-3 transition-all ${
                        !type.supported
                          ? 'opacity-40 cursor-not-allowed bg-gray-50'
                          : sectionType === type.value
                          ? 'border-green-600 bg-green-600 cursor-pointer'
                          : 'border-gray-200 hover:border-green-300 hover:bg-gray-500 cursor-pointer'
                      }`}
                      title={!type.supported ? 'Not available in current template' : ''}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <span className={`font-medium text-sm ${type.supported ? 'text-gray-900' : 'text-gray-400'}`}>
                          {type.label}
                        </span>
                        {sectionType === type.value && type.supported && (
                          <div className="flex-shrink-0 w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                        {!type.supported && (
                          <span className="text-xs text-gray-400">🔒</span>
                        )}
                      </div>
                      <p className={`text-xs ${type.supported ? 'text-gray-600' : 'text-gray-400'}`}>
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
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-200 flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setIsOpen(false)
                  setContext('')
                }}
                className="flex-1"
                disabled={isGenerating}
              >
                Cancel
              </Button>
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
            </div>
          </div>
        </div>
      )}
    </>
  )
}
