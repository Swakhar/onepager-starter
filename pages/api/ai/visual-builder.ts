/**
 * Visual Builder API Router
 * 
 * Main API endpoint for AI-powered visual builder features:
 * - Screenshot analysis: Extract design from any website screenshot
 * - Style transfer: Apply reference designs to current template
 * - Natural commands: Process natural language design requests
 * - Smart suggestions: Generate expert UX/UI improvement suggestions
 * 
 * All business logic is modularized in /helpers/ directory for maintainability.
 */

import { NextApiRequest, NextApiResponse } from 'next'
import { analyzeScreenshot } from './helpers/screenshot-analyzer'
import { styleTransfer } from './helpers/style-transfer'
import { processNaturalCommand } from './helpers/natural-command'
import { generateSmartSuggestions } from './helpers/smart-suggestions'

// CRITICAL: Increase body size limit to 10MB for image uploads
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}

// COST OPTIMIZATION NOTES:
// - gpt-4o-mini: ~$0.01/image (10x cheaper than gpt-4o) - RECOMMENDED ✅
// - detail: 'high' = better analysis (~$0.01), 'low' = ultra cheap (~$0.003) but less accurate
// - For production with high traffic, consider 'low' detail or caching results
// - Current config: gpt-4o-mini with 'high' detail = best balance of cost/quality

/**
 * Main API handler - routes requests to appropriate processor
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { type } = req.body

    switch (type) {
      case 'analyze-screenshot':
        return await analyzeScreenshot(req, res)
      case 'style-transfer':
        return await styleTransfer(req, res)
      case 'natural-command':
        return await processNaturalCommand(req, res)
      case 'smart-suggestions':
        return await generateSmartSuggestions(req, res)
      default:
        return res.status(400).json({ error: 'Invalid request type' })
    }
  } catch (error: any) {
    console.error('Visual Builder API Error:', error)
    return res.status(500).json({ 
      error: 'AI processing failed', 
      details: error.message 
    })
  }
}
