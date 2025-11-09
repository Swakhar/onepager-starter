import { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// CRITICAL: Increase body size limit to 10MB for image uploads
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}

// COST OPTIMIZATION NOTES:
// - gpt-4o-mini: ~$0.01/image (10x cheaper than gpt-4o) - RECOMMENDED ✅
// - detail: 'high' = better analysis (~$0.01), 'low' = ultra cheap (~$0.003) but less accurate
// - For production with high traffic, consider 'low' detail or caching results
// - Current config: gpt-4o-mini with 'high' detail = best balance of cost/quality

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

  const prompt = `You are an expert web designer analyzing a website screenshot for design inspiration. Your job is to extract visual design elements (colors, fonts, layout) from ANY website screenshot, regardless of its industry or purpose.

CRITICAL INSTRUCTIONS:
1. You MUST respond with ONLY valid JSON - no explanations before or after
2. Analyze ANY website screenshot provided - restaurant, e-commerce, blog, portfolio, corporate, etc.
3. Extract ONLY visual design elements (colors, fonts, spacing, layout style)
4. The screenshot's industry/purpose can differ from the target template - that's expected and good!
5. If you cannot see details clearly, make reasonable design estimates
6. Your response must start with { and end with }
7. NEVER refuse to analyze a website screenshot

CURRENT TEMPLATE INFO (Target to apply design to):
Template Type: ${currentTemplate?.template || 'modern-portfolio'}
Current Sections: ${JSON.stringify(currentTemplate?.sectionOrder || [])}
Template Purpose: ${getTemplatePurpose(currentTemplate?.template)}

EXAMPLES OF VALID CROSS-DOMAIN ANALYSIS:
✓ Restaurant screenshot → Portfolio template: Extract warm colors, elegant fonts, keep portfolio structure
✓ E-commerce screenshot → Portfolio template: Extract modern colors, clean layout, keep portfolio sections
✓ Corporate screenshot → Portfolio template: Extract professional palette, formal typography, keep portfolio flow
✓ Blog screenshot → Portfolio template: Extract readable fonts, content spacing, keep portfolio sections

The screenshot and template type DON'T need to match - we're only extracting visual design inspiration!

REQUIRED JSON OUTPUT FORMAT (copy this structure exactly):
{
  "colorPalette": {
    "primary": "#3B82F6",
    "secondary": "#8B5CF6",
    "accent": "#EC4899",
    "background": "#FFFFFF",
    "backgroundAlt": "#F9FAFB",
    "text": "#111827",
    "textSecondary": "#6B7280"
  },
  "typography": {
    "headingFont": "Inter",
    "bodyFont": "Inter",
    "style": "modern"
  },
  "layout": {
    "structure": "single-column",
    "spacing": "normal",
    "alignment": "center"
  },
  "components": {
    "hasHero": true,
    "heroStyle": "full-screen",
    "hasTestimonials": false,
    "hasProjects": true,
    "hasServices": true,
    "ctaStyle": "button"
  },
  "mood": "professional",
  "industry": "tech",
  "description": "Clean modern design with blue accent colors",
  "screenshotPurpose": "portfolio|ecommerce|blog|saas|restaurant|corporate|other",
  "adaptationStrategy": {
    "isCompatible": true,
    "reasoning": "Restaurant design has warm, inviting colors that can enhance portfolio's visual appeal",
    "recommendations": [
      "Apply warm color palette from restaurant to portfolio",
      "Use elegant typography for headings",
      "Keep portfolio section structure (hero, about, projects)",
      "Add restaurant's welcoming mood to portfolio hero"
    ],
    "sectionsToKeep": ["hero", "about", "projects"],
    "sectionsToAdd": [],
    "sectionsToRemove": [],
    "contentGuidance": "Apply visual design only - colors, fonts, spacing. Keep portfolio content and structure."
  }
}

KEY POINT: Even if screenshot is a restaurant and template is portfolio, analyze it! Extract colors, fonts, and layout style. In adaptationStrategy, explain how to apply restaurant's visual design to portfolio template.

IMPORTANT: Respond with ONLY the JSON object above. No markdown, no explanations, just the JSON.`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // COST-EFFECTIVE: ~$0.01 per image vs gpt-4o ~$0.10 (10x cheaper, still excellent quality)
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            {
              type: 'image_url',
              image_url: {
                url: imageUrl || `data:image/jpeg;base64,${imageBase64}`,
                detail: 'high', // 'high' for detailed analysis, 'low' for even cheaper but less detail
              },
            },
          ],
        },
      ],
      max_tokens: 1500,
    })

    const content = completion.choices[0]?.message?.content || '{}'
    
    console.log('GPT-4o Response:', content.substring(0, 200)) // Log first 200 chars for debugging
    
    // Check if model refused to analyze (common responses)
    if (content.toLowerCase().includes("i'm unable") || 
        content.toLowerCase().includes("i cannot") ||
        content.toLowerCase().includes("i can't") ||
        content.toLowerCase().includes("i apologize")) {
      console.error('GPT-4o refused to analyze:', content.substring(0, 500))
      return res.status(400).json({ 
        error: 'Image analysis failed', 
        details: content.substring(0, 500),
        suggestion: 'The AI had trouble analyzing this image. This could be due to:\n• Image quality or resolution issues\n• Unclear or obscured website content\n• Technical limitations\n\nTry:\n• Taking a clearer screenshot\n• Using a different browser/device\n• Capturing a different section of the website\n\nNote: Cross-domain analysis (e.g., restaurant → portfolio) is fully supported!'
      })
    }
    
    // Extract JSON from potential markdown code blocks or raw JSON
    let jsonString = content
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
    
    let analysis
    try {
      analysis = JSON.parse(jsonString.trim())
    } catch (parseError) {
      console.error('JSON Parse Error. Raw content:', content)
      return res.status(500).json({ 
        error: 'Failed to parse AI response', 
        details: 'The AI returned an invalid format. This might be due to image content or format issues.',
        rawResponse: content.substring(0, 500)
      })
    }

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

