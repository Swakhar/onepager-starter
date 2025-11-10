/**
 * Smart Suggestions Generator
 * 
 * Generates expert-level UX/UI improvement suggestions with automated design audits.
 * Uses WCAG standards, UX research, and best practices.
 */

import { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai'
import { getSmartSuggestionsPrompt } from './prompts'
import { checkColorContrast, checkFontReadability, checkSectionOrder } from './design-audit'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

/**
 * Generate smart suggestions based on current state
 * Includes automated design audits for accessibility and UX
 */
export async function generateSmartSuggestions(req: NextApiRequest, res: NextApiResponse) {
  const { currentData, analytics } = req.body

  // Extract only essential info to reduce token count
  const essentialData = {
    template: currentData?.template || 'modern-portfolio',
    colors: currentData?.colors || {},
    fonts: currentData?.fonts || {},
    sections: currentData?.sectionOrder || [],
    heroTitle: currentData?.hero?.title || '',
    aboutTitle: currentData?.about?.title || '',
  }

  // Run automated design audits
  const hasLowContrast = checkColorContrast(essentialData.colors)
  const hasReadabilityIssues = checkFontReadability(essentialData.fonts)
  const hasSectionOrderIssues = checkSectionOrder(essentialData.sections)

  const prompt = getSmartSuggestionsPrompt(
    essentialData,
    analytics,
    hasLowContrast,
    hasReadabilityIssues,
    hasSectionOrderIssues
  )

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Cost-optimized: ~$0.002/request
      messages: [
        {
          role: 'system',
          content: 'You are an expert UX/UI designer and web design consultant with deep knowledge of WCAG standards, conversion optimization, and design psychology.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    })

    const content = completion.choices[0]?.message?.content || '{}'
    console.log('Smart Suggestions Response:', content.substring(0, 200))

    // Parse JSON response
    const result = parseSmartSuggestionsResponse(content)

    return res.status(200).json(result)
  } catch (error: any) {
    console.error('Smart suggestions generation error:', error)
    return res.status(500).json({ 
      error: 'Failed to generate suggestions', 
      details: error.message 
    })
  }
}

/**
 * Parse smart suggestions AI response
 */
function parseSmartSuggestionsResponse(content: string): any {
  let jsonString = content
  
  // Extract JSON from markdown code blocks
  const jsonBlockMatch = content.match(/```json\s*([\s\S]*?)\s*```/)
  const codeBlockMatch = content.match(/```\s*([\s\S]*?)\s*```/)
  const jsonMatch = content.match(/\{[\s\S]*\}/)
  
  if (jsonBlockMatch) {
    jsonString = jsonBlockMatch[1]
  } else if (codeBlockMatch) {
    jsonString = codeBlockMatch[1]
  } else if (jsonMatch) {
    jsonString = jsonMatch[0]
  }
  
  try {
    return JSON.parse(jsonString)
  } catch (parseError) {
    console.error('JSON parsing failed:', parseError)
    try {
      const fixed = jsonString.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']')
      return JSON.parse(fixed)
    } catch (fixError) {
      throw new Error(`Failed to parse smart suggestions response: ${fixError}`)
    }
  }
}
