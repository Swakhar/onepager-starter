import React, { useState } from 'react'
import { toast } from '@/components/ui/Toast'
import { ColorPicker } from '../controls/ColorPicker'
import { FontSelector } from '../controls/FontSelector'
import { Button } from '@/components/ui/Button'
import { ColorScheme, FontScheme } from '@/types/template'
import { fontOptions, FontFamily } from '@/config/fonts'

interface DesignPanelProps {
  colors: ColorScheme
  fonts: FontScheme
  onColorsChange: (colors: ColorScheme) => void
  onFontsChange: (fonts: FontScheme) => void
}

export const DesignPanel: React.FC<DesignPanelProps> = ({
  colors,
  fonts,
  onColorsChange,
  onFontsChange,
}) => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [showPaletteModal, setShowPaletteModal] = useState(false)
  const [generatedPalette, setGeneratedPalette] = useState<any>(null)
  const [industry, setIndustry] = useState('')
  const [mood, setMood] = useState('')
  
  const [isGeneratingFonts, setIsGeneratingFonts] = useState(false)
  const [showFontsModal, setShowFontsModal] = useState(false)
  const [generatedFontPairings, setGeneratedFontPairings] = useState<any[]>([])
  const [selectedPairing, setSelectedPairing] = useState<any>(null)

  const handleColorChange = (key: keyof ColorScheme, value: string) => {
    onColorsChange({
      ...colors,
      [key]: value,
    })
  }

  const handleFontChange = (type: 'heading' | 'body', fontKey: FontFamily) => {
    const selectedFont = fontOptions[fontKey]
    onFontsChange({
      ...fonts,
      [type]: selectedFont[type],
    })
  }

  const handleGenerateColors = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/ai/generate-colors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          industry: industry || 'technology',
          mood: mood || 'professional',
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate colors')
      }

      setGeneratedPalette(data.palette)
      setShowPaletteModal(true)
    } catch (error: any) {
      console.error('Color generation error:', error)
      toast.error(`Failed to generate colors: ${error.message}`)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleApplyPalette = () => {
    if (generatedPalette) {
      onColorsChange({
        primary: generatedPalette.primary,
        secondary: generatedPalette.secondary,
        accent: generatedPalette.accent,
        background: generatedPalette.background,
        backgroundAlt: generatedPalette.backgroundAlt || colors.backgroundAlt || generatedPalette.background,
        text: generatedPalette.text,
        textSecondary: colors.textSecondary, // Keep existing
      })
      setShowPaletteModal(false)
    }
  }

  const handleGenerateFonts = async () => {
    setIsGeneratingFonts(true)
    try {
      const response = await fetch('/api/ai/suggest-fonts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          industry: industry || 'technology',
          mood: mood || 'professional',
          currentFonts: {
            heading: fonts.heading,
            body: fonts.body,
          },
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate font pairings')
      }

      setGeneratedFontPairings(data.pairings || [])
      setSelectedPairing(data.pairings?.[0] || null)
      setShowFontsModal(true)
    } catch (error: any) {
      console.error('Font generation error:', error)
      toast.error(`Failed to generate fonts: ${error.message}`)
    } finally {
      setIsGeneratingFonts(false)
    }
  }

  const handleApplyFonts = () => {
    if (selectedPairing) {
      // Find matching font key from fontOptions
      const headingKey = Object.entries(fontOptions).find(
        ([_, font]) => font.heading === selectedPairing.heading
      )?.[0] as FontFamily
      
      const bodyKey = Object.entries(fontOptions).find(
        ([_, font]) => font.body === selectedPairing.body
      )?.[0] as FontFamily

      if (headingKey && bodyKey) {
        onFontsChange({
          heading: fontOptions[headingKey].heading,
          body: fontOptions[bodyKey].body,
          headingSizes: fonts.headingSizes, // Keep existing sizes
        })
        setShowFontsModal(false)
      } else {
        // If fonts not in our library, apply directly
        onFontsChange({
          heading: selectedPairing.heading,
          body: selectedPairing.body,
          headingSizes: fonts.headingSizes, // Keep existing sizes
        })
        setShowFontsModal(false)
      }
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900">Color Scheme</h3>
          <Button
            size="sm"
            onClick={handleGenerateColors}
            disabled={isGenerating}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          >
            {isGenerating ? '⏳ Generating...' : '🎨 AI Generate'}
          </Button>
        </div>
        <div className="space-y-4">
          <ColorPicker
            label="Primary Color"
            value={colors.primary}
            onChange={(value) => handleColorChange('primary', value)}
          />
          <ColorPicker
            label="Secondary Color"
            value={colors.secondary}
            onChange={(value) => handleColorChange('secondary', value)}
          />
          <ColorPicker
            label="Accent Color"
            value={colors.accent}
            onChange={(value) => handleColorChange('accent', value)}
          />
          <ColorPicker
            label="Background"
            value={colors.background}
            onChange={(value) => handleColorChange('background', value)}
          />
          <ColorPicker
            label="Alternate Background"
            value={colors.backgroundAlt || colors.background}
            onChange={(value) => handleColorChange('backgroundAlt', value)}
          />
          <p className="text-xs text-gray-500 -mt-2 pl-1">
            💡 Used for alternating section backgrounds to improve visual separation
          </p>
          <ColorPicker
            label="Text Color"
            value={colors.text}
            onChange={(value) => handleColorChange('text', value)}
          />
          <ColorPicker
            label="Secondary Text"
            value={colors.textSecondary}
            onChange={(value) => handleColorChange('textSecondary', value)}
          />
        </div>
      </div>

      <div className="pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900">Typography</h3>
          <Button
            size="sm"
            onClick={handleGenerateFonts}
            disabled={isGeneratingFonts}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
          >
            {isGeneratingFonts ? '⏳ Generating...' : '✨ AI Suggest Fonts'}
          </Button>
        </div>
        <div className="space-y-4">
          <FontSelector
            label="Heading Font"
            value={
              Object.entries(fontOptions).find(
                ([_, font]) => font.heading === fonts.heading
              )?.[0] as FontFamily || 'modern'
            }
            onChange={(key) => handleFontChange('heading', key)}
          />
          <FontSelector
            label="Body Font"
            value={
              Object.entries(fontOptions).find(
                ([_, font]) => font.body === fonts.body
              )?.[0] as FontFamily || 'modern'
            }
            onChange={(key) => handleFontChange('body', key)}
          />
        </div>
      </div>

      {/* Color Palette Generator Modal */}
      {showPaletteModal && generatedPalette && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[10000] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full overflow-hidden shadow-2xl">
            <div className="p-5 bg-gradient-to-r from-purple-600 to-pink-600">
              <h3 className="font-bold text-white flex items-center gap-2 text-lg">
                <span>🎨</span> {generatedPalette.name}
              </h3>
              <p className="text-sm text-purple-100 mt-1">
                {generatedPalette.description}
              </p>
            </div>

            <div className="p-6 space-y-4">
              {/* Color Preview */}
              <div className="grid grid-cols-5 gap-3">
                {[
                  { label: 'Primary', color: generatedPalette.primary },
                  { label: 'Secondary', color: generatedPalette.secondary },
                  { label: 'Accent', color: generatedPalette.accent },
                  { label: 'Background', color: generatedPalette.background },
                  { label: 'Text', color: generatedPalette.text },
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <div
                      className="w-full aspect-square rounded-lg border-2 border-gray-200 shadow-sm"
                      style={{ backgroundColor: item.color }}
                    />
                    <p className="text-xs font-medium text-gray-700 mt-2">{item.label}</p>
                    <p className="text-xs text-gray-500 font-mono">{item.color}</p>
                  </div>
                ))}
              </div>

              {/* Preview Card */}
              <div className="mt-4 p-4 rounded-lg border-2" style={{ 
                backgroundColor: generatedPalette.background,
                borderColor: generatedPalette.primary
              }}>
                <h4 className="font-bold text-lg mb-2" style={{ color: generatedPalette.primary }}>
                  Preview
                </h4>
                <p className="text-sm mb-3" style={{ color: generatedPalette.text }}>
                  This is how your content will look with the new colors.
                </p>
                <button
                  className="px-4 py-2 rounded-lg font-medium text-sm"
                  style={{ 
                    backgroundColor: generatedPalette.accent,
                    color: generatedPalette.background
                  }}
                >
                  Call to Action
                </button>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-200 flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowPaletteModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleApplyPalette}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                ✓ Apply Palette
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Font Pairing Modal */}
      {showFontsModal && generatedFontPairings.length > 0 && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[10000] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-5 bg-gradient-to-r from-blue-600 to-indigo-600">
              <h3 className="font-bold text-white flex items-center gap-2 text-lg">
                <span>✨</span> AI Font Pairings
              </h3>
              <p className="text-sm text-blue-100 mt-1">
                Choose a professional font combination for your site
              </p>
            </div>

            <div className="p-6 space-y-4">
              {generatedFontPairings.map((pairing, index) => (
                <div
                  key={pairing.id || index}
                  onClick={() => setSelectedPairing(pairing)}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    selectedPairing?.id === pairing.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-lg text-gray-900">{pairing.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{pairing.description}</p>
                    </div>
                    {selectedPairing?.id === pairing.id && (
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-medium text-gray-500">Vibe:</span>
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                      {pairing.vibe}
                    </span>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div>
                      <span className="text-xs text-gray-500">Heading:</span>
                      <div
                        className="text-2xl font-bold mt-1"
                        style={{ fontFamily: pairing.heading }}
                      >
                        {pairing.heading}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Body:</span>
                      <div
                        className="text-base mt-1"
                        style={{ fontFamily: pairing.body }}
                      >
                        {pairing.body} - The quick brown fox jumps over the lazy dog
                      </div>
                    </div>
                  </div>

                  {pairing.bestFor && pairing.bestFor.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {pairing.bestFor.map((use: string, i: number) => (
                        <span
                          key={i}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                        >
                          {use}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-200 flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowFontsModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleApplyFonts}
                disabled={!selectedPairing}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                ✓ Apply Fonts
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
