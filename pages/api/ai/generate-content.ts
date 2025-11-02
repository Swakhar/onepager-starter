import { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { prompt, context, type } = req.body

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ 
      error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to your .env.local file.' 
    })
  }

  try {
    const systemPrompts = {
      'improve': 'You are a professional copywriter. Improve the following text to be more engaging, clear, and professional. Keep the same tone and message. Return ONLY the improved text, no explanations.',
      'generate': 'You are a creative content writer. Generate professional, engaging content based on the user\'s request. Return ONLY the content, no explanations.',
      'seo': 'You are an SEO expert. Optimize the following content for search engines while keeping it natural and engaging. Return ONLY the optimized text, no explanations.',
      'shorter': 'You are a concise writer. Make the following text shorter while keeping the key message. Return ONLY the shortened text, no explanations.',
      'longer': 'You are a detailed writer. Expand the following text with more details and examples. Return ONLY the expanded text, no explanations.',
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: systemPrompts[type as keyof typeof systemPrompts] || systemPrompts.improve,
        },
        {
          role: 'user',
          content: context ? `Context: ${context}\n\nTask: ${prompt}` : prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    const generatedText = completion.choices[0]?.message?.content || ''

    res.status(200).json({ text: generatedText })
  } catch (error: any) {
    console.error('OpenAI API Error:', error)
    res.status(500).json({ 
      error: error.message || 'Failed to generate content. Please try again.' 
    })
  }
}
