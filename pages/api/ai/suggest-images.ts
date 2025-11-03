import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { query, orientation = 'landscape', count = 6 } = req.body

  if (!query) {
    return res.status(400).json({ error: 'Query is required' })
  }

  // Get Unsplash API key from environment
  const unsplashAccessKey = process.env.UNSPLASH_ACCESS_KEY

  if (!unsplashAccessKey) {
    // Fallback: Return placeholder images if no API key
    const placeholders = Array.from({ length: count }, (_, i) => ({
      id: `placeholder-${i}`,
      url: `https://images.unsplash.com/photo-${1500000000000 + i}?w=800&q=80`,
      thumbnail: `https://images.unsplash.com/photo-${1500000000000 + i}?w=400&q=80`,
      alt: `${query} image ${i + 1}`,
      photographer: 'Unsplash',
      photographerUrl: 'https://unsplash.com',
    }))
    
    return res.status(200).json({ 
      images: placeholders,
      message: 'Using placeholder images. Add UNSPLASH_ACCESS_KEY to .env.local for real images.'
    })
  }

  try {
    // Search Unsplash
    const unsplashUrl = new URL('https://api.unsplash.com/search/photos')
    unsplashUrl.searchParams.set('query', query)
    unsplashUrl.searchParams.set('orientation', orientation)
    unsplashUrl.searchParams.set('per_page', count.toString())
    unsplashUrl.searchParams.set('order_by', 'relevant')

    const response = await fetch(unsplashUrl.toString(), {
      headers: {
        'Authorization': `Client-ID ${unsplashAccessKey}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.statusText}`)
    }

    const data = await response.json()

    const images = data.results.map((photo: any) => ({
      id: photo.id,
      url: photo.urls.regular,
      thumbnail: photo.urls.small,
      alt: photo.alt_description || query,
      photographer: photo.user.name,
      photographerUrl: photo.user.links.html,
      downloadUrl: photo.links.download_location,
    }))

    return res.status(200).json({ images })
  } catch (error: any) {
    console.error('Image suggestion error:', error)
    return res.status(500).json({ 
      error: 'Failed to fetch images',
      details: error.message 
    })
  }
}
