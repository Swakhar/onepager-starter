import React, { useState, useCallback } from 'react'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { TemplateData, ColorScheme, FontScheme } from '@/types/template'

interface VisualAIBuilderProps {
  currentData: TemplateData
  currentColors: ColorScheme
  currentFonts: FontScheme
  onApplyChanges: (changes: {
    colors?: ColorScheme
    fonts?: FontScheme
    data?: Partial<TemplateData>
    sectionOrder?: string[]
  }) => void
}

type BuilderMode = 'screenshot' | 'style-transfer' | 'natural-command' | 'suggestions'

export const VisualAIBuilder: React.FC<VisualAIBuilderProps> = ({
  currentData,
  currentColors,
  currentFonts,
  onApplyChanges,
}) => {
  const [mode, setMode] = useState<BuilderMode>('natural-command')
  const [isProcessing, setIsProcessing] = useState(false)
  const [command, setCommand] = useState('')
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null)
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState<any[]>([])
  
  // Style Transfer state
  const [styleInputMode, setStyleInputMode] = useState<'url' | 'screenshot'>('screenshot')
  const [styleReferenceUrl, setStyleReferenceUrl] = useState('')
  const [styleReferenceScreenshot, setStyleReferenceScreenshot] = useState<string | null>(null)
  const [transferOptions, setTransferOptions] = useState({
    colors: true,
    fonts: true,
    layout: true,
    spacing: true,
  })

  // Handle screenshot upload
  const handleScreenshotUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setScreenshotFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setScreenshotPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  // Process screenshot
  const processScreenshot = async () => {
    if (!screenshotFile && !screenshotPreview) {
      setError('Please upload a screenshot first')
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const response = await fetch('/api/ai/visual-builder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'analyze-screenshot',
          imageBase64: screenshotPreview?.split(',')[1],
          currentTemplate: currentData,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze screenshot')
      }

      setResult(data.analysis)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsProcessing(false)
    }
  }

  // Apply analyzed design
  const applyScreenshotDesign = () => {
    if (!result) return

    const changes: any = {}

    if (result.colorPalette) {
      changes.colors = {
        ...currentColors,
        ...result.colorPalette,
      }
    }

    if (result.typography) {
      changes.fonts = {
        heading: result.typography.headingFont || currentFonts.heading,
        body: result.typography.bodyFont || currentFonts.body,
        headingSizes: currentFonts.headingSizes,
      }
    }

    onApplyChanges(changes)
    alert('✨ Design applied successfully! Check your preview.')
    setResult(null)
    setScreenshotFile(null)
    setScreenshotPreview(null)
  }

  // Process natural language command
  const processCommand = async () => {
    if (!command.trim()) {
      setError('Please enter a design command')
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const response = await fetch('/api/ai/visual-builder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'natural-command',
          command,
          currentData,
          currentColors,
          currentFonts,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process command')
      }

      setResult(data)

      // Auto-apply if changes are straightforward
      if (data.changes) {
        applyNaturalCommandChanges(data.changes)
      }
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsProcessing(false)
    }
  }

  // Apply natural command changes
  const applyNaturalCommandChanges = (changes: any) => {
    const updates: any = {}

    // Apply color changes
    if (changes.colors) {
      updates.colors = {
        ...currentColors,
        ...changes.colors,
      }
    }

    // Apply font changes
    if (changes.fonts) {
      updates.fonts = {
        ...currentFonts,
        ...changes.fonts,
      }
    }

    // Apply content changes
    if (changes.content) {
      updates.data = {
        ...currentData,
      }

      // Update hero content
      if (changes.content.hero) {
        updates.data.hero = {
          ...currentData.hero,
          ...changes.content.hero,
        }
      }

      // Update about content
      if (changes.content.about) {
        updates.data.about = {
          ...currentData.about,
          ...changes.content.about,
        }
      }

      // Update any other content sections
      Object.keys(changes.content).forEach((key) => {
        if (key !== 'hero' && key !== 'about') {
          updates.data[key] = {
            ...currentData[key],
            ...changes.content[key],
          }
        }
      })
    }

    // Apply layout changes
    if (changes.layout) {
      updates.data = updates.data || { ...currentData }

      if (changes.layout.sectionOrder) {
        updates.data.sectionOrder = changes.layout.sectionOrder
      }

      if (changes.layout.spacing) {
        updates.data.spacing = changes.layout.spacing
      }

      if (changes.layout.alignment) {
        updates.data.alignment = changes.layout.alignment
      }
    }

    // Apply component changes (add/remove sections)
    if (changes.components) {
      updates.data = updates.data || { ...currentData }

      // Add new sections
      if (changes.components.add && Array.isArray(changes.components.add)) {
        const currentOrder = updates.data.sectionOrder || currentData.sectionOrder || []
        const newSections = changes.components.add.filter((s: string) => !currentOrder.includes(s))
        if (newSections.length > 0) {
          updates.data.sectionOrder = [...currentOrder, ...newSections]
        }
      }

      // Remove sections
      if (changes.components.remove && Array.isArray(changes.components.remove)) {
        const currentOrder = updates.data.sectionOrder || currentData.sectionOrder || []
        updates.data.sectionOrder = currentOrder.filter((s: string) => !changes.components.remove.includes(s))
      }

      // Modify specific components
      if (changes.components.modify) {
        Object.keys(changes.components.modify).forEach((key) => {
          updates.data[key] = {
            ...updates.data[key],
            ...changes.components.modify[key],
          }
        })
      }
    }

    // Apply animation changes
    if (changes.animations) {
      updates.data = updates.data || { ...currentData }
      updates.data.animations = {
        ...(currentData.animations || {}),
        ...changes.animations,
      }
    }

    onApplyChanges(updates)
  }

  // Process style transfer
  const processStyleTransfer = async () => {
    if (!styleReferenceUrl && !styleReferenceScreenshot) {
      setError('Please provide a reference URL or upload a screenshot')
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const response = await fetch('/api/ai/visual-builder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'style-transfer',
          referenceStyle: styleReferenceScreenshot ? {
            imageBase64: styleReferenceScreenshot.split(',')[1],
          } : {
            url: styleReferenceUrl,
          },
          currentData,
          transferOptions,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to transfer style')
      }

      // Apply transferred style
      const updates: any = {}
      
      if (data.updatedDesign.colorScheme) {
        updates.colors = data.updatedDesign.colorScheme
      }
      
      if (data.updatedDesign.fonts) {
        updates.fonts = {
          heading: data.updatedDesign.fonts.heading || currentFonts.heading,
          body: data.updatedDesign.fonts.body || currentFonts.body,
          headingSizes: currentFonts.headingSizes,
        }
      }
      
      if (data.updatedDesign.layoutChanges) {
        updates.data = {
          ...currentData,
          ...data.updatedDesign.layoutChanges,
        }
      }

      onApplyChanges(updates)
      setResult(data.updatedDesign)
      alert('✨ Style transferred successfully! Check your preview.')
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsProcessing(false)
    }
  }

  // Get smart suggestions
  const getSmartSuggestions = async () => {
    setIsProcessing(true)
    setError(null)

    try {
      const response = await fetch('/api/ai/visual-builder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'smart-suggestions',
          currentData,
          analytics: {}, // TODO: Pass real analytics
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get suggestions')
      }

      setSuggestions(data.suggestions || [])
      setResult(data)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsProcessing(false)
    }
  }

  // Apply a single suggestion
  const applySuggestion = async (suggestion: any) => {
    const { action } = suggestion

    if (!action || !action.type || !action.params) {
      alert('❌ Invalid suggestion: Missing action details')
      console.error('Invalid suggestion action:', suggestion)
      return
    }

    try {
      const updates: any = {}

      switch (action.type) {
        case 'apply-color':
          // Apply color changes
          updates.colors = {
            ...currentColors,
            ...action.params,
          }
          break

        case 'apply-font':
          // Apply font changes
          updates.fonts = {
            ...currentFonts,
            heading: action.params.heading || currentFonts.heading,
            body: action.params.body || currentFonts.body,
          }
          break

        case 'reorder-sections':
          // Reorder sections
          if (action.params.order && Array.isArray(action.params.order)) {
            updates.data = {
              ...currentData,
              sectionOrder: action.params.order,
            }
          }
          break

        case 'add-section':
          // Add new section
          if (action.params.section) {
            const currentOrder = currentData.sectionOrder || []
            if (!currentOrder.includes(action.params.section)) {
              updates.data = {
                ...currentData,
                sectionOrder: [...currentOrder, action.params.section],
              }
            }
          }
          break

        case 'update-spacing':
          // Update spacing
          updates.data = {
            ...currentData,
            spacing: action.params.spacing,
          }
          break

        case 'update-content':
          // Update specific section content
          if (action.params.section && action.params.changes) {
            updates.data = {
              ...currentData,
              [action.params.section]: {
                ...currentData[action.params.section],
                ...action.params.changes,
              },
            }
          }
          break

        default:
          alert(`❌ Action type "${action.type}" not yet implemented`)
          return
      }

      // Apply the changes
      onApplyChanges(updates)
      
      // Show success message
      alert(`✅ Applied: ${suggestion.title}`)
      
      // Optionally remove the suggestion from the list
      setSuggestions(suggestions.filter(s => s.id !== suggestion.id))
    } catch (error: any) {
      console.error('Error applying suggestion:', error)
      alert(`❌ Failed to apply suggestion: ${error.message}`)
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-4 text-white">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">🎨</span>
          <div>
            <h3 className="text-lg font-bold">Visual AI Builder</h3>
            <p className="text-sm opacity-90">
              Transform your design with AI-powered visual intelligence
            </p>
          </div>
        </div>
      </div>

      {/* Mode Selector */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setMode('natural-command')}
          className={`p-3 rounded-lg border-2 transition-all ${
            mode === 'natural-command'
              ? 'border-purple-600 bg-purple-50'
              : 'border-gray-200 hover:border-purple-300'
          }`}
        >
          <div className="text-2xl mb-1">💬</div>
          <div className="text-sm font-semibold">Natural Commands</div>
          <div className="text-xs text-gray-500">Tell AI what you want</div>
        </button>

        <button
          onClick={() => setMode('screenshot')}
          className={`p-3 rounded-lg border-2 transition-all ${
            mode === 'screenshot'
              ? 'border-purple-600 bg-purple-50'
              : 'border-gray-200 hover:border-purple-300'
          }`}
        >
          <div className="text-2xl mb-1">📸</div>
          <div className="text-sm font-semibold">Screenshot Analysis</div>
          <div className="text-xs text-gray-500">Upload & recreate</div>
        </button>

        <button
          onClick={() => setMode('style-transfer')}
          className={`p-3 rounded-lg border-2 transition-all ${
            mode === 'style-transfer'
              ? 'border-purple-600 bg-purple-50'
              : 'border-gray-200 hover:border-purple-300'
          }`}
        >
          <div className="text-2xl mb-1">🎭</div>
          <div className="text-sm font-semibold">Style Transfer</div>
          <div className="text-xs text-gray-500">Copy another site's style</div>
        </button>

        <button
          onClick={() => {
            setMode('suggestions')
            getSmartSuggestions()
          }}
          className={`p-3 rounded-lg border-2 transition-all ${
            mode === 'suggestions'
              ? 'border-purple-600 bg-purple-50'
              : 'border-gray-200 hover:border-purple-300'
          }`}
        >
          <div className="text-2xl mb-1">💡</div>
          <div className="text-sm font-semibold">Smart Suggestions</div>
          <div className="text-xs text-gray-500">AI recommendations</div>
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-700">❌ {error}</p>
        </div>
      )}

      {/* Natural Command Mode */}
      {mode === 'natural-command' && (
        <div className="space-y-3">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-700 mb-2">
              <strong>💡 Examples:</strong>
            </p>
            <div className="text-xs text-blue-600 space-y-1">
              <div>• "Make it look like Apple's website but warmer"</div>
              <div>• "Change all buttons to blue"</div>
              <div>• "Make it more professional"</div>
              <div>• "Add more contrast"</div>
              <div>• "Use a playful color scheme"</div>
            </div>
          </div>

          <Textarea
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder="Describe what you want to change... (e.g., 'Make it look more modern with blue colors')"
            rows={4}
            className="w-full"
          />

          <Button
            onClick={processCommand}
            disabled={isProcessing || !command.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
          >
            {isProcessing ? '🔄 Processing...' : '✨ Apply Command'}
          </Button>

          {result && result.explanation && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-2">✅ Changes Applied!</h4>
              <p className="text-sm text-green-700 mb-3">{result.explanation}</p>
              
              {result.additionalSuggestions && result.additionalSuggestions.length > 0 && (
                <div className="mt-3 pt-3 border-t border-green-200">
                  <p className="text-xs font-semibold text-green-900 mb-2">💡 Additional Suggestions:</p>
                  <ul className="space-y-1">
                    {result.additionalSuggestions.map((suggestion: string, index: number) => (
                      <li key={index} className="text-xs text-green-700">• {suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Screenshot Mode */}
      {mode === 'screenshot' && (
        <div className="space-y-3">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-700">
              <strong>📸 Upload a screenshot</strong> of any website and our AI will analyze its design elements (colors, fonts, layout) and apply them to your site.
            </p>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            {screenshotPreview ? (
              <div>
                <img
                  src={screenshotPreview}
                  alt="Screenshot preview"
                  className="max-w-full max-h-64 mx-auto rounded-lg shadow-lg mb-3"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setScreenshotFile(null)
                    setScreenshotPreview(null)
                    setResult(null)
                  }}
                >
                  Remove Screenshot
                </Button>
              </div>
            ) : (
              <label className="cursor-pointer">
                <div className="text-4xl mb-2">📸</div>
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Click to upload screenshot
                </p>
                <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleScreenshotUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {screenshotPreview && !result && (
            <Button
              onClick={processScreenshot}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
            >
              {isProcessing ? '🔍 Analyzing...' : '🔍 Analyze Design'}
            </Button>
          )}

          {result && (
            <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
              <h4 className="font-semibold text-gray-900">🎨 Design Analysis</h4>
              
              {result.description && (
                <p className="text-sm text-gray-600">{result.description}</p>
              )}

              {/* Adaptation Strategy Info */}
              {result.adaptationStrategy && (
                <div className={`rounded-lg p-3 ${
                  result.adaptationStrategy.isCompatible
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-yellow-50 border border-yellow-200'
                }`}>
                  <p className="text-xs font-semibold mb-1 ${
                    result.adaptationStrategy.isCompatible ? 'text-green-900' : 'text-yellow-900'
                  }">
                    {result.adaptationStrategy.isCompatible ? '✅ Compatible Design' : '⚠️ Adaptation Required'}
                  </p>
                  <p className="text-xs mb-2 ${
                    result.adaptationStrategy.isCompatible ? 'text-green-700' : 'text-yellow-700'
                  }">
                    {result.adaptationStrategy.reasoning}
                  </p>
                  {result.adaptationStrategy.recommendations && result.adaptationStrategy.recommendations.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold mb-1 ${
                        result.adaptationStrategy.isCompatible ? 'text-green-900' : 'text-yellow-900'
                      }">
                        Recommendations:
                      </p>
                      <ul className="space-y-1">
                        {result.adaptationStrategy.recommendations.map((rec: string, i: number) => (
                          <li key={i} className="text-xs ${
                            result.adaptationStrategy.isCompatible ? 'text-green-700' : 'text-yellow-700'
                          }">
                            • {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {result.colorPalette && (
                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-2">Colors:</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(result.colorPalette).map(([key, value]: [string, any]) => (
                      <div key={key} className="text-center">
                        <div
                          className="w-12 h-12 rounded border-2 border-gray-200"
                          style={{ backgroundColor: value }}
                        />
                        <p className="text-xs text-gray-500 mt-1">{key}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.typography && (
                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-1">Typography:</p>
                  <p className="text-sm text-gray-600">
                    Heading: {result.typography.headingFont}<br />
                    Body: {result.typography.bodyFont}
                  </p>
                </div>
              )}

              {result.mood && result.industry && (
                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-1">Style:</p>
                  <p className="text-sm text-gray-600">
                    Mood: <span className="capitalize">{result.mood}</span> • Industry: <span className="capitalize">{result.industry}</span>
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={applyScreenshotDesign}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600"
                >
                  ✅ Apply This Design
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setResult(null)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Style Transfer Mode */}
      {mode === 'style-transfer' && (
        <div className="space-y-3">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <p className="text-xs text-purple-700">
              <strong>🎭 Style Transfer:</strong> Copy the visual style from any website while preserving your content.
            </p>
          </div>

          {/* Tab selector: URL or Screenshot */}
          <div className="flex gap-2">
            <button
              onClick={() => setStyleInputMode('url')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                styleInputMode === 'url'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              � Website URL
            </button>
            <button
              onClick={() => setStyleInputMode('screenshot')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                styleInputMode === 'screenshot'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              📸 Screenshot
            </button>
          </div>

          {/* URL Input */}
          {styleInputMode === 'url' && (
            <Input
              value={styleReferenceUrl}
              onChange={(e) => setStyleReferenceUrl(e.target.value)}
              placeholder="https://example.com"
              type="url"
            />
          )}

          {/* Screenshot Upload */}
          {styleInputMode === 'screenshot' && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {styleReferenceScreenshot ? (
                <div>
                  <img
                    src={styleReferenceScreenshot}
                    alt="Style reference"
                    className="max-w-full max-h-32 mx-auto rounded mb-2"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setStyleReferenceScreenshot(null)}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <label className="cursor-pointer">
                  <div className="text-2xl mb-1">📸</div>
                  <p className="text-sm font-medium text-gray-700">Upload reference screenshot</p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const reader = new FileReader()
                        reader.onloadend = () => setStyleReferenceScreenshot(reader.result as string)
                        reader.readAsDataURL(file)
                      }
                    }}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          )}

          {/* Transfer Options */}
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs font-semibold text-gray-700 mb-2">What to transfer:</p>
            <div className="space-y-2">
              {[
                { key: 'colors' as const, label: '🎨 Colors' },
                { key: 'fonts' as const, label: '✏️ Fonts' },
                { key: 'layout' as const, label: '📐 Layout' },
                { key: 'spacing' as const, label: '📏 Spacing' },
              ].map((option) => (
                <label key={option.key} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={transferOptions[option.key]}
                    onChange={(e) =>
                      setTransferOptions({ ...transferOptions, [option.key]: e.target.checked })
                    }
                    className="rounded"
                  />
                  <span className="text-sm">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          <Button
            onClick={processStyleTransfer}
            disabled={isProcessing || (!styleReferenceUrl && !styleReferenceScreenshot)}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
          >
            {isProcessing ? '🔄 Transferring Style...' : '🎭 Transfer Style'}
          </Button>

          {/* Results */}
          {result && result.recommendations && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-2">✅ Style Transferred!</h4>
              {result.recommendations.length > 0 && (
                <>
                  <p className="text-xs font-semibold text-green-900 mb-2">💡 Recommendations:</p>
                  <ul className="space-y-1">
                    {result.recommendations.map((rec: string, i: number) => (
                      <li key={i} className="text-xs text-green-700">• {rec}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Smart Suggestions Mode */}
      {mode === 'suggestions' && (
        <div className="space-y-3">
          {isProcessing ? (
            <div className="text-center py-8">
              <div className="animate-spin text-4xl mb-2">🔄</div>
              <p className="text-sm text-gray-600">Analyzing your design...</p>
            </div>
          ) : suggestions.length > 0 ? (
            <>
              {result?.overallScore && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">Overall Design Score</h4>
                    <span className="text-2xl font-bold text-purple-600">{result.overallScore}/100</span>
                  </div>
                  {result.strengths && result.strengths.length > 0 && (
                    <div className="mb-2">
                      <p className="text-xs font-semibold text-green-700">✅ Strengths:</p>
                      <ul className="text-xs text-gray-600 ml-4">
                        {result.strengths.map((strength: string, i: number) => (
                          <li key={i}>• {strength}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {result.areasToImprove && result.areasToImprove.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-orange-700">📈 Areas to Improve:</p>
                      <ul className="text-xs text-gray-600 ml-4">
                        {result.areasToImprove.map((area: string, i: number) => (
                          <li key={i}>• {area}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={suggestion.id || index}
                    className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                            suggestion.priority === 'high' ? 'bg-red-100 text-red-700' :
                            suggestion.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {suggestion.priority}
                          </span>
                          <span className="text-xs text-gray-500">{suggestion.type}</span>
                        </div>
                        <h5 className="font-semibold text-sm text-gray-900">{suggestion.title}</h5>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{suggestion.description}</p>
                    {suggestion.expectedImpact && (
                      <p className="text-xs text-green-600 mb-2">
                        📈 <strong>Impact:</strong> {suggestion.expectedImpact}
                      </p>
                    )}
                    <Button
                      size="sm"
                      onClick={() => applySuggestion(suggestion)}
                      className="text-xs"
                    >
                      Apply Suggestion
                    </Button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">💡</div>
              <p className="text-sm text-gray-600">No suggestions available yet.</p>
              <Button
                onClick={getSmartSuggestions}
                size="sm"
                className="mt-3"
              >
                Generate Suggestions
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
