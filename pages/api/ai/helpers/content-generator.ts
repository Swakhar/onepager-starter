/**
 * Content Generator
 * 
 * Generates website content using AI based on prompt analysis.
 * Produces structured content matching template expectations.
 * 
 * TEMPLATE-AWARE GENERATION:
 * - modern-portfolio: Always includes projects
 * - business-card: Only includes projects if explicitly requested
 * - creative-resume: Always includes projects
 * 
 * Uses GPT-3.5-turbo for cost efficiency (~$0.01 per generation).
 */

import { callOpenAI, parseOpenAIJSON } from './openai-client'
import { contentGenerationCache, CacheKey } from './cache'
import { PromptAnalysis } from './prompt-analyzer'

export interface GeneratedContent {
  hero: {
    title: string
    subtitle: string
    description: string
    cta?: {
      primary?: {
        text: string
        link: string
      }
    }
  }
  about?: {
    title: string
    description: string
  }
  services?: {
    title: string
    subtitle?: string
    items: Array<{
      id: string
      title: string
      description: string
      icon?: string
    }>
  }
  testimonials?: {
    title: string
    subtitle?: string
    items: Array<{
      id: string
      content: string
      author: string
      role: string
      company?: string
      avatar?: string
      rating?: number
    }>
  }
  projects?: Array<{
    id: string
    title: string
    description: string
    image: string
    tags: string[]
    link?: string
  }>
  contact?: {
    email: string
    phone: string
    location: string
    description?: string
  }
  social?: {
    [key: string]: string | undefined
  }
}

/**
 * Generate website content based on analysis
 * 
 * @param analysis - Prompt analysis results
 * @param templateId - Selected template ID
 * @param isPremium - Whether to use GPT-4
 * @returns Generated content structure
 */
export async function generateContent(
  analysis: PromptAnalysis,
  templateId: string,
  isPremium: boolean = false
): Promise<GeneratedContent> {
  // Check cache first
  const cacheKey = CacheKey.generate(
    `content-${analysis.siteName}-${analysis.description}`,
    { templateId, industry: analysis.industry, tone: analysis.tone }
  )
  const cached = contentGenerationCache.get(cacheKey)
  
  if (cached) {
    console.log('📦 Using cached content generation')
    return cached
  }

  console.log('📝 Generating content with AI...')

  // Determine if we should generate projects section
  const shouldGenerateProjects = determineProjectsGeneration(analysis, templateId)
  
  console.log(`📋 Template: ${templateId}, Generate Projects: ${shouldGenerateProjects}`)

  // Build dynamic system prompt
  const systemPrompt = buildContentPrompt(analysis, shouldGenerateProjects)

  const userMessage = `Generate website content for:
Industry: ${analysis.industry}
Type: ${analysis.siteType}
Name: ${analysis.siteName}
Description: ${analysis.description}
Tone: ${analysis.tone}
Features: ${analysis.features.join(', ') || 'standard website features'}`

  try {
    const response = await callOpenAI({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
      temperature: 0.8, // Higher creativity for content
      maxTokens: 2000, // Enough for full content
    }, isPremium)

    let content = parseOpenAIJSON<any>(response.content, 'content generation')

    // Normalize keys to lowercase (GPT sometimes capitalizes)
    content = normalizeKeys(content)

    // Validate and apply defaults
    content = validateContent(content, analysis)

    console.log('✅ Content generation complete:', {
      sections: Object.keys(content).length,
      hasProjects: !!content.projects,
      servicesCount: content.services?.items?.length || 0,
      testimonialsCount: content.testimonials?.items?.length || 0,
    })

    // Cache the result
    contentGenerationCache.set(cacheKey, content)

    return content
  } catch (error) {
    console.error('❌ Content generation failed:', error)
    
    // Return minimal fallback content
    return generateFallbackContent(analysis)
  }
}

/**
 * Determine if projects section should be generated
 * 
 * LOGIC:
 * - modern-portfolio: Always YES
 * - creative-resume: Always YES
 * - business-card: Only if explicitly mentioned in features/description
 */
function determineProjectsGeneration(
  analysis: PromptAnalysis,
  templateId: string
): boolean {
  if (templateId === 'modern-portfolio' || templateId === 'creative-resume') {
    return true
  }

  if (templateId === 'business-card') {
    // Check if user explicitly wants projects
    const hasProjectKeywords = 
      analysis.features.includes('projects') ||
      analysis.features.includes('portfolio') ||
      analysis.description.toLowerCase().includes('project') ||
      analysis.description.toLowerCase().includes('portfolio') ||
      analysis.description.toLowerCase().includes('work examples')

    return hasProjectKeywords
  }

  return false
}

/**
 * Build system prompt for content generation
 */
