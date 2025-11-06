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

  try {
    const { type, data } = req.body

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

// Analyze a screenshot and extract design elements
async function analyzeScreenshot(req: NextApiRequest, res: NextApiResponse) {
  const { imageUrl, imageBase64, currentTemplate } = req.body

  const prompt = `You are an expert web designer analyzing a website screenshot. Extract design elements AND provide intelligent adaptation recommendations.

CURRENT TEMPLATE INFO:
Template Type: ${currentTemplate?.template || 'modern-portfolio'}
Current Sections: ${JSON.stringify(currentTemplate?.sectionOrder || [])}
Template Purpose: ${getTemplatePurpose(currentTemplate?.template)}

TASK: Analyze the screenshot and extract design elements. If the screenshot's purpose differs from the current template, provide adaptation strategies.

OUTPUT ONLY valid JSON:
{
  "colorPalette": {
    "primary": "#hexcode",
    "secondary": "#hexcode",
    "accent": "#hexcode",
    "background": "#hexcode",
    "backgroundAlt": "#hexcode",
    "text": "#hexcode",
    "textSecondary": "#hexcode"
  },
  "typography": {
    "headingFont": "font-family name",
    "bodyFont": "font-family name",
    "style": "modern|elegant|minimal|bold|playful"
  },
  "layout": {
    "structure": "single-column|two-column|grid|masonry",
    "spacing": "compact|normal|spacious",
    "alignment": "left|center|right"
  },
  "components": {
    "hasHero": true|false,
    "heroStyle": "full-screen|split|minimal|video",
    "hasTestimonials": true|false,
    "hasProjects": true|false,
    "hasServices": true|false,
    "ctaStyle": "button|link|banner"
  },
  "mood": "professional|creative|corporate|friendly|luxury|playful",
  "industry": "tech|design|business|education|ecommerce|restaurant|healthcare|other",
  "description": "Brief description of the overall design style",
  "screenshotPurpose": "portfolio|ecommerce|blog|saas|restaurant|corporate|other",
  "adaptationStrategy": {
    "isCompatible": true|false,
    "reasoning": "Why screenshot matches or differs from current template",
    "recommendations": [
      "Keep portfolio structure but apply e-commerce color scheme",
      "Use spacious layout from screenshot",
      "Adapt hero style to match screenshot"
    ],
    "sectionsToKeep": ["hero", "about", "projects"],
    "sectionsToAdd": ["services", "testimonials"],
    "sectionsToRemove": [],
    "contentGuidance": "How to adapt content from screenshot to current template"
  }
}

ADAPTATION EXAMPLES:
- If screenshot is e-commerce but template is portfolio → Extract visual style (colors, fonts), suggest keeping portfolio structure, recommend adding services/pricing sections
- If screenshot is corporate but template is creative → Extract professional color palette, suggest minimal layout, keep creative sections
- If screenshot matches template type → Apply design directly with high compatibility

Analyze the screenshot comprehensively.`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            {
              type: 'image_url',
              image_url: {
                url: imageUrl || `data:image/jpeg;base64,${imageBase64}`,
              },
            },
          ],
        },
      ],
      max_tokens: 1500,
    })

    const content = completion.choices[0]?.message?.content || '{}'
    
    // Extract JSON from potential markdown code blocks
    const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/\{[\s\S]*\}/)
    const jsonString = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content
    
    const analysis = JSON.parse(jsonString.trim())

    return res.status(200).json({
      success: true,
      analysis,
      message: 'Screenshot analyzed successfully',
    })
  } catch (error: any) {
    console.error('Screenshot analysis error:', error)
    return res.status(500).json({ error: 'Failed to analyze screenshot', details: error.message })
  }
}

// Helper function to get template purpose
function getTemplatePurpose(templateId?: string): string {
  const purposes: Record<string, string> = {
    'modern-portfolio': 'Personal portfolio showcasing projects and skills',
    'business-card': 'Professional business card / landing page',
    'creative-resume': 'Creative resume / CV with experience and education',
  }
  return purposes[templateId || ''] || 'General purpose website'
}

