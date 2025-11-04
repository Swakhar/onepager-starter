import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Curated list of Google Fonts that work well together
const FONT_LIBRARY = {
  headings: [
    'Playfair Display', 'Montserrat', 'Raleway', 'Poppins', 'Bebas Neue',
    'Oswald', 'Merriweather', 'Lora', 'Roboto Slab', 'Space Grotesk',
    'Inter', 'DM Serif Display', 'Crimson Text', 'Bitter', 'Abril Fatface'
  ],
  body: [
    'Open Sans', 'Lato', 'Roboto', 'Source Sans Pro', 'Nunito',
    'Work Sans', 'Karla', 'Mulish', 'Inter', 'PT Sans',
    'Noto Sans', 'Rubik', 'Hind', 'Libre Franklin', 'Manrope'
  ]
};

interface FontPairing {
  id: string;
  name: string;
  heading: string;
  body: string;
  description: string;
  vibe: string;
  bestFor: string[];
  googleFontsUrl: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { industry, mood, currentFonts } = req.body;

    if (!process.env.OPENAI_API_KEY) {
      console.warn('OpenAI API key not found, returning default font pairings');
      return res.status(200).json({
        pairings: getDefaultFontPairings()
      });
    }

    const prompt = `As a typography expert, suggest 3 professional font pairings for a ${industry || 'business'} website with a ${mood || 'professional'} mood.

Current fonts: ${currentFonts?.heading || 'none'} (heading), ${currentFonts?.body || 'none'} (body)

Choose from these Google Fonts:
Headings: ${FONT_LIBRARY.headings.join(', ')}
Body: ${FONT_LIBRARY.body.join(', ')}

For each pairing, provide:
1. A unique identifier (e.g., "modern-minimal")
2. A descriptive name (e.g., "Modern Minimal")
3. Heading font
4. Body font
5. A brief description of the pairing's personality
6. The vibe it creates (e.g., "Professional & Trustworthy")
7. What it's best for (array of use cases)

Return as JSON array with this structure:
[
  {
    "id": "modern-minimal",
    "name": "Modern Minimal",
    "heading": "Montserrat",
    "body": "Open Sans",
    "description": "Clean, contemporary typography that projects sophistication and clarity",
    "vibe": "Professional & Trustworthy",
    "bestFor": ["Corporate sites", "SaaS products", "Professional services"]
  }
]`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a professional typography expert specializing in web design. Return only valid JSON arrays.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content = completion.choices[0]?.message?.content || '[]';
    
    // Parse AI response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    const pairings: FontPairing[] = jsonMatch 
      ? JSON.parse(jsonMatch[0])
      : getDefaultFontPairings();

    // Add Google Fonts URLs
    const pairingsWithUrls = pairings.map(pairing => ({
      ...pairing,
      googleFontsUrl: `https://fonts.googleapis.com/css2?family=${pairing.heading.replace(/ /g, '+')}:wght@700&family=${pairing.body.replace(/ /g, '+')}:wght@400&display=swap`
    }));

    res.status(200).json({
      pairings: pairingsWithUrls.slice(0, 3)
    });

  } catch (error) {
    console.error('Error generating font pairings:', error);
    res.status(200).json({
      pairings: getDefaultFontPairings()
    });
  }
}

function getDefaultFontPairings(): FontPairing[] {
  return [
    {
      id: 'classic-elegance',
      name: 'Classic Elegance',
      heading: 'Playfair Display',
      body: 'Source Sans Pro',
      description: 'Timeless serif heading paired with clean sans-serif body creates sophisticated balance',
      vibe: 'Elegant & Professional',
      bestFor: ['Luxury brands', 'Creative portfolios', 'Editorial sites'],
      googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Source+Sans+Pro:wght@400&display=swap'
    },
    {
      id: 'modern-clean',
      name: 'Modern Clean',
      heading: 'Montserrat',
      body: 'Open Sans',
      description: 'Contemporary geometric heading with friendly body text for approachable professionalism',
      vibe: 'Modern & Trustworthy',
      bestFor: ['SaaS products', 'Tech startups', 'Corporate sites'],
      googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@700&family=Open+Sans:wght@400&display=swap'
    },
    {
      id: 'bold-impact',
      name: 'Bold Impact',
      heading: 'Bebas Neue',
      body: 'Lato',
      description: 'Strong condensed heading creates visual impact, balanced with readable body text',
      vibe: 'Bold & Confident',
      bestFor: ['Creative agencies', 'Fashion brands', 'Event sites'],
      googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Bebas+Neue:wght@400&family=Lato:wght@400&display=swap'
    }
  ];
}
