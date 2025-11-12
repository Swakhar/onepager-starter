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

/**
 * Generate minimal fallback content for restaurant template
 */
function generateFallbackRestaurantContent(analysis: PromptAnalysis): any {
  return {
    hero: {
      slides: [{
        id: '1',
        badge: 'Welcome',
        title: analysis.siteName,
        subtitle: 'Authentic Culinary Experience',
        description: analysis.description || 'Experience the finest dining',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
        ctaPrimary: { text: 'View Menu', link: '#menu' },
        ctaSecondary: { text: 'Reserve Now', link: '#reservations' }
      }]
    },
    about: {
      title: 'About Us',
      subtitle: 'Our Story',
      description: 'Welcome to ' + analysis.siteName + '. We bring authentic flavors and exceptional service to every dish.',
      features: [
        { icon: 'award', title: 'Award Winning', description: 'Recognized for culinary excellence' },
        { icon: 'heart', title: 'Made with Love', description: 'Every dish prepared with passion' },
        { icon: 'users', title: 'Family Friendly', description: 'Perfect for all occasions' }
      ],
      images: [
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5',
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836'
      ]
    },
    menu: {
      title: 'Our Menu',
      subtitle: 'Culinary Delights',
      items: [
        {
          id: 'item-1',
          name: 'Chef\'s Signature Pasta',
          description: 'Handmade pasta with seasonal ingredients and house-made sauce',
          price: '$28',
          category: 'main course',
          rating: 5,
          tags: ['Chef\'s Special', 'Popular']
        },
        {
          id: 'item-2',
          name: 'Grilled Seafood Platter',
          description: 'Fresh catch of the day with roasted vegetables',
          price: '$42',
          category: 'main course',
          rating: 5,
          tags: ['Fresh', 'Gluten-Free']
        }
      ]
    },
    testimonials: {
      title: 'What Our Guests Say',
      subtitle: 'Reviews',
      items: [
        {
          id: 'testimonial-1',
          content: 'Absolutely amazing experience! The food quality and service exceeded all expectations.',
          author: 'Sarah Johnson',
          role: 'Food Critic',
          rating: 5,
          date: 'Nov 2025'
        }
      ]
    },
    reservations: {
      title: 'Book Your Table',
      subtitle: 'Reserve Now',
      description: 'Reserve your table for an unforgettable dining experience'
    },
    contact: {
      phone: '+1 (555) 123-4567',
      email: 'info@restaurant.com',
      address: '123 Main Street, City, State 12345',
      hours: 'Mon-Fri: 11:00 AM - 10:00 PM\nSat-Sun: 10:00 AM - 11:00 PM'
    },
    social: {
      facebook: 'https://facebook.com/restaurant',
      instagram: 'https://instagram.com/restaurant',
      twitter: 'https://twitter.com/restaurant'
    }
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

  // Use restaurant-specific prompt for restaurant template
  if (templateId === 'restaurant-elegant') {
    const systemPrompt = buildRestaurantContentPrompt(analysis)
    const userMessage = `Generate website content for this restaurant:
Name: ${analysis.siteName}
Description: ${analysis.description}
Cuisine Type: ${analysis.industry}
Tone: ${analysis.tone}
Features: ${analysis.features.join(', ') || 'fine dining, reservations'}`

    try {
      const response = await callOpenAI({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.8,
        maxTokens: 2500, // More tokens for restaurant content
      }, isPremium)

      let content = parseOpenAIJSON<any>(response.content, 'content generation')
      content = normalizeKeys(content)
      content = validateRestaurantContent(content, analysis)

      console.log('✅ Restaurant content generation complete:', {
        sections: Object.keys(content).length,
        menuItems: content.menu?.items?.length || 0,
        testimonials: content.testimonials?.items?.length || 0,
      })

      contentGenerationCache.set(cacheKey, content)
      return content
    } catch (error) {
      console.error('❌ Restaurant content generation failed:', error)
      return generateFallbackRestaurantContent(analysis)
    }
  }

  // Build dynamic system prompt for other templates
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
 * Determine if we should generate projects section
 * 
 * Template-aware logic:
 * - modern-portfolio: Always include projects
 * - creative-resume: Always include projects
 * - business-card: Only if explicitly mentioned in prompt
 * - restaurant-elegant: Never include projects (uses menu instead)
 */
function determineProjectsGeneration(analysis: PromptAnalysis, templateId: string): boolean {
  // Restaurant template never has projects
  if (templateId === 'restaurant-elegant') {
    return false
  }

  // Portfolio and resume templates always have projects
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
 * Build restaurant-specific content prompt
 */
function buildRestaurantContentPrompt(analysis: PromptAnalysis): string {
  return `You are a professional restaurant marketing copywriter. Generate compelling website content for a ${analysis.tone} ${analysis.industry} restaurant.

Generate content for these sections:

1. hero (lowercase) - Object with:
   - slides (array): 3 hero slides with { id, badge, title, subtitle, description, image, ctaPrimary: {text, link}, ctaSecondary: {text, link} }
   - Use elegant, appetizing descriptions
   - Use food images from Unsplash (e.g., "https://images.unsplash.com/photo-1504674900247-0877df9cc836")

2. about (lowercase) - Object with:
   - title (string): "About Us" or creative variant
   - subtitle (string): Brief tagline
   - description (string): 2-3 paragraphs about restaurant story
   - story (string, optional): Additional history/chef info
   - features (array): 3-4 features with { icon, title, description } - use "award", "heart", "users", "clock"
   - images (array): 3 restaurant/food image URLs
   - stats (array, optional): 3 stats with { number, label } like "25+ Years", "50K Happy Guests"

3. menu (lowercase) - Object with:
   - title (string): "Our Menu" or creative variant
   - subtitle (string): Brief intro
   - items (array): 8-12 menu items with { id, name, description, price, category, image, isSpecial, rating, tags }
   - Categories: "appetizers", "main course", "desserts", "beverages"
   - Prices: Format like "$24" or "$18-22"
   - Tags: Dietary info like ["Vegetarian", "Gluten-Free", "Spicy"]

4. gallery (lowercase) - Object with:
   - title (string): "Gallery" or "Our Restaurant"
   - subtitle (string, optional)
   - images (array): 8-10 images with { id, src, alt, category }
   - Categories: "Interior", "Food", "Events"

5. testimonials (lowercase) - Object with:
   - title (string): "What Our Guests Say" or similar
   - subtitle (string, optional)
   - items (array): 4-6 testimonials with { id, content, author, role, company, rating, image, date }
   - Rating: 4-5 stars

6. reservations (lowercase) - Object with:
   - title (string): "Book a Table" or similar
   - subtitle (string, optional)
   - description (string): Brief booking instructions

7. contact (lowercase) - Object with:
   - phone (string): Restaurant phone
   - email (string): Restaurant email
   - address (string): Full address
   - hours (string): Opening hours (multi-line)

8. footer (lowercase) - Object with:
   - about (object): { title, description }
   - services (array): 4-5 services like { title, link }
   - blog (array): 2-3 recent posts with { title, date, author, comments, link }

9. social (lowercase) - Object with:
   - facebook, instagram, twitter, youtube (URLs)

CRITICAL RULES:
1. Use lowercase keys ONLY
2. Generate authentic ${analysis.industry} menu items (no generic items)
3. Use realistic prices appropriate for ${analysis.tone} dining
4. Make descriptions appetizing and elegant
5. Use real Unsplash food/restaurant images
6. No emojis in restaurant content (keep it elegant)

Return ONLY valid JSON matching this structure.`
}

/**
 * Validate restaurant content
 */
function validateRestaurantContent(content: any, analysis: PromptAnalysis): any {
  // Ensure hero slides exist
  if (!content.hero || !content.hero.slides) {
    content.hero = {
      slides: [{
        id: '1',
        badge: 'Welcome',
        title: analysis.siteName,
        subtitle: 'Fine Dining Experience',
        description: analysis.description || 'Experience culinary excellence',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
        ctaPrimary: { text: 'View Menu', link: '#menu' },
        ctaSecondary: { text: 'Book Table', link: '#reservations' }
      }]
    }
  }

  // Ensure menu exists
  if (!content.menu || !content.menu.items || content.menu.items.length === 0) {
    content.menu = {
      title: 'Our Menu',
      subtitle: 'Culinary Excellence',
      items: [
        {
          id: 'item-1',
          name: 'Signature Dish',
          description: 'Chef\'s special creation with seasonal ingredients',
          price: '$32',
          category: 'main course',
          rating: 5,
          tags: ['Chef\'s Special']
        }
      ]
    }
  }

  // Ensure contact exists
  if (!content.contact) {
    content.contact = {
      phone: '+1 (555) 123-4567',
      email: 'info@restaurant.com',
      address: '123 Main Street, City, State 12345',
      hours: 'Mon-Fri: 11:00 AM - 10:00 PM\nSat-Sun: 10:00 AM - 11:00 PM'
    }
  }

  return content
}
