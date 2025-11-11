/**
 * Template Selector & Design System Generator
 * 
 * Helper functions for:
 * 1. Selecting the best template based on site type
 * 2. Generating industry-appropriate color schemes
 * 3. Creating font pairings
 * 4. Determining section order based on content
 */

import { PromptAnalysis } from './prompt-analyzer'

export interface ColorScheme {
  primary: string
  secondary: string
  accent: string
  background: string
  backgroundAlt: string
  text: string
  textSecondary: string
}

export interface FontScheme {
  heading: string
  body: string
  headingSizes: {
    h1: string
    h2: string
    h3: string
  }
}

export interface DesignSystem {
  colors: ColorScheme
  fonts: FontScheme
}

/**
 * Select best template based on site type
 * 
 * TEMPLATE MAPPING:
 * - portfolio → modern-portfolio (showcase work)
 * - business/restaurant → business-card (professional services)
 * - resume → creative-resume (career history)
 * - ecommerce/saas → modern-portfolio (product showcase)
 */
export function selectTemplate(analysis: PromptAnalysis): string {
  const templateMapping: Record<string, string> = {
    portfolio: 'modern-portfolio',
    business: 'business-card',
    resume: 'creative-resume',
    landing: 'business-card',
    restaurant: 'business-card',
    ecommerce: 'modern-portfolio',
    saas: 'modern-portfolio',
  }

  const templateId = templateMapping[analysis.siteType] || 'modern-portfolio'
  
  console.log(`🎨 Selected template: ${templateId} (site type: ${analysis.siteType})`)
  
  return templateId
}

/**
 * Generate design system (colors + fonts) for the site
 * 
 * @param analysis - Prompt analysis with industry/tone info
 * @returns Complete design system with colors and fonts
 */
export function generateDesignSystem(analysis: PromptAnalysis): DesignSystem {
  console.log(`🎨 Generating design system for ${analysis.industry} (${analysis.tone})`)

  const colors = generateColorScheme(analysis)
  const fonts = generateFontScheme(analysis)

  return { colors, fonts }
}

/**
 * Generate color scheme based on industry
 * 
 * INDUSTRY PALETTES:
 * - Restaurant: Warm, appetizing colors
 * - Technology: Cool, modern blues/purples
 * - Creative: Bold, vibrant colors
 * - Professional: Conservative blues/grays
 * - Health: Calming greens
 */
function generateColorScheme(analysis: PromptAnalysis): ColorScheme {
  // Use user's color preference if provided
  if (analysis.primaryColor) {
    return generateCustomColorScheme(analysis.primaryColor)
  }

  // Industry-specific palettes
  const industryPalettes: Record<string, ColorScheme> = {
    restaurant: {
      primary: '#C41E3A',      // Rich red
      secondary: '#FFF8DC',    // Cream
      accent: '#228B22',       // Forest green
      background: '#FFFFFF',
      backgroundAlt: '#F9FAFB',
      text: '#1F2937',
      textSecondary: '#6B7280'
    },
    technology: {
      primary: '#3B82F6',      // Blue
      secondary: '#8B5CF6',    // Purple
      accent: '#10B981',       // Green
      background: '#FFFFFF',
      backgroundAlt: '#F9FAFB',
      text: '#1F2937',
      textSecondary: '#6B7280'
    },
    creative: {
      primary: '#EC4899',      // Pink
      secondary: '#F59E0B',    // Amber
      accent: '#8B5CF6',       // Purple
      background: '#FFFFFF',
      backgroundAlt: '#F9FAFB',
      text: '#1F2937',
      textSecondary: '#6B7280'
    },
    professional: {
      primary: '#1E40AF',      // Navy
      secondary: '#64748B',    // Slate
      accent: '#0EA5E9',       // Sky blue
      background: '#FFFFFF',
      backgroundAlt: '#F9FAFB',
      text: '#1F2937',
      textSecondary: '#6B7280'
    },
    health: {
      primary: '#10B981',      // Emerald
      secondary: '#059669',    // Green
      accent: '#34D399',       // Light green
      background: '#FFFFFF',
      backgroundAlt: '#F9FAFB',
      text: '#1F2937',
      textSecondary: '#6B7280'
    },
  }

  // Match industry to palette
  const industry = analysis.industry.toLowerCase()
  
  if (industry.includes('restaurant') || industry.includes('food')) {
    return industryPalettes.restaurant
  } else if (industry.includes('tech') || industry.includes('software')) {
    return industryPalettes.technology
  } else if (industry.includes('creative') || industry.includes('design') || industry.includes('art')) {
    return industryPalettes.creative
  } else if (industry.includes('health') || industry.includes('fitness') || industry.includes('medical')) {
    return industryPalettes.health
  } else {
    return industryPalettes.professional // Default
  }
}

