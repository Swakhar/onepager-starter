/**
 * Command History Hook
 * 
 * Custom hook for managing command history and favorites with localStorage persistence.
 */

import { useState, useCallback, useEffect } from 'react'

export interface CommandHistoryItem {
  id: string
  command: string
  timestamp: Date
  result: any
}

interface UseCommandHistoryReturn {
  commandHistory: CommandHistoryItem[]
  favoriteCommands: string[]
  addToHistory: (command: string, result: any) => void
  toggleFavorite: (command: string) => void
  clearHistory: () => void
}

export function useCommandHistory(): UseCommandHistoryReturn {
  const [commandHistory, setCommandHistory] = useState<CommandHistoryItem[]>([])
  const [favoriteCommands, setFavoriteCommands] = useState<string[]>([])

  // Load history and favorites from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('ai-builder-history')
    const savedFavorites = localStorage.getItem('ai-builder-favorites')
    
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory)
        // Convert timestamp strings back to Date objects
        const historyWithDates = parsed.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }))
        setCommandHistory(historyWithDates)
      } catch (e) {
        console.error('Failed to load command history:', e)
      }
    }
    
    if (savedFavorites) {
      try {
        setFavoriteCommands(JSON.parse(savedFavorites))
      } catch (e) {
        console.error('Failed to load favorites:', e)
      }
    }
  }, [])

  // Save history to localStorage whenever it changes
  useEffect(() => {
    if (commandHistory.length > 0) {
      localStorage.setItem('ai-builder-history', JSON.stringify(commandHistory))
    }
  }, [commandHistory])

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (favoriteCommands.length > 0) {
      localStorage.setItem('ai-builder-favorites', JSON.stringify(favoriteCommands))
    }
  }, [favoriteCommands])

  // Add command to history (smart: avoid duplicates, update timestamp if command exists)
  const addToHistory = useCallback((command: string, result: any) => {
    setCommandHistory(prev => {
      // Check if this command already exists
      const existingIndex = prev.findIndex(
        item => item.command.toLowerCase().trim() === command.toLowerCase().trim()
      )
      
      if (existingIndex >= 0) {
        // Command exists - update it and move to top
        const updatedItem: CommandHistoryItem = {
          ...prev[existingIndex],
          timestamp: new Date(),
          result,
        }
        
        // Remove old entry and add updated one at the top
        const newHistory = [...prev]
        newHistory.splice(existingIndex, 1)
        return [updatedItem, ...newHistory]
      } else {
        // New command - add to top
        const newItem: CommandHistoryItem = {
          id: Date.now().toString(),
          command,
          timestamp: new Date(),
          result,
        }
        
        // Keep only last 20 commands
        return [newItem, ...prev].slice(0, 20)
      }
    })
  }, [])

  // Toggle favorite
  const toggleFavorite = useCallback((command: string) => {
    setFavoriteCommands(prev => {
      if (prev.includes(command)) {
        return prev.filter(c => c !== command)
      } else {
        return [...prev, command]
      }
    })
  }, [])

  // Clear history
  const clearHistory = useCallback(() => {
    setCommandHistory([])
    localStorage.removeItem('ai-builder-history')
  }, [])

  return {
    commandHistory,
    favoriteCommands,
    addToHistory,
    toggleFavorite,
    clearHistory,
  }
}
