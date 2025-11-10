/**
 * Smart Suggestions Mode Component
 * 
 * Generates expert-level UX/UI improvement suggestions with automated design audits.
 */

import React from 'react'
import { Button } from '@/components/ui/Button'

interface SmartSuggestionsModeProps {
  isProcessing: boolean
  suggestions: any[]
  result: any
  onGenerate: () => void
  onApplySuggestion: (suggestion: any) => void
}

export function SmartSuggestionsMode({
  isProcessing,
  suggestions,
  result,
  onGenerate,
  onApplySuggestion,
}: SmartSuggestionsModeProps) {
  return (
    <div className="space-y-3">
      {isProcessing ? (
        <div className="text-center py-8">
          <div className="animate-spin text-4xl mb-2">🔄</div>
          <p className="text-sm text-gray-600">Analyzing your design...</p>
        </div>
      ) : suggestions.length > 0 ? (
        <>
          {result?.overallScore && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900">Overall Design Score</h4>
                <span className="text-2xl font-bold text-purple-600">{result.overallScore}/100</span>
              </div>
              {result.strengths && result.strengths.length > 0 && (
                <div className="mb-2">
                  <p className="text-xs font-semibold text-green-700">✅ Strengths:</p>
                  <ul className="text-xs text-gray-600 ml-4">
                    {result.strengths.map((strength: string, i: number) => (
                      <li key={i}>• {strength}</li>
                    ))}
                  </ul>
                </div>
              )}
              {result.areasToImprove && result.areasToImprove.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-orange-700">📈 Areas to Improve:</p>
                  <ul className="text-xs text-gray-600 ml-4">
                    {result.areasToImprove.map((area: string, i: number) => (
                      <li key={i}>• {area}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <div
                key={suggestion.id || index}
                className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                        suggestion.priority === 'high' ? 'bg-red-100 text-red-700' :
                        suggestion.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {suggestion.priority}
                      </span>
                      <span className="text-xs text-gray-500">{suggestion.type}</span>
                    </div>
                    <h5 className="font-semibold text-sm text-gray-900">{suggestion.title}</h5>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mb-2">{suggestion.description}</p>
                {suggestion.expectedImpact && (
                  <p className="text-xs text-green-600 mb-2">
                    📈 <strong>Impact:</strong> {suggestion.expectedImpact}
                  </p>
                )}
                <Button
                  size="sm"
                  onClick={() => onApplySuggestion(suggestion)}
                  className="text-xs"
                >
                  Apply Suggestion
                </Button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">💡</div>
          <p className="text-sm text-gray-600">No suggestions available yet.</p>
          <Button
            onClick={onGenerate}
            size="sm"
            className="mt-3"
          >
            Generate Suggestions
          </Button>
        </div>
      )}
    </div>
  )
}
