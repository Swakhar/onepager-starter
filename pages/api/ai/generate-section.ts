import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface SectionContent {
  type: string;
  title: string;
  subtitle?: string;
  content?: string;
  items?: Array<{
    title: string;
    description: string;
    icon?: string;
  }>;
  cta?: {
    text: string;
    action: string;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      sectionType, 
      industry, 
      businessName, 
      tone,
      context 
    } = req.body;

    if (!sectionType) {
      return res.status(400).json({ error: 'Section type is required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      console.warn('OpenAI API key not found, returning default section content');
      return res.status(200).json({
        section: getDefaultSection(sectionType, businessName, industry)
      });
    }

    const prompt = generatePromptForSection(sectionType, industry, businessName, tone, context);

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a professional copywriter and web content strategist. Create compelling, conversion-focused content that engages visitors. Return only valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const content = completion.choices[0]?.message?.content || '{}';
    
    // Parse AI response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const section: SectionContent = jsonMatch 
      ? JSON.parse(jsonMatch[0])
      : getDefaultSection(sectionType, businessName, industry);

    res.status(200).json({ section });

  } catch (error) {
    console.error('Error generating section:', error);
    const { sectionType, businessName, industry } = req.body;
    res.status(200).json({
      section: getDefaultSection(sectionType, businessName, industry)
    });
  }
}

function generatePromptForSection(
  sectionType: string,
  industry?: string,
  businessName?: string,
  tone?: string,
  context?: string
): string {
  const businessInfo = businessName || 'the business';
  const industryInfo = industry || 'this industry';
  const toneInfo = tone || 'professional and engaging';

  const sectionPrompts: Record<string, string> = {
    hero: `Create a compelling Hero section for ${businessInfo} in ${industryInfo}.
    
Return JSON:
{
  "type": "hero",
  "title": "Main headline (compelling, benefit-focused, max 60 chars)",
  "subtitle": "Supporting text (clear value proposition, 100-150 chars)",
  "content": "Brief description (2-3 sentences about what makes them unique)",
  "cta": {
    "text": "Primary action button text",
    "action": "get-started"
  }
}`,

    about: `Create an About section for ${businessInfo} in ${industryInfo}.
    
Return JSON:
{
  "type": "about",
  "title": "Section heading",
  "content": "Compelling story (3-4 paragraphs about mission, values, and what drives the business)",
  "items": [
    {
      "title": "Value 1 (e.g., 'Our Mission')",
      "description": "Brief description",
      "icon": "🎯"
    }
  ]
}`,

    services: `Create a Services section for ${businessInfo} in ${industryInfo}.
    
Return JSON:
{
  "type": "services",
  "title": "Services section heading",
  "subtitle": "Brief description of services offered",
  "items": [
    {
      "title": "Service name",
      "description": "Service description (2-3 sentences, benefit-focused)",
      "icon": "relevant emoji"
    }
  ]
}
Include 3-4 services.`,

    features: `Create a Features section for ${businessInfo} in ${industryInfo}.
    
Return JSON:
{
  "type": "features",
  "title": "Features section heading",
  "subtitle": "Brief description of key benefits",
  "items": [
    {
      "title": "Feature name",
      "description": "Feature benefit (focus on customer value, not just functionality)",
      "icon": "relevant emoji"
    }
  ]
}
Include 4-6 features.`,

    testimonials: `Create a Testimonials section for ${businessInfo} in ${industryInfo}.
    
Return JSON:
{
  "type": "testimonials",
  "title": "Testimonials section heading",
  "subtitle": "Brief introduction to customer success",
  "items": [
    {
      "title": "Customer name and role/company",
      "description": "Realistic testimonial quote (specific results, emotional benefit)",
      "icon": "⭐"
    }
  ]
}
Include 3 testimonials.`,

    cta: `Create a Call-to-Action section for ${businessInfo} in ${industryInfo}.
    
Return JSON:
{
  "type": "cta",
  "title": "Compelling CTA headline",
  "subtitle": "Urgency or benefit statement",
  "content": "Brief explanation of next steps or what they'll get",
  "cta": {
    "text": "Action button text (action-oriented)",
    "action": "contact"
  }
}`,

    contact: `Create a Contact section for ${businessInfo} in ${industryInfo}.
    
Return JSON:
{
  "type": "contact",
  "title": "Contact section heading",
  "content": "Friendly invitation to get in touch (2-3 sentences)",
  "items": [
    {
      "title": "Contact method (e.g., 'Email')",
      "description": "Placeholder contact info or instruction",
      "icon": "relevant emoji"
    }
  ]
}`
  };

  const basePrompt = sectionPrompts[sectionType] || sectionPrompts.about;
  const contextNote = context ? `\n\nAdditional context: ${context}` : '';
  const toneNote = `\n\nTone: ${toneInfo}. Make it sound natural and ${toneInfo}.`;

  return basePrompt + contextNote + toneNote;
}

function getDefaultSection(
  sectionType: string,
  businessName?: string,
  industry?: string
): SectionContent {
  const name = businessName || 'Your Business';
  const field = industry || 'your industry';

  const defaults: Record<string, SectionContent> = {
    hero: {
      type: 'hero',
      title: `Welcome to ${name}`,
      subtitle: 'Your trusted partner for success',
      content: `We help businesses ${field} achieve their goals with innovative solutions and dedicated support.`,
      cta: {
        text: 'Get Started',
        action: 'get-started'
      }
    },
    about: {
      type: 'about',
      title: 'About Us',
      content: `${name} is dedicated to delivering exceptional results in ${field}. Our team combines expertise with passion to create solutions that make a real difference.\n\nWe believe in building lasting relationships with our clients through transparency, quality, and continuous innovation.`,
      items: [
        {
          title: 'Our Mission',
          description: 'To empower businesses with innovative solutions',
          icon: '🎯'
        },
        {
          title: 'Our Values',
          description: 'Integrity, excellence, and customer success',
          icon: '💎'
        }
      ]
    },
    services: {
      type: 'services',
      title: 'Our Services',
      subtitle: 'Comprehensive solutions tailored to your needs',
      items: [
        {
          title: 'Service 1',
          description: 'Expert solutions designed to help you succeed',
          icon: '⚡'
        },
        {
          title: 'Service 2',
          description: 'Innovative approaches to complex challenges',
          icon: '🚀'
        },
        {
          title: 'Service 3',
          description: 'Dedicated support every step of the way',
          icon: '💡'
        }
      ]
    },
    features: {
      type: 'features',
      title: 'Key Features',
      subtitle: 'Everything you need to succeed',
      items: [
        {
          title: 'Easy to Use',
          description: 'Intuitive interface designed for everyone',
          icon: '✨'
        },
        {
          title: 'Fast & Reliable',
          description: 'Built for performance and stability',
          icon: '⚡'
        },
        {
          title: 'Secure',
          description: 'Enterprise-grade security you can trust',
          icon: '🔒'
        }
      ]
    },
    testimonials: {
      type: 'testimonials',
      title: 'What Our Clients Say',
      subtitle: 'Trusted by businesses worldwide',
      items: [
        {
          title: 'Sarah Johnson, CEO',
          description: 'Working with this team transformed our business. Highly recommended!',
          icon: '⭐'
        },
        {
          title: 'Michael Chen, Founder',
          description: 'Outstanding service and exceptional results. Could not be happier.',
          icon: '⭐'
        }
      ]
    },
    cta: {
      type: 'cta',
      title: 'Ready to Get Started?',
      subtitle: "Let's work together to achieve your goals",
      content: 'Join hundreds of satisfied clients and experience the difference.',
      cta: {
        text: 'Contact Us Today',
        action: 'contact'
      }
    },
    contact: {
      type: 'contact',
      title: 'Get in Touch',
      content: "We'd love to hear from you. Reach out and let's start a conversation.",
      items: [
        {
          title: 'Email',
          description: 'hello@example.com',
          icon: '📧'
        },
        {
          title: 'Phone',
          description: '+1 (555) 123-4567',
          icon: '📱'
        }
      ]
    }
  };

  return defaults[sectionType] || defaults.about;
}
