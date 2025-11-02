import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

// Create Supabase client with service role key for backend access
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { siteId, visitorId, event, pagePath, referrer, userAgent, deviceType, browser, os, country, city } = req.body

    if (!siteId || !visitorId) {
      return res.status(400).json({ error: 'Missing required fields: siteId and visitorId' })
    }

    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      console.log('[Analytics] Tracking skipped - Supabase not configured')
      return res.status(200).json({ success: true, message: 'Tracking skipped - database not configured' })
    }

    // Get IP address
    const ipAddress = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || 
                      req.socket.remoteAddress || 
                      'unknown'

    // Detect geolocation if not provided
    let geoCountry = country
    let geoCity = city
    
    if (!country && ipAddress !== 'unknown' && !ipAddress.includes('::')) {
      try {
        const geoData = await getGeolocation(ipAddress)
        geoCountry = geoData.country
        geoCity = geoData.city
      } catch (error) {
        console.error('[Analytics] Geolocation failed:', error)
      }
    }

    // Insert analytics event
    const { error } = await supabase
      .from('analytics_events')
      .insert([{
        site_id: siteId,
        visitor_id: visitorId,
        event_type: event || 'page_view',
        page_path: pagePath || '/',
        referrer: referrer || null,
        user_agent: userAgent || req.headers['user-agent'] || null,
        ip_address: ipAddress,
        device_type: deviceType || null,
        browser: browser || null,
        os: os || null,
        country: geoCountry || null,
        city: geoCity || null,
      }])

    if (error) {
      console.error('[Analytics] Insert error:', error)
      throw error
    }

    console.log(`[Analytics] Tracked: ${event || 'page_view'} for site ${siteId}`)

    return res.status(200).json({ success: true })
  } catch (error: any) {
    console.error('[Analytics] Tracking error:', error)
    return res.status(500).json({ error: error.message || 'Failed to track event' })
  }
}

// Simple geolocation using ipapi.co (free tier: 45 req/min)
async function getGeolocation(ip: string): Promise<{ country: string; city: string }> {
  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`, {
      headers: { 'User-Agent': 'OnePager Analytics' }
    })
    
    if (!response.ok) {
      throw new Error('Geolocation API failed')
    }
    
    const data = await response.json()
    
    return {
      country: data.country_name ? `${data.country_emoji || '🌍'} ${data.country_name}` : '🌍 Unknown',
      city: data.city || 'Unknown',
    }
  } catch (error) {
    console.error('[Geolocation] Error:', error)
    return { country: '🌍 Unknown', city: 'Unknown' }
  }
}
