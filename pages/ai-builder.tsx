import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { toast } from '@/components/ui/Toast'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { createNewSite } from '@/lib/storage/siteStorage'
import { Site } from '@/types/site'

const examplePrompts = [
  {
    icon: '🍕',
    title: 'Restaurant',
    prompt: 'Create a restaurant website with menu, reservations, and contact information. Italian cuisine with elegant design.'
  },
  {
    icon: '💼',
    title: 'Portfolio',
    prompt: 'Build a photography portfolio website showcasing my work with project gallery and client testimonials.'
  },
  {
    icon: '🏢',
    title: 'Business',
    prompt: 'Create a consulting business website with services, about us, case studies, and contact form.'
  },
  {
    icon: '🎨',
    title: 'Creative Agency',
    prompt: 'Design a modern creative agency website with bold colors, showcasing our design services and portfolio.'
  },
  {
    icon: '💪',
    title: 'Fitness',
    prompt: 'Build a fitness trainer website with training programs, testimonials, and booking system.'
  },
  {
    icon: '⚖️',
    title: 'Legal',
    prompt: 'Create a professional law firm website with practice areas, attorney profiles, and consultation booking.'
  },
]

const industryOptions = [
  'Restaurant & Food',
  'Technology',
  'Creative & Design',
  'Professional Services',
  'Health & Wellness',
  'Retail & E-commerce',
  'Education',
  'Real Estate',
  'Other'
]

const toneOptions = [
  { value: 'professional', label: 'Professional', icon: '💼' },
  { value: 'casual', label: 'Casual & Friendly', icon: '😊' },
  { value: 'creative', label: 'Creative & Bold', icon: '🎨' },
  { value: 'modern', label: 'Modern & Minimal', icon: '✨' },
]

