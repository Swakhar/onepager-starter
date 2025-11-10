import { useEffect } from 'react'
import { ShortcutsModal, ShortcutsButton } from '@/components/ui/ShortcutsModal'
import { OnboardingTour, useOnboardingTour } from '@/components/ui/OnboardingTour'
import { PublishModal } from '@/components/ui/PublishModal'
import { EditorNavbar } from '@/components/editor/EditorNavbar'
import { EditorSidebar } from '@/components/editor/EditorSidebar'
import { PreviewArea } from '@/components/editor/PreviewArea'
import { SuccessToast } from '@/components/editor/SuccessToast'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { templates } from '@/config/templates'
import { useHistoryStore } from '@/store/historyStore'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { useEditorState } from '@/hooks/useEditorState'
import { useEditorUI } from '@/hooks/useEditorUI'
import { useDeviceView } from '@/hooks/useDeviceView'

function EditorPage() {
  // Custom hooks for state management
  const { site, setSite, isSaving, showSuccessToast, handleSave, handlePublish } = useEditorState()
  const { 
    activeTab, 
    setActiveTab, 
    showShortcuts, 
    showMobilePanel, 
    showPublishModal,
    toggleMobilePanel,
    closeMobilePanel,
    openPublishModal,
    closePublishModal,
    openShortcuts,
    closeShortcuts,
  } = useEditorUI()
  const { deviceView, setDeviceView } = useDeviceView()

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

  // Undo/Redo handlers
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

  // Publish modal handler
  const handleOpenPublishModal = () => {
    if (!site) return
    
    // If already published, just toggle publish status
    if (site.published) {
      handlePublish()
    } else {
      // Show modal for first-time publishing
      openPublishModal()
    }
  }

  // Domain search handler
  const handleOpenDomainSearchFromPublish = () => {
    closePublishModal()
    setActiveTab('settings')
    toggleMobilePanel()
    // Trigger domain search in settings
    setTimeout(() => {
      const domainButton = document.querySelector('[data-domain-search]') as HTMLButtonElement
      domainButton?.click()
    }, 300)
  }

  // Site update handler
  const handleSiteUpdate = (updates: Partial<typeof site>) => {
    if (!site) return
    setSite({ ...site, ...updates })
  }

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
        if (site) handleOpenPublishModal()
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
      action: openShortcuts,
      description: 'Show keyboard shortcuts',
    },
  ]

  useKeyboardShortcuts(shortcuts, !!site)

  // Loading state
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
        <SuccessToast show={showSuccessToast} />

        {/* Top Navigation Bar */}
        <EditorNavbar
          site={site}
          template={template}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          deviceView={deviceView}
          setDeviceView={setDeviceView}
          showMobilePanel={showMobilePanel}
          toggleMobilePanel={toggleMobilePanel}
          isSaving={isSaving}
          canUndo={canUndo}
          canRedo={canRedo}
          onSave={handleSave}
          onPublish={handleOpenPublishModal}
          onUndo={handleUndo}
          onRedo={handleRedo}
        />

        {/* Editor Content */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Side Panel */}
          <EditorSidebar
            site={site}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            showMobilePanel={showMobilePanel}
            closeMobilePanel={closeMobilePanel}
            onSiteUpdate={handleSiteUpdate}
          />

          {/* Main Preview Area */}
          <PreviewArea
            site={site}
            deviceView={deviceView}
            setDeviceView={setDeviceView}
          />
        </div>
      </div>

      {/* Keyboard Shortcuts */}
      <ShortcutsButton onClick={openShortcuts} />
      <ShortcutsModal
        shortcuts={shortcuts}
        isOpen={showShortcuts}
        onClose={closeShortcuts}
      />

      {/* Publish Modal */}
      <PublishModal
        isOpen={showPublishModal}
        onClose={closePublishModal}
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

export default EditorPage
