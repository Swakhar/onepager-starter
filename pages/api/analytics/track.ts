import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase/client'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { siteId, visitorId, pagePath, referrer, userAgent, deviceType, browser, os } = req.body

    if (!siteId || !visitorId) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Get IP address
    const ipAddress = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.socket.remoteAddress || ''

    if (!supabase) {
      return res.status(500).json({ error: 'Database not configured' })
    }

    // Insert analytics event
    const { error } = await supabase
      .from('analytics')
      .insert([{
        site_id: siteId,
        visitor_id: visitorId,
        page_path: pagePath || '/',
        referrer: referrer || null,
        user_agent: userAgent || null,
        ip_address: ipAddress,
        device_type: deviceType || null,
        browser: browser || null,
        os: os || null,
      }])

    if (error) throw error

    return res.status(200).json({ success: true })
  } catch (error: any) {
    console.error('Analytics tracking error:', error)
    return res.status(500).json({ error: error.message })
  }
}