export default function AIBuilderPage() {
  const router = useRouter()
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  
  // Advanced options
  const [industry, setIndustry] = useState('')
  const [tone, setTone] = useState('professional')
  const [primaryColor, setPrimaryColor] = useState('#3B82F6')
  
  // Generation progress
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState('')

  const handleExampleClick = (examplePrompt: string) => {
    setPrompt(examplePrompt)
    // Auto-scroll to textarea
    document.getElementById('prompt-textarea')?.focus()
  }

  const simulateProgress = () => {
    const steps = [
      { progress: 20, message: '🔍 Analyzing your requirements...' },
      { progress: 40, message: '🎨 Selecting best template...' },
      { progress: 60, message: '📝 Generating content with AI...' },
      { progress: 80, message: '🎨 Creating color scheme...' },
      { progress: 95, message: '🧩 Assembling components...' },
      { progress: 100, message: '✨ Finalizing your website...' },
    ]

    let currentStepIndex = 0
    const interval = setInterval(() => {
      if (currentStepIndex < steps.length) {
        const step = steps[currentStepIndex]
        setProgress(step.progress)
        setCurrentStep(step.message)
        currentStepIndex++
      } else {
        clearInterval(interval)
      }
    }, 800)

    return interval
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.warning('Please describe your website', 'Tell us what kind of website you want to create')
      return
    }

    setIsGenerating(true)
    setProgress(0)
    setCurrentStep('🚀 Starting AI generation...')

    const progressInterval = simulateProgress()

    try {
      const options = {
        industry: industry || undefined,
        tone: tone as any,
        colors: primaryColor || undefined,
        features: [] as string[],
      }

      // Call the AI site generator API
      const response = await fetch('/api/ai/site-generator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, options }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.details || 'Failed to generate site')
      }

      const data = await response.json()
      
      console.log('✅ Received data from API:', data)
      console.log('📦 Site object:', data.site)
      console.log('📊 Analysis:', data.analysis)
      
      clearInterval(progressInterval)
      setProgress(100)
      setCurrentStep('✅ Website created successfully!')

      // Create a new site with the generated data
      const siteTitle = data.site.title || data.analysis.siteName || 'My Website'
      console.log('📝 Site title:', siteTitle)
      
      const newSite = createNewSite(data.site.templateId, siteTitle)
      console.log('🏗️ New site created:', newSite.id)
      
      // Apply the generated content
      newSite.data = data.site.content
      console.log('📄 Content applied:', Object.keys(newSite.data))
      
      // Apply the generated design
      newSite.settings = {
        ...newSite.settings,
        colors: data.site.design.colors,
        fonts: data.site.design.fonts,
        layout: {
          ...newSite.settings.layout,
          sectionOrder: data.site.sectionOrder,
        },
        seo: {
          ...newSite.settings.seo,
          title: siteTitle,
          description: data.analysis.description || `${siteTitle} - ${data.analysis.industry}`,
        },
      }
      
      console.log('🎨 Settings applied:', newSite.settings)
      
      // Set the title
      newSite.title = siteTitle
      console.log('✅ Final site ready:', { id: newSite.id, title: newSite.title })

      // Save the site
      const { saveSite } = await import('@/lib/storage/siteStorage')
      await saveSite(newSite)

      // Show success message
      toast.success(
        'Website created!',
        'Your AI-generated website is ready. Redirecting to editor...'
      )

      // Redirect to editor after a short delay
      setTimeout(() => {
        router.push(`/editor?siteId=${newSite.id}`)
      }, 1500)

    } catch (error: any) {
      clearInterval(progressInterval)
      console.error('Generation error:', error)
      toast.error(
        'Failed to generate website',
        error.message || 'Please try again with a different description'
      )
      setIsGenerating(false)
      setProgress(0)
      setCurrentStep('')
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
        {/* Header */}
        <header className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
            <div className="flex items-center justify-between mb-6">
              <Link href="/dashboard">
                <Button variant="outline" size="sm" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                  ← Back to Dashboard
                </Button>
              </Link>
            </div>
            
            <div className="text-center">
              <div className="text-6xl mb-4">🤖✨</div>
              <h1 className="text-4xl sm:text-5xl font-bold mb-3">
                AI Website Builder
              </h1>
              <p className="text-xl text-purple-100">
                Describe your dream website, AI builds it in seconds
              </p>
              <div className="flex items-center justify-center gap-6 mt-6 text-sm text-purple-100">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⚡</span>
                  <span>30-60 seconds</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🎨</span>
                  <span>AI-designed</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">✏️</span>
                  <span>Fully editable</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          {/* Main Prompt Section */}
          <Card className="mb-8 border-2 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">What kind of website do you need?</CardTitle>
              <p className="text-gray-600 mt-2">
                Describe your website in detail. The more information you provide, the better the result.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Textarea */}
              <div>
                <textarea
                  id="prompt-textarea"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Example: Create a modern restaurant website with an elegant design. Include a hero section with high-quality food images, an about us section telling our story, a menu showcase with prices, customer testimonials, and a contact form for reservations..."
                  rows={6}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 resize-none text-lg"
                  disabled={isGenerating}
                />
                <div className="text-right text-sm text-gray-500 mt-1">
                  {prompt.length} characters
                </div>
              </div>

              {/* Advanced Options Toggle */}
              <div>
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-2"
                >
                  <span>{showAdvanced ? '▼' : '▶'}</span>
                  Advanced Options (Optional)
                </button>

                {showAdvanced && (
                  <div className="mt-4 p-6 bg-gray-50 rounded-lg space-y-4">
                    {/* Industry */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Industry/Niche
                      </label>
                      <select
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                      >
                        <option value="">Auto-detect from description</option>
                        {industryOptions.map(ind => (
                          <option key={ind} value={ind}>{ind}</option>
                        ))}
                      </select>
                    </div>

                    {/* Tone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Website Tone & Style
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {toneOptions.map(option => (
                          <button
                            key={option.value}
                            onClick={() => setTone(option.value)}
                            className={`p-3 rounded-lg border-2 transition-all ${
                              tone === option.value
                                ? 'border-purple-500 bg-purple-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="text-2xl mb-1">{option.icon}</div>
                            <div className="text-sm font-medium">{option.label}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Primary Color */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Primary Color Preference
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="h-12 w-20 rounded border border-gray-300 cursor-pointer"
                        />
                        <Input
                          type="text"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          placeholder="#3B82F6"
                          className="flex-1"
                        />
                        <span className="text-sm text-gray-500">Optional</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Generate Button */}
              <div>
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                  size="lg"
                  className="w-full text-lg py-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {isGenerating ? (
                    <span className="flex items-center gap-3">
                      <span className="animate-spin">⚙️</span>
                      Generating...
                    </span>
                  ) : (
                    <span className="flex items-center gap-3">
                      <span>✨</span>
                      Generate My Website with AI
                      <span>🚀</span>
                    </span>
                  )}
                </Button>
              </div>

              {/* Progress Indicator */}
              {isGenerating && (
                <div className="space-y-3">
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-purple-600 to-pink-600 h-full transition-all duration-500 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-center text-gray-700 font-medium">
                    {currentStep}
                  </p>
                  <p className="text-center text-sm text-gray-500">
                    This usually takes 30-60 seconds...
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Example Prompts */}
          {!isGenerating && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-center">
                Not sure what to write? Try these examples:
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {examplePrompts.map((example, index) => (
                  <Card
                    key={index}
                    className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-purple-500"
                    onClick={() => handleExampleClick(example.prompt)}
                  >
                    <CardHeader>
                      <div className="text-4xl mb-2">{example.icon}</div>
                      <CardTitle className="text-lg">{example.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {example.prompt}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-4"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleExampleClick(example.prompt)
                        }}
                      >
                        Use This Example
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* How It Works */}
          {!isGenerating && (
            <Card className="mt-12 bg-gradient-to-br from-purple-50 to-pink-50 border-2">
              <CardHeader>
                <CardTitle className="text-2xl text-center">How It Works</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-4xl mb-3">📝</div>
                    <h3 className="font-semibold mb-2">1. Describe</h3>
                    <p className="text-sm text-gray-600">
                      Tell us about your website in natural language
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl mb-3">🤖</div>
                    <h3 className="font-semibold mb-2">2. AI Generates</h3>
                    <p className="text-sm text-gray-600">
                      Our AI creates content, design, and layout
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl mb-3">✏️</div>
                    <h3 className="font-semibold mb-2">3. Customize</h3>
                    <p className="text-sm text-gray-600">
                      Edit anything with our visual editor
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl mb-3">🚀</div>
                    <h3 className="font-semibold mb-2">4. Publish</h3>
                    <p className="text-sm text-gray-600">
                      Launch your website with one click
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </ProtectedRoute>
  )
}