// Transfer style from reference to current template
async function styleTransfer(req: NextApiRequest, res: NextApiResponse) {
  const { referenceStyle, currentData, transferOptions } = req.body

  const prompt = `You are a web design expert. A user wants to apply a design style to their website.

REFERENCE STYLE:
${JSON.stringify(referenceStyle, null, 2)}

CURRENT WEBSITE DATA:
${JSON.stringify(currentData, null, 2)}

TRANSFER OPTIONS:
- Colors: ${transferOptions?.colors !== false}
- Fonts: ${transferOptions?.fonts !== false}
- Layout: ${transferOptions?.layout !== false}
- Spacing: ${transferOptions?.spacing !== false}

Generate updated design settings that apply the reference style while preserving the user's content. Output ONLY valid JSON:

{
  "colorScheme": {
    "primary": "#hexcode",
    "secondary": "#hexcode",
    "accent": "#hexcode",
    "background": "#hexcode",
    "backgroundAlt": "#hexcode",
    "text": "#hexcode",
    "textSecondary": "#hexcode"
  },
  "fonts": {
    "heading": "font-family",
    "body": "font-family",
    "style": "modern|elegant|minimal"
  },
  "layoutChanges": {
    "sectionOrder": ["hero", "about", "services"],
    "spacing": "compact|normal|spacious"
  },
  "recommendations": [
    "Suggestion 1",
    "Suggestion 2"
  ]
}`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are an expert web designer who helps transfer design styles between websites.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    })

    const content = completion.choices[0]?.message?.content || '{}'
    const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/\{[\s\S]*\}/)
    const jsonString = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content
    
    const updatedDesign = JSON.parse(jsonString.trim())

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

// Process natural language design commands
async function processNaturalCommand(req: NextApiRequest, res: NextApiResponse) {
  const { command, currentData, currentColors, currentFonts } = req.body

  const prompt = `You are a web design AI assistant. Process this design command and output comprehensive changes as JSON.

USER COMMAND: "${command}"

CURRENT DESIGN STATE:
Colors: ${JSON.stringify(currentColors)}
Fonts: ${JSON.stringify(currentFonts)}
Template: ${currentData?.template || 'modern-portfolio'}
Current Sections: ${JSON.stringify(currentData?.sectionOrder || [])}
Hero Data: ${JSON.stringify(currentData?.hero || {})}

Generate ONLY valid JSON with ALL possible changes. You can modify:
- Colors (all 7 properties)
- Fonts (heading, body)
- Content (hero text, descriptions, CTAs)
- Layout (spacing, alignment, section order)
- Components (add/remove sections)
- Animations (entrance effects, hover states)
- Specific sections (target hero, about, services, etc.)

OUTPUT FORMAT (valid JSON only):
{
  "changes": {
    "colors": {
      "primary": "#hexcode",
      "secondary": "#hexcode",
      "accent": "#hexcode",
      "background": "#hexcode",
      "backgroundAlt": "#hexcode",
      "text": "#hexcode",
      "textSecondary": "#hexcode"
    },
    "fonts": {
      "heading": "font-family",
      "body": "font-family"
    },
    "content": {
      "hero": {
        "title": "new title if command requests it",
        "subtitle": "new subtitle",
        "cta": "new CTA text"
      },
      "about": {
        "description": "updated description"
      }
    },
    "layout": {
      "spacing": "compact|normal|spacious",
      "alignment": "left|center|right",
      "sectionOrder": ["hero", "about", "services", "projects", "contact"]
    },
    "components": {
      "add": ["testimonials", "services"],
      "remove": ["projects"],
      "modify": {
        "hero": {
          "style": "full-screen|split|minimal",
          "hasImage": true|false
        }
      }
    },
    "animations": {
      "entranceEffect": "fade-in|slide-up|zoom-in|none",
      "enableHoverEffects": true|false
    }
  },
  "explanation": "Detailed explanation of ALL changes made and why",
  "additionalSuggestions": [
    "Related suggestion 1",
    "Related suggestion 2"
  ]
}

COMMAND EXAMPLES & EXPECTED BEHAVIOR:
- "Make it look warmer" → Warm orange/red colors, friendly fonts
- "Make it more professional" → Blue/gray corporate colors, sans-serif fonts
- "Change all buttons to blue" → Update primary/accent to blue
- "Make it look like Apple's website" → Clean white/gray, SF Pro style, minimal
- "Add more contrast" → Darker text, lighter backgrounds
- "Make the hero more engaging" → Update hero content, add dynamic CTA, suggest image
- "Reorganize sections to emphasize services" → Move services section higher
- "Add testimonials section" → Include testimonials in components.add
- "Remove the projects section" → Include projects in components.remove
- "Make it playful and fun" → Bright colors, rounded fonts, add animations
- "Change the hero title to 'Welcome to Innovation'" → Update content.hero.title
- "Add smooth animations" → Enable entrance effects and hover states
- "Make it look more modern and tech-focused" → Update colors, fonts, and suggest minimal layout

IMPORTANT: Only include properties that are actually being changed. If command doesn't mention content, don't include content object. If it's only about colors, only return colors.`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are an advanced AI design assistant that processes natural language commands and outputs comprehensive structured JSON changes. You can modify colors, fonts, content, layout, components, and animations.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 2000,
    })

    const content = completion.choices[0]?.message?.content || '{}'
    const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/\{[\s\S]*\}/)
    const jsonString = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content
    
    const result = JSON.parse(jsonString.trim())

    return res.status(200).json({
      success: true,
      ...result,
    })
  } catch (error: any) {
    console.error('Natural command error:', error)
    return res.status(500).json({ error: 'Failed to process command', details: error.message })
  }
}

