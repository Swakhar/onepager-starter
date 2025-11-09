import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/Button'
import { Tabs } from '@/components/ui/Tabs'
import { Tooltip } from '@/components/ui/Tooltip'
import { ShortcutsModal, ShortcutsButton } from '@/components/ui/ShortcutsModal'
import { OnboardingTour, useOnboardingTour } from '@/components/ui/OnboardingTour'
import { PublishModal } from '@/components/ui/PublishModal'
import { DesignPanel } from '@/components/editor/panels/DesignPanel'
import { ContentPanel } from '@/components/editor/panels/ContentPanel'
import { SettingsPanel } from '@/components/editor/panels/SettingsPanel'
import { SEOPanel } from '@/components/editor/panels/SEOPanel'
import { AnalyticsPanel } from '@/components/editor/panels/AnalyticsPanel'
import { ExportButtons } from '@/components/editor/ExportButtons'
import { VisualAIBuilder } from '@/components/editor/VisualAIBuilder'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'
import { Site } from '@/types/site'
import { TemplateData, ColorScheme, FontScheme } from '@/types/template'
import { templates } from '@/config/templates'
import { modernPortfolioSampleData, businessCardSampleData, creativeResumeSampleData } from '@/config/sampleData'
import { saveSite, loadSite, createNewSite } from '@/lib/storage/siteStorage'
import { useHistoryStore } from '@/store/historyStore'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'

// Dynamically import template components
const ModernPortfolio = dynamic(() => import('@/components/templates/modern-portfolio'))
const BusinessCard = dynamic(() => import('@/components/templates/business-card'))
const CreativeResume = dynamic(() => import('@/components/templates/creative-resume'))

type EditorTab = 'content' | 'design' | 'ai' | 'settings' | 'seo' | 'analytics'

// Template component mapping
const templateComponents: Record<string, React.ComponentType<{ data: TemplateData; colors: ColorScheme; fonts: FontScheme }>> = {
  'modern-portfolio': ModernPortfolio as any,
  'business-card': BusinessCard as any,
  'creative-resume': CreativeResume as any,
}

