/**
 * Natural Command Mode Component
 * 
 * AI-powered natural language design commands.
 * Examples: "Make it blue", "Remove about section", "Change hero title"
 */

import React from 'react'
import { CommandHistoryItem } from '@/hooks/useCommandHistory'

interface NaturalCommandModeProps {
  command: string
  setCommand: (command: string) => void
  isProcessing: boolean
  isListening: boolean
  voiceSupported: boolean
  result: any
  commandHistory: CommandHistoryItem[]
  favoriteCommands: string[]
  onProcess: () => void
  onVoiceStart: () => void
  onRerunCommand: (cmd: string) => void
  onToggleFavorite: (cmd: string) => void
}

export function NaturalCommandMode({
  command,
  setCommand,
  isProcessing,
  isListening,
  voiceSupported,
  result,
  commandHistory,
  favoriteCommands,
  onProcess,
  onVoiceStart,
  onRerunCommand,
  onToggleFavorite,
}: NaturalCommandModeProps) {
  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">
          💬 What would you like to change?
        </p>
        <p className="text-xs text-gray-500 mb-3">
          Try: "Make it blue", "Remove about section", "Change fonts to modern"
        </p>
        <div className="relative">
          <textarea
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder='e.g., "Make the colors warmer" or "Remove the contact section"'
            className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            rows={3}
            disabled={isProcessing}
          />
          {voiceSupported && (
            <button
              onClick={onVoiceStart}
              disabled={isProcessing || isListening}
              className={`absolute bottom-3 right-3 p-2 rounded-lg transition-all ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              title="Voice input"
            >
              🎤
            </button>
          )}
        </div>
      </div>

      {isListening && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
          <div className="animate-pulse">
            <span className="text-red-500 text-lg">🎤</span>
          </div>
          <span className="text-red-700 text-sm font-medium">
            Listening... Speak your design command
          </span>
        </div>
      )}

      <button
        onClick={onProcess}
        disabled={isProcessing || !command.trim()}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-medium hover:from-purple-500 hover:to-pink-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? '⏳ Processing...' : '✨ Apply Command'}
      </button>

      {result && result.explanation && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
          <p className="text-sm font-semibold text-green-800 flex items-center gap-2">
            <span>✅</span>
            <span>Changes Applied</span>
          </p>
          <p className="text-sm text-green-700">{result.explanation}</p>
          {result.additionalSuggestions && result.additionalSuggestions.length > 0 && (
            <div className="mt-2 pt-2 border-t border-green-300">
              <p className="text-xs font-medium text-green-800 mb-1">💡 Suggestions:</p>
              <ul className="text-xs text-green-700 space-y-1">
                {result.additionalSuggestions.map((suggestion: string, idx: number) => (
                  <li key={idx}>• {suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Command History */}
      {commandHistory.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <p className="text-xs font-semibold text-gray-700 flex items-center gap-2">
            <span>📜</span>
            <span>Recent Commands</span>
          </p>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {commandHistory.slice(0, 5).map((item) => (
              <div
                key={item.id}
                className="bg-white rounded border border-gray-200 p-2 hover:border-purple-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <button
                    onClick={() => onRerunCommand(item.command)}
                    className="flex-1 text-left text-xs text-gray-700 hover:text-purple-600 transition-colors"
                    title="Click to re-run"
                  >
                    "{item.command}"
                  </button>
                  <button
                    onClick={() => onToggleFavorite(item.command)}
                    className="text-sm"
                    title={favoriteCommands.includes(item.command) ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    {favoriteCommands.includes(item.command) ? '⭐' : '☆'}
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(item.timestamp).toLocaleTimeString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Favorites */}
      {favoriteCommands.length > 0 && (
        <div className="bg-yellow-50 rounded-lg p-4 space-y-2">
          <p className="text-xs font-semibold text-yellow-800 flex items-center gap-2">
            <span>⭐</span>
            <span>Favorite Commands</span>
          </p>
          <div className="space-y-1">
            {favoriteCommands.map((cmd, idx) => (
              <button
                key={idx}
                onClick={() => onRerunCommand(cmd)}
                className="w-full text-left text-xs text-yellow-800 bg-white rounded border border-yellow-200 p-2 hover:border-yellow-400 hover:bg-yellow-50 transition-colors"
              >
                "{cmd}"
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
