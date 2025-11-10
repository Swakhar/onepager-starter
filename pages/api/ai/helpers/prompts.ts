/**
 * AI Prompts for Visual Builder
 * 
 * Centralized location for all AI prompts used in the visual builder.
 * This makes it easy to update prompts and maintain consistency.
 */

export function getScreenshotAnalysisPrompt(currentTemplate: any): string {
  return `You are an expert web designer analyzing a website screenshot for design inspiration. Your job is to extract visual design elements (colors, fonts, layout) from ANY website screenshot, regardless of its industry or purpose.

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
}

export function getStyleTransferPrompt(
  designAnalysis: any,
  currentData: any,
  transferOptions: any
): string {
  return `You are a web design expert. Apply a reference design style to the user's website while preserving their content.

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
}

export function getNaturalCommandPrompt(
  command: string,
  essentialData: any,
  currentColors: any,
  currentFonts: any
): string {
  return `You are an intelligent web design AI assistant like ChatGPT. Process this natural language command and make ONLY the changes the user wants.

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
}

export function getSmartSuggestionsPrompt(
  essentialData: any,
  analytics: any,
  hasLowContrast: boolean,
  hasReadabilityIssues: boolean,
  hasSectionOrderIssues: boolean
): string {
  return `You are an expert UX/UI designer and web design consultant. Analyze this website and provide 3-5 HIGH-IMPACT, ACTIONABLE improvement suggestions based on modern design principles.

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
