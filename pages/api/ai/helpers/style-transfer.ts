/**
 * Style Transfer Handler
 * 
 * Transfers design styles from reference websites to current template
 * while preserving user content.
 */

import { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai'
import { getStyleTransferPrompt } from './prompts'
import { analyzeScreenshotCore } from './screenshot-analyzer'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

/**
 * Transfer style from reference to current template
 * 
 * IMPORTANT: Style transfer uses screenshot analysis
 * This ensures ANY website works (not just popular ones GPT knows about)
 * 
 * NOTE: URL input is NOT supported directly because:
 * - AI models cannot browse/access external URLs
 * - We would need server-side screenshot capture (requires puppeteer/playwright)
 * 
 * SOLUTION: Users should upload a screenshot of the reference website instead
 * This works for ANY website (popular or unpopular) and is more reliable
 */
export async function styleTransfer(req: NextApiRequest, res: NextApiResponse) {
  const { 
    referenceStyle, 
    currentData, 
    transferOptions, 
    imageUrl, 
    imageBase64, 
    currentTemplate 
  } = req.body

  let designAnalysis: any = null

  // If screenshot is provided, analyze it first
  if (imageUrl || imageBase64 || referenceStyle?.imageBase64) {
    try {
      // Use screenshot analysis to extract design
      const imgUrl = imageUrl
      const imgBase64 = imageBase64 || referenceStyle?.imageBase64
      
      designAnalysis = await analyzeScreenshotCore(imgUrl, imgBase64, currentTemplate)
    } catch (error: any) {
      console.error('Style transfer screenshot analysis error:', error)
      return res.status(400).json({
        error: 'Failed to analyze reference screenshot',
        details: error.message,
      })
    }
  } else if (referenceStyle) {
    // If style object is already provided (from previous analysis)
    designAnalysis = referenceStyle
  } else {
    return res.status(400).json({ 
      error: 'No reference provided',
      details: 'Please provide either a screenshot (imageUrl/imageBase64) or a pre-analyzed style object (referenceStyle)'
    })
  }

  // Now apply the extracted style to current template
  const prompt = getStyleTransferPrompt(designAnalysis, currentData, transferOptions)

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Cost-optimized: ~$0.002/request
      messages: [
        {
          role: 'system',
          content: 'You are an expert web designer specializing in style transfer. You adapt design styles while preserving content and structure.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    })

    const content = completion.choices[0]?.message?.content || '{}'
    console.log('Style Transfer Response:', content.substring(0, 200))

    // Parse JSON response
    const updatedDesign = parseStyleTransferResponse(content)

    return res.status(200).json({
      success: true,
      updatedDesign,
      message: 'Style transferred successfully',
    })
  } catch (error: any) {
    console.error('Style transfer error:', error)
    return res.status(500).json({ error: 'Failed to transfer style', details: error.message })
  }
}

/**
 * Parse style transfer AI response
 */
function parseStyleTransferResponse(content: string): any {
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
      throw new Error(`Failed to parse style transfer response: ${fixError}`)
    }
  }
}
