/**
 * AI Site Generator API
 * 
 * Main endpoint for AI-powered website generation.
 * Takes a natural language prompt and generates a complete website.
 * 
 * ARCHITECTURE:
 * - Modular design with helper functions
 * - GPT-3.5-turbo for cost efficiency (~$0.01 per site)
 * - Response caching to avoid duplicate API calls
 * - Template-aware content generation
 * - Comprehensive error handling
 * 
 * COST OPTIMIZATION:
 * - GPT-3.5-turbo: $0.01 per site (15x cheaper than GPT-4)
 * - Caching: 10-20% of requests hit cache (free)
 * - Monthly cost: ~$10 for 1,000 sites
 * 
 * FLOW:
 * 1. Analyze prompt → Extract requirements
 * 2. Select template → Match best template
 * 3. Generate content → AI creates copy
 * 4. Generate design → Industry colors + fonts
 * 5. Select sections → Based on generated content
 * 6. Return complete site → Ready for editor
 * 
 * @see /helpers/prompt-analyzer.ts - Prompt analysis
 * @see /helpers/content-generator.ts - Content generation
 * @see /helpers/template-helpers.ts - Template selection & design
 * @see /helpers/openai-client.ts - OpenAI API wrapper
 * @see /helpers/cache.ts - Response caching
 */

import type { NextApiRequest, NextApiResponse } from 'next'
import { analyzePrompt, PromptAnalysis } from './helpers/prompt-analyzer'
import { generateContent, GeneratedContent } from './helpers/content-generator'
import { 
  selectTemplate, 
  generateDesignSystem, 
  selectSections,
  DesignSystem 
} from './helpers/template-helpers'
import { siteGeneratorCache, CacheKey } from './helpers/cache'

/**
 * Request body interface
 */
interface GenerationRequest {
  prompt: string
  options?: {
    industry?: string
    tone?: 'professional' | 'casual' | 'creative' | 'modern'
    colors?: string
    features?: string[]
  }
}

/**
 * Response body interface
 */
interface GenerationResponse {
  success: boolean
  site: {
    templateId: string
    title: string
    content: GeneratedContent
    design: DesignSystem
    sectionOrder: string[]
  }
  analysis: PromptAnalysis
  meta: {
    generationTime: number
    cached: boolean
    model: string
  }
}

/**
 * Main API handler
 * 
 * POST /api/ai/site-generator
 * Body: { prompt: string, options?: {...} }
 * 
 * Returns complete site data ready for editor.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GenerationResponse | { error: string; details?: string }>
) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const startTime = Date.now()

  try {
    const { prompt, options = {} }: GenerationRequest = req.body

    // Validate input
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Invalid prompt', 
        details: 'Please provide a description of your website' 
      })
    }

    console.log('🚀 Starting site generation...')
    console.log('📝 Prompt:', prompt.substring(0, 100) + '...')
    console.log('⚙️ Options:', options)

    // Check full site cache first (entire generation)
    const fullCacheKey = CacheKey.generate(prompt, options)
    const cachedSite = siteGeneratorCache.get(fullCacheKey)

    if (cachedSite) {
      const generationTime = Date.now() - startTime
      console.log(`✅ Site generation complete (cached) in ${generationTime}ms`)
      
      return res.status(200).json({
        ...cachedSite,
        meta: {
          ...cachedSite.meta,
          generationTime,
          cached: true,
        }
      })
    }

    // STEP 1: Analyze prompt
    console.log('📊 Step 1/5: Analyzing prompt...')
    const analysis = await analyzePrompt(prompt, {
      industry: options.industry,
      tone: options.tone,
      colors: options.colors,
    })

    // STEP 2: Select best template
    console.log('🎨 Step 2/5: Selecting template...')
    const templateId = selectTemplate(analysis)

    // STEP 3: Generate content
    console.log('📝 Step 3/5: Generating content...')
    const content = await generateContent(analysis, templateId)

    // STEP 4: Generate design system
    console.log('🎨 Step 4/5: Creating design system...')
    const design = generateDesignSystem(analysis)

    // STEP 5: Determine section order based on generated content
    console.log('📐 Step 5/5: Determining section order...')
    const sectionOrder = selectSections(content)

    // Build final response
    const generationTime = Date.now() - startTime
    const response: GenerationResponse = {
      success: true,
      site: {
        templateId,
        title: analysis.siteName,
        content,
        design,
        sectionOrder,
      },
      analysis,
      meta: {
        generationTime,
        cached: false,
        model: 'gpt-3.5-turbo', // Current model (future: track premium users)
      }
    }

    // Cache the complete result
    siteGeneratorCache.set(fullCacheKey, response)

    console.log(`✅ Site generation complete in ${generationTime}ms`)
    console.log(`📊 Generated ${sectionOrder.length} sections:`, sectionOrder)

    return res.status(200).json(response)

  } catch (error: any) {
    const generationTime = Date.now() - startTime
    
    console.error('❌ Site generation failed:', {
      error: error.message,
      stack: error.stack,
      time: generationTime
    })

    // Return detailed error for debugging
    return res.status(500).json({
      error: 'Failed to generate website',
      details: error.message || 'An unexpected error occurred. Please try again.'
    })
  }
}
