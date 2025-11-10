/**
 * Editor Sidebar Component
 * Side panel with tabs and content editing panels
 */

import React from 'react'
import { ContentPanel } from '@/components/editor/panels/ContentPanel'
import { DesignPanel } from '@/components/editor/panels/DesignPanel'
import { SettingsPanel } from '@/components/editor/panels/SettingsPanel'
import { SEOPanel } from '@/components/editor/panels/SEOPanel'
import { AnalyticsPanel } from '@/components/editor/panels/AnalyticsPanel'
import { VisualAIBuilder } from '@/components/editor/VisualAIBuilder'
import { Site } from '@/types/site'
import { TemplateData, ColorScheme, FontScheme } from '@/types/template'
import { EditorTab } from '@/hooks/useEditorUI'

interface EditorSidebarProps {
  site: Site
  activeTab: EditorTab
  setActiveTab: (tab: EditorTab) => void
  showMobilePanel: boolean
  closeMobilePanel: () => void
  onSiteUpdate: (updates: Partial<Site>) => void
}

const TAB_CONFIG = [
  { id: 'content', label: 'Content', icon: '📝' },
  { id: 'design', label: 'Design', icon: '🎨' },
  { id: 'ai', label: 'AI', icon: '✨' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
  { id: 'seo', label: 'SEO', icon: '🚀' },
  { id: 'analytics', label: 'Analytics', icon: '📊' },
] as const

export const EditorSidebar: React.FC<EditorSidebarProps> = ({
  site,
  activeTab,
  setActiveTab,
  showMobilePanel,
  closeMobilePanel,
  onSiteUpdate,
}) => {
  return (
    <div 
      className={`
        bg-[#1a1a1a] border-r border-gray-800 overflow-y-auto
        md:w-80 lg:w-96 md:relative md:flex-shrink-0
        ${showMobilePanel 
          ? 'fixed inset-0 top-14 z-50 w-full' 
          : 'hidden md:block'
        }
      `}
      data-tour="content"
    >
      {/* Mobile: Tab Selector */}
      {showMobilePanel && (
        <div className="md:hidden sticky top-0 bg-[#1a1a1a] border-b border-gray-800 p-4 z-10">
          <div className="grid grid-cols-3 gap-2">
            {TAB_CONFIG.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as EditorTab)}
                className={`flex flex-col items-center gap-1 p-3 rounded-lg text-xs font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                    : 'bg-[#0f0f0f] text-gray-400'
                }`}
              >
                <span className="text-xl">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      
      <div className="p-6 space-y-6 editor-panel">
        {activeTab === 'content' && (
          <ContentPanel
            data={site.data}
            onDataChange={(newData: TemplateData) => onSiteUpdate({ data: newData })}
            templateId={site.templateId}
            sectionOrder={site.settings.layout.sectionOrder}
            onSectionOrderChange={(newOrder: string[]) => {
              onSiteUpdate({
                settings: {
                  ...site.settings,
                  layout: {
                    ...site.settings.layout,
                    sectionOrder: newOrder,
                  }
                }
              })
            }}
          />
        )}

        {activeTab === 'design' && (
          <DesignPanel
            colors={site.settings.colors}
            fonts={site.settings.fonts}
            onColorsChange={(colors) => 
              onSiteUpdate({
                settings: { ...site.settings, colors }
              })
            }
            onFontsChange={(fonts) =>
              onSiteUpdate({
                settings: { ...site.settings, fonts }
              })
            }
          />
        )}

        {activeTab === 'ai' && (
          <VisualAIBuilder
            currentData={site.data}
            currentColors={site.settings.colors}
            currentFonts={site.settings.fonts}
            currentSectionOrder={site.settings.layout.sectionOrder}
            onApplyChanges={(changes) => {
              const updates: any = {}
              
              if (changes.colors) {
                updates.settings = {
                  ...site.settings,
                  colors: changes.colors,
                }
              }
              
              if (changes.fonts) {
                updates.settings = {
                  ...(updates.settings || site.settings),
                  fonts: changes.fonts,
                }
              }
              
              if (changes.data) {
                updates.data = {
                  ...site.data,
                  ...changes.data,
                }
              }
              
              if (changes.sectionOrder) {
                updates.settings = {
                  ...site.settings,
                  ...(updates.settings || {}),
                  layout: {
                    ...site.settings.layout,
                    sectionOrder: changes.sectionOrder,
                  }
                }
              }
              
              // Properly merge settings
              onSiteUpdate({
                ...updates,
                settings: {
                  ...site.settings,
                  ...(updates.settings || {}),
                }
              })
            }}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsPanel
            site={site}
            onUpdate={onSiteUpdate}
          />
        )}

        {activeTab === 'seo' && (
          <SEOPanel 
            site={site}
            onUpdate={onSiteUpdate}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsPanel
            site={site}
            onUpdate={onSiteUpdate}
          />
        )}
      </div>
      
      {/* Mobile: Close Button */}
      {showMobilePanel && (
        <div className="md:hidden sticky bottom-0 bg-[#1a1a1a] border-t border-gray-800 p-4">
          <button
            onClick={closeMobilePanel}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium"
          >
            Done Editing
          </button>
        </div>
      )}
    </div>
  )
}
