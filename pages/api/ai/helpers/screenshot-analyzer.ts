/**
 * Screenshot Analyzer
 * 
 * Analyzes website screenshots using GPT-4o-mini vision API
 * to extract design elements (colors, fonts, layout).
 */

import { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai'
import { getScreenshotAnalysisPrompt } from './prompts'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

/**
 * Core screenshot analysis logic (reusable)
 * Returns the parsed analysis result or throws an error
 */
export async function analyzeScreenshotCore(
  imageUrl: string | undefined,
  imageBase64: string | undefined,
  currentTemplate: any
): Promise<any> {
  const prompt = getScreenshotAnalysisPrompt(currentTemplate)

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini', // Cost-optimized: ~$0.01/image
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          {
            type: 'image_url',
            image_url: {
              url: imageUrl || `data:image/jpeg;base64,${imageBase64}`,
              detail: 'high', // Better analysis quality
            },
          },
        ],
      },
    ],
    max_tokens: 1500,
  })

  const content = completion.choices[0]?.message?.content || '{}'
  
  console.log('GPT-4o Response:', content.substring(0, 200))
  
  // Check if model refused to analyze
  if (content.toLowerCase().includes("i'm unable") || 
      content.toLowerCase().includes("i cannot") ||
      content.toLowerCase().includes("i can't") ||
      content.toLowerCase().includes("i apologize")) {
    throw new Error('AI refused to analyze this image. This might be due to content restrictions. Please try a different screenshot.')
  }
  
  // Parse JSON from response (handle markdown code blocks)
  return parseAIResponse(content)
}

/**
 * Analyze a screenshot and extract design elements (API endpoint)
 * Supports cross-domain analysis (e.g., restaurant → portfolio)
 */
export async function analyzeScreenshot(req: NextApiRequest, res: NextApiResponse) {
  const { imageUrl, imageBase64, currentTemplate } = req.body

  try {
    const analysis = await analyzeScreenshotCore(imageUrl, imageBase64, currentTemplate)

    return res.status(200).json({
      success: true,
      analysis,
      message: 'Screenshot analyzed successfully',
    })
  } catch (error: any) {
    console.error('Screenshot analysis error:', error)
    
    // If it was a refusal error, return 400
    if (error.message.includes('AI refused')) {
      return res.status(400).json({ 
        error: 'AI refused to analyze', 
        details: error.message 
      })
    }
    
    // Otherwise return 500
    return res.status(500).json({ 
      error: 'Failed to analyze screenshot', 
      details: error.message 
    })
  }
}

/**
 * Parse AI response, handling various JSON formats
 * Tries multiple strategies to extract JSON
 */
function parseAIResponse(content: string): any {
  // Extract JSON from potential markdown code blocks or raw JSON
  let jsonString = content
  
  // Try markdown json block
  const jsonBlockMatch = content.match(/```json\s*([\s\S]*?)\s*```/)
  if (jsonBlockMatch) {
    jsonString = jsonBlockMatch[1]
  } else {
    // Try any code block
    const codeBlockMatch = content.match(/```\s*([\s\S]*?)\s*```/)
    if (codeBlockMatch) {
      jsonString = codeBlockMatch[1]
    } else {
      // Try to find JSON object
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        jsonString = jsonMatch[0]
      }
    }
  }
  
  // Parse JSON
  try {
    return JSON.parse(jsonString)
  } catch (parseError) {
    // Fallback: try to fix common JSON issues
    console.error('JSON parsing failed, attempting fix:', parseError)
    try {
      // Remove trailing commas, fix quotes
      const fixed = jsonString.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']')
      return JSON.parse(fixed)
    } catch (fixError) {
      throw new Error(`Failed to parse AI response as JSON: ${fixError}`)
    }
  }
}
