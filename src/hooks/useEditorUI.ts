/**
 * Custom hook for managing editor UI state
 * Handles tabs, modals, and panel visibility
 */

import { useState } from 'react'

export type EditorTab = 'content' | 'design' | 'ai' | 'settings' | 'seo' | 'analytics'

export function useEditorUI() {
  const [activeTab, setActiveTab] = useState<EditorTab>('content')
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [showMobilePanel, setShowMobilePanel] = useState(false)
  const [showPublishModal, setShowPublishModal] = useState(false)

  const toggleMobilePanel = () => setShowMobilePanel(!showMobilePanel)
  const closeMobilePanel = () => setShowMobilePanel(false)
  const openPublishModal = () => setShowPublishModal(true)
  const closePublishModal = () => setShowPublishModal(false)
  const openShortcuts = () => setShowShortcuts(true)
  const closeShortcuts = () => setShowShortcuts(false)

  return {
    activeTab,
    setActiveTab,
    showShortcuts,
    setShowShortcuts,
    showMobilePanel,
    setShowMobilePanel,
    showPublishModal,
    setShowPublishModal,
    toggleMobilePanel,
    closeMobilePanel,
    openPublishModal,
    closePublishModal,
    openShortcuts,
    closeShortcuts,
  }
}