/**
 * Generate custom color scheme from user's primary color
 */
function generateCustomColorScheme(primaryColor: string): ColorScheme {
  // TODO: In future, use color theory to generate harmonious palettes
  // For now, use primary color with safe defaults
  return {
    primary: primaryColor,
    secondary: adjustColor(primaryColor, -20), // Slightly darker
    accent: adjustColor(primaryColor, 30),    // Slightly lighter/different hue
    background: '#FFFFFF',
    backgroundAlt: '#F9FAFB',
    text: '#1F2937',
    textSecondary: '#6B7280'
  }
}

/**
 * Simple color adjustment (placeholder for future color theory implementation)
 */
function adjustColor(hex: string, adjustment: number): string {
  // Simple lightness adjustment
  // TODO: Implement proper HSL color manipulation
  return hex // For now, just return original
}

/**
 * Generate font scheme based on tone
 * 
 * FONT PAIRINGS:
 * - Professional: Inter (clean, modern)
 * - Creative: Playfair Display + Open Sans (elegant, readable)
 * - Casual: Poppins + Roboto (friendly, approachable)
 * - Modern: Montserrat + Inter (contemporary, sleek)
 */
function generateFontScheme(analysis: PromptAnalysis): FontScheme {
  const fontPairings: Record<string, FontScheme> = {
    professional: {
      heading: 'Inter',
      body: 'Inter',
      headingSizes: {
        h1: '3rem',    // 48px
        h2: '2.25rem', // 36px
        h3: '1.5rem'   // 24px
      }
    },
    creative: {
      heading: 'Playfair Display',
      body: 'Open Sans',
      headingSizes: {
        h1: '3rem',
        h2: '2.25rem',
        h3: '1.5rem'
      }
    },
    casual: {
      heading: 'Poppins',
      body: 'Roboto',
      headingSizes: {
        h1: '3rem',
        h2: '2.25rem',
        h3: '1.5rem'
      }
    },
    modern: {
      heading: 'Montserrat',
      body: 'Inter',
      headingSizes: {
        h1: '3rem',
        h2: '2.25rem',
        h3: '1.5rem'
      }
    }
  }

  const tone = analysis.tone.toLowerCase()
  return fontPairings[tone] || fontPairings.professional
}

/**
 * Determine section order based on generated content
 * 
 * LOGIC:
 * - Always start with hero
 * - Add about if exists
 * - Add optional sections only if content was generated
 * - Always end with contact/social
 * 
 * This ensures we only show sections that have actual content.
 */
export function selectSections(content: any): string[] {
  const sections: string[] = []

  // Core sections (always included if they exist)
  if (content.hero) sections.push('hero')
  if (content.about) sections.push('about')

  // Optional sections (only if content was generated)
  if (content.services && content.services.items && content.services.items.length > 0) {
    sections.push('services')
  }

  if (content.projects && content.projects.length > 0) {
    sections.push('projects')
  }

  if (content.testimonials && content.testimonials.items && content.testimonials.items.length > 0) {
    sections.push('testimonials')
  }

  // Footer sections (always at end if they exist)
  if (content.contact) sections.push('contact')
  if (content.social) sections.push('social')

  console.log(`📐 Section order determined: [${sections.join(', ')}]`)

  return sections
}
