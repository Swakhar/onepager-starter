/**
 * Editor Navigation Bar Component
 * Top bar with back button, title, tabs, and action buttons
 */

import React from 'react'
import { useRouter } from 'next/router'
import { Button } from '@/components/ui/Button'
import { Tooltip } from '@/components/ui/Tooltip'
import { ExportButtons } from '@/components/editor/ExportButtons'
import { Site } from '@/types/site'
import { EditorTab } from '@/hooks/useEditorUI'
import { DeviceView } from '@/hooks/useDeviceView'
import { TemplateConfig } from '@/types/template'

interface EditorNavbarProps {
  site: Site
  template: TemplateConfig | undefined
  activeTab: EditorTab
  setActiveTab: (tab: EditorTab) => void
  deviceView: DeviceView
  setDeviceView: (view: DeviceView) => void
  showMobilePanel: boolean
  toggleMobilePanel: () => void
  isSaving: boolean
  canUndo: boolean
  canRedo: boolean
  onSave: () => void
  onPublish: () => void
  onUndo: () => void
  onRedo: () => void
}

const TAB_CONFIG = [
  { id: 'content', label: 'Content', icon: '📝' },
  { id: 'design', label: 'Design', icon: '🎨' },
  { id: 'ai', label: 'AI', icon: '✨' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
  { id: 'seo', label: 'SEO', icon: '🚀' },
  { id: 'analytics', label: 'Analytics', icon: '📊' },
] as const

const DEVICE_CONFIG = [
  { id: 'desktop', icon: '🖥️', label: 'Desktop' },
  { id: 'tablet', icon: '📱', label: 'Tablet' },
  { id: 'mobile', icon: '📱', label: 'Mobile' },
] as const

export const EditorNavbar: React.FC<EditorNavbarProps> = ({
  site,
  template,
  activeTab,
  setActiveTab,
  deviceView,
  setDeviceView,
  showMobilePanel,
  toggleMobilePanel,
  isSaving,
  canUndo,
  canRedo,
  onSave,
  onPublish,
  onUndo,
  onRedo,
}) => {
  const router = useRouter()

  return (
    <div className="h-14 bg-[#1a1a1a] border-b border-gray-800 flex items-center px-4 gap-4 shrink-0">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        <Tooltip content="Back to Dashboard">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-colors text-gray-400 hover:text-white"
          >
            <span className="text-lg">←</span>
            <span className="text-sm font-medium hidden sm:inline">Back</span>
          </button>
        </Tooltip>
        
        <div className="h-6 w-px bg-gray-800" />
        
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <h1 className="text-sm font-semibold text-white leading-tight">{site.title}</h1>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="hidden sm:inline">{template?.name || 'Template'}</span>
              <span className="hidden sm:inline">•</span>
              {site.published ? (
                <span className="inline-flex items-center gap-1 text-green-400">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                  Live
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-gray-500">
                  <span className="w-1.5 h-1.5 bg-gray-500 rounded-full"></span>
                  Draft
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Center Section - Editor Tabs */}
      <div className="flex-1 flex justify-center">
        {/* Desktop Tabs */}
        <div className="hidden md:flex items-center gap-1 bg-[#0f0f0f] rounded-lg p-1 border border-gray-800" data-tour="tabs">
          {TAB_CONFIG.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as EditorTab)}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <span className="text-base">{tab.icon}</span>
              <span className="hidden md:inline">{tab.label}</span>
            </button>
          ))}
        </div>
        
        {/* Mobile: Panel Toggle Button */}
        <button
          onClick={toggleMobilePanel}
          className="md:hidden flex items-center gap-2 px-4 py-2 bg-[#0f0f0f] rounded-lg border border-gray-800 text-white"
        >
          <span className="text-base">
            {TAB_CONFIG.find(t => t.id === activeTab)?.icon}
          </span>
          <span className="text-sm font-medium">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </span>
          <span className="text-xs">{showMobilePanel ? '✕' : '▼'}</span>
        </button>
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center gap-2" data-tour="save">
        {/* Undo/Redo */}
        <div className="hidden md:flex items-center gap-1 border-r border-gray-800 pr-2">
          <Tooltip content="Undo (⌘Z)">
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className={`p-2 rounded-lg transition-all ${
                canUndo
                  ? 'hover:bg-gray-800 text-gray-400 hover:text-white'
                  : 'text-gray-700 cursor-not-allowed'
              }`}
            >
              <span className="text-lg">↶</span>
            </button>
          </Tooltip>
          <Tooltip content="Redo (⌘⇧Z)">
            <button
              onClick={onRedo}
              disabled={!canRedo}
              className={`p-2 rounded-lg transition-all ${
                canRedo
                  ? 'hover:bg-gray-800 text-gray-400 hover:text-white'
                  : 'text-gray-700 cursor-not-allowed'
              }`}
            >
              <span className="text-lg">↷</span>
            </button>
          </Tooltip>
        </div>

        {/* Device View Switcher */}
        <div className="hidden lg:flex items-center gap-1 bg-[#0f0f0f] rounded-lg p-1 border border-gray-800">
          {DEVICE_CONFIG.map((device) => (
            <Tooltip key={device.id} content={device.label}>
              <button
                onClick={() => setDeviceView(device.id as DeviceView)}
                className={`px-3 py-1.5 rounded-md text-sm transition-all ${
                  deviceView === device.id
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                {device.icon}
              </button>
            </Tooltip>
          ))}
        </div>

        <div className="h-6 w-px bg-gray-800" />

        {/* Export Buttons */}
        <div className="hidden md:block">
          <ExportButtons site={site} />
        </div>

        <Tooltip content="Save changes (⌘S)">
          <Button
            variant="outline"
            size="sm"
            onClick={onSave}
            disabled={isSaving}
            className="border-gray-700 bg-transparent hover:bg-gray-800 text-white font-medium"
          >
            <span className="hidden sm:inline">{isSaving ? 'Saving...' : '💾 Save'}</span>
            <span className="sm:hidden">💾</span>
          </Button>
        </Tooltip>
        
        <Tooltip content="Publish your site (⌘P)">
          <Button
            size="sm"
            onClick={onPublish}
            disabled={isSaving}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg font-medium border-0"
          >
            <span className="hidden sm:inline">{site.published ? '🚀 Update' : '🚀 Publish'}</span>
            <span className="sm:hidden">🚀</span>
          </Button>
        </Tooltip>
      </div>
    </div>
  )
}