export default function EditorPage() {
  const router = useRouter()
  const { siteId } = router.query
  
  const [site, setSite] = useState<Site | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<EditorTab>('content')
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [showMobilePanel, setShowMobilePanel] = useState(false)
  const [showPublishModal, setShowPublishModal] = useState(false)

  // History store for undo/redo
  const { setPresent, undo, redo, canUndo, canRedo } = useHistoryStore()

  // Onboarding tour
  const { isActive: isTourActive, complete: completeTour } = useOnboardingTour('editor')

  // Tour steps
  const tourSteps = [
    {
      target: '[data-tour="tabs"]',
      title: '📝 Welcome to the Editor!',
      content: 'Use these tabs to edit your content, customize design, and configure settings.',
    },
    {
      target: '[data-tour="content"]',
      title: '✏️ Edit Your Content',
      content: 'Add your text, images, projects, and skills here. Everything updates in real-time!',
    },
    {
      target: '[data-tour="preview"]',
      title: '👁️ Live Preview',
      content: 'See your changes instantly! Switch between Desktop, Tablet, and Mobile views.',
    },
    {
      target: '[data-tour="save"]',
      title: '💾 Save Your Work',
      content: 'Click Save to store your changes, or Publish to make your site live!',
    },
  ]

  // Update history when site changes
  useEffect(() => {
    if (site) {
      setPresent(site)
    }
  }, [site, setPresent])

  // Keyboard shortcuts
  const shortcuts = [
    {
      key: 's',
      metaKey: true,
      action: () => {
        if (site) handleSave()
      },
      description: 'Save site',
    },
    {
      key: 'p',
      metaKey: true,
      action: () => {
        if (site) handlePublish()
      },
      description: 'Publish site',
    },
    {
      key: 'z',
      metaKey: true,
      action: handleUndo,
      description: 'Undo',
    },
    {
      key: 'z',
      metaKey: true,
      shiftKey: true,
      action: handleRedo,
      description: 'Redo',
    },
    {
      key: '?',
      action: () => setShowShortcuts(true),
      description: 'Show keyboard shortcuts',
    },
  ]

  useKeyboardShortcuts(shortcuts, !!site)

  function handleUndo() {
    const previous = undo()
    if (previous) {
      setSite({ ...previous })
    }
  }

  function handleRedo() {
    const next = redo()
    if (next) {
      setSite({ ...next })
    }
  }

  useEffect(() => {
    // Load site from storage or create new one
    const loadSiteData = async () => {
      if (siteId && typeof siteId === 'string') {
        const loaded = await loadSite(siteId)
        if (loaded) {
          setSite(loaded)
        } else {
          // Site not found, redirect to dashboard
          router.push('/dashboard')
        }
      } else {
        // Create a new demo site
        const newSite = createNewSite('modern-portfolio', 'My Portfolio')
        newSite.data = modernPortfolioSampleData
        setSite(newSite)
      }
    }
    loadSiteData()
  }, [siteId, router])

  const handleSave = async () => {
    if (!site) return
    
    setIsSaving(true)
    try {
      await saveSite({
        ...site,
        updatedAt: new Date().toISOString(),
      })
      setShowSuccessToast(true)
      setTimeout(() => setShowSuccessToast(false), 3000)
    } catch (error) {
      console.error('Failed to save site:', error)
      alert('Failed to save site')
    } finally {
      setIsSaving(false)
    }
  }

  const handlePublish = async (withDomain?: string) => {
    if (!site) return
    
    setIsSaving(true)
    try {
      await saveSite({
        ...site,
        published: true,
        customDomain: withDomain || site.customDomain,
        updatedAt: new Date().toISOString(),
      })
      setShowSuccessToast(true)
      setTimeout(() => setShowSuccessToast(false), 3000)
      setSite({ ...site, published: true, customDomain: withDomain || site.customDomain })
    } catch (error) {
      console.error('Failed to publish site:', error)
      alert('Failed to publish site')
    } finally {
      setIsSaving(false)
    }
  }

  const handleOpenPublishModal = () => {
    if (!site) return
    
    // If already published, just toggle publish status
    if (site.published) {
      handlePublish()
    } else {
      // Show modal for first-time publishing
      setShowPublishModal(true)
    }
  }

  const handleOpenDomainSearchFromPublish = () => {
    setShowPublishModal(false)
    setActiveTab('settings')
    setShowMobilePanel(true)
    // Trigger domain search in settings
    setTimeout(() => {
      const domainButton = document.querySelector('[data-domain-search]') as HTMLButtonElement
      domainButton?.click()
    }, 300)
  }

  if (!site) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading editor...</p>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  const template = templates[site.templateId]

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
        {/* Success Toast */}
        {showSuccessToast && (
          <div className="fixed top-6 right-6 z-[100] bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-fadeIn border border-green-400/30">
            <span className="text-2xl">✅</span>
            <div>
              <p className="font-semibold">Success!</p>
              <p className="text-sm text-green-50">Your changes have been saved</p>
            </div>
          </div>
        )}

        {/* Top Navigation Bar */}
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
            <div className="hidden md:flex items-center gap-1 bg-[#0f0f0f] rounded-lg p-1 border border-gray-800" data-tour="tabs">
              {[
                { id: 'content', label: 'Content', icon: '📝' },
                { id: 'design', label: 'Design', icon: '🎨' },
                { id: 'ai', label: 'AI', icon: '✨' },
                { id: 'settings', label: 'Settings', icon: '⚙️' },
                { id: 'seo', label: 'SEO', icon: '🚀' },
                { id: 'analytics', label: 'Analytics', icon: '📊' },
              ].map((tab) => (
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
              onClick={() => setShowMobilePanel(!showMobilePanel)}
              className="md:hidden flex items-center gap-2 px-4 py-2 bg-[#0f0f0f] rounded-lg border border-gray-800 text-white"
            >
              <span className="text-base">
                {activeTab === 'content' && '📝'}
                {activeTab === 'design' && '🎨'}
                {activeTab === 'ai' && '✨'}
                {activeTab === 'settings' && '⚙️'}
                {activeTab === 'seo' && '🚀'}
                {activeTab === 'analytics' && '📊'}
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
                  onClick={handleUndo}
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
                  onClick={handleRedo}
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
              {[
                { id: 'desktop', icon: '🖥️', label: 'Desktop' },
                { id: 'tablet', icon: '📱', label: 'Tablet' },
                { id: 'mobile', icon: '�', label: 'Mobile' },
              ].map((device) => (
                <Tooltip key={device.id} content={device.label}>
                  <button
                    onClick={() => setDeviceView(device.id as any)}
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
                onClick={handleSave}
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
                onClick={handleOpenPublishModal}
                disabled={isSaving}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg font-medium border-0"
              >
                <span className="hidden sm:inline">{site.published ? '🚀 Update' : '🚀 Publish'}</span>
                <span className="sm:hidden">🚀</span>
              </Button>
            </Tooltip>
          </div>
        </div>

        {/* Editor Content */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Side Panel - Desktop always visible, Mobile overlay */}
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
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { id: 'content', label: 'Content', icon: '📝' },
                    { id: 'design', label: 'Design', icon: '🎨' },
                    { id: 'ai', label: 'AI', icon: '✨' },
                    { id: 'settings', label: 'Settings', icon: '⚙️' },
                    { id: 'seo', label: 'SEO', icon: '🚀' },
                    { id: 'analytics', label: 'Analytics', icon: '📊' },
                  ].map((tab) => (
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
                  onDataChange={(newData: TemplateData) => setSite({ ...site, data: newData })}
                  templateId={site.templateId}
                  sectionOrder={site.settings.layout.sectionOrder} // ADDED: Pass section order
                  onSectionOrderChange={(newOrder: string[]) => {
                    // ADDED: Update section order in settings
                    setSite({
                      ...site,
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
                    setSite({ ...site, settings: { ...site.settings, colors } })
                  }
                  onFontsChange={(fonts) =>
                    setSite({ ...site, settings: { ...site.settings, fonts } })
                  }
                />
              )}

              {activeTab === 'ai' && (
                <VisualAIBuilder
                  currentData={site.data}
                  currentColors={site.settings.colors}
                  currentFonts={site.settings.fonts}
                  currentSectionOrder={site.settings.layout.sectionOrder} // ADDED: Pass section order
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
                      // CRITICAL FIX: Deep merge settings to preserve colors, fonts, etc.
                      updates.settings = {
                        ...site.settings, // Start with all current settings
                        ...(updates.settings || {}), // Merge any updates.settings
                        layout: {
                          ...site.settings.layout, // Preserve other layout properties
                          sectionOrder: changes.sectionOrder, // Update section order
                        }
                      }
                    }
                    
                    // CRITICAL FIX: Properly merge nested settings object
                    setSite({
                      ...site,
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
                  onUpdate={(updates: Partial<Site>) => setSite({ ...site, ...updates })}
                />
              )}

              {activeTab === 'seo' && (
                <SEOPanel 
                  site={site}
                  onUpdate={(updates: Partial<Site>) => setSite({ ...site, ...updates })}
                />
              )}

              {activeTab === 'analytics' && (
                <AnalyticsPanel
                  site={site}
                  onUpdate={(updates: Partial<Site>) => setSite({ ...site, ...updates })}
                />
              )}
            </div>
            
            {/* Mobile: Close Button */}
            {showMobilePanel && (
              <div className="md:hidden sticky bottom-0 bg-[#1a1a1a] border-t border-gray-800 p-4">
                <button
                  onClick={() => setShowMobilePanel(false)}
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium"
                >
                  Done Editing
                </button>
              </div>
            )}
          </div>

          {/* Main Preview Area */}
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
                {['desktop', 'tablet', 'mobile'].map((device) => (
                  <button
                    key={device}
                    onClick={() => setDeviceView(device as any)}
                    className={`px-2 py-1 rounded text-xs ${
                      deviceView === device
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-400'
                    }`}
                  >
                    {device === 'desktop' ? '🖥️' : '📱'}
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
                  {(() => {
                    const TemplateComponent = templateComponents[site.templateId]
                    if (!TemplateComponent) {
                      return (
                        <div className="p-12 text-center">
                          <span className="text-6xl block mb-4">😕</span>
                          <p className="text-gray-500 font-medium">Template not found</p>
                        </div>
                      )
                    }
                    return (
                      <TemplateComponent
                        data={{
                          ...site.data,
                          sectionOrder: site.settings.layout.sectionOrder, // CRITICAL: Pass sectionOrder to template
                        }}
                        colors={site.settings.colors}
                        fonts={site.settings.fonts}
                      />
                    )
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts */}
      <ShortcutsButton onClick={() => setShowShortcuts(true)} />
      <ShortcutsModal
        shortcuts={shortcuts}
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />

      {/* Publish Modal */}
      <PublishModal
        isOpen={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        site={site}
        onPublish={handlePublish}
        onOpenDomainSearch={handleOpenDomainSearchFromPublish}
      />

      {/* Onboarding Tour */}
      <OnboardingTour
        steps={tourSteps}
        isActive={isTourActive}
        onComplete={completeTour}
      />
    </ProtectedRoute>
  )
}
