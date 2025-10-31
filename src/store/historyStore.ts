import { create } from 'zustand'
import { Site } from '@/types/site'

interface HistoryState {
  past: Site[]
  present: Site | null
  future: Site[]
  canUndo: boolean
  canRedo: boolean
  
  // Actions
  setPresent: (site: Site) => void
  undo: () => Site | null
  redo: () => Site | null
  clearHistory: () => void
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  past: [],
  present: null,
  future: [],
  canUndo: false,
  canRedo: false,

  setPresent: (site: Site) => {
    const { present, past } = get()
    
    // Only add to history if the site actually changed
    if (present && JSON.stringify(present) !== JSON.stringify(site)) {
      set({
        past: [...past, present].slice(-20), // Keep last 20 states
        present: site,
        future: [], // Clear future when new change is made
        canUndo: true,
        canRedo: false,
      })
    } else if (!present) {
      set({
        present: site,
        canUndo: false,
        canRedo: false,
      })
    }
  },

  undo: () => {
    const { past, present, future } = get()
    
    if (past.length === 0) return null
    
    const previous = past[past.length - 1]
    const newPast = past.slice(0, past.length - 1)
    
    set({
      past: newPast,
      present: previous,
      future: present ? [present, ...future] : future,
      canUndo: newPast.length > 0,
      canRedo: true,
    })
    
    return previous
  },

  redo: () => {
    const { past, present, future } = get()
    
    if (future.length === 0) return null
    
    const next = future[0]
    const newFuture = future.slice(1)
    
    set({
      past: present ? [...past, present] : past,
      present: next,
      future: newFuture,
      canUndo: true,
      canRedo: newFuture.length > 0,
    })
    
    return next
  },

  clearHistory: () => {
    set({
      past: [],
      present: null,
      future: [],
      canUndo: false,
      canRedo: false,
    })
  },
}))
