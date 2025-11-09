import React, { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { TemplateData, ColorScheme, FontScheme } from '@/types/template'

interface CommandHistoryItem {
  id: string
  command: string
  timestamp: Date
  result: any
}

interface BeforeSnapshot {
  colors: ColorScheme
  fonts: FontScheme
  data: TemplateData
  sectionOrder: string[]
}

interface VisualAIBuilderProps {
  currentData: TemplateData
  currentColors: ColorScheme
  currentFonts: FontScheme
  currentSectionOrder: string[] // ADDED: Current section order from site.settings.layout
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
  currentSectionOrder, // ADDED: Receive current section order
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
  
  // Style Transfer state - SIMPLIFIED: Only screenshot mode (URL input removed)
  const [styleReferenceScreenshot, setStyleReferenceScreenshot] = useState<string | null>(null)
  const [transferOptions, setTransferOptions] = useState({
    colors: true,
    fonts: true,
    layout: true,
    spacing: true,
  })

  // Command History & Favorites state
  const [commandHistory, setCommandHistory] = useState<CommandHistoryItem[]>([])
  const [favoriteCommands, setFavoriteCommands] = useState<string[]>([])

  // Before/After Comparison state
  const [beforeSnapshot, setBeforeSnapshot] = useState<BeforeSnapshot | null>(null)
  const [showComparison, setShowComparison] = useState(false)

  // Voice Command state
  const [isListening, setIsListening] = useState(false)
  const [voiceSupported, setVoiceSupported] = useState(true)

  // CRITICAL FIX: Derive actual section order from data if currentSectionOrder is empty
  // This handles the case where site.settings.layout.sectionOrder is []
  const actualSectionOrder = React.useMemo(() => {
    if (currentSectionOrder && currentSectionOrder.length > 0) {
      return currentSectionOrder
    }
    
    // Derive section order from what actually exists in currentData
    const existingSections: string[] = []
    const sectionKeys = ['hero', 'about', 'skills', 'social', 'contact', 'projects', 'services', 'features', 'testimonials']
    
    sectionKeys.forEach((key) => {
      if (currentData[key]) {
        existingSections.push(key)
      }
    })
    
    return existingSections
  }, [currentSectionOrder, currentData])

  // Check voice support on mount
  useEffect(() => {
    const supported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window
    setVoiceSupported(supported)
  }, [])

  // Load history and favorites from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('ai-builder-history')
    const savedFavorites = localStorage.getItem('ai-builder-favorites')
    
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory)
        // Convert timestamp strings back to Date objects
        const historyWithDates = parsed.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }))
        setCommandHistory(historyWithDates)
      } catch (e) {
        console.error('Failed to load command history:', e)
      }
    }
    
    if (savedFavorites) {
      try {
        setFavoriteCommands(JSON.parse(savedFavorites))
      } catch (e) {
        console.error('Failed to load favorites:', e)
      }
    }
  }, [])

  // Save history to localStorage whenever it changes
  useEffect(() => {
    if (commandHistory.length > 0) {
      localStorage.setItem('ai-builder-history', JSON.stringify(commandHistory))
    }
  }, [commandHistory])

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (favoriteCommands.length > 0) {
      localStorage.setItem('ai-builder-favorites', JSON.stringify(favoriteCommands))
    }
  }, [favoriteCommands])

  // Capture snapshot before applying changes
  const captureSnapshot = useCallback(() => {
    // Deep clone to ensure we capture actual state, not references
    setBeforeSnapshot({
      colors: JSON.parse(JSON.stringify(currentColors)),
      fonts: JSON.parse(JSON.stringify(currentFonts)),
      data: JSON.parse(JSON.stringify(currentData)),
      sectionOrder: JSON.parse(JSON.stringify(actualSectionOrder)), // FIXED: Use actualSectionOrder
    })
    console.log('📸 Snapshot captured:', {
      sections: actualSectionOrder, // FIXED: Log actual section order
      dataKeys: Object.keys(currentData || {}),
    })
  }, [currentColors, currentFonts, currentData, actualSectionOrder])

  // Restore from snapshot
  const restoreSnapshot = () => {
    if (!beforeSnapshot) {
      alert('⚠️ No snapshot available to restore')
      return
    }
    
    console.log('↩️ Restoring snapshot:', {
      sections: beforeSnapshot.sectionOrder, // FIXED: Log actual section order
      dataKeys: Object.keys(beforeSnapshot.data || {}),
    })
    
    console.log('🔍 Restoring with sectionOrder:', beforeSnapshot.sectionOrder)
    console.log('🔍 Data keys being restored:', Object.keys(beforeSnapshot.data))
    
    onApplyChanges({
      colors: beforeSnapshot.colors,
      fonts: beforeSnapshot.fonts,
      data: beforeSnapshot.data,
      sectionOrder: beforeSnapshot.sectionOrder, // ADDED: Restore section order
    })
    
    alert('✅ Design restored to before AI changes')
    setShowComparison(false)
    setBeforeSnapshot(null)
  }

  // Add command to history (smart: avoid duplicates, update timestamp if command exists)
  const addToHistory = useCallback((command: string, result: any) => {
    setCommandHistory(prev => {
      // Check if this command already exists
      const existingIndex = prev.findIndex(item => item.command.toLowerCase().trim() === command.toLowerCase().trim())
      
      if (existingIndex >= 0) {
        // Command exists - update it and move to top
        const updatedItem: CommandHistoryItem = {
          ...prev[existingIndex],
          timestamp: new Date(), // Update timestamp
          result, // Update result
        }
        
        // Remove old entry and add updated one at the top
        const newHistory = [...prev]
        newHistory.splice(existingIndex, 1)
        return [updatedItem, ...newHistory]
      } else {
        // New command - add to top
        const newItem: CommandHistoryItem = {
          id: Date.now().toString(),
          command,
          timestamp: new Date(),
          result,
        }
        
        return [newItem, ...prev.slice(0, 49)] // Keep last 50
      }
    })
  }, [])

  // Toggle favorite
  const toggleFavorite = useCallback((command: string) => {
    setFavoriteCommands(prev => {
      if (prev.includes(command)) {
        return prev.filter(c => c !== command)
      } else {
        return [...prev, command]
      }
    })
  }, [])

  // Voice command support
  const startVoiceInput = useCallback(() => {
    if (!voiceSupported) {
      alert('⚠️ Voice input is not supported in this browser. Please use Chrome, Edge, or Safari.')
      return
    }

    // @ts-ignore - TypeScript doesn't recognize webkit prefix
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'

    recognition.onstart = () => {
      setIsListening(true)
      setError(null)
    }

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setCommand(transcript)
      setIsListening(false)
    }

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
      setIsListening(false)
      
      if (event.error === 'no-speech') {
        setError('No speech detected. Please try again.')
      } else if (event.error === 'not-allowed') {
        setError('Microphone access denied. Please allow microphone access in your browser settings.')
      } else {
        setError(`Voice recognition error: ${event.error}`)
      }
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    try {
      recognition.start()
    } catch (error) {
      console.error('Failed to start speech recognition:', error)
      setIsListening(false)
      setError('Failed to start voice recognition. Please try again.')
    }
  }, [voiceSupported])

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

    // Capture snapshot before applying changes
    captureSnapshot()

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

    // Capture snapshot before making changes
    captureSnapshot()

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

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process command')
      }

      setResult(data)

      // Add to history on success
      addToHistory(command, data)

      // Auto-apply if changes are straightforward
      if (data.changes) {
        applyNaturalCommandChanges(data.changes)
        
        // Show success message based on what changed
        let message = '✅ Changes Applied!'
        if (data.changes.components?.remove) {
          message += `\n\n📦 Hidden sections: ${data.changes.components.remove.join(', ')}`
          message += '\n\n💡 Note: Section data is preserved. You can re-add it anytime from the Content panel.'
        }
        if (data.changes.components?.add) {
          message += `\n\n➕ Added sections: ${data.changes.components.add.join(', ')}`
        }
        if (data.changes.colors) {
          const changedColors = Object.keys(data.changes.colors).join(', ')
          message += `\n\n🎨 Updated colors: ${changedColors}`
        }
        if (data.changes.fonts) {
          message += `\n\n✍️ Updated fonts`
        }
        if (data.changes.content) {
          const changedSections = Object.keys(data.changes.content).join(', ')
          message += `\n\n📝 Updated content in: ${changedSections}`
        }
        
        message += `\n\n${data.explanation || ''}`
        
        if (data.additionalSuggestions && data.additionalSuggestions.length > 0) {
          message += `\n\n💡 Suggestions:\n${data.additionalSuggestions.map((s: string) => `• ${s}`).join('\n')}`
        }
        
        alert(message)
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

    // CRITICAL: Always start with full current data to preserve everything
    let updatedData = { ...currentData }

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
      // Update hero content
      if (changes.content.hero) {
        updatedData.hero = {
          ...currentData.hero,
          ...changes.content.hero,
        }
      }

      // Update about content
      if (changes.content.about) {
        updatedData.about = {
          ...currentData.about,
          ...changes.content.about,
        }
      }

      // Update any other content sections
      Object.keys(changes.content).forEach((key) => {
        if (key !== 'hero' && key !== 'about') {
          updatedData[key] = {
            ...currentData[key],
            ...changes.content[key],
          }
        }
      })
    }

    // Apply layout changes
    if (changes.layout) {
      if (changes.layout.sectionOrder) {
        updatedData.sectionOrder = changes.layout.sectionOrder
      }

      if (changes.layout.spacing) {
        updatedData.spacing = changes.layout.spacing
      }

      if (changes.layout.alignment) {
        updatedData.alignment = changes.layout.alignment
      }
    }

    // Apply component changes (add/remove sections)
    if (changes.components) {
      // Add new sections
      if (changes.components.add && Array.isArray(changes.components.add)) {
        // FIXED: Use actualSectionOrder
        const currentOrder = actualSectionOrder || []
        const newSections = changes.components.add.filter((s: string) => !currentOrder.includes(s))
        if (newSections.length > 0) {
          updatedData.sectionOrder = [...currentOrder, ...newSections]
        }
      }

      // Remove sections (ONLY from sectionOrder, data is preserved!)
      if (changes.components.remove && Array.isArray(changes.components.remove)) {
        // FIXED: Use actualSectionOrder, not currentSectionOrder prop
        const currentOrder = actualSectionOrder || []
        
        console.log('🔍 Before removal - Current order:', currentOrder)
        console.log('🔍 Sections to remove:', changes.components.remove)
        
        // Filter out removed sections from order
        updatedData.sectionOrder = currentOrder.filter((s: string) => 
          !changes.components.remove.includes(s)
        )
        
        console.log('🔍 After removal - New order:', updatedData.sectionOrder)
        
        // CRITICAL: Explicitly preserve ALL original data for ALL sections
        // This ensures removed sections keep their data
        Object.keys(currentData).forEach((key) => {
          if (typeof currentData[key] === 'object' && currentData[key] !== null) {
            // Preserve all section data (hero, about, projects, etc.)
            if (!updatedData[key]) {
              updatedData[key] = currentData[key]
            }
          }
        })
        
        console.log('✅ Hidden sections (data preserved):', changes.components.remove)
        console.log('✅ New section order:', updatedData.sectionOrder)
        console.log('✅ All data keys preserved:', Object.keys(updatedData))
      }

      // Modify specific components
      if (changes.components.modify) {
        Object.keys(changes.components.modify).forEach((key) => {
          updatedData[key] = {
            ...updatedData[key],
            ...changes.components.modify[key],
          }
        })
      }
    }

    // Apply animation changes
    if (changes.animations) {
      updatedData.animations = {
        ...(currentData.animations || {}),
        ...changes.animations,
      }
    }

    // CRITICAL FIX: sectionOrder should be passed separately, not inside data
    if (updatedData.sectionOrder) {
      updates.sectionOrder = updatedData.sectionOrder
      // Remove sectionOrder from data object
      delete updatedData.sectionOrder
    }

    // Assign the final data object
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

    // Capture snapshot before applying changes
    captureSnapshot()

    setIsProcessing(true)
    setError(null)

    try {
      // UPDATED: Use the same screenshot analysis approach
      // This works for ANY website (not just popular ones)
      const response = await fetch('/api/ai/visual-builder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'style-transfer',
          imageBase64: styleReferenceScreenshot.split(',')[1], // Remove data:image/... prefix
          currentData,
          currentTemplate: {
            template: currentData?.template,
            sectionOrder: currentSectionOrder,
          },
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

    // Capture snapshot before applying changes
    captureSnapshot()

    try {
      const updates: any = {}

      switch (action.type) {
        case 'apply-color':
          // Apply color changes
          updates.colors = {
            ...currentColors,
            ...action.params,
          }
          console.log('✅ Applying color changes:', action.params)
          break

        case 'apply-font':
          // Apply font changes
          updates.fonts = {
            ...currentFonts,
            heading: action.params.heading || currentFonts.heading,
            body: action.params.body || currentFonts.body,
            headingSizes: currentFonts.headingSizes, // Preserve heading sizes
          }
          console.log('✅ Applying font changes:', action.params)
          break

        case 'reorder-sections':
          // FIXED: Pass sectionOrder separately, not inside data
          if (action.params.order && Array.isArray(action.params.order)) {
            updates.sectionOrder = action.params.order
            console.log('✅ Reordering sections:', action.params.order)
          }
          break

        case 'add-section':
          // FIXED: Add to actualSectionOrder, not data.sectionOrder
          if (action.params.section) {
            const currentOrder = actualSectionOrder || []
            if (!currentOrder.includes(action.params.section)) {
              updates.sectionOrder = [...currentOrder, action.params.section]
              console.log('✅ Adding section:', action.params.section)
            } else {
              console.log('ℹ️ Section already exists:', action.params.section)
            }
          }
          break

        case 'update-spacing':
          // Update spacing in data
          updates.data = {
            ...currentData,
            spacing: action.params.spacing,
          }
          console.log('✅ Updating spacing:', action.params.spacing)
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
            console.log('✅ Updating content:', action.params.section, action.params.changes)
          }
          break

        default:
          alert(`❌ Action type "${action.type}" not yet implemented`)
          console.error('Unsupported action type:', action.type)
          return
      }

      // Apply the changes
      onApplyChanges(updates)
      
      // Show success message with details
      const changeType = action.type.replace('apply-', '').replace('-', ' ')
      alert(`✅ Applied: ${suggestion.title}\n\n${suggestion.expectedImpact || 'Change applied successfully'}`)
      
      // Remove the suggestion from the list
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

          {/* Command Input with Voice Button */}
          <div className="relative">
            <Textarea
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              placeholder="Describe what you want to change... (or click the mic to speak)"
              rows={4}
              className="w-full pr-12"
            />
            
            {/* Voice Input Button */}
            {voiceSupported && (
              <button
                onClick={startVoiceInput}
                disabled={isProcessing || isListening}
                className={`absolute bottom-3 right-3 p-2 rounded-full transition-all ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
                title={isListening ? 'Listening...' : 'Click to speak'}
                type="button"
              >
                🎤
              </button>
            )}
          </div>

          {/* Listening Indicator */}
          {isListening && (
            <div className="text-center py-2 bg-red-50 border border-red-200 rounded-lg">
              <span className="inline-flex items-center gap-2 text-sm text-red-600">
                <span className="animate-pulse">🔴</span>
                <span className="font-semibold">Listening... Speak now</span>
              </span>
              <p className="text-xs text-red-500 mt-1">Speak clearly and naturally</p>
            </div>
          )}

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

          {/* Command History Panel */}
          {commandHistory.length > 0 && (
            <div className="mt-4">
              <details className="group">
                <summary className="cursor-pointer text-sm font-semibold text-gray-700 hover:text-gray-900 flex items-center justify-between p-2 rounded hover:bg-gray-50">
                  <span>📜 Command History ({commandHistory.length})</span>
                  <span className="text-xs text-gray-500 group-open:hidden">Click to expand</span>
                </summary>
                <div className="mt-2 space-y-2 max-h-64 overflow-y-auto border rounded-lg p-2 bg-gray-50">
                  {commandHistory.map((item) => (
                    <div key={item.id} className="bg-white rounded p-3 text-xs border border-gray-200 hover:border-gray-300 transition-all">
                      <div className="flex items-start justify-between gap-2">
                        <p className="flex-1 text-gray-700 font-medium">"{item.command}"</p>
                        <div className="flex gap-1">
                          <button
                            onClick={() => {
                              setCommand(item.command)
                              window.scrollTo({ top: 0, behavior: 'smooth' })
                            }}
                            className="px-2 py-1 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded text-xs transition-all"
                            title="Use this command"
                          >
                            ↻
                          </button>
                          <button
                            onClick={() => toggleFavorite(item.command)}
                            className={`px-2 py-1 rounded text-xs transition-all ${
                              favoriteCommands.includes(item.command)
                                ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                            title={favoriteCommands.includes(item.command) ? 'Remove from favorites' : 'Add to favorites'}
                          >
                            ★
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-500 mt-1">
                        {item.timestamp.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </details>
            </div>
          )}

          {/* Favorites Panel */}
          {favoriteCommands.length > 0 && (
            <div className="mt-2">
              <details className="group">
                <summary className="cursor-pointer text-sm font-semibold text-gray-700 hover:text-gray-900 flex items-center justify-between p-2 rounded hover:bg-gray-50">
                  <span>⭐ Favorite Commands ({favoriteCommands.length})</span>
                  <span className="text-xs text-gray-500 group-open:hidden">Click to expand</span>
                </summary>
                <div className="mt-2 flex flex-wrap gap-2">
                  {favoriteCommands.map((cmd, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setCommand(cmd)
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                      }}
                      className="px-3 py-2 bg-yellow-50 hover:bg-yellow-100 rounded-lg text-xs text-gray-700 border border-yellow-200 hover:border-yellow-300 transition-all flex items-center gap-2"
                    >
                      <span>⭐</span>
                      <span>{cmd}</span>
                    </button>
                  ))}
                </div>
              </details>
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

          {/* Screenshot Upload - SIMPLIFIED: Screenshot only, no URL input */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              📸 Upload Reference Screenshot
            </p>
            <p className="text-xs text-gray-500 mb-3">
              Take a screenshot of any website you like. Works for ANY site (popular or not)!
            </p>
            <div className="border-2 border-dashed border-purple-300 rounded-lg p-6 text-center bg-purple-50">
              {styleReferenceScreenshot ? (
                <div>
                  <img
                    src={styleReferenceScreenshot}
                    alt="Style reference"
                    className="max-w-full max-h-32 mx-auto rounded mb-2 border-2 border-purple-200"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setStyleReferenceScreenshot(null)}
                  >
                    🗑️ Remove
                  </Button>
                </div>
              ) : (
                <label className="cursor-pointer">
                  <div className="text-4xl mb-2">🎨</div>
                  <p className="text-sm font-medium text-gray-700">Click to upload screenshot</p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                  <p className="text-xs text-purple-600 mt-2">
                    ✨ Works for any website - not just popular ones!
                  </p>
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
          </div>

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
            disabled={isProcessing || !styleReferenceScreenshot}
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

      {/* Before/After Comparison Toggle Button */}
      {beforeSnapshot && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2 font-semibold"
          >
            {showComparison ? '✕ Close Comparison' : '⚡ Before/After'}
          </button>
        </div>
      )}

      {/* Before/After Comparison Modal */}
      {showComparison && beforeSnapshot && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Before/After Comparison</h3>
                <div className="flex gap-2">
                  <button
                    onClick={restoreSnapshot}
                    className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium transition-all"
                  >
                    ↺ Restore Before
                  </button>
                  <button
                    onClick={() => setShowComparison(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl px-2"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Before Column */}
                <div>
                  <h4 className="font-semibold mb-3 text-red-600 text-center">Before Changes</h4>
                  <div className="border rounded-lg p-4 bg-gray-50 space-y-4">
                    {/* Colors */}
                    <div>
                      <p className="text-xs font-semibold text-gray-700 mb-2">🎨 Colors:</p>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-xs">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-6 h-6 rounded border" 
                              style={{ backgroundColor: beforeSnapshot.colors.primary }}
                            />
                            <span className="text-gray-600">Primary</span>
                          </div>
                        </div>
                        <div className="text-xs">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-6 h-6 rounded border" 
                              style={{ backgroundColor: beforeSnapshot.colors.secondary }}
                            />
                            <span className="text-gray-600">Secondary</span>
                          </div>
                        </div>
                        <div className="text-xs">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-6 h-6 rounded border" 
                              style={{ backgroundColor: beforeSnapshot.colors.accent }}
                            />
                            <span className="text-gray-600">Accent</span>
                          </div>
                        </div>
                        <div className="text-xs">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-6 h-6 rounded border" 
                              style={{ backgroundColor: beforeSnapshot.colors.background }}
                            />
                            <span className="text-gray-600">Background</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Fonts */}
                    <div>
                      <p className="text-xs font-semibold text-gray-700 mb-2">✏️ Fonts:</p>
                      <div className="space-y-1 text-xs text-gray-600">
                        <div>Heading: <span className="font-semibold">{beforeSnapshot.fonts.heading}</span></div>
                        <div>Body: <span className="font-semibold">{beforeSnapshot.fonts.body}</span></div>
                      </div>
                    </div>

                    {/* Content Preview */}
                    <div>
                      <p className="text-xs font-semibold text-gray-700 mb-2">📝 Hero Content:</p>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div className="truncate">Title: {beforeSnapshot.data.hero?.title || 'N/A'}</div>
                        <div className="truncate">Subtitle: {beforeSnapshot.data.hero?.subtitle || 'N/A'}</div>
                      </div>
                    </div>

                    {/* Section Order */}
                    {beforeSnapshot.sectionOrder && (
                      <div>
                        <p className="text-xs font-semibold text-gray-700 mb-2">📐 Section Order:</p>
                        <div className="text-xs text-gray-600">
                          {beforeSnapshot.sectionOrder.join(' → ')}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* After Column */}
                <div>
                  <h4 className="font-semibold mb-3 text-green-600 text-center">After AI Changes</h4>
                  <div className="border rounded-lg p-4 bg-gray-50 space-y-4">
                    {/* Colors */}
                    <div>
                      <p className="text-xs font-semibold text-gray-700 mb-2">🎨 Colors:</p>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-xs">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-6 h-6 rounded border" 
                              style={{ backgroundColor: currentColors.primary }}
                            />
                            <span className="text-gray-600">Primary</span>
                          </div>
                        </div>
                        <div className="text-xs">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-6 h-6 rounded border" 
                              style={{ backgroundColor: currentColors.secondary }}
                            />
                            <span className="text-gray-600">Secondary</span>
                          </div>
                        </div>
                        <div className="text-xs">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-6 h-6 rounded border" 
                              style={{ backgroundColor: currentColors.accent }}
                            />
                            <span className="text-gray-600">Accent</span>
                          </div>
                        </div>
                        <div className="text-xs">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-6 h-6 rounded border" 
                              style={{ backgroundColor: currentColors.background }}
                            />
                            <span className="text-gray-600">Background</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Fonts */}
                    <div>
                      <p className="text-xs font-semibold text-gray-700 mb-2">✏️ Fonts:</p>
                      <div className="space-y-1 text-xs text-gray-600">
                        <div>Heading: <span className="font-semibold">{currentFonts.heading}</span></div>
                        <div>Body: <span className="font-semibold">{currentFonts.body}</span></div>
                      </div>
                    </div>

                    {/* Content Preview */}
                    <div>
                      <p className="text-xs font-semibold text-gray-700 mb-2">📝 Hero Content:</p>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div className="truncate">Title: {currentData.hero?.title || 'N/A'}</div>
                        <div className="truncate">Subtitle: {currentData.hero?.subtitle || 'N/A'}</div>
                      </div>
                    </div>

                    {/* Section Order */}
                    {actualSectionOrder && actualSectionOrder.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-700 mb-2">📐 Section Order:</p>
                        <div className="text-xs text-gray-600">
                          {actualSectionOrder.join(' → ')}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Summary of Changes */}
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-semibold text-blue-900 mb-2">📊 Summary of Changes:</p>
                <div className="text-xs text-blue-700 space-y-1">
                  {beforeSnapshot.colors.primary !== currentColors.primary && (
                    <div>✓ Primary color changed from {beforeSnapshot.colors.primary} to {currentColors.primary}</div>
                  )}
                  {beforeSnapshot.fonts.heading !== currentFonts.heading && (
                    <div>✓ Heading font changed from {beforeSnapshot.fonts.heading} to {currentFonts.heading}</div>
                  )}
                  {beforeSnapshot.fonts.body !== currentFonts.body && (
                    <div>✓ Body font changed from {beforeSnapshot.fonts.body} to {currentFonts.body}</div>
                  )}
                  {beforeSnapshot.data.hero?.title !== currentData.hero?.title && (
                    <div>✓ Hero title updated</div>
                  )}
                  {JSON.stringify(beforeSnapshot.sectionOrder) !== JSON.stringify(actualSectionOrder) && (
                    <div>✓ Section order rearranged</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
