import { useState, useEffect } from 'react'
import { Button } from './Button'

interface TourStep {
  target: string // CSS selector
  title: string
  content: string
  position?: 'top' | 'bottom' | 'left' | 'right'
}

interface OnboardingTourProps {
  steps: TourStep[]
  onComplete: () => void
  isActive: boolean
}

export function OnboardingTour({ steps, onComplete, isActive }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null)
  const [position, setPosition] = useState({ top: 0, left: 0 })

  useEffect(() => {
    if (!isActive || currentStep >= steps.length) return

    const step = steps[currentStep]
    const element = document.querySelector(step.target) as HTMLElement

    if (element) {
      setTargetElement(element)
      
      // Scroll element into view
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })

      // Highlight the element
      element.style.position = 'relative'
      element.style.zIndex = '1000'
      element.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.5), 0 0 0 9999px rgba(0, 0, 0, 0.5)'
      element.style.borderRadius = '8px'

      // Calculate position
      const rect = element.getBoundingClientRect()
      setPosition({
        top: rect.bottom + window.scrollY + 10,
        left: rect.left + window.scrollX,
      })
    }

    return () => {
      if (element) {
        element.style.position = ''
        element.style.zIndex = ''
        element.style.boxShadow = ''
        element.style.borderRadius = ''
      }
    }
  }, [currentStep, steps, isActive])

  if (!isActive || currentStep >= steps.length) return null

  const step = steps[currentStep]
  const isLastStep = currentStep === steps.length - 1

  const handleNext = () => {
    if (isLastStep) {
      onComplete()
    } else {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleSkip = () => {
    onComplete()
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[999] pointer-events-none" />

      {/* Tour Card */}
      <div
        className="fixed z-[1001] bg-white rounded-2xl shadow-2xl border-2 border-indigo-500 max-w-md animate-fadeIn"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
        }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-semibold text-sm">
              Step {currentStep + 1} of {steps.length}
            </span>
            <button
              onClick={handleSkip}
              className="text-white/80 hover:text-white text-sm"
            >
              Skip Tour
            </button>
          </div>
          <h3 className="text-xl font-bold text-white">{step.title}</h3>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 leading-relaxed mb-6">{step.content}</p>

          {/* Progress */}
          <div className="mb-6">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            {currentStep > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                ← Previous
              </Button>
            )}
            <div className="flex-1" />
            <Button
              size="sm"
              onClick={handleNext}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              {isLastStep ? "Get Started! 🎉" : "Next →"}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

// Hook to manage onboarding state
export function useOnboardingTour(tourKey: string) {
  const [isActive, setIsActive] = useState(false)
  const [hasCompleted, setHasCompleted] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const completed = localStorage.getItem(`onboarding-${tourKey}`)
      setHasCompleted(completed === 'true')
      
      // Auto-start if not completed
      if (completed !== 'true') {
        setTimeout(() => setIsActive(true), 1000)
      }
    }
  }, [tourKey])

  const complete = () => {
    setIsActive(false)
    setHasCompleted(true)
    if (typeof window !== 'undefined') {
      localStorage.setItem(`onboarding-${tourKey}`, 'true')
    }
  }

  const restart = () => {
    setIsActive(true)
  }

  return { isActive, hasCompleted, complete, restart }
}
