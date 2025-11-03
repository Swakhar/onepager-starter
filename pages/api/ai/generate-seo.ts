import type { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { content, industry, brandName, currentUrl } = req.body

  if (!content) {
    return res.status(400).json({ error: 'Content is required' })
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

    const prompt = `Based on this content, generate SEO-optimized meta tags:

Content: ${content}
${brandName ? `Brand: ${brandName}` : ''}
${industry ? `Industry: ${industry}` : ''}

Return ONLY a JSON object with this exact structure (no markdown, no explanation):
{
  "title": "SEO title (50-60 characters, includes main keyword)",
  "description": "Meta description (150-160 characters, compelling and keyword-rich)",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "ogTitle": "Open Graph title (social media preview)",
  "ogDescription": "Open Graph description (social media preview)"
}

Requirements:
- Title should be catchy and include primary keyword
- Description should be action-oriented and include a call-to-action
- Keywords should be relevant and varied (3-7 keywords)
- OG title/description optimized for social sharing
- All text should be natural, not keyword-stuffed`

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert SEO specialist. You only respond with valid JSON objects, no markdown formatting. You understand search intent, keyword research, and how to write compelling meta descriptions that drive clicks.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 400,
    })

    const responseContent = response.choices[0]?.message?.content?.trim()
    
    if (!responseContent) {
      throw new Error('No response from AI')
    }

    // Parse JSON (remove any potential markdown formatting)
    const cleanContent = responseContent.replace(/```json\n?|\n?```/g, '').trim()
    const seoData = JSON.parse(cleanContent)

    // Validate SEO data structure
    if (!seoData.title || !seoData.description || !seoData.keywords) {
      throw new Error('Invalid SEO data structure')
    }

    return res.status(200).json({ seo: seoData })
  } catch (error: any) {
    console.error('SEO generation error:', error)
    
    // Fallback: Return basic SEO data
    const fallbackSeo = {
      title: brandName ? `${brandName} | Professional Portfolio` : 'Professional Portfolio',
      description: 'Explore my work, skills, and experience. Get in touch to discuss your next project.',
      keywords: ['portfolio', 'professional', industry || 'developer', 'projects', 'hire'],
      ogTitle: brandName ? `${brandName} | Portfolio` : 'Professional Portfolio',
      ogDescription: 'Check out my latest work and projects.',
    }

    return res.status(200).json({ 
      seo: fallbackSeo,
      fallback: true,
      message: 'Using fallback SEO due to: ' + error.message
    })
  }
}
