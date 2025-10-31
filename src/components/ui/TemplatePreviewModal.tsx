import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Button } from './Button'
import { TemplateData, ColorScheme, FontScheme } from '@/types/template'

// Dynamically import template components
const ModernPortfolio = dynamic(() => import('@/components/templates/modern-portfolio'))
const BusinessCard = dynamic(() => import('@/components/templates/business-card'))
const CreativeResume = dynamic(() => import('@/components/templates/creative-resume'))

const templateComponents: Record<string, React.ComponentType<{ data: TemplateData; colors: ColorScheme; fonts: FontScheme }>> = {
  'modern-portfolio': ModernPortfolio as any,
  'business-card': BusinessCard as any,
  'creative-resume': CreativeResume as any,
}

interface TemplatePreviewModalProps {
  templateId: string
  templateName: string
  sampleData: TemplateData
  colors: ColorScheme
  fonts: FontScheme
  isOpen: boolean
  onClose: () => void
  onUseTemplate: () => void
}

export function TemplatePreviewModal({
  templateId,
  templateName,
  sampleData,
  colors,
  fonts,
  isOpen,
  onClose,
  onUseTemplate
}: TemplatePreviewModalProps) {
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')

  if (!isOpen) return null

  const TemplateComponent = templateComponents[templateId]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl mx-4 max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <span className="text-4xl">👁️</span>
            <div>
              <h2 className="text-2xl font-bold text-white">{templateName} Preview</h2>
              <p className="text-indigo-100 text-sm">See how your site will look</p>
            </div>
          </div>

          {/* Device Switcher */}
          <div className="flex items-center gap-4">
            <div className="flex gap-1 bg-white/20 backdrop-blur-sm rounded-lg p-1">
              <button
                onClick={() => setDeviceView('desktop')}
                className={`px-4 py-2 text-xs font-semibold rounded transition-all ${
                  deviceView === 'desktop'
                    ? 'bg-white text-indigo-600 shadow-lg'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                🖥️ Desktop
              </button>
              <button
                onClick={() => setDeviceView('tablet')}
                className={`px-4 py-2 text-xs font-semibold rounded transition-all ${
                  deviceView === 'tablet'
                    ? 'bg-white text-indigo-600 shadow-lg'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                📱 Tablet
              </button>
              <button
                onClick={() => setDeviceView('mobile')}
                className={`px-4 py-2 text-xs font-semibold rounded transition-all ${
                  deviceView === 'mobile'
                    ? 'bg-white text-indigo-600 shadow-lg'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                📱 Mobile
              </button>
            </div>

            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-lg px-4 py-2 transition-colors font-semibold"
            >
              ✕ Close
            </button>
          </div>
        </div>

        {/* Preview Area */}
        <div className="flex-1 overflow-auto bg-gradient-to-br from-gray-50 to-gray-100 p-8">
          <div className="flex justify-center items-start min-h-full">
            <div
              className={`bg-white transition-all duration-500 ${
                deviceView === 'mobile'
                  ? 'w-[375px] max-h-[667px]'
                  : deviceView === 'tablet'
                  ? 'w-[768px] max-h-[1024px]'
                  : 'w-full max-h-none'
              }`}
              style={{
                boxShadow: deviceView !== 'desktop' ? '0 20px 60px rgba(0,0,0,0.3)' : 'none',
                borderRadius: deviceView !== 'desktop' ? '20px' : '0',
                overflow: 'auto',
              }}
            >
              {TemplateComponent ? (
                <TemplateComponent data={sampleData} colors={colors} fonts={fonts} />
              ) : (
                <div className="p-12 text-center">
                  <span className="text-6xl block mb-4">😕</span>
                  <p className="text-gray-500">Template not found</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-white flex items-center justify-between flex-shrink-0">
          <p className="text-gray-600">
            This is a preview with sample data. You can customize everything!
          </p>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={onUseTemplate}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg"
            >
              Use This Template →
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
