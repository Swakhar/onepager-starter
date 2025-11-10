/**
 * Natural Command Processor
 * 
 * Processes natural language design commands using GPT-3.5-turbo.
 * Supports color changes, font changes, content updates, section management, etc.
 */

import { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai'
import { getNaturalCommandPrompt } from './prompts'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

/**
 * Process natural language design commands
 * Examples: "Make it blue", "Remove about section", "Change hero title"
 */
export async function processNaturalCommand(req: NextApiRequest, res: NextApiResponse) {
  const { command, currentData, currentColors, currentFonts, currentSectionOrder } = req.body

  // Extract only essential info to reduce token count
  const essentialData = {
    template: currentData?.template || 'modern-portfolio',
    sectionOrder: currentSectionOrder || [],
    colors: currentColors,
    fonts: currentFonts,
    heroTitle: currentData?.hero?.title || '',
    aboutTitle: currentData?.about?.title || '',
    hasSections: {
      hero: !!currentData?.hero,
      about: !!currentData?.about,
      services: !!currentData?.services,
      projects: !!currentData?.projects,
      testimonials: !!currentData?.testimonials,
      contact: !!currentData?.contact,
    }
  }

  const prompt = getNaturalCommandPrompt(command, essentialData, currentColors, currentFonts)

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Cost-optimized: ~$0.002/request
      messages: [
        {
          role: 'system',
          content: 'You are an intelligent web design AI assistant. You understand natural language commands and make precise, targeted changes to websites.',
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
    console.log('Natural Command Response:', content.substring(0, 200))

    // Parse JSON response
    const result = parseNaturalCommandResponse(content)

    return res.status(200).json(result)
  } catch (error: any) {
    console.error('Natural command processing error:', error)
    return res.status(500).json({ 
      error: 'Failed to process command', 
      details: error.message 
    })
  }
}

/**
 * Parse natural command AI response
 */
function parseNaturalCommandResponse(content: string): any {
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
      throw new Error(`Failed to parse natural command response: ${fixError}`)
    }
  }
}