// Generate smart suggestions based on current state
async function generateSmartSuggestions(req: NextApiRequest, res: NextApiResponse) {
  const { currentData, analytics } = req.body

  const prompt = `You are a web design consultant. Analyze this website and provide smart improvement suggestions.

CURRENT WEBSITE:
${JSON.stringify(currentData, null, 2)}

ANALYTICS DATA:
${JSON.stringify(analytics || {}, null, 2)}

Generate ONLY valid JSON with actionable suggestions. IMPORTANT: Each suggestion MUST have a valid action object with specific parameters.

OUTPUT FORMAT (valid JSON only):
{
  "suggestions": [
    {
      "id": "unique-id",
      "type": "color|font|layout|content|seo",
      "priority": "high|medium|low",
      "title": "Short actionable title",
      "description": "Detailed explanation of the issue and why this change helps",
      "action": {
        "type": "apply-color|apply-font|reorder-sections|add-section|update-spacing|update-content",
        "params": {
          // For apply-color: exact color values
          "primary": "#hexcode",
          "text": "#hexcode"
          
          // For apply-font: exact font names
          "heading": "Font Name",
          "body": "Font Name"
          
          // For reorder-sections: exact new order
          "order": ["hero", "services", "about", "projects", "contact"]
          
          // For add-section: section name
          "section": "testimonials"
          
          // For update-spacing: spacing value
          "spacing": "spacious"
          
          // For update-content: section and changes
          "section": "hero",
          "changes": { "title": "New title" }
        }
      },
      "expectedImpact": "Specific measurable improvement this will bring"
    }
  ],
  "overallScore": 75,
  "strengths": ["Specific strength 1", "Specific strength 2"],
  "areasToImprove": ["Specific area 1", "Specific area 2"]
}

EXAMPLE SUGGESTIONS:
1. Color Contrast Issue:
{
  "id": "color-contrast-1",
  "type": "color",
  "priority": "high",
  "title": "Improve Text Contrast",
  "description": "Current text color #666666 has insufficient contrast (3.2:1) with background. WCAG AA requires 4.5:1 for body text.",
  "action": {
    "type": "apply-color",
    "params": {
      "text": "#222222",
      "textSecondary": "#555555"
    }
  },
  "expectedImpact": "Better readability and accessibility, improved SEO"
}

2. Font Optimization:
{
  "id": "font-optimization-1",
  "type": "font",
  "priority": "medium",
  "title": "Use System Fonts for Speed",
  "description": "Custom fonts add 200kb to page load. System fonts are faster and provide native feel.",
  "action": {
    "type": "apply-font",
    "params": {
      "heading": "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      "body": "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    }
  },
  "expectedImpact": "Faster page load (0.5s improvement), better performance score"
}

3. Section Reordering:
{
  "id": "section-order-1",
  "type": "layout",
  "priority": "medium",
  "title": "Move Services Section Higher",
  "description": "Services are your key offering. Moving them before About can improve conversion by 15-20%.",
  "action": {
    "type": "reorder-sections",
    "params": {
      "order": ["hero", "services", "about", "projects", "testimonials", "contact"]
    }
  },
  "expectedImpact": "Higher engagement with service offerings, improved conversion rate"
}

Analyze the current website and provide 3-5 actionable suggestions with VALID action objects.`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are an expert web design consultant providing actionable improvement suggestions.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    })

    const content = completion.choices[0]?.message?.content || '{}'
    const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/\{[\s\S]*\}/)
    const jsonString = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content
    
    const suggestions = JSON.parse(jsonString.trim())

    return res.status(200).json({
      success: true,
      ...suggestions,
    })
  } catch (error: any) {
    console.error('Smart suggestions error:', error)
    return res.status(500).json({ error: 'Failed to generate suggestions', details: error.message })
  }
}
