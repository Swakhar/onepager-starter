/**
 * Prompt Analyzer
 * 
 * Analyzes user's natural language prompt to extract:
 * - Industry/niche
 * - Site type (portfolio, business, restaurant, etc.)
 * - Desired tone (professional, casual, creative)
 * - Key features
 * - Site name
 * 
 * Uses GPT-3.5-turbo for cost efficiency.
 * Results are cached to avoid reanalyzing identical prompts.
 */

import { callOpenAI, parseOpenAIJSON } from './openai-client'
import { promptAnalysisCache, CacheKey } from './cache'

export interface PromptAnalysis {
  industry: string
  siteType: 'portfolio' | 'business' | 'resume' | 'landing' | 'restaurant' | 'ecommerce' | 'saas'
  tone: string
  primaryColor?: string
  features: string[]
  siteName: string
  description: string
}

export interface AnalyzeOptions {
  industry?: string
  tone?: string
  colors?: string
}

/**
 * Analyze user prompt to extract website requirements
 * 
 * @param prompt - User's natural language description
 * @param options - Optional overrides from advanced options
 * @param isPremium - Whether to use GPT-4 (premium users only)
 * @returns Structured analysis of the prompt
 * 
 * @example
 * ```typescript
 * const analysis = await analyzePrompt(
 *   "Create a modern Italian restaurant website with online reservations",
 *   { tone: 'professional' }
 * )
 * // Returns: { industry: 'Restaurant', siteType: 'restaurant', ... }
 * ```
 */
export async function analyzePrompt(
  prompt: string,
  options: AnalyzeOptions = {},
  isPremium: boolean = false
): Promise<PromptAnalysis> {
  // Check cache first
  const cacheKey = CacheKey.generate(prompt, options)
  const cached = promptAnalysisCache.get(cacheKey)
  
  if (cached) {
    console.log('📦 Using cached prompt analysis')
    return cached
  }

  console.log('🔍 Analyzing prompt with AI...')

  const systemPrompt = `You are an expert website consultant. Analyze the user's website request and extract key information.

Your task: Extract the following from the user's description:
1. industry: The business industry (e.g., "Restaurant", "Technology", "Photography")
2. siteType: One of: portfolio, business, resume, landing, restaurant, ecommerce, saas
3. tone: The desired style (professional, casual, creative, modern)
4. features: Array of key features mentioned (e.g., ["menu", "reservations", "gallery"])
5. siteName: Generate a professional business name if not provided
6. description: A brief (1-2 sentence) summary

CRITICAL RULES:
1. Always provide a siteName even if not explicitly mentioned
2. Make siteName professional and relevant to the industry
3. Return ONLY valid JSON, no markdown or explanations

Examples of good siteNames:
- "law firm" → "Premier Legal Associates"
- "restaurant" → "Bella Italia Restaurant"
- "photographer" → "Artisan Photography Studio"
- "consulting" → "Strategic Business Solutions"

If no siteName can be inferred, use: "My [Industry] Website"

Return JSON in this EXACT format:
{
  "industry": "string",
  "siteType": "portfolio|business|resume|landing|restaurant|ecommerce|saas",
  "tone": "professional|casual|creative|modern",
  "features": ["feature1", "feature2"],
  "siteName": "Professional Business Name",
  "description": "Brief 1-2 sentence summary",
  "primaryColor": "#hexcode or null"
}`

  const userMessage = `Analyze this website request:\n\nPrompt: ${prompt}\n\nOptions: ${JSON.stringify(options)}`

  try {
    const response = await callOpenAI({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
      temperature: 0.7,
      maxTokens: 500,
    }, isPremium)

    const analysis = parseOpenAIJSON<PromptAnalysis>(response.content, 'prompt analysis')

    // Apply fallbacks for safety
    if (!analysis.siteName || analysis.siteName.trim() === '') {
      analysis.siteName = `My ${analysis.industry || 'Website'}`
      console.warn('⚠️ AI failed to generate siteName, using fallback')
    }

    if (!analysis.tone) {
      analysis.tone = options.tone || 'professional'
    }

    if (options.colors) {
      analysis.primaryColor = options.colors
    }

    console.log('✅ Prompt analysis complete:', {
      industry: analysis.industry,
      siteType: analysis.siteType,
      siteName: analysis.siteName,
      features: analysis.features.length
    })

    // Cache the result
    promptAnalysisCache.set(cacheKey, analysis)

    return analysis
  } catch (error) {
    console.error('❌ Prompt analysis failed:', error)
    
    // Return sensible fallback instead of crashing
    const fallbackAnalysis: PromptAnalysis = {
      industry: options.industry || 'Business',
      siteType: 'business',
      tone: options.tone || 'professional',
      features: [],
      siteName: 'My Website',
      description: prompt.substring(0, 100),
      primaryColor: options.colors,
    }

    console.log('⚠️ Using fallback analysis due to error')
    return fallbackAnalysis
  }
}
