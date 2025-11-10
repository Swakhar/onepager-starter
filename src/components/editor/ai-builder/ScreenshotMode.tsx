/**
 * Screenshot Mode Component
 * 
 * Analyzes website screenshots to extract design elements.
 * Supports cross-domain analysis (e.g., restaurant → portfolio).
 */

import React from 'react'
import { Button } from '@/components/ui/Button'

interface ScreenshotModeProps {
  screenshotPreview: string | null
  isProcessing: boolean
  result: any
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRemoveScreenshot: () => void
  onAnalyze: () => void
  onApply: () => void
  onCancel: () => void
}

export function ScreenshotMode({
  screenshotPreview,
  isProcessing,
  result,
  onFileUpload,
  onRemoveScreenshot,
  onAnalyze,
  onApply,
  onCancel,
}: ScreenshotModeProps) {
  return (
    <div className="space-y-3">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-xs text-blue-700">
          <strong>📸 Upload a screenshot</strong> of any website and our AI will analyze its design elements (colors, fonts, layout) and apply them to your site.
        </p>
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        {screenshotPreview ? (
          <div>
            <img
              src={screenshotPreview}
              alt="Screenshot preview"
              className="max-w-full max-h-64 mx-auto rounded-lg shadow-lg mb-3"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={onRemoveScreenshot}
            >
              Remove Screenshot
            </Button>
          </div>
        ) : (
          <label className="cursor-pointer">
            <div className="text-4xl mb-2">📸</div>
            <p className="text-sm font-medium text-gray-700 mb-1">
              Click to upload screenshot
            </p>
            <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
            <input
              type="file"
              accept="image/*"
              onChange={onFileUpload}
              className="hidden"
            />
          </label>
        )}
      </div>

      {screenshotPreview && !result && (
        <Button
          onClick={onAnalyze}
          disabled={isProcessing}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
        >
          {isProcessing ? '🔍 Analyzing...' : '🔍 Analyze Design'}
        </Button>
      )}

      {result && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
          <h4 className="font-semibold text-gray-900">🎨 Design Analysis</h4>
          
          {result.description && (
            <p className="text-sm text-gray-600">{result.description}</p>
          )}

          {/* Adaptation Strategy Info */}
          {result.adaptationStrategy && (
            <div className={`rounded-lg p-3 ${
              result.adaptationStrategy.isCompatible
                ? 'bg-green-50 border border-green-200'
                : 'bg-yellow-50 border border-yellow-200'
            }`}>
              <p className={`text-xs font-semibold mb-1 ${
                result.adaptationStrategy.isCompatible ? 'text-green-900' : 'text-yellow-900'
              }`}>
                {result.adaptationStrategy.isCompatible ? '✅ Compatible Design' : '⚠️ Adaptation Required'}
              </p>
              <p className={`text-xs mb-2 ${
                result.adaptationStrategy.isCompatible ? 'text-green-700' : 'text-yellow-700'
              }`}>
                {result.adaptationStrategy.reasoning}
              </p>
              {result.adaptationStrategy.recommendations && result.adaptationStrategy.recommendations.length > 0 && (
                <div>
                  <p className={`text-xs font-semibold mb-1 ${
                    result.adaptationStrategy.isCompatible ? 'text-green-900' : 'text-yellow-900'
                  }`}>
                    Recommendations:
                  </p>
                  <ul className="space-y-1">
                    {result.adaptationStrategy.recommendations.map((rec: string, i: number) => (
                      <li key={i} className={`text-xs ${
                        result.adaptationStrategy.isCompatible ? 'text-green-700' : 'text-yellow-700'
                      }`}>
                        • {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {result.colorPalette && (
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-2">Colors:</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(result.colorPalette).map(([key, value]: [string, any]) => (
                  <div key={key} className="text-center">
                    <div
                      className="w-12 h-12 rounded border-2 border-gray-200"
                      style={{ backgroundColor: value }}
                    />
                    <p className="text-xs text-gray-500 mt-1">{key}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.typography && (
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-1">Typography:</p>
              <p className="text-sm text-gray-600">
                Heading: {result.typography.headingFont}<br />
                Body: {result.typography.bodyFont}
              </p>
            </div>
          )}

          {result.mood && result.industry && (
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-1">Style:</p>
              <p className="text-sm text-gray-600">
                Mood: <span className="capitalize">{result.mood}</span> • Industry: <span className="capitalize">{result.industry}</span>
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={onApply}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600"
            >
              ✅ Apply This Design
            </Button>
            <Button
              variant="outline"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
