import type { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { industry, mood, brandName } = req.body

  if (!industry && !mood) {
    return res.status(400).json({ error: 'Industry or mood is required' })
  }

  const openaiKey = process.env.OPENAI_API_KEY

  if (!openaiKey) {
    return res.status(500).json({ 
      error: 'OpenAI API key not configured',
      details: 'Add OPENAI_API_KEY to your .env.local file'
    })
  }

  try {
    const openai = new OpenAI({ apiKey: openaiKey })

    const prompt = `Generate a professional color palette for ${brandName ? `"${brandName}", ` : ''}a ${industry || 'business'} that should feel ${mood || 'professional'}.

Return ONLY a JSON object with this exact structure (no markdown, no explanation):
{
  "primary": "#hexcolor",
  "secondary": "#hexcolor",
  "accent": "#hexcolor",
  "background": "#hexcolor",
  "text": "#hexcolor",
  "name": "Palette Name",
  "description": "One sentence describing the palette's mood and purpose"
}

Requirements:
- Use hex colors only
- Ensure high contrast between text and background (WCAG AA compliant)
- Primary should be the main brand color
- Secondary complements primary
- Accent for CTAs and highlights
- Background should be subtle (light or dark based on mood)
- Text should have good readability on background`

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a professional color theory expert and brand designer. You only respond with valid JSON objects, no markdown formatting.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 300,
    })

    const content = response.choices[0]?.message?.content?.trim()
    
    if (!content) {
      throw new Error('No response from AI')
    }

    // Parse JSON (remove any potential markdown formatting)
    const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim()
    const palette = JSON.parse(cleanContent)

    // Validate palette structure
    if (!palette.primary || !palette.secondary || !palette.accent || !palette.background || !palette.text) {
      throw new Error('Invalid palette structure')
    }

    return res.status(200).json({ palette })
  } catch (error: any) {
    console.error('Color generation error:', error)
    
    // Fallback: Return a default professional palette
    const fallbackPalette = {
      primary: '#4F46E5',
      secondary: '#7C3AED',
      accent: '#EC4899',
      background: '#FFFFFF',
      text: '#1F2937',
      name: 'Professional Blue',
      description: 'A trustworthy and modern color scheme perfect for any business.'
    }

    return res.status(200).json({ 
      palette: fallbackPalette,
      fallback: true,
      message: 'Using fallback palette due to: ' + error.message
    })
  }
}
