export type EditorPanel = 'content' | 'design' | 'layout' | 'media' | 'settings'

export type EditorMode = 'edit' | 'preview'

export type DeviceType = 'desktop' | 'tablet' | 'mobile'

export interface EditorState {
  activePanel: EditorPanel
  mode: EditorMode
  device: DeviceType
  selectedSection: string | null
  selectedElement: string | null
  isLoading: boolean
  isSaving: boolean
  hasUnsavedChanges: boolean
  history: HistoryState
}

export interface HistoryState {
  past: string[] // Serialized states
  future: string[]
  canUndo: boolean
  canRedo: boolean
}

export interface EditorAction {
  type: string
  payload: any
  timestamp: number
}