// Helper functions for design auditing
function checkColorContrast(colors: any): boolean {
  // Simple heuristic: check if text and background have sufficient contrast
  if (!colors.text || !colors.background) return false
  
  const textLuminance = getRelativeLuminance(colors.text)
  const bgLuminance = getRelativeLuminance(colors.background)
  const contrast = (Math.max(textLuminance, bgLuminance) + 0.05) / (Math.min(textLuminance, bgLuminance) + 0.05)
  
  return contrast < 4.5 // WCAG AA minimum for normal text
}

function getRelativeLuminance(hex: string): number {
  // Convert hex to RGB
  const rgb = parseInt(hex.replace('#', ''), 16)
  const r = (rgb >> 16) & 0xff
  const g = (rgb >> 8) & 0xff
  const b = rgb & 0xff
  
  // Convert to relative luminance
  const [rs, gs, bs] = [r, g, b].map(c => {
    const val = c / 255
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4)
  })
  
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

function checkFontReadability(fonts: any): boolean {
  // Check if heading and body fonts are too similar or hard to read
  if (!fonts.heading || !fonts.body) return true
  
  // Issue if same font for both (no hierarchy)
  if (fonts.heading === fonts.body) return true
  
  // Issue if using difficult-to-read decorative fonts
  const decorativeFonts = ['Comic Sans', 'Papyrus', 'Brush Script', 'Curlz']
  return decorativeFonts.some(font => 
    fonts.heading?.includes(font) || fonts.body?.includes(font)
  )
}

function checkSectionOrder(sections: string[]): boolean {
  // Check if section order follows best practices
  if (!sections || sections.length === 0) return false
  
  // Best practice: Hero should be first
  if (sections[0] !== 'hero') return true
  
  // Contact should typically be last
  const contactIndex = sections.indexOf('contact')
  if (contactIndex !== -1 && contactIndex < sections.length - 2) return true
  
  return false
}

