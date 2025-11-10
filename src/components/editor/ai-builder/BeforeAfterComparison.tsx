/**
 * Before/After Comparison Component
 * 
 * Modal component for comparing design before and after AI changes.
 * Shows side-by-side comparison with restore functionality.
 */

import React from 'react'
import { BeforeSnapshot } from '@/hooks/useSnapshot'
import { ColorScheme, FontScheme, TemplateData } from '@/types/template'

interface BeforeAfterComparisonProps {
  isOpen: boolean
  beforeSnapshot: BeforeSnapshot
  currentColors: ColorScheme
  currentFonts: FontScheme
  currentData: TemplateData
  currentSectionOrder: string[]
  onClose: () => void
  onRestore: () => void
}

export function BeforeAfterComparison({
  isOpen,
  beforeSnapshot,
  currentColors,
  currentFonts,
  currentData,
  currentSectionOrder,
  onClose,
  onRestore,
}: BeforeAfterComparisonProps) {
  if (!isOpen) return null

  return (
    <>
      {/* Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={onClose}
          className="px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2 font-semibold"
        >
          ✕ Close Comparison
        </button>
      </div>

      {/* Modal */}
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Before/After Comparison</h3>
              <div className="flex gap-2">
                <button
                  onClick={onRestore}
                  className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium transition-all"
                >
                  ↺ Restore Before
                </button>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 text-2xl px-2"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Before Column */}
              <div>
                <h4 className="font-semibold mb-3 text-red-600 text-center">Before Changes</h4>
                <div className="border rounded-lg p-4 bg-gray-50 space-y-4">
                  {/* Colors */}
                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-2">🎨 Colors:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {['primary', 'secondary', 'accent', 'background'].map((colorKey) => (
                        <div key={colorKey} className="text-xs">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-6 h-6 rounded border" 
                              style={{ backgroundColor: beforeSnapshot.colors[colorKey as keyof ColorScheme] }}
                            />
                            <span className="text-gray-600 capitalize">{colorKey}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Fonts */}
                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-2">✏️ Fonts:</p>
                    <div className="space-y-1 text-xs text-gray-600">
                      <div>Heading: <span className="font-semibold">{beforeSnapshot.fonts.heading}</span></div>
                      <div>Body: <span className="font-semibold">{beforeSnapshot.fonts.body}</span></div>
                    </div>
                  </div>

                  {/* Content Preview */}
                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-2">📝 Hero Content:</p>
                    <div className="text-xs text-gray-600 space-y-1">
                      <div className="truncate">Title: {beforeSnapshot.data.hero?.title || 'N/A'}</div>
                      <div className="truncate">Subtitle: {beforeSnapshot.data.hero?.subtitle || 'N/A'}</div>
                    </div>
                  </div>

                  {/* Section Order */}
                  {beforeSnapshot.sectionOrder && (
                    <div>
                      <p className="text-xs font-semibold text-gray-700 mb-2">📐 Section Order:</p>
                      <div className="text-xs text-gray-600">
                        {beforeSnapshot.sectionOrder.join(' → ')}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* After Column */}
              <div>
                <h4 className="font-semibold mb-3 text-green-600 text-center">After AI Changes</h4>
                <div className="border rounded-lg p-4 bg-gray-50 space-y-4">
                  {/* Colors */}
                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-2">🎨 Colors:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {['primary', 'secondary', 'accent', 'background'].map((colorKey) => (
                        <div key={colorKey} className="text-xs">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-6 h-6 rounded border" 
                              style={{ backgroundColor: currentColors[colorKey as keyof ColorScheme] }}
                            />
                            <span className="text-gray-600 capitalize">{colorKey}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Fonts */}
                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-2">✏️ Fonts:</p>
                    <div className="space-y-1 text-xs text-gray-600">
                      <div>Heading: <span className="font-semibold">{currentFonts.heading}</span></div>
                      <div>Body: <span className="font-semibold">{currentFonts.body}</span></div>
                    </div>
                  </div>

                  {/* Content Preview */}
                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-2">📝 Hero Content:</p>
                    <div className="text-xs text-gray-600 space-y-1">
                      <div className="truncate">Title: {currentData.hero?.title || 'N/A'}</div>
                      <div className="truncate">Subtitle: {currentData.hero?.subtitle || 'N/A'}</div>
                    </div>
                  </div>

                  {/* Section Order */}
                  {currentSectionOrder && currentSectionOrder.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-700 mb-2">📐 Section Order:</p>
                      <div className="text-xs text-gray-600">
                        {currentSectionOrder.join(' → ')}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Summary of Changes */}
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-semibold text-blue-900 mb-2">📊 Summary of Changes:</p>
              <div className="text-xs text-blue-700 space-y-1">
                {beforeSnapshot.colors.primary !== currentColors.primary && (
                  <div>✓ Primary color changed from {beforeSnapshot.colors.primary} to {currentColors.primary}</div>
                )}
                {beforeSnapshot.fonts.heading !== currentFonts.heading && (
                  <div>✓ Heading font changed from {beforeSnapshot.fonts.heading} to {currentFonts.heading}</div>
                )}
                {beforeSnapshot.fonts.body !== currentFonts.body && (
                  <div>✓ Body font changed from {beforeSnapshot.fonts.body} to {currentFonts.body}</div>
                )}
                {beforeSnapshot.data.hero?.title !== currentData.hero?.title && (
                  <div>✓ Hero title updated</div>
                )}
                {JSON.stringify(beforeSnapshot.sectionOrder) !== JSON.stringify(currentSectionOrder) && (
                  <div>✓ Section order rearranged</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
