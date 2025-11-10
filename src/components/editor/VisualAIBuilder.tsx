/**
 * Visual AI Builder Component (Refactored)
 * 
 * Main component for AI-powered visual design features.
 * Modular architecture with 4 modes:
 * - Natural Commands: ChatGPT-like design commands
 * - Screenshot Analysis: Extract design from any website
 * - Style Transfer: Apply reference designs
 * - Smart Suggestions: Expert UX/UI improvements
 */

import React, { useState, useCallback, useMemo } from 'react'
import { ColorScheme, FontScheme, TemplateData } from '@/types/template'
import { useVoiceCommand } from '@/hooks/useVoiceCommand'
import { useCommandHistory } from '@/hooks/useCommandHistory'
import { useSnapshot } from '@/hooks/useSnapshot'
import { NaturalCommandMode } from './ai-builder/NaturalCommandMode'
import { ScreenshotMode } from './ai-builder/ScreenshotMode'
import { StyleTransferMode } from './ai-builder/StyleTransferMode'
import { SmartSuggestionsMode } from './ai-builder/SmartSuggestionsMode'
import { BeforeAfterComparison } from './ai-builder/BeforeAfterComparison'

interface VisualAIBuilderProps {
  currentData: TemplateData
  currentColors: ColorScheme
  currentFonts: FontScheme
  currentSectionOrder: string[]
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
  currentSectionOrder,
  onApplyChanges,
}) => {
  // UI State
  const [mode, setMode] = useState<BuilderMode>('natural-command')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)
  const [showComparison, setShowComparison] = useState(false)

  // Natural Command State
  const [command, setCommand] = useState('')

  // Screenshot Analysis State
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null)
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null)

  // Style Transfer State
  const [styleReferenceScreenshot, setStyleReferenceScreenshot] = useState<string | null>(null)
  const [transferOptions, setTransferOptions] = useState({
    colors: true,
    fonts: true,
    layout: true,
    spacing: true,
  })

  // Smart Suggestions State
  const [suggestions, setSuggestions] = useState<any[]>([])

  // Custom Hooks
  const { commandHistory, favoriteCommands, addToHistory, toggleFavorite } = useCommandHistory()
  const { beforeSnapshot, captureSnapshot, clearSnapshot, hasSnapshot } = useSnapshot()

  // Voice Command
  const { isListening, voiceSupported, startListening } = useVoiceCommand((text) => {
    setCommand(text)
  })

  // Derive actual section order
  const actualSectionOrder = useMemo(() => {
    if (currentSectionOrder && currentSectionOrder.length > 0) {
      return currentSectionOrder
    }
    
    const existingSections: string[] = []
    const sectionKeys = ['hero', 'about', 'skills', 'social', 'contact', 'projects', 'services', 'features', 'testimonials']
    
    sectionKeys.forEach((key) => {
      if (currentData[key]) {
        existingSections.push(key)
      }
    })
    
    return existingSections
  }, [currentSectionOrder, currentData])

  // Restore from snapshot
  const restoreSnapshot = useCallback(() => {
    if (!beforeSnapshot) {
      alert('⚠️ No snapshot available to restore')
      return
    }
    
    onApplyChanges({
      colors: beforeSnapshot.colors,
      fonts: beforeSnapshot.fonts,
      data: beforeSnapshot.data,
      sectionOrder: beforeSnapshot.sectionOrder,
    })
    
    alert('✅ Design restored to before AI changes')
    setShowComparison(false)
    clearSnapshot()
  }, [beforeSnapshot, onApplyChanges, clearSnapshot])

  // Handle screenshot upload
  const handleScreenshotUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setScreenshotFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setScreenshotPreview(reader.result as string)
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
      if (!response.ok) throw new Error(data.error || 'Failed to analyze screenshot')

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

    captureSnapshot(currentColors, currentFonts, currentData, actualSectionOrder)

    const changes: any = {}

    if (result.colorPalette) {
      changes.colors = { ...currentColors, ...result.colorPalette }
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

    captureSnapshot(currentColors, currentFonts, currentData, actualSectionOrder)
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
          currentSectionOrder: actualSectionOrder,
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to process command')

      setResult(data)
      addToHistory(command, data)

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
    let updatedData = { ...currentData }

    if (changes.colors) {
      updates.colors = { ...currentColors, ...changes.colors }
    }

    if (changes.fonts) {
      updates.fonts = { ...currentFonts, ...changes.fonts }
    }

    if (changes.content) {
      if (changes.content.hero) {
        updatedData.hero = { ...currentData.hero, ...changes.content.hero }
      }
      if (changes.content.about) {
        updatedData.about = { ...currentData.about, ...changes.content.about }
      }
      Object.keys(changes.content).forEach((key) => {
        if (key !== 'hero' && key !== 'about') {
          updatedData[key] = { ...currentData[key], ...changes.content[key] }
        }
      })
    }

    if (changes.layout) {
      if (changes.layout.sectionOrder) {
        updatedData.sectionOrder = changes.layout.sectionOrder
      }
    }

    if (changes.components) {
      if (changes.components.add && Array.isArray(changes.components.add)) {
        const currentOrder = actualSectionOrder || []
        changes.components.add.forEach((section: string) => {
          if (!currentOrder.includes(section)) {
            updatedData.sectionOrder = [...currentOrder, section]
          }
        })
      }

      if (changes.components.remove && Array.isArray(changes.components.remove)) {
        let currentOrder = actualSectionOrder || []
        changes.components.remove.forEach((section: string) => {
          currentOrder = currentOrder.filter(s => s !== section)
        })
        updatedData.sectionOrder = currentOrder
      }
    }

    if (changes.animations) {
      updatedData.animations = { ...(currentData.animations || {}), ...changes.animations }
    }

    if (updatedData.sectionOrder) {
      updates.sectionOrder = updatedData.sectionOrder
      delete updatedData.sectionOrder
    }

    if (Object.keys(updatedData).length > 0) {
      updates.data = updatedData
    }

    onApplyChanges(updates)
  }

  // Process style transfer
  const processStyleTransfer = async () => {
    if (!styleReferenceScreenshot) {
      setError('Please upload a reference screenshot')
      return
    }

    captureSnapshot(currentColors, currentFonts, currentData, actualSectionOrder)
    setIsProcessing(true)
    setError(null)

    try {
      const response = await fetch('/api/ai/visual-builder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'style-transfer',
          imageBase64: styleReferenceScreenshot.split(',')[1],
          currentData,
          currentTemplate: {
            template: currentData?.template,
            sectionOrder: currentSectionOrder,
          },
          transferOptions,
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to transfer style')

      const updates: any = {}
      
      if (data.updatedDesign.colorScheme) {
        updates.colors = { ...currentColors, ...data.updatedDesign.colorScheme }
      }
      
      if (data.updatedDesign.fonts) {
        updates.fonts = {
          heading: data.updatedDesign.fonts.heading || currentFonts.heading,
          body: data.updatedDesign.fonts.body || currentFonts.body,
          headingSizes: currentFonts.headingSizes,
        }
      }
      
      if (data.updatedDesign.layoutChanges) {
        updates.data = { ...currentData, ...data.updatedDesign.layoutChanges }
      }

      onApplyChanges(updates)
      setResult(data.updatedDesign)
      alert(`✨ Style transferred successfully!\n\n${data.updatedDesign.explanation || 'Check your preview.'}`)
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
          analytics: {},
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to generate suggestions')

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
      return
    }

    captureSnapshot(currentColors, currentFonts, currentData, actualSectionOrder)

    try {
      const updates: any = {}

      switch (action.type) {
        case 'apply-color':
          updates.colors = { ...currentColors, ...action.params }
          break
          
        case 'apply-font':
          updates.fonts = {
            ...currentFonts,
            heading: action.params.heading || currentFonts.heading,
            body: action.params.body || currentFonts.body,
            headingSizes: currentFonts.headingSizes,
          }
          break
          
        case 'reorder-sections':
          if (action.params.order && Array.isArray(action.params.order)) {
            updates.sectionOrder = action.params.order
          }
          break
          
        case 'add-section':
          if (action.params.section) {
            const currentOrder = actualSectionOrder || []
            if (!currentOrder.includes(action.params.section)) {
              updates.sectionOrder = [...currentOrder, action.params.section]
            }
          }
          break
          
        case 'update-spacing':
          if (action.params.spacing) {
            updates.data = { ...currentData, spacing: action.params.spacing }
          }
          break
          
        case 'update-content':
          if (action.params.section && action.params.changes) {
            updates.data = {
              ...currentData,
              [action.params.section]: {
                ...currentData[action.params.section],
                ...action.params.changes,
              }
            }
          }
          break

        default:
          alert(`⚠️ Unknown action type: ${action.type}`)
          return
      }

      onApplyChanges(updates)
      alert(`✅ Applied: ${suggestion.title}\n\n${suggestion.expectedImpact || 'Change applied successfully'}`)
      setSuggestions(suggestions.filter(s => s.id !== suggestion.id))
    } catch (error: any) {
      alert(`❌ Failed to apply suggestion: ${error.message}`)
    }
  }

  return (
    <div className="space-y-4 visual-ai-builder">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-4 text-white">
        <h3 className="text-lg font-bold mb-1">✨ AI Visual Builder</h3>
        <p className="text-sm opacity-90">
          Let AI help you design with natural language, screenshots, or smart suggestions
        </p>
      </div>

      {/* Mode Selector */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { id: 'natural-command', label: '💬 Natural Commands', desc: 'ChatGPT-like design commands' },
          { id: 'screenshot', label: '📸 Screenshot Analysis', desc: 'Extract design from any site' },
          { id: 'style-transfer', label: '🎭 Style Transfer', desc: 'Copy visual style' },
          { id: 'suggestions', label: '💡 Smart Suggestions', desc: 'Expert UX/UI improvements' },
        ].map((modeOption) => (
          <button
            key={modeOption.id}
            onClick={() => setMode(modeOption.id as BuilderMode)}
            className={`p-3 rounded-lg text-left transition-all ${
              mode === modeOption.id
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            <div className="font-semibold text-sm">{modeOption.label}</div>
            <div className={`text-xs mt-1 ${mode === modeOption.id ? 'text-white opacity-90' : 'text-gray-500'}`}>
              {modeOption.desc}
            </div>
          </button>
        ))}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-700">❌ {error}</p>
        </div>
      )}

      {/* Mode Content */}
      {mode === 'natural-command' && (
        <NaturalCommandMode
          command={command}
          setCommand={setCommand}
          isProcessing={isProcessing}
          isListening={isListening}
          voiceSupported={voiceSupported}
          result={result}
          commandHistory={commandHistory}
          favoriteCommands={favoriteCommands}
          onProcess={processCommand}
          onVoiceStart={startListening}
          onRerunCommand={setCommand}
          onToggleFavorite={toggleFavorite}
        />
      )}

      {mode === 'screenshot' && (
        <ScreenshotMode
          screenshotPreview={screenshotPreview}
          isProcessing={isProcessing}
          result={result}
          onFileUpload={handleScreenshotUpload}
          onRemoveScreenshot={() => {
            setScreenshotFile(null)
            setScreenshotPreview(null)
            setResult(null)
          }}
          onAnalyze={processScreenshot}
          onApply={applyScreenshotDesign}
          onCancel={() => setResult(null)}
        />
      )}

      {mode === 'style-transfer' && (
        <StyleTransferMode
          styleReferenceScreenshot={styleReferenceScreenshot}
          transferOptions={transferOptions}
          isProcessing={isProcessing}
          result={result}
          onScreenshotUpload={(e) => {
            const file = e.target.files?.[0]
            if (file) {
              const reader = new FileReader()
              reader.onloadend = () => setStyleReferenceScreenshot(reader.result as string)
              reader.readAsDataURL(file)
            }
          }}
          onRemoveScreenshot={() => setStyleReferenceScreenshot(null)}
          onTransferOptionsChange={setTransferOptions}
          onTransfer={processStyleTransfer}
        />
      )}

      {mode === 'suggestions' && (
        <SmartSuggestionsMode
          isProcessing={isProcessing}
          suggestions={suggestions}
          result={result}
          onGenerate={getSmartSuggestions}
          onApplySuggestion={applySuggestion}
        />
      )}

      {/* Before/After Comparison */}
      {hasSnapshot && (
        <>
          {!showComparison && (
            <div className="fixed bottom-6 right-6 z-50">
              <button
                onClick={() => setShowComparison(true)}
                className="px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2 font-semibold"
              >
                ⚡ Before/After
              </button>
            </div>
          )}

          {showComparison && beforeSnapshot && (
            <BeforeAfterComparison
              isOpen={showComparison}
              beforeSnapshot={beforeSnapshot}
              currentColors={currentColors}
              currentFonts={currentFonts}
              currentData={currentData}
              currentSectionOrder={actualSectionOrder}
              onClose={() => setShowComparison(false)}
              onRestore={restoreSnapshot}
            />
          )}
        </>
      )}
    </div>
  )
}
