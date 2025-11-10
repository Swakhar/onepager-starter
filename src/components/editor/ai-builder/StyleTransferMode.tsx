/**
 * Style Transfer Mode Component
 * 
 * Transfers design styles from reference websites to current template
 * while preserving user content.
 */

import React from 'react'
import { Button } from '@/components/ui/Button'

interface StyleTransferModeProps {
  styleReferenceScreenshot: string | null
  transferOptions: {
    colors: boolean
    fonts: boolean
    layout: boolean
    spacing: boolean
  }
  isProcessing: boolean
  result: any
  onScreenshotUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRemoveScreenshot: () => void
  onTransferOptionsChange: (options: {
    colors: boolean
    fonts: boolean
    layout: boolean
    spacing: boolean
  }) => void
  onTransfer: () => void
}

export function StyleTransferMode({
  styleReferenceScreenshot,
  transferOptions,
  isProcessing,
  result,
  onScreenshotUpload,
  onRemoveScreenshot,
  onTransferOptionsChange,
  onTransfer,
}: StyleTransferModeProps) {
  return (
    <div className="space-y-3">
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
        <p className="text-xs text-purple-700">
          <strong>🎭 Style Transfer:</strong> Copy the visual style from any website while preserving your content.
        </p>
      </div>

      {/* Screenshot Upload */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">
          📸 Upload Reference Screenshot
        </p>
        <p className="text-xs text-gray-500 mb-3">
          Take a screenshot of any website you like. Works for ANY site (popular or not)!
        </p>
        <div className="border-2 border-dashed border-purple-300 rounded-lg p-6 text-center bg-purple-50">
          {styleReferenceScreenshot ? (
            <div>
              <img
                src={styleReferenceScreenshot}
                alt="Style reference"
                className="max-w-full max-h-32 mx-auto rounded mb-2 border-2 border-purple-200"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={onRemoveScreenshot}
              >
                🗑️ Remove
              </Button>
            </div>
          ) : (
            <label className="cursor-pointer">
              <div className="text-4xl mb-2">🎨</div>
              <p className="text-sm font-medium text-gray-700">Click to upload screenshot</p>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
              <p className="text-xs text-purple-600 mt-2">
                ✨ Works for any website - not just popular ones!
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={onScreenshotUpload}
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>

      {/* Transfer Options */}
      <div className="bg-gray-50 rounded-lg p-3">
        <p className="text-xs font-semibold text-gray-700 mb-2">What to transfer:</p>
        <div className="space-y-2">
          {[
            { key: 'colors' as const, label: '🎨 Colors' },
            { key: 'fonts' as const, label: '✏️ Fonts' },
            { key: 'layout' as const, label: '📐 Layout' },
            { key: 'spacing' as const, label: '📏 Spacing' },
          ].map((option) => (
            <label key={option.key} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={transferOptions[option.key]}
                onChange={(e) =>
                  onTransferOptionsChange({ 
                    ...transferOptions, 
                    [option.key]: e.target.checked 
                  })
                }
                className="rounded"
              />
              <span className="text-sm">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      <Button
        onClick={onTransfer}
        disabled={isProcessing || !styleReferenceScreenshot}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
      >
        {isProcessing ? '🔄 Transferring Style...' : '🎭 Transfer Style'}
      </Button>

      {/* Results */}
      {result && result.recommendations && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-semibold text-green-900 mb-2">✅ Style Transferred!</h4>
          {result.recommendations.length > 0 && (
            <>
              <p className="text-xs font-semibold text-green-900 mb-2">💡 Recommendations:</p>
              <ul className="space-y-1">
                {result.recommendations.map((rec: string, i: number) => (
                  <li key={i} className="text-xs text-green-700">• {rec}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  )
}
