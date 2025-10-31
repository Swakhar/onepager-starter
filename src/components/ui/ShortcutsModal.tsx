import { useState } from 'react'
import { getShortcutLabel } from '@/hooks/useKeyboardShortcuts'

interface KeyboardShortcut {
  key: string
  ctrlKey?: boolean
  metaKey?: boolean
  shiftKey?: boolean
  altKey?: boolean
  action: () => void
  description: string
}

interface ShortcutsModalProps {
  shortcuts: KeyboardShortcut[]
  isOpen: boolean
  onClose: () => void
}

export function ShortcutsModal({ shortcuts, isOpen, onClose }: ShortcutsModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">⌨️</span>
            <h2 className="text-2xl font-bold text-white">Keyboard Shortcuts</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg px-3 py-2 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Shortcuts List */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
          <div className="space-y-3">
            {shortcuts.map((shortcut, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <span className="text-gray-700 font-medium">{shortcut.description}</span>
                <kbd className="px-4 py-2 bg-white border-2 border-gray-300 rounded-lg font-mono text-sm font-bold text-gray-700 shadow-sm">
                  {getShortcutLabel(shortcut)}
                </kbd>
              </div>
            ))}
          </div>

          {/* Pro Tip */}
          <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <h3 className="font-bold text-blue-900 mb-1">Pro Tip</h3>
                <p className="text-sm text-blue-700">
                  Press <kbd className="px-2 py-1 bg-white border border-blue-300 rounded text-xs font-mono">?</kbd> anytime to view shortcuts
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  )
}

export function ShortcutsButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all flex items-center justify-center z-40 group"
      title="Keyboard Shortcuts (Press ?)"
    >
      <span className="text-2xl group-hover:scale-110 transition-transform">⌨️</span>
    </button>
  )
}
