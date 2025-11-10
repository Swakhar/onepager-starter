/**
 * Preview Area Component
 * Live preview of the site with device switcher
 */

import React from 'react'
import dynamic from 'next/dynamic'
import { Site } from '@/types/site'
import { TemplateData, ColorScheme, FontScheme } from '@/types/template'
import { DeviceView } from '@/hooks/useDeviceView'

// Dynamically import template components
const ModernPortfolio = dynamic(() => import('@/components/templates/modern-portfolio'))
const BusinessCard = dynamic(() => import('@/components/templates/business-card'))
const CreativeResume = dynamic(() => import('@/components/templates/creative-resume'))

// Template component mapping
const templateComponents: Record<string, React.ComponentType<{ data: TemplateData; colors: ColorScheme; fonts: FontScheme }>> = {
  'modern-portfolio': ModernPortfolio as any,
  'business-card': BusinessCard as any,
  'creative-resume': CreativeResume as any,
}

interface PreviewAreaProps {
  site: Site
  deviceView: DeviceView
  setDeviceView: (view: DeviceView) => void
}

export const PreviewArea: React.FC<PreviewAreaProps> = ({
  site,
  deviceView,
  setDeviceView,
}) => {
  const TemplateComponent = templateComponents[site.templateId]

  return (
    <div className="flex-1 flex flex-col overflow-hidden" data-tour="preview">
      {/* Preview Toolbar */}
      <div className="h-12 bg-[#141414] border-b border-gray-800 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors"></div>
          </div>
          <span className="text-xs text-gray-500 ml-2">👁️ Live Preview</span>
        </div>
        
        {/* Mobile Device Switcher */}
        <div className="lg:hidden flex gap-1 bg-[#0f0f0f] rounded-lg p-1 border border-gray-800">
          {[
            { id: 'desktop', icon: '🖥️' },
            { id: 'tablet', icon: '📱' },
            { id: 'mobile', icon: '📱' },
          ].map((device) => (
            <button
              key={device.id}
              onClick={() => setDeviceView(device.id as DeviceView)}
              className={`px-2 py-1 rounded text-xs ${
                deviceView === device.id
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400'
              }`}
            >
              {device.icon}
            </button>
          ))}
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-auto bg-[#0f0f0f] p-4 sm:p-8">
        <div className="flex justify-center items-start min-h-full">
          <div 
            id="site-preview"
            className={`bg-white transition-all duration-500 ease-in-out ${
              deviceView === 'mobile' 
                ? 'w-[375px]' 
                : deviceView === 'tablet'
                ? 'w-[768px]'
                : 'w-full max-w-7xl'
            }`}
            style={{ 
              boxShadow: deviceView !== 'desktop' 
                ? '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)' 
                : '0 10px 30px rgba(0, 0, 0, 0.3)',
              borderRadius: deviceView !== 'desktop' ? '24px' : '8px',
              overflow: 'hidden',
            }}
          >
            {TemplateComponent ? (
              <TemplateComponent
                data={{
                  ...site.data,
                  sectionOrder: site.settings.layout.sectionOrder,
                }}
                colors={site.settings.colors}
                fonts={site.settings.fonts}
              />
            ) : (
              <div className="p-12 text-center">
                <span className="text-6xl block mb-4">😕</span>
                <p className="text-gray-500 font-medium">Template not found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
