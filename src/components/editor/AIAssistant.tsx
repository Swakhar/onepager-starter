import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '@/components/ui/Button'

interface AIAssistantProps {
  currentText: string
  onApply: (newText: string) => void
  context?: string
  isTextarea?: boolean // NEW: Flag for textarea styling
}

export function AIAssistant({ currentText, onApply, context, isTextarea = false }: AIAssistantProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedText, setGeneratedText] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleAIAction = async (type: string, customPrompt?: string) => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/ai/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: customPrompt || currentText,
          context,
          type,
        }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate content')
      }

      setGeneratedText(data.text)
      setShowPreview(true)
    } catch (error: any) {
      console.error('AI generation failed:', error)
      alert(`AI generation failed: ${error.message}. Please check your OpenAI API key in .env.local`)
    } finally {
      setIsGenerating(false)
      setShowMenu(false)
    }
  }

  // Update menu position on scroll and resize
  const updateMenuPosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setMenuPosition({
        top: rect.bottom + 8,
        left: rect.left,
      })
    }
  }

  const handleButtonClick = () => {
    if (!showMenu) {
      updateMenuPosition()
    }
    setShowMenu(!showMenu)
  }

  // Listen for scroll and resize events when menu is open
  useEffect(() => {
    if (showMenu) {
      updateMenuPosition()
      window.addEventListener('scroll', updateMenuPosition, true) // true = capture phase (catches all scrolls)
      window.addEventListener('resize', updateMenuPosition)
      
      return () => {
        window.removeEventListener('scroll', updateMenuPosition, true)
        window.removeEventListener('resize', updateMenuPosition)
      }
    }
  }, [showMenu])

  return (
    <>
      {/* AI Button - Different styles for textarea vs input */}
      <Button
        ref={buttonRef}
        variant="outline"
        size="sm"
        onClick={handleButtonClick}
        className={`bg-gradient-to-r from-purple-600/10 to-pink-600/10 border-purple-500/30 hover:border-purple-500/50 text-purple-300 ${
          isTextarea 
            ? 'absolute top-2 right-2 z-10' // Positioned in top-right corner for textareas
            : '' // Inline for inputs
        }`}
        disabled={isGenerating}
      >
        {isGenerating ? (
          <>
            <span className="animate-spin">⏳</span>
            <span className="ml-2">AI</span>
          </>
        ) : (
          <>
            <span>✨</span>
            <span className="ml-2">AI</span>
          </>
        )}
      </Button>

      {/* AI Menu - Rendered via Portal */}
      {showMenu && typeof window !== 'undefined' && createPortal(
        <>
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 z-[9998]" 
            onClick={() => setShowMenu(false)}
          />
          
          {/* Dropdown Menu */}
          <div 
            className="fixed w-64 bg-[#1a1a1a] border-2 border-purple-500/30 rounded-xl shadow-2xl z-[9999] overflow-hidden"
            style={{
              top: `${menuPosition.top}px`,
              left: `${menuPosition.left}px`,
            }}
          >
            <div className="p-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-b border-purple-500/30">
              <h4 className="font-semibold text-white text-sm flex items-center gap-2">
                <span>✨</span> AI Assistant
              </h4>
              <p className="text-xs text-gray-400 mt-0.5">
                {currentText ? 'Improve this text' : 'Generate new content'}
              </p>
            </div>
            
            <div className="p-2 space-y-1">
              {currentText ? (
                <>
                  <button
                    onClick={() => handleAIAction('improve')}
                    className="w-full text-left p-3 rounded-lg hover:bg-[#2a2a2a] transition-colors"
                  >
                    <div className="text-white font-medium text-sm">✨ Improve Writing</div>
                    <div className="text-xs text-gray-400">Make it more professional</div>
                  </button>
                  
                  <button
                    onClick={() => handleAIAction('seo')}
                    className="w-full text-left p-3 rounded-lg hover:bg-[#2a2a2a] transition-colors"
                  >
                    <div className="text-white font-medium text-sm">🔍 Optimize for SEO</div>
                    <div className="text-xs text-gray-400">Better search rankings</div>
                  </button>
                  
                  <button
                    onClick={() => handleAIAction('shorter')}
                    className="w-full text-left p-3 rounded-lg hover:bg-[#2a2a2a] transition-colors"
                  >
                    <div className="text-white font-medium text-sm">📉 Make Shorter</div>
                    <div className="text-xs text-gray-400">More concise version</div>
                  </button>
                  
                  <button
                    onClick={() => handleAIAction('longer')}
                    className="w-full text-left p-3 rounded-lg hover:bg-[#2a2a2a] transition-colors"
                  >
                    <div className="text-white font-medium text-sm">📈 Make Longer</div>
                    <div className="text-xs text-gray-400">Add more details</div>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleAIAction('generate', `Write a professional ${context || 'section'} for a portfolio website`)}
                    className="w-full text-left p-3 rounded-lg hover:bg-[#2a2a2a] transition-colors"
                  >
                    <div className="text-white font-medium text-sm">✏️ Generate Content</div>
                    <div className="text-xs text-gray-400">AI writes for you</div>
                  </button>
                  
                  <button
                    onClick={() => handleAIAction('generate', `Write 3 compelling bullet points about ${context || 'my work'}`)}
                    className="w-full text-left p-3 rounded-lg hover:bg-[#2a2a2a] transition-colors"
                  >
                    <div className="text-white font-medium text-sm">📝 Generate Ideas</div>
                    <div className="text-xs text-gray-400">Get inspired</div>
                  </button>
                </>
              )}
            </div>
          </div>
        </>,
        document.body
      )}

      {/* Preview Modal */}
      {showPreview && generatedText && typeof window !== 'undefined' && createPortal(
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[10000] flex items-center justify-center p-4">
          <div className="bg-[#1a1a1a] border-2 border-purple-500/30 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-b border-purple-500/30">
              <h3 className="font-bold text-white flex items-center gap-2">
                <span>✨</span> AI Generated Content
              </h3>
              <p className="text-sm text-gray-400 mt-1">Review and apply the changes</p>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-96">
              {currentText && (
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">ORIGINAL:</p>
                  <div className="p-3 bg-[#0f0f0f] rounded-lg border border-gray-800 text-gray-400 text-sm">
                    {currentText}
                  </div>
                </div>
              )}
              
              <div>
                <p className="text-xs text-gray-500 mb-2">AI IMPROVED:</p>
                <div className="p-3 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-lg border border-purple-500/30 text-white text-sm">
                  {generatedText}
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-[#0f0f0f] border-t border-gray-800 flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowPreview(false)}
                className="flex-1 border-gray-700 text-gray-300 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  onApply(generatedText)
                  setShowPreview(false)
                  setGeneratedText('')
                }}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                ✓ Apply Changes
              </Button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