function buildContentPrompt(analysis: PromptAnalysis, includeProjects: boolean): string {
  const projectsSection = includeProjects ? `
5. projects (lowercase) - Array of objects with:
   - id (string): "project-1", "project-2", etc.
   - title (string): Project name
   - description (string): 2-3 sentences about the project
   - image (string): Use placeholder URL like "https://images.unsplash.com/photo-1589829545856-d10d557cf95f"
   - tags (array): 3-5 technology/skill tags
   - link (string, optional): Project URL` : ''

  const projectsExample = includeProjects ? `,
  "projects": [
    {
      "id": "project-1",
      "title": "Example Project",
      "description": "Brief description of the project and its impact.",
      "image": "https://images.unsplash.com/photo-1589829545856-d10d557cf95f",
      "tags": ["tag1", "tag2", "tag3"],
      "link": "#"
    }
  ]` : ''

  const noProjectsNote = !includeProjects ? 
    '\n\nNOTE: Do NOT generate a projects section for this business-focused website.' : ''

  return `You are a professional copywriter. Generate compelling website content based on the site analysis.

Generate content for these sections:
1. hero (lowercase) - Object with:
   - title (string): Catchy main heading
   - subtitle (string): Brief tagline
   - description (string): 1-2 sentence description
   - cta (object): { primary: { text: "Get Started", link: "#contact" } }

2. about (lowercase) - Object with:
   - title (string): "About Us" or similar
   - description (string): 2-3 paragraphs about the business/person

3. services (lowercase) - Object with:
   - title (string): "Our Services" or similar
   - subtitle (string, optional): Brief intro
   - items (array): 3-6 service items with { id, title, description, icon (emoji) }

4. testimonials (lowercase) - Object with:
   - title (string): "Client Testimonials" or similar
   - subtitle (string, optional): Brief intro
   - items (array): 3-5 testimonials with { id, content, author, role, company, avatar (emoji), rating }
${projectsSection}
${includeProjects ? '6' : '5'}. contact (lowercase) - Object with:
   - email (string): Professional email
   - phone (string): Phone number
   - location (string): City, State
   - description (string, optional): Contact description

${includeProjects ? '7' : '6'}. social (lowercase) - Object with optional properties:
   - github, linkedin, twitter, instagram, website (all strings - URLs)

CRITICAL RULES:
1. Use lowercase keys ONLY (hero, not Hero)
2. Match this EXACT structure
3. Make content relevant to: ${analysis.industry}
4. Use tone: ${analysis.tone}
5. Generate realistic content (not lorem ipsum)
6. Use emojis for icons (💼, 🎨, ⚡, etc.)${noProjectsNote}

Example structure:
{
  "hero": {
    "title": "Professional Headline",
    "subtitle": "Tagline goes here",
    "description": "Brief description of what you offer.",
    "cta": {
      "primary": {
        "text": "Get Started",
        "link": "#contact"
      }
    }
  },
  "about": {
    "title": "About Us",
    "description": "Your story goes here..."
  },
  "services": {
    "title": "Our Services",
    "subtitle": "What we offer",
    "items": [
      {
        "id": "service-1",
        "title": "Service Name",
        "description": "Service description here.",
        "icon": "💼"
      }
    ]
  },
  "testimonials": {
    "title": "Client Testimonials",
    "subtitle": "What our clients say",
    "items": [
      {
        "id": "testimonial-1",
        "content": "Great experience working with them!",
        "author": "John Doe",
        "role": "CEO",
        "company": "Tech Corp",
        "avatar": "👨‍💼",
        "rating": 5
      }
    ]
  }${projectsExample},
  "contact": {
    "email": "contact@example.com",
    "phone": "+1 (555) 123-4567",
    "location": "San Francisco, CA",
    "description": "Get in touch with us today."
  },
  "social": {
    "linkedin": "https://linkedin.com/company/example",
    "twitter": "https://twitter.com/example",
    "website": "https://example.com"
  }
}

Return ONLY valid JSON matching this structure. No markdown, no explanations.`
}

/**
 * Normalize all keys to lowercase recursively
 * GPT sometimes returns "Hero" instead of "hero"
 */
function normalizeKeys(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(normalizeKeys)
  }
  
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      const lowercaseKey = key.toLowerCase()
      acc[lowercaseKey] = normalizeKeys(obj[key])
      return acc
    }, {} as any)
  }
  
  return obj
}

/**
 * Validate content and apply defaults
 */
function validateContent(content: any, analysis: PromptAnalysis): GeneratedContent {
  // Ensure hero exists
  if (!content.hero) {
    content.hero = {
      title: analysis.siteName,
      subtitle: `Professional ${analysis.industry} Services`,
      description: analysis.description || 'Welcome to our website',
      cta: { primary: { text: 'Get Started', link: '#contact' } }
    }
  }

  // Ensure contact exists
  if (!content.contact) {
    content.contact = {
      email: 'contact@example.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA'
    }
  }

  return content
}

/**
 * Generate minimal fallback content if AI fails
 */
function generateFallbackContent(analysis: PromptAnalysis): GeneratedContent {
  return {
    hero: {
      title: analysis.siteName,
      subtitle: `Professional ${analysis.industry} Services`,
      description: analysis.description || 'Welcome to our website',
      cta: {
        primary: {
          text: 'Get Started',
          link: '#contact'
        }
      }
    },
    about: {
      title: 'About Us',
      description: `We are a professional ${analysis.industry.toLowerCase()} business committed to excellence.`
    },
    contact: {
      email: 'contact@example.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA'
    }
  }
}
