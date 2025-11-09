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
  const { command, currentData, currentColors, currentFonts, currentSectionOrder } = req.body

  // Extract only essential info to reduce token count
  const essentialData = {
    template: currentData?.template || 'modern-portfolio',
    sectionOrder: currentSectionOrder || [], // FIXED: Use actual section order from site.settings.layout
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

  const prompt = `You are an intelligent web design AI assistant like ChatGPT. Process this natural language command and make ONLY the changes the user wants.

USER COMMAND: "${command}"

CURRENT STATE:
Colors: ${JSON.stringify(currentColors)}
Fonts: ${JSON.stringify(currentFonts)}
Template: ${essentialData.template}
Sections: ${JSON.stringify(essentialData.sectionOrder)}
Available: ${JSON.stringify(essentialData.hasSections)}

CRITICAL RULES:
1. **Be specific** - If user says "change color to blue", ONLY change primary color to blue
2. **Preserve content** - NEVER delete content unless user explicitly says "delete content"
3. **Remove vs Hide** - "Remove section" means hide it (remove from sectionOrder), NOT delete data
4. **Smart inference** - "Make it professional" = change colors + fonts, "warmer" = orange/red colors only
5. **No over-engineering** - Don't add things user didn't ask for
6. **Context aware** - Understand variations like "remove", "hide", "get rid of", "take out" all mean the same

COMMAND INTERPRETATION EXAMPLES:
✅ "Remove About Me Section" → components.remove: ["about"] (hide section, keep data)
✅ "Change color to blue" → colors.primary: "#3B82F6" (only primary)
✅ "Make text darker" → colors.text: "#111111" (only text color)
✅ "Use modern fonts" → fonts.heading + fonts.body (both fonts)
✅ "Make it warmer" → colors (warm palette), NOT fonts/layout
✅ "Add testimonials" → components.add: ["testimonials"]
✅ "Change hero title to Welcome" → content.hero.title: "Welcome"
✅ "Make buttons bigger" → (no API support, suggest manual edit)

❌ "Remove section" → DON'T delete content data
❌ "Change color" → DON'T change fonts/layout/content
❌ "Make professional" → DON'T remove sections

OUTPUT FORMAT (valid JSON only):
{
  "changes": {
    "colors": { "primary": "#hex", "secondary": "#hex", ... },
    "fonts": { "heading": "font", "body": "font" },
    "content": { "hero": { "title": "text", "subtitle": "text" } },
    "layout": { "spacing": "compact|normal|spacious", "sectionOrder": ["hero", "about", ...] },
    "components": { 
      "add": ["testimonials"],
      "remove": ["about"]  // ONLY removes from view, data preserved
    },
    "animations": { "entranceEffect": "fade-in", "enableHoverEffects": true }
  },
  "explanation": "Brief explanation of what you changed",
  "additionalSuggestions": ["Related suggestion"]
}

IMPORTANT: 
- Only include properties that are ACTUALLY changing
- Be conservative - less is more
- If command is unclear, make minimal safe changes
- components.remove NEVER deletes data, only hides section`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { 
          role: 'system', 
          content: `You are an intelligent design AI that processes natural language commands precisely. 

KEY PRINCIPLES:
1. Be surgical - only change what user explicitly requests
2. "Remove/hide section" = remove from sectionOrder ONLY, preserve data
3. "Change color" = only color properties, never fonts/layout
4. Understand synonyms: "remove"="hide"="take out"="get rid of"
5. Be conservative - when unsure, make minimal changes

CORRECT INTERPRETATIONS:
"Remove About section" → components.remove: ["about"]
"Change to blue" → colors.primary: "#3B82F6" 
"Darker text" → colors.text: "#111"
"Add testimonials" → components.add: ["testimonials"]

INCORRECT (never do these):
"Remove section" → DON'T delete content data
"Change color" → DON'T change fonts
"Professional look" → DON'T remove sections`
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7, // Lower temperature for more precise/consistent results
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

  // Extract only essential info to reduce token count
  const essentialData = {
    template: currentData?.template || 'modern-portfolio',
    colors: currentData?.colors || {},
    fonts: currentData?.fonts || {},
    sections: currentData?.sectionOrder || [],
    heroTitle: currentData?.hero?.title || '',
  }

  const prompt = `Analyze this website and provide 3-5 improvement suggestions.

CURRENT STATE:
Template: ${essentialData.template}
Colors: ${JSON.stringify(essentialData.colors)}
Fonts: ${JSON.stringify(essentialData.fonts)}
Sections: ${JSON.stringify(essentialData.sections)}
Hero: "${essentialData.heroTitle}"

Analytics: ${analytics ? `Bounce rate: ${analytics.bounceRate}%` : 'No data'}

OUTPUT FORMAT (valid JSON only):
{
  "suggestions": [
    {
      "id": "unique-id",
      "type": "color|font|layout|content|seo",
      "priority": "high|medium|low",
      "title": "Short title",
      "description": "Why this helps",
      "action": {
        "type": "apply-color|apply-font|reorder-sections|add-section",
        "params": { /* specific parameters */ }
      },
      "expectedImpact": "Measurable improvement"
    }
  ],
  "overallScore": 75,
  "strengths": ["strength 1"],
  "areasToImprove": ["area 1"]
}

EXAMPLES:
- Color contrast issue → apply-color with accessible colors
- Font readability → apply-font with better pairing
- Section order → reorder-sections with optimal flow
- Missing section → add-section (testimonials)

Keep suggestions actionable and specific.`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Using GPT-3.5 for faster processing and lower token usage
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