// Transfer style from reference to current template
async function styleTransfer(req: NextApiRequest, res: NextApiResponse) {
  const { referenceStyle, currentData, transferOptions, imageUrl, imageBase64, currentTemplate } = req.body

  // IMPORTANT: Style transfer now uses the same screenshot analysis as analyzeScreenshot
  // This ensures ANY website works (not just popular ones GPT knows about)
  // 
  // NOTE: URL input is NOT supported directly because:
  // - AI models cannot browse/access external URLs
  // - We would need server-side screenshot capture (requires puppeteer/playwright)
  // 
  // SOLUTION: Users should upload a screenshot of the reference website instead
  // This works for ANY website (popular or unpopular) and is more reliable
  
  let designAnalysis: any = null

  // If screenshot is provided, analyze it first
  if (imageUrl || imageBase64 || referenceStyle?.imageBase64) {
    try {
      // Use the same screenshot analysis logic
      const screenshotPrompt = `You are an expert web designer analyzing a website screenshot for design inspiration. Extract ONLY visual design elements.

CRITICAL INSTRUCTIONS:
1. You MUST respond with ONLY valid JSON - no explanations
2. Extract colors, fonts, spacing, layout style from the screenshot
3. Your response must start with { and end with }

REQUIRED JSON OUTPUT:
{
  "colorPalette": {
    "primary": "#hex",
    "secondary": "#hex",
    "accent": "#hex",
    "background": "#hex",
    "backgroundAlt": "#hex",
    "text": "#hex",
    "textSecondary": "#hex"
  },
  "typography": {
    "headingFont": "font-name",
    "bodyFont": "font-name",
    "style": "modern|elegant|minimal|bold"
  },
  "layout": {
    "spacing": "compact|normal|spacious",
    "alignment": "left|center|right"
  },
  "mood": "professional|creative|friendly|luxury",
  "description": "Brief style description"
}`

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini', // COST-EFFECTIVE: Same as analyzeScreenshot
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: screenshotPrompt },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl || `data:image/jpeg;base64,${imageBase64 || referenceStyle?.imageBase64}`,
                  detail: 'high',
                },
              },
            ],
          },
        ],
        max_tokens: 1000,
      })

      const content = completion.choices[0]?.message?.content || '{}'
      
      // Extract JSON (same logic as analyzeScreenshot)
      let jsonString = content
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

      designAnalysis = JSON.parse(jsonString.trim())
    } catch (error: any) {
      console.error('Screenshot analysis failed in styleTransfer:', error)
      return res.status(500).json({ 
        error: 'Failed to analyze reference screenshot',
        details: error.message 
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
  const applyPrompt = `You are a web design expert. Apply a reference design style to the user's website while preserving their content.

REFERENCE DESIGN STYLE:
${JSON.stringify(designAnalysis, null, 2)}

CURRENT WEBSITE DATA:
Template: ${currentData?.template || 'modern-portfolio'}
Current Colors: ${JSON.stringify(currentData?.colors || {})}
Current Fonts: ${JSON.stringify(currentData?.fonts || {})}

TRANSFER OPTIONS (what user wants to apply):
- Colors: ${transferOptions?.colors !== false ? 'YES' : 'NO'}
- Fonts: ${transferOptions?.fonts !== false ? 'YES' : 'NO'}  
- Layout: ${transferOptions?.layout !== false ? 'YES' : 'NO'}
- Spacing: ${transferOptions?.spacing !== false ? 'YES' : 'NO'}

CRITICAL RULES:
1. ONLY apply what user requested in transfer options
2. Preserve all user content - never change text/images
3. Adapt reference style to fit user's template type
4. Output ONLY valid JSON

REQUIRED JSON OUTPUT:
{
  "colorScheme": {
    "primary": "#hex",
    "secondary": "#hex",
    "accent": "#hex",
    "background": "#hex",
    "backgroundAlt": "#hex",
    "text": "#hex",
    "textSecondary": "#hex"
  },
  "fonts": {
    "heading": "font-family",
    "body": "font-family",
    "style": "modern|elegant|minimal"
  },
  "layoutChanges": {
    "spacing": "compact|normal|spacious"
  },
  "explanation": "Brief explanation of what was applied",
  "recommendations": [
    "Additional suggestion 1",
    "Additional suggestion 2"
  ]
}

IMPORTANT: Respond with ONLY the JSON object above. No markdown, no explanations outside JSON.`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // COST-EFFECTIVE: Using cheaper model for style application (no vision needed)
      messages: [
        { role: 'system', content: 'You are an expert web designer who helps apply design styles while preserving user content. Output only valid JSON.' },
        { role: 'user', content: applyPrompt },
      ],
      temperature: 0.7,
      max_tokens: 1000,
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
    aboutTitle: currentData?.about?.title || '',
  }

  // Smart analysis based on design principles
  const hasLowContrast = checkColorContrast(essentialData.colors)
  const hasReadabilityIssues = checkFontReadability(essentialData.fonts)
  const hasSectionOrderIssues = checkSectionOrder(essentialData.sections)

  const prompt = `You are an expert UX/UI designer and web design consultant. Analyze this website and provide 3-5 HIGH-IMPACT, ACTIONABLE improvement suggestions based on modern design principles.

CURRENT DESIGN STATE:
Template: ${essentialData.template}
Colors: ${JSON.stringify(essentialData.colors)}
Fonts: ${JSON.stringify(essentialData.fonts)}
Section Order: ${JSON.stringify(essentialData.sections)}
Hero Title: "${essentialData.heroTitle}"
About Title: "${essentialData.aboutTitle}"

ANALYTICS (if available): ${analytics ? `Bounce rate: ${analytics.bounceRate}%` : 'No analytics data available'}

DESIGN AUDIT FINDINGS:
- Color Contrast: ${hasLowContrast ? '⚠️ ISSUE: Low contrast detected (accessibility concern)' : '✅ Good contrast'}
- Typography: ${hasReadabilityIssues ? '⚠️ ISSUE: Font pairing could be improved' : '✅ Good font pairing'}
- Section Flow: ${hasSectionOrderIssues ? '⚠️ ISSUE: Unconventional section order' : '✅ Logical section flow'}

YOUR TASK:
1. Prioritize issues that impact conversion, accessibility, and user experience
2. Provide SPECIFIC, IMPLEMENTABLE solutions (exact hex codes, font names, section orders)
3. Explain WHY each change helps (data-driven reasoning)
4. Focus on quick wins with high impact

CRITICAL: Each suggestion MUST have a valid action that can be applied immediately.

ACTION TYPES YOU CAN USE:
- "apply-color": Apply specific color values { primary: "#hex", secondary: "#hex", ... }
- "apply-font": Apply specific fonts { heading: "Font Name", body: "Font Name" }
- "reorder-sections": Reorder sections { order: ["hero", "about", "projects", ...] }
- "add-section": Add missing section { section: "testimonials|services|contact" }
- "update-spacing": Change spacing { spacing: "compact|normal|spacious" }

REQUIRED JSON OUTPUT:
{
  "suggestions": [
    {
      "id": "improve-contrast",
      "type": "color",
      "priority": "high",
      "title": "Improve Color Contrast for Accessibility",
      "description": "Current text-background contrast ratio is 3.2:1. WCAG AAA requires 7:1 for better readability. This affects 15% of users with visual impairments.",
      "action": {
        "type": "apply-color",
        "params": {
          "text": "#1F2937",
          "background": "#FFFFFF",
          "textSecondary": "#4B5563"
        }
      },
      "expectedImpact": "Improves readability by 40% and meets WCAG AAA standards. Studies show 25% increase in time-on-page with better contrast."
    }
  ],
  "overallScore": 75,
  "strengths": ["Clear hierarchy", "Modern aesthetic", "Mobile responsive"],
  "areasToImprove": ["Color accessibility", "Font readability", "Call-to-action visibility"]
}

SUGGESTION PRIORITY GUIDELINES:
- HIGH: Accessibility issues, broken UX, conversion blockers
- MEDIUM: Design improvements, optimization opportunities  
- LOW: Nice-to-have enhancements, aesthetic tweaks

BEST PRACTICES TO CHECK:
1. **Accessibility**: WCAG 2.1 AA compliance (contrast 4.5:1 minimum)
2. **Typography**: Max 2-3 fonts, heading/body distinction, readable sizes (16px+ body)
3. **Color Psychology**: Match colors to industry (blue=trust, orange=energy, green=growth)
4. **Section Order**: Hero → Value Prop → Social Proof → CTA (proven conversion flow)
5. **Visual Hierarchy**: Clear focal points, F-pattern layout, whitespace usage

IMPORTANT: 
- Respond with ONLY valid JSON
- Include 3-5 suggestions (prioritize by impact)
- Make action.params SPECIFIC (exact values, not descriptions)
- Base recommendations on design data and UX research`

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
